from rest_framework import serializers
from .models import User
from vault.models import File
from django.db.models import Sum


class UserSerializer(serializers.ModelSerializer):
    total_files = serializers.SerializerMethodField()  # Общее количество файлов
    total_storage_size = serializers.SerializerMethodField()  # Общий размер файлов

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'email', 'is_staff', 'total_files', 'total_storage_size']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    # Метод для подсчета общего количества файлов пользователя
    def get_total_files(self, user):
        return File.objects.filter(user=user).count()

    # Метод для подсчета общего размера файлов пользователя
    def get_total_storage_size(self, user):
        total_size = File.objects.filter(user=user).aggregate(total_size=Sum('size'))['total_size'] or 0
        return f"{round(total_size / 1048576, 2)}  Мб"