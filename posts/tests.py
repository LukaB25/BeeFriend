from django.contrib.auth.models import User
from .models import Post
from rest_framework import status
from rest_framework.test import APITestCase


class PostListViewTests(APITestCase):
    """
    Tests for the PostList view.
    """
    def setUp(self):
        User.objects.create_user(username='tester', password='test123')

    def test_can_list_posts(self):
        tester = User.objects.get(username='tester')
        Post.objects.create(owner=tester, title='Test title')
        response = self.client.get('/posts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logged_in_user_can_create_post(self):
        self.client.login(username='tester', password='test123')
        response = self.client.post('/posts/', {'title': 'Test title'})
        count = Post.objects.count()
        self.assertEqual(count, 1)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_logged_out_user_cant_create_post(self):
        response = self.client.post('/posts/', {'title': 'Test title'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class PostDetailViewTests(APITestCase):
    """
    Tests for the PostDetail view.
    """
    def setUp(self):
        tester = User.objects.create_user(username='tester', password='test123')
        tester2 = User.objects.create_user(username='tester2', password='test321')
        Post.objects.create(
            owner=tester, title='Test title'
        )
        Post.objects.create(
            owner=tester2, title='Test title 2'
        )

    def test_can_view_a_post_using_valid_id(self):
        response = self.client.get('/posts/1/')
        self.assertEqual(response.data['title'], 'Test title')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_cant_view_a_post_using_invalid_id(self):
        response = self.client.get('/posts/123/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_logged_in_user_can_update_their_own_post(self):
        self.client.login(username='tester', password='test123')
        response = self.client.put('/posts/1/', {'title': 'Changed title'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logged_in_user_cant_update_other_users_post(self):
        self.client.login(username='tester', password='test123')
        response = self.client.put('/posts/2/', {'title': 'Changed title 2'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_logged_out_user_cant_update_other_users_post(self):
        response = self.client.put('/posts/2/', {'title': 'Updated title'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_logged_in_user_can_delete_their_own_post(self):
        self.client.login(username='tester', password='test123')
        response = self.client.delete('/posts/1/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_logged_in_user_cant_delete_other_users_post(self):
        self.client.login(username='tester', password='test123')
        response = self.client.delete('/posts/2/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)