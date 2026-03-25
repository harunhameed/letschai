import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import Post, Branch, Batch, Place
from faker import Faker

User = get_user_model()

class Command(BaseCommand):
    help = 'Populates the database with dummy data for LetsChai'

    def handle(self, *args, **kwargs):
        fake = Faker('en_IN') 
        
        departments = ['Computer Science', 'Mechanical Engineering', 'Electronics', 'Civil Engineering', 'Business', 'Arts']
        years = [1, 2, 3, 4]
        places = ['Library', 'Cafeteria', 'CS Lab', 'Sports Complex', 'Student Center']

        self.stdout.write('Deleting old data...')
        # Clear existing data (except superuser) to start fresh
        User.objects.filter(is_superuser=False).delete()
        Post.objects.all().delete()
        Branch.objects.all().delete()
        Batch.objects.all().delete()
        Place.objects.all().delete()

        self.stdout.write('Creating Branches, Batches, and Places...')
        branch_objs = [Branch.objects.create(name=d) for d in departments]
        batch_objs = [Batch.objects.create(year=y) for y in years]
        place_objs = [Place.objects.create(name=p) for p in places]

        self.stdout.write('Creating 50 dummy users...')
        users = []
        for i in range(1, 51):
            first_name = fake.first_name()
            last_name = fake.last_name()
            username = f"user{i}"
            
            user = User.objects.create_user(
                username=username,
                password='password123',
                first_name=first_name,
                last_name=last_name,
                branch=random.choice(branch_objs),
                batch=random.choice(batch_objs),
                bio=fake.sentence(nb_words=10),
                dob=fake.date_of_birth(minimum_age=17, maximum_age=25),
                daily_spin_count=0,
                is_authorized=True
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