from rest_framework import serializers
from .models import File


class FileSerializer(serializers.ModelSerializer):
    size = serializers.SerializerMethodField()  # Размер файла в мегабайтах
    upload_date = serializers.SerializerMethodField() # Приводим дату к виду д.м.г ч:м:с
    last_download_date = serializers.SerializerMethodField()  # Приводим дату к виду д.м.г ч:м:с

    class Meta:
        model = File
        fields = [
            "id",
            "user",
            "file_name",
            "file",
            "upload_date",
            "last_download_date",
            "size",
            "comment",
            "link",
            "type",
        ]
        read_only_fields = [
            "uploadDate",
            "lastDownloadDate",
        ]  # Эти поля будут только для чтения


    def get_size(self, obj):
        return f"{round(obj.size / 1048576, 2)} Мб"

    def get_upload_date(self, obj):
        return obj.uploadDate.strftime('%d.%m.%Y %H:%M:%S')

    def get_last_download_date(self, obj):
        if obj.lastDownloadDate:
            return obj.lastDownloadDate.strftime('%d.%m.%Y %H:%M:%S')
        else:
            return obj.lastDownloadDate
