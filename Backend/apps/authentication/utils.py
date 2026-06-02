import datetime
import hashlib
import jwt
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

import uuid

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

def set_auth_cookies(response, user):
    access_token = generate_access_token(user)
    refresh_token = generate_refresh_token(user)
    
    hashed = hash_token(refresh_token)
    decoded_refresh = decode_token(refresh_token)
    
    # Expiry time from decoded JWT payload
    expires_at = datetime.datetime.fromtimestamp(decoded_refresh['exp'], tz=datetime.timezone.utc)
    
    # Store refresh token record
    RefreshToken.objects.create(
        user=user,
        token=hashed,
        expires_at=expires_at
    )
    
    # Determine secure cookie settings (HTTPS in prod)
    is_secure = not settings.DEBUG
    
    # Set cookies
    response.set_cookie(
        key='access_token',
        value=access_token,
        max_age=15 * 60,
        httponly=True,
        secure=is_secure,
        samesite='Lax',
        path='/'
    )
    
    response.set_cookie(
        key='refresh_token',
        value=refresh_token,
        max_age=7 * 24 * 60 * 60,
        httponly=True,
        secure=is_secure,
        samesite='Lax',
        path='/'
    )
    return response

def clear_auth_cookies(response):
    response.delete_cookie('access_token', path='/')
    response.delete_cookie('refresh_token', path='/')
    return response

def rotate_refresh_token(old_refresh_token_str, response):
    # Decode token
    payload = decode_token(old_refresh_token_str)
    if not payload:
        return None
    
    user_id = payload.get('user_id')
    hashed_old = hash_token(old_refresh_token_str)
    
    try:
        db_token = RefreshToken.objects.get(token=hashed_old)
    except RefreshToken.DoesNotExist:
        # Invalid or untracked token
        return None
        
    user = db_token.user
    
    # Check for reuse / theft detection
    if db_token.is_revoked:
        # Crucial security: Revoke ALL active refresh tokens for this user
        RefreshToken.objects.filter(user=user, is_revoked=False).update(is_revoked=True)
        return None
        
    # Check expiration
    if db_token.expires_at < timezone.now():
        db_token.is_revoked = True
        db_token.save()
        return None
        
    # Valid token. Rotate:
    db_token.is_revoked = True
    db_token.save()
    
    # Generate and set new pair of tokens
    set_auth_cookies(response, user)
    return user
