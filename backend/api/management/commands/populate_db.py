import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import Post  # Import your other models here
from faker import Faker

User = get_user_model()

class Command(BaseCommand):
    help = 'Populates the database with dummy data for LetsChai'

    def handle(self, *args, **kwargs):
        fake = Faker('en_IN') # Using Indian locale for realistic names
        
        departments = ['Computer Science', 'Mechanical Engineering', 'Electronics', 'Civil Engineering', 'Business', 'Arts']
        years = [1, 2, 3, 4]

        self.stdout.write('Deleting old data...')
        # Optional: Clear existing data (except superuser) to start fresh
        User.objects.filter(is_superuser=False).delete()
        Post.objects.all().delete()

        self.stdout.write('Creating 50 dummy users...')
        users = []
        for i in range(1, 51):
            # Generate fake data
            first_name = fake.first_name()
            last_name = fake.last_name()
            username = f"user{i}"
            
            user = User.objects.create_user(
                username=username,
                password='password123', # Give everyone the same easy password for testing
                first_name=first_name,
                last_name=last_name,
                # Assuming these are the custom fields on your User model:
                department=random.choice(departments),
                year=random.choice(years),
                bio=fake.sentence(nb_words=10)
            )
            users.append(user)

        self.stdout.write('Creating realistic posts...')
        # Have some random users create posts
        for _ in range(30):
            random_user = random.choice(users)
            Post.objects.create(
                author=random_user,
                content=fake.text(max_nb_chars=200)
            )

        self.stdout.write(self.style.SUCCESS('Successfully populated the database!'))