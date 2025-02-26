from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth import get_user_model

@receiver(post_migrate)
def create_initial_users(sender, **kwargs):
    User = get_user_model()

    # Создаем суперпользователя (Admin)
    if not User.objects.filter(username='Admin').exists():
        User.objects.create_superuser(
            username='Admin',
            first_name='Админ',
            email='admin@mail.ru',
            password='Rfa233Rfa233!',
        )

    # Создаем первого обычного пользователя (User1)
    if not User.objects.filter(username='User1').exists():
        User.objects.create_user(
            username='User1',
            first_name='Пользователь1',
            email='user1@example.com',
            password='User1Password123!',
        )

    # Создаем второго обычного пользователя (User2)
    if not User.objects.filter(username='User2').exists():
        User.objects.create_user(
            username='User2',
            first_name='Пользователь2',
            email='user2@example.com',
            password='User2Password123!',
        )
