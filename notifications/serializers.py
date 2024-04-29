from rest_framework import serializers
from .models import Notification


class FriendRequestNotificationSerializer(serializers.ModelSerializer):
    """
    Friend request notification model serializer.
    """
    owner = serializers.ReadOnlyField(source='owner.username')
    friend = serializers.ReadOnlyField(source='friend.friend.username')
    notification_type = serializers.ReadOnlyField()
    friend_accepted = serializers.ReadOnlyField(source='friend.accepted')
    


    class Meta:
        model = Notification
        fields = [
            'id',
            'owner',
            'friend',
            'friend_accepted',
            'seen',
            'notification_type',
            'created_at',
        ]
        read_only_fields = [
            'id',
            'created_at',
            'owner',
            'friend',
            'notification_type',
            'created_at',
        ]


class LikeNotificationSerializer(serializers.ModelSerializer):
    """
    Like notification model serializer.
    """
    owner = serializers.ReadOnlyField(source='owner.username')
    like_owner = serializers.ReadOnlyField(source='like.owner.username')
    liked_post = serializers.ReadOnlyField(source='like.post.title')
    liked_post_id = serializers.ReadOnlyField(source='like.post.id')
    notification_type = serializers.ReadOnlyField()


    class Meta:
        model = Notification
        fields = [
            'id',
            'owner',
            'like_owner',
            'liked_post',
            'liked_post_id',
            'notification_type',
            'seen',
            'created_at',
        ]
        read_only_fields = [
            'id',
            'owner',
            'like_owner',
            'liked_post',
            'liked_post_id',
            'notification_type',
            'created_at',
        ]


class CommentNotificationSerializer(serializers.ModelSerializer):
    """
    Comment notification model serializer.
    """
    owner = serializers.ReadOnlyField(source='owner.username')
    comment_owner = serializers.ReadOnlyField(source='comment.owner.username')
    commented_post = serializers.ReadOnlyField(source='comment.post.title')
    commented_post_id = serializers.ReadOnlyField(source='comment.post.id')
    notification_type = serializers.ReadOnlyField()


    class Meta:
        model = Notification
        fields = [
            'id',
            'owner',
            'comment_owner',
            'commented_post',
            'commented_post_id',
            'notification_type',
            'seen',
            'created_at',
        ]
        read_only_fields = [
            'id',
            'owner',
            'comment_owner',
            'commented_post',
            'commented_post_id',
            'notification_type',
            'created_at',
        ]


class MessageNotificationSerializer(serializers.ModelSerializer):
    """
    Message notification model serializer.
    """
    owner = serializers.ReadOnlyField(source='owner.username')
    message_sender = serializers.ReadOnlyField(source='message.sender.username')
    message_chat = serializers.ReadOnlyField(source='message.chat.id')
    notification_type = serializers.ReadOnlyField()


    class Meta:
        model = Notification
        fields = [
            'id',
            'owner',
            'message_sender',
            'message_chat',
            'notification_type',
            'seen',
            'created_at',
        ]
        read_only_fields = [
            'id',
            'owner',
            'message_sender',
            'message_chat',
            'notification_type',
            'created_at',
        ]
