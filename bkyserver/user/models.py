from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid



class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    profile_picture_key = models.CharField(max_length=255, blank=True, null=True, help_text="Stores the R2 object key")
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.username


























