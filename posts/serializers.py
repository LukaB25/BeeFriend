from rest_framework import serializers
from .models import Post


class PostSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_image = serializers.ImageField(source='owner.profile.image.url')

    def validate_image(self, value):
        if value.size > 1024 *1024 *2:
            raise serializers.ValidationError(
                'Image size is too big, it must be less than 2MB'
            )
        if value.width > 1920:
            raise serializers.ValidationError(
                'Image width is too large, it must be less than 1920px'
            )
        if value.height > 1920:
            raise serializers.ValidationError(
                'Image height is too large, it must be less than 1920px'
            )

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner


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
            'created_at',
            'updated_at',
        ]