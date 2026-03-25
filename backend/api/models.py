from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class Branch(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Batch(models.Model):
    year = models.PositiveIntegerField()

    def __str__(self):
        return str(self.year)

class Place(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class User(AbstractUser):
    """Extended user with campus-specific fields."""
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True, related_name='students')
    batch = models.ForeignKey(Batch, on_delete=models.SET_NULL, null=True, blank=True, related_name='students')
    daily_spin_count = models.IntegerField(default=0)
    is_authorized = models.BooleanField(default=False)
    dob = models.DateField(null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    id_card_photo = models.ImageField(upload_to='id_cards/', blank=True, null=True)

    def __str__(self):
        return self.username

class Post(models.Model):
    """Campus feed post."""
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField(max_length=2000)
    image = models.ImageField(upload_to='posts/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.author.username}: {self.content[:50]}'

class Connection(models.Model):
    """Connection request between two users."""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
    ]

    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_connections')
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_connections')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    source = models.CharField(max_length=100, blank=True)
    place = models.ForeignKey(Place, on_delete=models.SET_NULL, null=True, blank=True, related_name='connections')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('sender', 'receiver')
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.sender.username} → {self.receiver.username} ({self.status})'

class SpinAttempt(models.Model):
    """Tracks a user's spin attempt."""
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='spin_attempts')
    spin_date = models.DateTimeField(auto_now_add=True)
    attempts_used = models.IntegerField(default=1)

    def __str__(self):
        return f'{self.student.username} - {self.spin_date.date()}'

class Club(models.Model):
    """Campus club / community."""
    name = models.CharField(max_length=200)
    description = models.TextField(max_length=1000, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_clubs')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class ClubPost(models.Model):
    """Post within a club."""
    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='posts')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='club_posts')
    content = models.TextField(max_length=2000)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'[{self.club.name}] {self.author.username}: {self.content[:50]}'
