from django.contrib.auth.models import User
from .models import Profile
from rest_framework import status
from rest_framework.test import APITestCase


class ProfileListViewTests(APITestCase):
    """
    Tests for the ProfileList view.
    """
    def setUp(self):
        User.objects.create_user(username='tester', password='test123')
        User.objects.create_user(username='tester2', password='test321')

    def test_can_list_all_profiles(self):
        response = self.client.get('/profiles/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)




class ProfileDetailViewTests(APITestCase):
    """
    Tests for the ProfileDetail view.
    """
    def setUp(self):
        User.objects.create_user(username='tester', password='test123')
        User.objects.create_user(username='tester2', password='test321')

    def test_can_view_profile_using_valid_id(self):
        response = self.client.get('/profiles/1/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_cant_view_profile_using_invalid_id(self):
        response = self.client.get('/profiles/123/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_logged_in_user_can_update_their_own_profile(self):
        self.client.login(username='tester', password='test123')
        response = self.client.put('/profiles/1/', {'bio': 'Updated bio'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logged_in_user_cant_update_other_users_profile(self):
        self.client.login(username='tester', password='test123')
        response = self.client.put('/profiles/2/', {'bio': 'Updated bio 2'})
        self.assertEqual(response.status_code, status. HTTP_403_FORBIDDEN)

    def test_logged_out_user_cant_update_users_profile(self):
        response = self.client.put('/profiles/1/', {'bio': 'Updated bio'})
        self.assertEqual(response.status_code, status. HTTP_403_FORBIDDEN)