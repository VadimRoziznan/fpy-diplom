from django.db import models

# Функция для динамического формирования пути для загрузки файлов
def user_directory_path(instance, filename):
    """
    Формирует путь для сохранения файлов:
    media/user_<username>/<filename>
    """
    return f"user_{instance.user.username}/{filename}"

# Модель для хранения файлов, связанных с пользователями
class File(models.Model):
    user = models.ForeignKey(
        'users.User',  # Связь с кастомной моделью пользователя
        on_delete=models.CASCADE,  # Если пользователь удаляется, удаляются и его файлы
        related_name='files'  # Позволяет обращаться к файлам через user.files
    )
    file_name = models.CharField(max_length=200, unique=False)
    file = models.FileField(upload_to=user_directory_path)  # Динамический путь для сохранения файлов
    uploadDate = models.DateTimeField(auto_now_add=True)  # Дата загрузки файла
    lastDownloadDate = models.DateTimeField(blank=True, null=True)  # Дата последней загрузки файла
    size = models.PositiveIntegerField()  # Размер файла в байтах
    comment = models.CharField(max_length=250, null=True, blank=True)  # Комментарий к файлу
    link = models.URLField(max_length=200, null=True, blank=True)  # Ссылка на файл или ресурс
    type = models.CharField(max_length=50)  # Тип файла

    def __str__(self):
        return f"{self.file.name} ({self.user.username})"