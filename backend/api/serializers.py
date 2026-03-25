from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Post, Connection, Club, ClubPost

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'department', 'year']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            department=validated_data.get('department', ''),
            year=validated_data.get('year'),
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'department', 'year', 'bio', 'profile_image']


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'department', 'year', 'bio', 'profile_image']
        read_only_fields = ['id', 'username']


class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    author_department = serializers.CharField(source='author.department', read_only=True)
    author_image = serializers.ImageField(source='author.profile_image', read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'author', 'author_name', 'author_department', 'author_image', 'content', 'image', 'created_at']
        read_only_fields = ['id', 'author', 'created_at']


class ConnectionSerializer(serializers.ModelSerializer):
    sender_info = UserSerializer(source='sender', read_only=True)
    receiver_info = UserSerializer(source='receiver', read_only=True)

    class Meta:
        model = Connection
        fields = ['id', 'sender', 'receiver', 'status', 'created_at', 'sender_info', 'receiver_info']
        read_only_fields = ['id', 'sender', 'status', 'created_at']


class ClubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Club
        fields = ['id', 'name', 'description', 'created_by', 'created_at']
        read_only_fields = ['id', 'created_by', 'created_at']


class ClubPostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = ClubPost
        fields = ['id', 'club', 'author', 'author_name', 'content', 'created_at']
        read_only_fields = ['id', 'club', 'author', 'created_at']
