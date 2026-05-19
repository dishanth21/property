from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    is_host = models.BooleanField(default=False)
    is_buyer = models.BooleanField(default=True)
    is_admin_user = models.BooleanField(default=False)
    phone = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.username

