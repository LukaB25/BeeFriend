from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError, MethodNotAllowed
from drf_api.permissions import IsOwner
from .models import Notification
from likes.models import Like
from comments.models import Comment
from chats.models import Message
from .serializers import (
    FriendRequestNotificationSerializer,
    LikeNotificationSerializer,
    CommentNotificationSerializer,
    MessageNotificationSerializer
)


class NotificationList(generics.ListCreateAPIView):
    """
    List all notifications or create a new notification instance.
    New notifications are created automatically each time user receives
    a friend request, new comment or like on their post, or a message.
    """
    queryset = Notification.objects.all()
    permission_classes = [
        permissions.IsAuthenticated,
        IsOwner
    ]

    def get(self,request, *args, **kwargs):
        notifications = self.get_queryset().filter(owner=request.user)
        notification_data = self.serializer_notifications(notifications)
        return Response(notification_data)

    def serializer_notifications(self, notifications):
        notification_data = []
        for notification in notifications:
            if notification.notification_type == 'friend_request':
                serializer = FriendRequestNotificationSerializer(notification)
            elif notification.notification_type == 'like':
                serializer = LikeNotificationSerializer(notification)
            elif notification.notification_type == 'comment':
                serializer = CommentNotificationSerializer(notification)
            elif notification.notification_type == 'message':
                serializer = MessageNotificationSerializer(notification)
            else:
                raise ValidationError({'detail': 'Invalid notification type.'})
            notification_data.append(serializer.data)
        return notification_data

    def create_notification(self, notification_type, request_data):
        request = self.context['request']
        owner = None
        if notification_type == 'friend_request':
            receiver = User.objects.get(username=request_data['friend'])
            sender = request.user
            owner = receiver
        elif notification_type == 'like':
            like = Like.objects.get(
                post=request_data['post'],
                user=request.user
            )
            liked_post = like.post
            owner = liked_post.owner
            like_owner = like.owner
        elif notification_type == 'comment':
            comment = Comment.objects.get(
                post=request_data['post'],
                owner=request_data['owner']
            )
            commented_post = comment.post
            owner = commented_post.owner
            comment_owner = comment.owner
        elif notification_type == 'message':
            message = Message.objects.get(
                sender=request_data['sender'],
                receiver=request_data['receiver']
            )
            owner = message.receiver
        
        if not owner:
            raise ValidationError({'detail':
                'Invalid notification type or missing data.'})
        
        notification = Notification.objects.create(
            owner=owner,
            friend=sender,
            like_owner=like_owner,
            liked_post=liked_post,
            comment_owner=comment_owner,
            commented_post=commented_post,
            notification_type=notification_type
        )


    def perform_create(self, serializer, create_notification):
        request = self.context['request']
        if request.method == 'POST':
            if 'friend' in request.data:
                notification_type = 'friend_request'
            elif 'like' in request.data:
                notification_type = 'like'
            elif 'comment' in request.data:
                notification_type = 'comment'
            elif 'message' in request.data:
                notification_type = 'message'
            else:
                raise ValidationError({'detail':
                'Invalid notification type.'})

            try:
                notification = create_notification(
                    notification_type, request.data
                )
                serializer.save(notification=notification)
            except (User.DoesNotExist, Like.DoesNotExist, Comment.DoesNotExist,
                    Message.DoesNotExist):
                raise ValidationError({'detail': 'Invalid notification data.'})
        else:
            raise MethodNotAllowed('POST')
        
