from django.contrib.humanize.templatetags.humanize import naturaltime
from rest_framework import serializers
from .models import Post
from comments.models import Comment
from likes.models import Like


class PostSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_image = serializers.ReadOnlyField(source='owner.profile.image.url')
    like_id = serializers.SerializerMethodField()
    comment_id = serializers.SerializerMethodField()
    like_count = serializers.ReadOnlyField()
    comment_count = serializers.ReadOnlyField()
    created_at = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()

    def validate_image(self, value):
        if value.size > 1024 * 1024 * 2:
            raise serializers.ValidationError(
                'Image size is too big, it must be less than 2MB'
            )
        if value.image.width > 1920:
            raise serializers.ValidationError(
                'Image width is too large, it must be less than 1920px'
            )
        if value.image.height > 1920:
            raise serializers.ValidationError(
                'Image height is too large, it must be less than 1920px'
            )
        return value

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner

    def get_like_id(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            like = Like.objects.filter(
                owner=user, post=obj
            ).first()
            if like:
                return like.id
            else:
                return None
        return None

    def get_comment_id(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            comment = Comment.objects.filter(
                owner=user, post=obj
            ).first()
            if comment:
                return comment.id
            else:
                return None
        return None

    def get_created_at(self, obj):
        return naturaltime(obj.created_at)

    def get_updated_at(self, obj):
        return naturaltime(obj.updated_at)

    class Meta:
        model = Post
        fields = [
            'id',
            'owner',
            'is_owner',
            'profile_id',
            'profile_image',
            'title',
            'content',
            'image',
            'like_count',
            'like_id',
            'comment_count',
            'comment_id',
            'created_at',
            'updated_at',
        ]
