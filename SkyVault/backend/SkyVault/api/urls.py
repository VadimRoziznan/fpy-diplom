from .views import (LoginView, RegisterView, UserFilesView, DashboardView, UploadFileView,
                    changeUserStatusAdmin, DownloadFileView, RenameFileView, ChangeFileCommentView,
                    GetShareLinkView, UserDeleteView)
from django.urls import path


urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('storage/<int:pk>/', UserFilesView.as_view(), name='storage'),
    path('dashboard/<int:pk>/', DashboardView.as_view(), name='dashboard'),
    path('user-files/<int:user_id>/', UploadFileView.as_view(), name='upload'),
    path('dashboard/change-status/user/<int:user_id>/', changeUserStatusAdmin.as_view(), name='change_user_status'),
    path('download/<path:file_id>/', DownloadFileView.as_view(), name='download'),
    path('rename-file/', RenameFileView.as_view(), name='rename_file'),
    path('change-file-comment/', ChangeFileCommentView.as_view(), name='change_file_comment'),
    path('get-share-link/', GetShareLinkView.as_view(), name='get_share-link'),
    path('user-delete/', UserDeleteView.as_view(), name='user_delete'),

]