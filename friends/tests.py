from django.contrib.auth.models import User
from .models import Friend
from rest_framework import status
from rest_framework.test import APITestCase


class FriendListViewTests(APITestCase):
    """
    Tests for the FriendList view.
    """
    def setUp(self):
        User.objects.create_user(username='tester', password='test123')
        User.objects.create_user(username='tester2', password='test321')
        User.objects.create_user(username='tester3', password='test456')
        Friend.objects.create(owner=User.objects.get(username='tester'), friend=User.objects.get(username='tester2'))
    
    def test_user_can_lookup_all_friend_requests(self):
        response = self.client.get('/friends/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logged_in_user_can_send_a_friend_request(self):
        self.client.login(username='tester', password='test123')
        response = self.client.post('/friends/', {'friend': User.objects.get(username='tester3').id})
        count = Friend.objects.count()
        self.assertEqual(count, 2)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_logged_in_user_cant_send_a_friend_request_to_themselves(self):
        self.client.login(username='tester', password='test123')
        response = self.client.post('/friends/', {'friend': User.objects.get(username='tester').id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_logged_in_user_cant_send_a_friend_request_twice(self):
        self.client.login(username='tester', password='test123')
        response = self.client.post('/friends/', {'friend': User.objects.get(username='tester2').id})
        self.assertEqual(response.data['detail'], 'You have already sent a friend request to this user.')

    def test_logged_in_user_cant_send_a_friend_request_to_an_existing_friend(self):
        Friend.objects.create(owner=User.objects.get(username='tester2'), friend=User.objects.get(username='tester3'), accepted=True)
        self.client.login(username='tester3', password='test456')
        response = self.client.post('/friends/', {'friend': User.objects.get(username='tester2').id})
        self.assertEqual(response.data['detail'], 'You are already friends with this user.')

    def test_logged_out_user_cant_send_a_friend_request(self):
        response = self.client.post('/friends/', {'friend': User.objects.get(username='tester3').id})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class FriendDetailViewTests(APITestCase):
    """
    Tests for the FriendDetail view.
    """
    def setUp(self):
        User.objects.create_user(username='tester', password='test123')
        User.objects.create_user(username='tester2', password='test321')
        User.objects.create_user(username='tester3', password='test456')
        Friend.objects.create(owner=User.objects.get(username='tester'), friend=User.objects.get(username='tester2'))
        Friend.objects.create(owner=User.objects.get(username='tester2'), friend=User.objects.get(username='tester3'), accepted=True)

    def test_user_can_view_a_friend_request_using_valid_id(self):
        response = self.client.get('/friends/1/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_cant_view_a_friend_request_using_invalid_id(self):
        response = self.client.get('/friends/456/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_can_accept_a_friend_request(self):
        self.client.login(username='tester2', password='test321')
        response = self.client.put('/friends/1/', {'accepted': True})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_cant_accept_a_friend_request_they_have_sent(self):
        self.client.login(username='tester', password='test123')
        response = self.client.put('/friends/1/', {'accepted': True})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_cant_accept_a_friend_request_twice(self):
        self.client.login(username='tester3', password='test456')
        response = self.client.put('/friends/2/', {'accepted': True})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_can_delete_a_friend_request_they_sent(self):
        self.client.login(username='tester', password='test123')
        response = self.client.delete('/friends/1/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_user_can_delete_a_friend_request_they_received(self):
        self.client.login(username='tester2', password='test321')
        response = self.client.delete('/friends/1/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_user_cant_delete_someone_elses_friend_request(self):
        self.client.login(username='tester', password='test123')
        response = self.client.delete('/friends/2/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_logged_out_user_cant_delete_friend_requests(self):
        response = self.client.delete('friends/1/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
