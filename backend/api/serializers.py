from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Post, Connection, Club, ClubPost, Branch, Batch, Place, SpinAttempt

User = get_user_model()

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ['id', 'name']

class BatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batch
        fields = ['id', 'year']

class PlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Place
        fields = ['id', 'name']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    branch_id = serializers.PrimaryKeyRelatedField(
        queryset=Branch.objects.all(), source='branch', write_only=True, required=False
    )
    batch_id = serializers.PrimaryKeyRelatedField(
        queryset=Batch.objects.all(), source='batch', write_only=True, required=False
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'branch_id', 'batch_id', 'dob']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            branch=validated_data.get('branch'),
            batch=validated_data.get('batch'),
            dob=validated_data.get('dob'),
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    branch = BranchSerializer(read_only=True)
    batch = BatchSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'first_name', 'last_name', 'branch', 'batch', 
            'bio', 'profile_image', 'id_card_photo', 'daily_spin_count', 
            'is_authorized', 'dob'
        ]

class ProfileSerializer(serializers.ModelSerializer):
    branch = BranchSerializer(read_only=True)
    batch = BatchSerializer(read_only=True)
    branch_id = serializers.PrimaryKeyRelatedField(
        queryset=Branch.objects.all(), source='branch', write_only=True, required=False
    )
    batch_id = serializers.PrimaryKeyRelatedField(
        queryset=Batch.objects.all(), source='batch', write_only=True, required=False
    )

    class Meta:
        model = User
        fields = [
            'id', 'username', 'first_name', 'last_name', 'branch', 'batch', 
            'branch_id', 'batch_id', 'bio', 'profile_image', 'id_card_photo', 
            'daily_spin_count', 'is_authorized', 'dob'
        ]
        read_only_fields = ['id', 'username', 'is_authorized', 'daily_spin_count']

class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    author_image = serializers.ImageField(source='author.profile_image', read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'author', 'author_name', 'author_image', 'content', 'image', 'created_at']
        read_only_fields = ['id', 'author', 'created_at']

class ConnectionSerializer(serializers.ModelSerializer):
    sender_info = UserSerializer(source='sender', read_only=True)
    receiver_info = UserSerializer(source='receiver', read_only=True)
    place_info = PlaceSerializer(source='place', read_only=True)
    place_id = serializers.PrimaryKeyRelatedField(
        queryset=Place.objects.all(), source='place', write_only=True, required=False
    )

    class Meta:
        model = Connection
        fields = ['id', 'sender', 'receiver', 'status', 'source', 'place_info', 'place_id', 'created_at', 'sender_info', 'receiver_info']
        read_only_fields = ['id', 'sender', 'status', 'created_at']

class SpinAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpinAttempt
        fields = ['id', 'student', 'spin_date', 'attempts_used']
        read_only_fields = ['id', 'student', 'spin_date']

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
