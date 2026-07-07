from rest_framework import serializers
from .models import Author, Book, BookNode, Article, ContentChunk

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

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

class ContentChunkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentChunk
        fields = '__all__'
