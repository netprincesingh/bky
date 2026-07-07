from django.contrib import admin
from .models import Author, Book, Chapter, Article, ContentChunk

admin.site.register(Author)
admin.site.register(Book)
admin.site.register(Chapter)
admin.site.register(Article)
admin.site.register(ContentChunk)
