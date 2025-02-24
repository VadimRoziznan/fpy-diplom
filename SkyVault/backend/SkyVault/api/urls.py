from django.urls import path

from .views import (login_view,register_view,user_files_view, dashboard_view, upload_file_view,
                    changeUserStatusAdmin, get_csrf_token, download_file_view, RenameFileView, ChangeFileCommentView)
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import csrf_protect
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie



urlpatterns = [
    path('csrf-token/', get_csrf_token, name='get-csrf-token'),
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('storage/<int:pk>/', user_files_view, name='storage'),  # Используем pk для RetrieveDestroyAPIView
    path('dashboard/<int:pk>/', dashboard_view, name='dashboard'),  # Используем pk для RetrieveAPIView
    path('user-files/<int:user_id>/', upload_file_view, name='upload'),  # Добавляем маршрут для загрузки файлов
    path('dashboard/change-status/user/<int:user_id>/', changeUserStatusAdmin.as_view(), name='change-user-status'),
    path('download/<path:file_id>/', download_file_view, name='download'),
    path('rename-file/', RenameFileView.as_view(), name='rename-file'),
    path('change-file-comment/', ChangeFileCommentView.as_view(), name='change-file-comment'),

]