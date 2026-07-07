from django.urls import path
from .views import (
    AuthorCreateView, AuthorListView, AuthorUpdateView, AuthorDeleteView,
    BookCreateView, BookListView, BookUpdateView, BookDeleteView,
    BookNodeCreateView, BookNodeUpdateView, BookNodeDeleteView, BookIndexView,
    ArticleCreateView, ArticleListView, ArticleUpdateView, ArticleDeleteView,
    ContentChunkCreateView, ContentChunkListView, ContentChunkUpdateView, ContentChunkDeleteView
    )

urlpatterns = [
    path('author/create/', AuthorCreateView.as_view(), name='author-create'),
    path('author/list/', AuthorListView.as_view(), name='author-list'),
    path('author/update/<uuid:pk>/', AuthorUpdateView.as_view(), name='author-update'),
    path('author/delete/<uuid:pk>/', AuthorDeleteView.as_view(), name='author-delete'),

    path('book/create/', BookCreateView.as_view(), name='book-create'),
    path('book/list/', BookListView.as_view(), name='book-list'),
    path('book/update/<uuid:pk>/', BookUpdateView.as_view(), name='book-update'),
    path('book/delete/<uuid:pk>/', BookDeleteView.as_view(), name='book-delete'),

    path('node/create/', BookNodeCreateView.as_view(), name='node-create'),
    path('node/update/<uuid:pk>/', BookNodeUpdateView.as_view(), name='node-update'),
    path('node/delete/<uuid:pk>/', BookNodeDeleteView.as_view(), name='node-delete'),
    path('book/<uuid:book_uuid>/index/', BookIndexView.as_view(), name='book-index'),

    path('article/create/', ArticleCreateView.as_view(), name='article-create'),
    path('article/list/', ArticleListView.as_view(), name='article-list'),
    path('article/update/<uuid:pk>/', ArticleUpdateView.as_view(), name='article-update'),
    path('article/delete/<uuid:pk>/', ArticleDeleteView.as_view(), name='article-delete'),

    path('chunk/create/', ContentChunkCreateView.as_view(), name='chunk-create'),
    path('chunk/list/', ContentChunkListView.as_view(), name='chunk-list'),
    path('chunk/update/<uuid:pk>/', ContentChunkUpdateView.as_view(), name='chunk-update'),
    path('chunk/delete/<uuid:pk>/', ContentChunkDeleteView.as_view(), name='chunk-delete'),
]