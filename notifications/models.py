from django.contrib.auth.models import User
from django.db import models
from friends.models import Friend
from comments.models import Comment
from likes.models import Like
from chats.models import Message


class Notification(models.Model):
    """
    Notification model related to the User('owner') instance,
    the Friend, Comment, Like, and Message instances.
    Notifications are created when a user receives a friend request,
    receives a comment or like on their post, or receives a message.
    """
    NOTIFICATION_TYPE_CHOICES = [
        ('friend_request', 'Friend Request'),
        ('comment', 'Comment'),
        ('like', 'Like'),
        ('message', 'Message'),
    ]
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    friend = models.ForeignKey(
        Friend, on_delete=models.CASCADE, null=True, blank=True
    )
    comment = models.ForeignKey(
        Comment, on_delete=models.CASCADE, null=True, blank=True
    )
    like = models.ForeignKey(
        Like, on_delete=models.CASCADE, null=True, blank=True
    )
    message = models.ForeignKey(
        Message, on_delete=models.CASCADE, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    seen = models.BooleanField(default=False)
    notification_type = models.CharField(
        max_length=25, choices=NOTIFICATION_TYPE_CHOICES
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        if self.notification_type == 'friend_request':
            return f"{self.friend.friend} sent you a friend request."
        elif self.notification_type == 'comment':
            return f"{self.comment.owner} commented on your post."
        elif self.notification_type == 'like':
            return f"{self.like.owner} liked your post."
        elif self.notification_type == 'message':
            return f"{self.message.sender} sent you a new message."
        else:
            return "Unknown notification"