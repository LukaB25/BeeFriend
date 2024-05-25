from rest_framework.decorators import api_view
from rest_framework.response import Response
from .settings import (
    JWT_AUTH_COOKIE, JWT_AUTH_REFRESH_COOKIE, JWT_AUTH_SAMESITE,
    JWT_AUTH_SECURE
)


@api_view()
def root_route(request):
    response_data = {
        'message': 'Welcome to the API.',
        'endpoints': {
            'for profiles': '/profiles/',
            'for posts': '/posts/',
            'for comments': '/comments/',
            'for likes': '/likes/',
            'for friends': '/friends/',
            'for chats': '/chats/',
            'to access specific chat messages': '/chats/<chat_id>/messages/',
            'for admins to access the admin panel': '/admin/',
        }
    }
    return Response(response_data)


# dj-rest-auth logout view fix
@api_view(['POST'])
def logout_route(request):
    response = Response()
    response.set_cookie(
        key=JWT_AUTH_COOKIE,
        value='',
        httponly=True,
        expires='Thu, 01 Jan 1970 00:00:00 GMT',
        max_age=0,
        samesite=JWT_AUTH_SAMESITE,
        secure=JWT_AUTH_SECURE,
    )
    response.set_cookie(
        key=JWT_AUTH_REFRESH_COOKIE,
        value='',
        httponly=True,
        expires='Thu, 01 Jan 1970 00:00:00 GMT',
        max_age=0,
        samesite=JWT_AUTH_SAMESITE,
        secure=JWT_AUTH_SECURE,
    )
    return response
