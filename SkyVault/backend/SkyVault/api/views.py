from django.contrib.gis.db.models.functions import FromWKB
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, login
from django.http import JsonResponse

from vault.models import File, user_directory_path
from vault.serialize import FileSerializer
from users.models import User
from users.serialize import UserSerializer

from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt

from django.middleware.csrf import get_token
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.parsers import MultiPartParser, FormParser
from users.models import User
from django.db.models import Q
import os
from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from django.utils import timezone


def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({"csrfToken": token})


@ensure_csrf_cookie
@api_view(["POST"])
@permission_classes([AllowAny])  # Разрешает доступ для всех пользователей
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    # Аутентификация пользователя
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)  # Авторизация пользователя через Django

        # Формирование ответа
        response_data = {
            "id": user.id,
            "role": user.is_superuser,
        }
        return Response(response_data)

    # Если аутентификация не удалась
    return Response(
        {"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST
    )


@ensure_csrf_cookie
@api_view(["POST"])
@permission_classes([AllowAny])  # Разрешает доступ для всех пользователей
def register_view(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(request.data.get("password"))
        user.save()
        # Формируем ответ с данными пользователя
        response_data = {
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "email": user.email,
        }
        return Response(response_data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @permission_classes([IsAuthenticated])
@csrf_exempt
@api_view(["GET", "DELETE"])
@permission_classes([AllowAny])  # Разрешить доступ без авторизации
def user_files_view(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(
            {"error": "Пользователь с данным pk не существует"},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "GET":
        files = File.objects.filter(user=user)
        serializer = FileSerializer(files, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "DELETE":
        file_id = request.query_params.get(
            "file_id"
        )  # Получаем ID файла из параметров запроса
        if not file_id:
            return Response(
                {"error": "Не передан ID файла"}, status=status.HTTP_400_BAD_REQUEST
            )
        try:
            file_obj = File.objects.get(id=file_id, user=user)
        except ObjectDoesNotExist:
            return Response(
                {"error": "Файл не найден или не принадлежит пользователю"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Удаление физического файла
        dir_path = os.path.dirname(file_obj.file.path)
        file_path = os.path.join(dir_path, file_obj.file_name)
        print(file_path)
        os.remove(file_path)

        # for filename in os.listdir(dir_path):
        #     if filename.startswith(os.path.basename(file_obj.file.name).split('.')[0]):
        #         file_path = os.path.join(dir_path, filename)
        #         print(file_path)
        #         if os.path.exists(file_path):
        #
        #             os.remove(file_path)  # Удаляем файл с диска
        #         break
        # Удаление записи из базы данных
        file_obj.delete()
        return Response(
            {"message": "Файл успешно удалён"}, status=status.HTTP_204_NO_CONTENT
        )


@csrf_exempt  # Отключение проверки CSRF
@api_view(["POST"])
@permission_classes([AllowAny])  # Разрешить доступ без авторизации
@parser_classes([MultiPartParser, FormParser])  # Для работы с файлами
def upload_file_view(request, user_id):
    """
    API для загрузки файлов.
    """
    # Получаем данные файла и других параметров из запроса
    file_name = request.data.get("file_name")
    file = request.FILES.get("file")  # Получаем файл из запроса
    comment = request.data.get("comment")  # Комментарий к файлу
    file_type = request.data.get("type")  # Тип файла
    # user_id = request.data.get('userId')  # Получаем ID пользователя
    # Проверяем, передан ли файл
    if not file:
        return Response(
            {"error": "Файл не передан"}, status=status.HTTP_400_BAD_REQUEST
        )

    # Проверяем, передан ли userId
    if not user_id:
        return Response(
            {"error": "userId не передан"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Получаем объект пользователя по переданному ID
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {"error": "Пользователь с данным ID не существует"},
            status=status.HTTP_404_NOT_FOUND,
        )

    # Проверяем, существует ли файл с таким именем для данного пользователя
    if File.objects.filter(Q(file_name=file_name) & Q(user=user)).exists():
        return Response(
            {"error": f'Файл с именем "{file_name}" уже существует'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Рассчитываем размер файла
    file_size = file.size

    # Создаем запись в базе данных
    file_instance = File.objects.create(
        user=user,  # Пользователь, загрузивший файл (объект User)
        file_name=file_name,
        file=file,  # Сам файл
        size=file_size,  # Размер файла
        comment=comment,  # Комментарий
        type=file_type,  # Тип файла
    )

    # Сериализуем данные для ответа
    serializer = FileSerializer(file_instance)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@csrf_exempt  # Отключение проверки CSRF
@api_view(["GET"])
@permission_classes([AllowAny])  # Разрешить доступ без авторизации
def download_file_view(request, file_id):
    file_ids = file_id.split(",")  # Разделяем строку на список file_id
    files_list = []
    for file_id in file_ids:
        try:
            file = File.objects.get(id=int(file_id))
        except File.DoesNotExist:
            return Response(
                {"error": f"Файла с ID {file_id} не существует"},
                status=status.HTTP_404_NOT_FOUND,
            )
        # Обновляем дату последнего скачивания
        file.lastDownloadDate = timezone.now()
        file.save()
        # Генерируем абсолютную ссылку на файл
        file_link = request.build_absolute_uri(file.file.url)
        files_list.append({"file_link": file_link, "file_name": file.file.name})

    return Response(files_list, status=status.HTTP_200_OK)


@csrf_exempt  # Отключение проверки CSRF
@api_view(["GET"])
@permission_classes([AllowAny])  # Разрешить доступ без авторизации
def dashboard_view(request, pk):
    """
    Представление для отображения панели администратора.
    Проверяет, является ли пользователь администратором, и возвращает список всех пользователей.
    """
    # Проверка существования пользователя
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(
            {"error": "Пользователь с данным pk не существует"},
            status=status.HTTP_404_NOT_FOUND,
        )

    # Проверка на права администратора
    if not user.is_staff:
        return Response(
            {"error": "У вас нет прав доступа к панели администратора"},
            status=status.HTTP_403_FORBIDDEN,
        )

    # Получение списка всех пользователей
    users = User.objects.exclude(id=pk)
    serializer = UserSerializer(users, many=True)
    # Возвращаем список пользователей с дополнительными полями
    return Response(serializer.data, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name="dispatch")
@permission_classes([AllowAny])
class changeUserStatusAdmin(APIView):
    """
    Представление для изменения статуса is_staff у пользователя.
    """

    def patch(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)  # Получаем пользователя по id
        except User.DoesNotExist:
            return Response(
                {"error": "Пользователь не найден"}, status=status.HTTP_404_NOT_FOUND
            )

        # Проверяем, есть ли поле is_staff в запросе
        is_staff = request.data.get("is_staff")
        if is_staff is not None:
            user.is_staff = is_staff  # Обновляем значение is_staff
            user.save()
            return Response({"success": "Статус обновлён"}, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "Поле is_staff не указано"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_exempt, name="dispatch")
@permission_classes([AllowAny])
class RenameFileView(APIView):
    """
    Представление для переименования файла.
    """

    def patch(self, request):

        try:
            # Получаем данные из тела запроса
            user_id = request.data.get("userId")
            file_id = request.data.get("fileId")
            new_name = request.data.get("newName")
            print(user_id, file_id, new_name)
            # Проверяем, указаны ли все необходимые данные
            if not user_id or not file_id or not new_name:
                return Response(
                    {"error": "Необходимо указать userId, fileId и newName"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Проверяем, существует ли пользователь
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response(
                    {"error": "Пользователь не найден"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Проверяем, существует ли файл и принадлежит ли он пользователю
            try:
                file = File.objects.get(id=file_id, user=user)
            except File.DoesNotExist:
                return Response(
                    {"error": "Файл не найден или не принадлежит пользователю"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Обновляем имя файла
            file_name_parts = os.path.basename(file.file.name).split('.')
            file_extension = '.' + file_name_parts[-1] if len(file_name_parts) > 1 else ''
            new_file_name = new_name + file_extension
            file.file_name = new_file_name
            file.save()  # Сохраняем изменения

            # Обновляем имя файла на диске
            old_file_path = file.file.path
            dir_path = os.path.dirname(old_file_path)
            for filename in os.listdir(dir_path):
                if filename.startswith(os.path.basename(old_file_path).split('.')[0]):
                    old_file_path = os.path.join(dir_path, filename)
                    new_file_path = os.path.join(dir_path, new_file_name)
                    os.rename(old_file_path, new_file_path)
                    break

            # Обновляем поле file модели File
            print(user)
            file.file = "user_" + str(user) + "/" + str(new_file_name)
            file.save()  # Сохраняем изменения

            return Response(
                {
                    "success": "Имя файла обновлено",
                    "file_id": file.id,
                    "new_name": file.file_name,
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": f"Произошла ошибка: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name="dispatch")
@permission_classes([AllowAny])
class ChangeFileCommentView(APIView):
    """
    Представление для изменения комментария к файлу.
    """

    def patch(self, request):

        try:
            # Получаем данные из тела запроса
            user_id = request.data.get("userId")
            file_id = request.data.get("fileId")
            new_comment = request.data.get("newComment")
            print(user_id, file_id, new_comment)
            # Проверяем, указаны ли все необходимые данные
            if not user_id or not file_id or not new_comment:
                return Response(
                    {"error": "Необходимо указать userId, fileId и newComment"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Проверяем, существует ли пользователь
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response(
                    {"error": "Пользователь не найден"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Проверяем, существует ли файл и принадлежит ли он пользователю
            try:
                file = File.objects.get(id=file_id, user=user)
            except File.DoesNotExist:
                return Response(
                    {"error": "Файл не найден или не принадлежит пользователю"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Обновляем комментарий к файлу
            file.comment = new_comment
            file.save()  # Сохраняем изменения

            return Response(status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": f"Произошла ошибка: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
