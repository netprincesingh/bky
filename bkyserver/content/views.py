from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from user.permissions import IsAdminProfile
from .models import Author, Book, BookNode, Article, ContentChunk
from .serializers import (
    AuthorSerializer, BookSerializer, BookNodeSerializer, BookNodeTreeSerializer,
    ArticleSerializer, ContentChunkSerializer
    )




class AuthorCreateView(APIView):
    permission_classes = [IsAdminProfile]
    
    def post(self, request):
        serializer = AuthorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AuthorListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        authors = Author.objects.all()
        serializer = AuthorSerializer(authors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AuthorUpdateView(APIView):
    permission_classes = [IsAdminProfile]
    
    def put(self, request, pk):
        author = get_object_or_404(Author, pk=pk)
        serializer = AuthorSerializer(author, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AuthorDeleteView(APIView):
    permission_classes = [IsAdminProfile]
    
    def delete(self, request, pk):
        author = get_object_or_404(Author, pk=pk)
        author.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class BookCreateView(APIView):
    permission_classes = [IsAdminProfile]
    
    def post(self, request):
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BookListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class BookUpdateView(APIView):
    permission_classes = [IsAdminProfile]
    
    def put(self, request, pk):
        book = get_object_or_404(Book, pk=pk)
        serializer = BookSerializer(book, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BookDeleteView(APIView):
    permission_classes = [IsAdminProfile]
    
    def delete(self, request, pk):
        book = get_object_or_404(Book, pk=pk)
        book.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class BookNodeCreateView(APIView):
    permission_classes = [IsAdminProfile]
    
    def post(self, request):
        serializer = BookNodeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BookNodeUpdateView(APIView):
    permission_classes = [IsAdminProfile]
    
    def put(self, request, pk):
        node = get_object_or_404(BookNode, pk=pk)
        serializer = BookNodeSerializer(node, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BookNodeDeleteView(APIView):
    permission_classes = [IsAdminProfile]
    
    def delete(self, request, pk):
        node = get_object_or_404(BookNode, pk=pk)
        node.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class BookIndexView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, book_uuid):
        # Fetch only the top-level nodes for the specific book
        root_nodes = BookNode.objects.filter(book_id=book_uuid, parent__isnull=True)
        serializer = BookNodeTreeSerializer(root_nodes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ArticleCreateView(APIView):
    permission_classes = [IsAdminProfile]
    
    def post(self, request):
        serializer = ArticleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ArticleListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        articles = Article.objects.all()
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ArticleUpdateView(APIView):
    permission_classes = [IsAdminProfile]
    
    def put(self, request, pk):
        article = get_object_or_404(Article, pk=pk)
        serializer = ArticleSerializer(article, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ArticleDeleteView(APIView):
    permission_classes = [IsAdminProfile]
    
    def delete(self, request, pk):
        article = get_object_or_404(Article, pk=pk)
        article.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ContentChunkCreateView(APIView):
    permission_classes = [IsAdminProfile]
    
    def post(self, request):
        serializer = ContentChunkSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ContentChunkListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        queryset = ContentChunk.objects.all()
        node_id = request.query_params.get('node_id')
        article_id = request.query_params.get('article_id')
        
        if node_id:
            queryset = queryset.filter(node_id=node_id)
        if article_id:
            queryset = queryset.filter(article_id=article_id)
            
        serializer = ContentChunkSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ContentChunkUpdateView(APIView):
    permission_classes = [IsAdminProfile]
    
    def put(self, request, pk):
        chunk = get_object_or_404(ContentChunk, pk=pk)
        serializer = ContentChunkSerializer(chunk, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ContentChunkDeleteView(APIView):
    permission_classes = [IsAdminProfile]
    
    def delete(self, request, pk):
        chunk = get_object_or_404(ContentChunk, pk=pk)
        chunk.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
