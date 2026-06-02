import datetime
import hashlib
import jwt
import uuid
from django.conf import settings
from django.utils import timezone
from .models import RefreshToken

def generate_access_token(user):
    payload = {
        'user_id': user.id,
        'email': user.email,
        'role': user.role,
        'exp': timezone.now() + datetime.timedelta(minutes=15),
        'iat': timezone.now(),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

def generate_refresh_token(user):
    payload = {
        'user_id': user.id,
        'jti': str(uuid.uuid4()),
        'exp': timezone.now() + datetime.timedelta(days=7),
        'iat': timezone.now(),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

def decode_token(token):
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def hash_token(token_str):
    return hashlib.sha256(token_str.encode('utf-8')).hexdigest()

def generate_auth_tokens(user):
    access_token = generate_access_token(user)
    refresh_token = generate_refresh_token(user)
    
    hashed = hash_token(refresh_token)
    decoded_refresh = decode_token(refresh_token)
    expires_at = datetime.datetime.fromtimestamp(decoded_refresh['exp'], tz=datetime.timezone.utc)
    
    RefreshToken.objects.create(
        user=user,
        token=hashed,
        expires_at=expires_at
    )
    return {
        'access': access_token,
        'refresh': refresh_token
    }

def rotate_refresh_token_header(old_refresh_token_str):
    payload = decode_token(old_refresh_token_str)
    if not payload:
        return None
        
    user_id = payload.get('user_id')
    hashed_old = hash_token(old_refresh_token_str)
    
    try:
        db_token = RefreshToken.objects.get(token=hashed_old)
    except RefreshToken.DoesNotExist:
        return None
        
    user = db_token.user
    
    if db_token.is_revoked:
        RefreshToken.objects.filter(user=user, is_revoked=False).update(is_revoked=True)
        return None
        
    if db_token.expires_at < timezone.now():
        db_token.is_revoked = True
        db_token.save()
        return None
        
    db_token.is_revoked = True
    db_token.save()
    
    return generate_auth_tokens(user)
