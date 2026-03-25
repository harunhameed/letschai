from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('auth/register/', views.register_view, name='register'),
    path('auth/login/', views.login_view, name='login'),

    # Profile
    path('profile/', views.profile_view, name='profile'),
    path('profile/<int:user_id>/', views.user_profile_view, name='user-profile'),

    # Feed
    path('posts/', views.post_list_create, name='posts'),

    # Connections
    path('connections/send/', views.send_connection, name='send-connection'),
    path('connections/accept/<int:conn_id>/', views.accept_connection, name='accept-connection'),
    path('connections/pending/', views.pending_requests, name='pending-requests'),
    path('connections/', views.my_connections, name='my-connections'),

    # Search
    path('search/', views.search_users, name='search-users'),

    # Spin
    path('spin/', views.spin_view, name='spin'),

    # Clubs
    path('clubs/', views.club_list, name='clubs'),
    path('clubs/<int:club_id>/posts/', views.club_posts, name='club-posts'),
]
