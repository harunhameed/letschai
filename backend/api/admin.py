from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import Post, Connection, Club, ClubPost

User = get_user_model()


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'first_name', 'last_name', 'branch', 'batch', 'is_staff']
    search_fields = ['username', 'first_name', 'last_name', 'branch__name']
    list_filter = ['branch', 'batch', 'is_staff']


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['author', 'content_preview', 'created_at']
    list_filter = ['created_at']

    def content_preview(self, obj):
        return obj.content[:80]


@admin.register(Connection)
class ConnectionAdmin(admin.ModelAdmin):
    list_display = ['sender', 'receiver', 'status', 'created_at']
    list_filter = ['status', 'created_at']


@admin.register(Club)
class ClubAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_by', 'created_at']


@admin.register(ClubPost)
class ClubPostAdmin(admin.ModelAdmin):
    list_display = ['club', 'author', 'content_preview', 'created_at']

    def content_preview(self, obj):
        return obj.content[:80]
