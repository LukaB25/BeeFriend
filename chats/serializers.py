from django.contrib.humanize.templatetags.humanize import naturaltime
from rest_framework import serializers
from .models import Chat, Message



class ChatSerializer(serializers.ModelSerializer):
    """
    Chat model serialzier.
    Creates a new chat instance so users can send messages to each other.
    First message sent to the user creates the chat instance.
    Validates that the user can't send a message to themselves.
    Each message sent to the user is connected to the previous chats they shared
    but the messages are connected to the chat id.
    """
    sender = serializers.ReadOnlyField(source='sender.username')
    receiver_username = serializers.ReadOnlyField(source='receiver.username')
    receiver_image = serializers.ReadOnlyField(source='receiver.profile.image.url')
    last_message = serializers.SerializerMethodField()
    unread_message_count = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()

    def get_last_message(self, obj):
        last_message = obj.messages.order_by('-created_at').first()
        return last_message.message if last_message else None
    
    def get_unread_message_count(self, obj):
        user = self.context['request'].user
        message_count = obj.messages.filter(chat=obj, chat__receiver=user, seen=False).count()
        return message_count
    
    def get_created_at(self, obj):
        return naturaltime(obj.created_at)
    

    class Meta:
        model = Chat
        fields = [
            'id',
            'sender',
            'receiver',
            'receiver_username',
            'receiver_image',
            'created_at',
            'last_message',
            'unread_message_count',
        ]


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.ReadOnlyField(source='sender.username')
    receiver = serializers.ReadOnlyField(source='get_receiver_username')
    created_at = serializers.SerializerMethodField()

    def get_created_at(self, obj):
        return naturaltime(obj.created_at)


    class Meta:
        model = Message
        fields = [
            'id',
            'sender',
            'message',
            'receiver',
            'created_at',
            'seen',
        ]
        read_only_fields = ['seen']