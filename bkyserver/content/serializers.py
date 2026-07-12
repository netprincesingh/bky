from rest_framework import serializers
from .models import (
    Author, AuthorImage, Book, BookImage, BookNode, 
    Article, ContentChunk, ContentChunkImage
)

class AuthorImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthorImage
        fields = '__all__'
        read_only_fields = ('author',) # author is set automatically

class AuthorSerializer(serializers.ModelSerializer):
    images = AuthorImageSerializer(many=True, required=False)

    class Meta:
        model = Author
        fields = '__all__'

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        author = Author.objects.create(**validated_data)
        for image_data in images_data:
            AuthorImage.objects.create(author=author, **image_data)
        return author

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if images_data is not None:
            instance.images.all().delete()
            for image_data in images_data:
                AuthorImage.objects.create(author=instance, **image_data)

        return instance

class BookImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookImage
        fields = '__all__'
        read_only_fields = ('book',)

class BookSerializer(serializers.ModelSerializer):
    images = BookImageSerializer(many=True, required=False)

    class Meta:
        model = Book
        fields = '__all__'

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        book = Book.objects.create(**validated_data)
        for image_data in images_data:
            BookImage.objects.create(book=book, **image_data)
        return book

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if images_data is not None:
            instance.images.all().delete()
            for image_data in images_data:
                BookImage.objects.create(book=instance, **image_data)

        return instance

class BookNodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookNode
        fields = '__all__'

class BookNodeTreeSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = BookNode
        fields = ['id', 'book', 'parent', 'node_type', 'title', 'order', 'created_at', 'children']

    def get_children(self, obj):
        children = obj.children.all()
        return BookNodeTreeSerializer(children, many=True).data

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'

class ContentChunkImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentChunkImage
        fields = '__all__'
        read_only_fields = ('chunk',)

class ContentChunkSerializer(serializers.ModelSerializer):
    images = ContentChunkImageSerializer(many=True, required=False)

    class Meta:
        model = ContentChunk
        fields = '__all__'

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        chunk = ContentChunk.objects.create(**validated_data)
        for image_data in images_data:
            ContentChunkImage.objects.create(chunk=chunk, **image_data)
        return chunk

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if images_data is not None:
            instance.images.all().delete()
            for image_data in images_data:
                ContentChunkImage.objects.create(chunk=instance, **image_data)

        return instance
