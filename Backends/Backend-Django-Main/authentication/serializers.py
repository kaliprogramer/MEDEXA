from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True)
    class Meta:
        model=User
        fields=["username","email","Organization_name","Specialization","password"]
    def create(self,validated_data):
        return User.objects.create_user(**validated_data)

