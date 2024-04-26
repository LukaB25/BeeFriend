from django.contrib.auth.models import User
from .models import Comment
from posts.models import Post
from rest_framework import status
from rest_framework.test import APITestCase


class CommentListViewTests(APITestCase):
    """
    Tests for the CommentList view.
    """
    def setUp(self):
        User.objects.create_user(username='tester', password='test123')
        User.objects.create_user(username='tester2', password='test321')

    def test_can_view_all_comments(self):
        tester = User.objects.get(username='tester')
        Post.objects.create(owner=tester, title='Test title')
        test_post = Post.objects.get(title='Test title')
        Comment.objects.create(owner=tester, post=test_post, body='Test body')
        response = self.client.get('/comments/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logged_in_user_can_create_comment(self):
        self.client.login(username='tester2', password='test321')
        tester = User.objects.get(username='tester')
        Post.objects.create(owner=tester, title='Test title')
        test_post = Post.objects.get(title='Test title')
        response = self.client.post('/comments/', {'post': test_post.id, 'body': 'Test comment'})
        count = Comment.objects.count()
        self.assertEqual(count, 1)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_logged_out_user_cant_create_comment(self):
        tester = User.objects.get(username='tester')
        Post.objects.create(owner=tester, title='Test title')
        test_post = Post.objects.get(title='Test title')
        response = self.client.post('/comments/', {'post': test_post.id, 'body': 'Test comment'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class CommentDetailViewTests(APITestCase):
    """
    Tests for the CommentDetail view.
    """
    def setUp(self):
        tester = User.objects.create_user(username='tester', password='test123')
        User.objects.create_user(username='tester2', password='test321')
        Post.objects.create(owner=tester, title='Test title')
        test_post = Post.objects.get(title='Test title')
        Comment.objects.create(owner=tester, post=test_post, body='Test comment')
    
    def test_can_view_a_comment_using_valid_id(self):
        response = self.client.get('/comments/1/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_cant_view_a_comment_using_valid_id(self):
        response = self.client.get('/comments/321/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_logged_in_user_can_update_their_own_comment(self):
        self.client.login(username='tester', password='test123')
        response = self.client.put('/comments/1/', {'body': 'Updated test comment'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logged_in_user_cant_update_other_users_comment(self):
        self.client.login(username='tester2', password='test321')
        response = self.client.put('/comments/1/',
                                   {'body': 'Changing someones test comment'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_logged_out_user_cant_update_comment(self):
        response = self.client.put('/comments/1/',
                                   {'body': 'Changing someones test comment'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_logged_in_user_can_delete_their_own_comment(self):
        self.client.login(username='tester', password='test123')
        response = self.client.delete('/comments/1/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_logged_in_user_cant_delete_other_users_comment(self):
        self.client.login(username='tester2', password='test321')
        response = self.client.delete('/comments/1/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)