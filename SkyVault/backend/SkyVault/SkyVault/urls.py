"""
URL configuration for SkyVault project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic.base import TemplateView
from django.urls import re_path
from api.views import ( check_session, logout_view,
    LoginView, RegisterView, DashboardView, UploadFileView, DownloadFileView,
    RenameFileView, ChangeFileCommentView, GetShareLinkView, UserDeleteView,
    changeUserStatusAdmin, UserFilesView
)




# urlpatterns = [
#     path("api/auth/session/", check_session, name="check_session"),
#     path("api/auth/logout/", logout_view, name="logout"),
#     path("admin/", admin.site.urls),
#     # path('', include('api.urls')),
#     path('login/', LoginView.as_view(), name='login'),
#     path('register/', RegisterView.as_view(), name='register'),
#     path('dashboard/<int:user_id>/', DashboardView.as_view(), name='dashboard'),
#     path('user-files/<int:user_id>/', UploadFileView.as_view(), name='upload'),
#     path('download/<path:file_id>/', DownloadFileView.as_view(), name='download'),
#     path('rename-file/', RenameFileView.as_view(), name='rename_file'),
#     path('change-file-comment/', ChangeFileCommentView.as_view(), name='change_file_comment'),
#     path('get-share-link/', GetShareLinkView.as_view(), name='get_share-link'),
#     path('user-delete/', UserDeleteView.as_view(), name='user_delete'),
#     path('dashboard/change-status/user/<int:user_id>/', changeUserStatusAdmin.as_view(), name='change_user_status'),
#     path('storage/<int:pk>/', UserFilesView.as_view(), name='storage'),
#     # Универсальный маршрут для React (должен быть последним)
#     re_path(
#         r'^(?!admin/|api/|dashboard/|login/|register/|user-files/|download/|rename-file/|change-file-comment/|get-share-link/|user-delete/|dashboard/change-status/user/|storage/|api/auth/session/|api/auth/logout/).*$',
#         TemplateView.as_view(template_name="index.html"), name='home1'),
# ]

urlpatterns = [
    # API-маршруты (все с префиксом /api/)
    path("api/auth/session/", check_session, name="check_session"),
    path("api/auth/logout/", logout_view, name="logout"),
    path("api/dashboard/<int:user_id>/", DashboardView.as_view(), name="dashboard_api"),
    path("api/user-files/<int:user_id>/", UploadFileView.as_view(), name="upload_api"),
    path("api/download/<path:file_id>/", DownloadFileView.as_view(), name="download_api"),
    path("api/rename-file/", RenameFileView.as_view(), name="rename_file_api"),
    path("api/change-file-comment/", ChangeFileCommentView.as_view(), name="change_file_comment_api"),
    path("api/get-share-link/", GetShareLinkView.as_view(), name="get_share-link_api"),
    path("api/user-delete/", UserDeleteView.as_view(), name="user_delete_api"),
    path("api/dashboard/change-status/user/<int:user_id>/", changeUserStatusAdmin.as_view(), name="change_user_status_api"),
    path("api/storage/<int:pk>/", UserFilesView.as_view(), name="storage_api"),

    # Маршруты для страниц (не API)
    path("admin/", admin.site.urls),
    path("login/", LoginView.as_view(), name="login"),
    path("register/", RegisterView.as_view(), name="register"),

    # Универсальный маршрут для React (должен быть последним)
    re_path(
        r'^(?!admin/|api|media/).*$',  # Исключаем только /admin/ и /api/
        TemplateView.as_view(template_name="index.html"),
        name="react_app"
    ),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)



