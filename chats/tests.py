from django.contrib.auth.models import User
from .models import Chat, Message
from rest_framework import status
from rest_framework.test import APITestCase


class ChatListViewTests(APITestCase):
    """
    Tests for the ChatList view.
    """
    def setUp(self):
        self.user1 = User.objects.create_user(username='tester1', password='test123')
        self.user2 = User.objects.create_user(username='tester2', password='test321')
        self.user3 = User.objects.create_user(username='tester3', password='test456')
        Chat.objects.create(sender=User.objects.get(username='tester1'),
                            receiver=User.objects.get(username='tester2'))
        Chat.objects.create(sender=User.objects.get(username='tester2'),
                            receiver=User.objects.get(username='tester3'))

    def test_logged_out_user_cant_view_chat_list(self):
        response = self.client.get('/chats/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_logged_in_user_can_view_chat_list_with_chats_they_are_participating_in(self):
        tester1 = User.objects.get(username='tester1')
        self.client.login(username='tester1', password='test123')
        response = self.client.get('/chats/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        count = Chat.objects.filter(sender=tester1).count(
            ) + Chat.objects.filter(receiver=tester1).count()
        self.assertEqual(count, 1)

    def test_logged_in_user_can_create_a_new_chat_instance(self):
        self.client.force_login(self.user1)
        response = self.client.post('/chats/', {'receiver': self.user3.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        count = Chat.objects.filter(sender=self.user1).count(
            ) + Chat.objects.filter(receiver=self.user1).count()
        self.assertEqual(count, 2)

    def test_logged_in_user_cant_create_a_chat_instance_with_themselves(self):
        self.client.force_login(self.user1)
        response = self.client.post('/chats/', {'receiver': self.user1.id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_logged_in_user_cant_create_a_chat_instance_with_same_user_twice(self):
        self.client.force_login(self.user1)
        response = self.client.post('/chats/', {'receiver': self.user2.id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_can_access_their_chats_with_valid_id(self):
        self.client.force_login(self.user1)
        response = self.client.get('/chats/1/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_cant_access_chats_they_are_not_participating_in(self):
        self.client.force_login(self.user1)
        response = self.client.get('/chats/2/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_can_delete_chat_instance_they_are_a_participating_in(self):
        self.client.force_login(self.user1)
        response = self.client.delete('/chats/1/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_user_cant_delete_chat_instance_they_are_not_participating_in(self):
        self.client.force_login(self.user1)
        response = self.client.delete('/chats/2/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class MessageListViewTests(APITestCase):
    """
    Tests for the MessageList view.
    """
    def setUp(self):
        self.user1 = User.objects.create_user(username='tester1', password='test123')
        self.user2 = User.objects.create_user(username='tester2', password='test321')
        self.user3 = User.objects.create_user(username='tester3', password='test456')
        chat = Chat.objects.create(sender=User.objects.get(username='tester1'),
                                   receiver=User.objects.get(username='tester2'))
        Message.objects.create(chat=chat, sender=self.user1, message='Hello there!')
        chat2 = Chat.objects.create(sender=User.objects.get(username='tester2'),
                                    receiver=User.objects.get(username='tester3'))
        Message.objects.create(chat=chat2, sender=self.user2, message='Hi, how are you?')

    def test_logged_out_user_cant_view_message_list(self):
        response = self.client.get('/chats/1/messages/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_logged_in_user_can_view_their_own_message_list(self):
        self.client.force_login(self.user1)
        response = self.client.get('/chats/1/messages/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        count = Message.objects.filter(sender=self.user1).count()
        self.assertEqual(count, 1)

    def test_logged_in_user_cant_access_messages_they_are_not_participating_in(self):
        self.client.force_login(self.user1)
        response = self.client.get('/chats/2/messages/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_logged_in_user_can_create_a_new_message_instance(self):
        self.client.force_login(self.user1)
        response = self.client.post('/chats/1/messages/', {'message': 'Hello!'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        count = Message.objects.filter(sender=self.user1).count()
        self.assertEqual(count, 2)

    def test_logged_in_user_cant_create_a_message_instance_in_a_chat_they_are_not_participating_in(self):
        self.client.force_login(self.user1)
        response = self.client.post('/chats/2/messages/', {'message': 'Hello!'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_logged_in_user_can_delete_message_instance_they_have_sent(self):
        self.client.force_login(self.user1)
        response = self.client.delete('/chats/1/messages/1/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_logged_in_user_cant_delete_message_instance_they_have_not_sent(self):
        self.client.force_login(self.user1)
        response = self.client.delete('/chats/1/messages/2/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_logged_in_sender_can_update_message_instance_they_have_sent(self):
        self.client.force_login(self.user1)
        response = self.client.put('/chats/1/messages/1/', {'message': 'Hello!'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logged_in_sender_cant_update_message_instance_they_have_not_sent(self):
        self.client.force_login(self.user1)
        response = self.client.put('/chats/1/messages/2/', {'message': 'Hello!'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_logged_in_receiver_cant_update_message_instance_they_have_received(self):
        self.client.force_login(self.user2)
        response = self.client.put('/chats/1/messages/2/', {'message': 'Hello!'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
