from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    first_name = models.CharField(max_length=50, null=False)
    email = models.EmailField(unique=True, null=False)
    # Поле username уже встроено как `username` в AbstractUser
    # Поле password тоже встроено

    def __str__(self):
        return self.username


