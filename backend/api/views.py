import random
from django.contrib.auth import authenticate, get_user_model
from django.db.models import Q
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from .models import Post, Connection, Club, ClubPost
from .serializers import (
    UserRegistrationSerializer, UserSerializer, ProfileSerializer,
    PostSerializer, ConnectionSerializer, ClubSerializer, ClubPostSerializer,
)

User = get_user_model()


# ═══════════════════════════════════════════
#  AUTH
# ═══════════════════════════════════════════

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """Register a new user."""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login and return auth token."""
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if user is None:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user': UserSerializer(user).data,
    })


# ═══════════════════════════════════════════
#  PROFILE
# ═══════════════════════════════════════════

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """Get or update current user's profile."""
    if request.method == 'GET':
        return Response(ProfileSerializer(request.user).data)

    serializer = ProfileSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile_view(request, user_id):
    """View another user's profile."""
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    return Response(UserSerializer(user).data)


# ═══════════════════════════════════════════
#  FEED / POSTS
# ═══════════════════════════════════════════

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def post_list_create(request):
    """GET: list all posts. POST: create a new post."""
    if request.method == 'GET':
        posts = Post.objects.select_related('author').all()
        return Response(PostSerializer(posts, many=True).data)

    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ═══════════════════════════════════════════
#  CONNECTIONS
# ═══════════════════════════════════════════

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_connection(request):
    """Send a connection request."""
    receiver_id = request.data.get('receiver')

    if not receiver_id:
        return Response({'error': 'Receiver ID required'}, status=status.HTTP_400_BAD_REQUEST)

    if int(receiver_id) == request.user.id:
        return Response({'error': 'Cannot connect with yourself'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        receiver = User.objects.get(id=receiver_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # Check if connection already exists in either direction
    existing = Connection.objects.filter(
        Q(sender=request.user, receiver=receiver) |
        Q(sender=receiver, receiver=request.user)
    ).first()

    if existing:
        return Response({'error': 'Connection already exists or pending'}, status=status.HTTP_400_BAD_REQUEST)

    conn = Connection.objects.create(sender=request.user, receiver=receiver)
    return Response(ConnectionSerializer(conn).data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_connection(request, conn_id):
    """Accept a pending connection request."""
    try:
        conn = Connection.objects.get(id=conn_id, receiver=request.user, status='pending')
    except Connection.DoesNotExist:
        return Response({'error': 'Request not found'}, status=status.HTTP_404_NOT_FOUND)

    conn.status = 'accepted'
    conn.save()
    return Response(ConnectionSerializer(conn).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pending_requests(request):
    """List pending connection requests received by current user."""
    conns = Connection.objects.filter(receiver=request.user, status='pending').select_related('sender')
    return Response(ConnectionSerializer(conns, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_connections(request):
    """List accepted connections for current user."""
    conns = Connection.objects.filter(
        Q(sender=request.user) | Q(receiver=request.user),
        status='accepted'
    ).select_related('sender', 'receiver')
    return Response(ConnectionSerializer(conns, many=True).data)


# ═══════════════════════════════════════════
#  SEARCH
# ═══════════════════════════════════════════

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_users(request):
    """Search users by name or username."""
    query = request.GET.get('q', '').strip()
    if not query:
        return Response([])

    users = User.objects.filter(
        Q(username__icontains=query) |
        Q(first_name__icontains=query) |
        Q(last_name__icontains=query) |
        Q(department__icontains=query)
    ).exclude(id=request.user.id)[:20]

    return Response(UserSerializer(users, many=True).data)


# ═══════════════════════════════════════════
#  SPIN
# ═══════════════════════════════════════════

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def spin_view(request):
    """Randomly match with a user (excludes self, connected, pending)."""
    # Get IDs to exclude
    connected_ids = set(
        Connection.objects.filter(
            Q(sender=request.user) | Q(receiver=request.user)
        ).values_list('sender_id', 'receiver_id')
        .distinct()
    )
    # Flatten the set of tuples
    exclude_ids = set()
    for pair in connected_ids:
        exclude_ids.update(pair)
    exclude_ids.add(request.user.id)

    candidates = User.objects.exclude(id__in=exclude_ids)

    if not candidates.exists():
        return Response({'error': 'No new users to discover right now'}, status=status.HTTP_404_NOT_FOUND)

    matched_user = random.choice(list(candidates))

    # Auto-send connection request
    conn = Connection.objects.create(sender=request.user, receiver=matched_user)

    return Response({
        'user': UserSerializer(matched_user).data,
        'connection': ConnectionSerializer(conn).data,
    })


# ═══════════════════════════════════════════
#  CLUBS
# ═══════════════════════════════════════════

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def club_list(request):
    """List all clubs."""
    clubs = Club.objects.all()
    return Response(ClubSerializer(clubs, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def club_posts(request, club_id):
    """List posts in a club."""
    posts = ClubPost.objects.filter(club_id=club_id).select_related('author')
    return Response(ClubPostSerializer(posts, many=True).data)
