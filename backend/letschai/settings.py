"""
Django settings for letschai project.
Configured for PostgreSQL (NeonSQL) with DRF and CORS.
"""

import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url


import logging
import sqlparse
from pygments import highlight
from pygments.lexers import SqlLexer
from pygments.formatters import TerminalTrueColorFormatter

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-change-me')

DEBUG = os.getenv('DEBUG', 'True').lower() in ('true', '1', 'yes')

ALLOWED_HOSTS = ['*']

# ─── Apps ───
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third party
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'django_filters',
    # Local
    'api',
]

# ─── Middleware ───
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ─── CORS ───
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# ─── REST Framework ───
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
}

ROOT_URLCONF = 'letschai.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'letschai.wsgi.application'

# ─── Database (NeonSQL PostgreSQL) ───
DATABASE_URL = os.getenv('DATABASE_URL')

if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.parse(DATABASE_URL)
    }
else:
    # Fallback to SQLite for local dev without Neon
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# ─── Auth ───
AUTH_USER_MODEL = 'api.User'

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
]

# ─── Internationalization ───
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

# ─── Static / Media ───
STATIC_URL = 'static/'
MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

class BeautifulSQLFormatter(logging.Formatter):
    def format(self, record):
        # Only format if it's an actual SQL query string
        if hasattr(record, 'sql'):
            sql = record.sql
        else:
            sql = record.getMessage()
            
        # Format the SQL to be multi-line and highly readable
        formatted_sql = sqlparse.format(sql, reindent=True, keyword_case='upper')
        
        # Add beautiful syntax highlighting for the terminal
        colored_sql = highlight(formatted_sql, SqlLexer(), TerminalTrueColorFormatter(style='monokai'))
        
        return f"\n\033[95m[LetsChai DB Execution]\033[0m\n{colored_sql}"

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'beautiful_sql': {
            '()': BeautifulSQLFormatter, 
        },
    },
    'handlers': {
        'console_sql': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'beautiful_sql',
        },
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['console_sql'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}