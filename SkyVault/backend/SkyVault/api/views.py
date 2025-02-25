import os
import json

from vault.models import File
from vault.serialize import FileSerializer
from users.serialize import UserSerializer
from users.models import User

from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
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


@method_decorator(ensure_csrf_cookie, name='dispatch')
@permission_classes([AllowAny])
class LoginView(APIView):
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



@method_decorator(ensure_csrf_cookie, name='dispatch')
@permission_classes([AllowAny])
class RegisterView(APIView):
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
@permission_classes([AllowAny])
class UserFilesView(APIView):
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
@permission_classes([AllowAny])
class UploadFileView(APIView):
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
@permission_classes([AllowAny])
class DownloadFileView(APIView):
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
@permission_classes([AllowAny])
class DashboardView(APIView):
    """
    Представление для отображения панели администратора.
    """

    def get(self, request, pk, *args, **kwargs):
        """
        Проверяет, является ли пользователь администратором, и возвращает список всех пользователей.
        """
        # Проверка существования пользователя
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(
                {"error": f"Пользователь с id №{pk} не существует"},
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
@permission_classes([AllowAny])
class GetShareLinkView(APIView):
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

        # Генерируем абсолютную ссылку на файл
        file_link = request.build_absolute_uri(file.file.url)

        return Response({"link": file_link}, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name="dispatch")
@permission_classes([AllowAny])
class UserDeleteView(APIView):
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
