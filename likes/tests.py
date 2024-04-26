from django.contrib.auth.models import User
from .models import Like
from posts.models import Post
from rest_framework import status
from rest_framework.test import APITestCase


class LikeListViewTests(APITestCase):
    """
    Tests for the LikeList view.
    """
    def setUp(self):
        tester = User.objects.create_user(username='tester', password='test123')
        User.objects.create_user(username='tester2', password='test321')
        Post.objects.create(owner=tester, title='Test title')
        test_post = Post.objects.get(title='Test title')
        Like.objects.create(owner=tester, post=test_post)

    def test_user_can_view_all_likes(self):
        response = self.client.get('/likes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logged_in_user_can_like_a_post(self):
        self.client.login(username='tester2', password='test321')
        test_post = Post.objects.get(title='Test title')
        response = self.client.post('/likes/', {'post': test_post.id})
        count = Like.objects.count()
        self.assertEqual(count, 2)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_logged_in_user_cant_like_a_post_twice(self):
        self.client.login(username='tester', password='test123')
        test_post = Post.objects.get(title='Test title')
        response = self.client.post('/likes/', {'post': test_post.id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_logged_out_user_cant_like_a_post(self):
        test_post = Post.objects.get(title='Test title')
        response = self.client.post('/likes/', {'post': test_post.id})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class LikeDetailViewTests(APITestCase):
    """
    Tests for the LikeDetail view.
    """
    def setUp(self):
        tester = User.objects.create_user(username='tester', password='test123')
        tester2 = User.objects.create_user(username='tester2', password='test321')
        Post.objects.create(owner=tester, title='Test title')
        test_post = Post.objects.get(title='Test title')
        Like.objects.create(owner=tester, post=test_post)

    def test_user_can_view_a_like_using_valid_id(self):
        response = self.client.get('/likes/1/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_cant_view_a_like_using_invalid_id(self):
        response = self.client.get('/likes/321/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_logged_in_user_can_delete_their_own_like(self):
        self.client.login(username='tester', password='test123')
        response = self.client.delete('/likes/1/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_logged_in_user_cant_delete_other_users_like(self):
        self.client.login(username='tester2', password='test321')
        response = self.client.delete('/likes/1/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
