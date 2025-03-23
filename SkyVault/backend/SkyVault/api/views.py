import os
import json

from vault.models import File
from vault.serialize import FileSerializer
from users.serialize import UserSerializer
from users.models import User

from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

from django.views.decorators.csrf import csrf_exempt,ensure_csrf_cookie
from django.contrib.auth import authenticate, login
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings
from django.utils.decorators import method_decorator
from django.utils import timezone
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.contrib.auth import logout



def check_session(request):
    print("check_session")
    if request.user.is_authenticated:
        return JsonResponse({
            "is_authenticated": True,
            "user": {
                "id": request.user.id,
                "username": request.user.username,
                "first_name": request.user.first_name,
                "last_name": request.user.last_name,
                "role": request.user.is_staff,
            }
        })
    return JsonResponse({"is_authenticated": False})

@require_POST
def logout_view(request):
    if request.user.is_authenticated:
        logout(request)  # Завершаем сессию только если пользователь авторизован
        return JsonResponse({"message": "Logged out successfully"}, status=200)
    return JsonResponse({"message": "Already logged out"}, status=200)

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny]  # Доступно всем
    """
    Представление для аутентификации пользователя
    """

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        # Аутентификация пользователя
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)  # Авторизация пользователя через Django
            response_data = {
                "id": user.id,
                "role": user.is_staff,
                "first_name": user.first_name,
            }
            return Response(response_data)

        # Если аутентификация не удалась
        return Response(
            {"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST
        )



@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []  # Отключаем любую аутентификацию (включая сессии)
    """
    Представление для регистрации нового пользователя.
    """

    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            # Сохраняем пользователя
            user = serializer.save()
            user.set_password(request.data.get("password"))  # Устанавливаем пароль
            user.save()

            # Формируем ответ с данными пользователя
            response_data = {
                "id": user.id,
                "username": user.username,
                "first_name": user.first_name,
                "email": user.email,
            }
            return Response(response_data, status=status.HTTP_201_CREATED)

        # Если данные невалидны, возвращаем ошибки
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class UserFilesView(APIView):
    permission_classes = [IsAuthenticated]
    """
    Представление для получения и удаление файлов пользователя.
    """

    def get(self, request, pk, *args, **kwargs):
        """
        Получение файлов пользователя
        """
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(
                {"error": f"Пользователь с id №{pk} не существует"},
                status=status.HTTP_404_NOT_FOUND,
            )

        files = File.objects.filter(user=user)
        serializer = FileSerializer(files, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk, *args, **kwargs):
        """
        Удаление файла пользователя.
        """
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(
                {"error": f"Пользователь с id №{pk} не существует"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Получаем ID файла из параметров запроса
        file_id = request.query_params.get("file_id")
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
        file_path = file_obj.file.path
        if os.path.exists(file_path):
            os.remove(file_path)  # Удаляем файл из файловой системы

        file_obj.delete()  # Удаляем запись из базы данных
        return Response(
            {"message": "Файл успешно удалён"}, status=status.HTTP_204_NO_CONTENT
        )


@method_decorator(csrf_exempt, name='dispatch')
class UploadFileView(APIView):
    permission_classes = [IsAuthenticated]
    """
    Представление для загрузки файлов на сервер.
    """
    parser_classes = [MultiPartParser, FormParser]  # Для обработки файлов

    def post(self, request, user_id, *args, **kwargs):
        """
        Загрузки файлов.
        """
        # Получаем данные из запроса
        file_name = request.data.get("file_name")
        file = request.FILES.get("file")  # Получаем файл из запроса
        comment = request.data.get("comment")  # Комментарий к файлу
        file_type = request.data.get("type")  # Тип файла

        # Проверяем, передан ли файл
        if not file:
            return Response(
                {"error": "Файл не передан"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Проверяем, передан ли user_id
        if not user_id:
            return Response(
                {"error": "userId не передан"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Проверяем существование пользователя
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": f"Пользователь с id №{user_id} не существует"},
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
            file_name=file_name, # Имя файла
            file=file,  # Сам файл
            size=file_size,  # Размер файла
            comment=comment,  # Комментарий
            type=file_type,  # Тип файла
        )

        # Сериализуем данные для ответа
        serializer = FileSerializer(file_instance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@method_decorator(csrf_exempt, name='dispatch')
class DownloadFileView(APIView):
    permission_classes = [IsAuthenticated]
    """
    Представление для выгрузки файлов по их ID.
    """

    def get(self, request, file_id, *args, **kwargs):
        """
        Поддерживает множественные file_id через запятую.
        """
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


@method_decorator(csrf_exempt, name="dispatch")
class DashboardView(APIView):
    permission_classes = [IsAuthenticated]
    """
    Представление для отображения панели администратора.
    """

    def get(self, request, user_id, *args, **kwargs):
        print("DashboardView")
        """
        Проверяет, является ли пользователь администратором, и возвращает список всех пользователей.
        """
        # Проверка существования пользователя
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": f"Пользователь с id №{user_id} не существует"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Проверка на права администратора
        if not user.is_staff:
            return Response(
                {"error": "У вас нет прав доступа к панели администратора"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Получение списка всех пользователей
        users = User.objects.exclude(id=user_id)
        print(users)
        serializer = UserSerializer(users, many=True)

        # Возвращаем список пользователей с дополнительными полями
        return Response(serializer.data, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name="dispatch")
class changeUserStatusAdmin(APIView):
    permission_classes = [IsAuthenticated]
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
class RenameFileView(APIView):
    permission_classes = [IsAuthenticated]
    """
    Представление для переименования файла.
    """

    def patch(self, request):

        try:
            # Получаем данные из тела запроса
            user_id = request.data.get("userId")
            file_id = request.data.get("fileId")
            new_name = request.data.get("newName")

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
class ChangeFileCommentView(APIView):
    permission_classes = [IsAuthenticated]
    """
    Представление для изменения комментария к файлу.
    """

    def patch(self, request):

        try:
            # Получаем данные из тела запроса
            user_id = request.data.get("userId")
            file_id = request.data.get("fileId")
            new_comment = request.data.get("newComment")

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


@method_decorator(csrf_exempt, name='dispatch')
class GetShareLinkView(APIView):
    permission_classes = [IsAuthenticated]
    """
    Представление формирующее ссылку для скачивания файла.
    """

    def post(self, request, *args, **kwargs):
        data = request.data
        file_id = data.get('fileId')

        if not file_id:
            return Response({"error": "Не указан fileId"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            file = File.objects.get(id=int(file_id))
        except File.DoesNotExist:
            return Response({"error": f"Файла с id №{file_id} не существует"}, status=status.HTTP_404_NOT_FOUND)

        # Выводим информацию для отладки
        print(f"File path: {file.file.path}")
        print(f"File URL: {file.file.url}")

        # Генерируем абсолютную ссылку на файл
        file_link = request.build_absolute_uri(file.file.url)

        return Response({"link": file_link}, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name="dispatch")
class UserDeleteView(APIView):
    permission_classes = [IsAuthenticated]
    """
    Представление для удаления пользователя.
    """

    def delete(self, request):
        try:
            data = json.loads(request.body)
            user_id = data['userId']
            id_to_delete = data['idToDelete']
        except (json.JSONDecodeError, KeyError):
            return Response(
                {"error": "Некорректные данные"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "Пользователь с данным ID не существует"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not user.is_staff:
            return Response(
                {"error": "Только администраторы могут удалять пользователей"},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            user_to_delete = User.objects.get(id=id_to_delete)
        except User.DoesNotExist:
            return Response(
                {"error": "Пользователь с данным ID не существует"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Удаление файлов пользователя
        files = File.objects.filter(user=user_to_delete)
        for file in files:
            # Удаление физического файла
            file_path = file.file.path
            if os.path.exists(file_path):
                os.remove(file_path)
            file.delete()

        # Удаление папки пользователя
        user_dir = os.path.join(settings.MEDIA_ROOT, f"user_{user_to_delete.username}")
        if os.path.exists(user_dir):
            import shutil
            shutil.rmtree(user_dir)

        # Удаление пользователя
        user_to_delete.delete()
        return Response(
            {"message": "Пользователь успешно удалён"},
            status=status.HTTP_204_NO_CONTENT,
        )
