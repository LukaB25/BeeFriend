from rest_framework.decorators import api_view
from rest_framework.response import Response


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
        'for notifications': '/notifications/',
        'to access specific chat messages': '/chats/<chat_id>/messages/',
        'for admins to access the admin panel': '/admin/',
        'for notifications !! still under maintanance !!': '/notifications/'
        }
    }
    return Response(response_data)