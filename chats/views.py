from django.contrib.auth.models import User
from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from drf_api.permissions import IsSenderOrReceiver
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer


class ChatList(generics.ListCreateAPIView):
    """
    List all chats or create a new chat instance.
    """
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsSenderOrReceiver
    ]

    def get_queryset(self):
        user = self.request.user
        return Chat.objects.filter(
            sender=user) | Chat.objects.filter(receiver=user)

    def perform_create(self, serializer):
        sender = self.request.user
        receiver = serializer.validated_data['receiver']

        if Chat.objects.filter(sender=sender, receiver=receiver).exists(
        ) | Chat.objects.filter(sender=receiver, receiver=sender).exists():
            raise ValidationError({
                'detail': 'Chat with this user already exists.'})
        elif sender == receiver:
            raise ValidationError({
                'detail': 'You cannot send a message to yourself.'})

        serializer.save(sender=sender, receiver=receiver)


class ChatDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a chat instance.
    """
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsSenderOrReceiver
    ]

    def get_queryset(self):
        user = self.request.user
        return Chat.objects.filter(sender=user) | Chat.objects.filter(
            receiver=user)


class MessageList(generics.ListCreateAPIView):
    """
    List all messages or create a new message instance.
    """
    queryset = Chat.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsSenderOrReceiver
    ]

    def get_queryset(self):
        user = self.request.user
        chat_id = self.kwargs['pk']
        try:
            chat = Chat.objects.get(id=chat_id)
            if chat.sender == user or chat.receiver == user:
                return chat.messages.all()
            else:
                raise ValidationError({
                    'detail': 'You cannot access this chat.'})
        except Chat.DoesNotExist:
            raise ValidationError({'detail': 'Chat does not exist.'})

    def perform_create(self, serializer):
        chat_id = self.kwargs['pk']
        chat = Chat.objects.get(id=chat_id)
        user = self.request.user

        if chat.sender == user or chat.receiver == user:
            serializer.save(chat=chat, sender=user)
        else:
            raise ValidationError({'detail': 'You cannot access this chat.'})


class MessageDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a message instance.
    """
    queryset = Chat.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsSenderOrReceiver
    ]

    def get_queryset(self):
        user = self.request.user
        chat_id = self.kwargs['pk']
        chat = Chat.objects.get(id=chat_id)
        message_id = self.kwargs['message_pk']
        try:
            if chat.sender == user or chat.receiver == user:
                return chat.messages.filter(pk=message_id)
            else:
                raise ValidationError({
                    'detail': 'You cannot access this chat.'})
        except Chat.DoesNotExist:
            raise ValidationError({'detail': 'Chat does not exist.'})

    def get_object(self):
        user = self.request.user
        chat_id = self.kwargs['pk']
        chat = Chat.objects.get(pk=chat_id)
        message_id = self.kwargs['message_pk']
        try:
            if chat.sender == user or chat.receiver == user:
                message = chat.messages.get(pk=message_id)
                receiver = message.chat.receiver
                return message
            else:
                raise ValidationError({
                    'detail': 'You cannot access this chat.'})
        except (Chat.DoesNotExist, Message.DoesNotExist):
            raise ValidationError({'detail': 'Chat does not exist.'})

    def perform_update(self, serializer):
        user = self.request.user
        sender = self.get_object().sender
        reciever = self.get_object().chat.receiver
        message = self.get_object()
        if user == sender:
            object_instance = self.get_object()
            serializer.save(seen=False)
        elif user == reciever:
            if message.seen is False:
                message.seen = True
                if serializer.initial_data.get('message') != message.message:
                    raise ValidationError({
                        'detail': 'You cannot edit the message you received.'})
                else:
                    message.save()
