from django.contrib import admin
from .models import Author, Book, BookNode, Article, ContentChunk

admin.site.register(Author)
admin.site.register(Book)
admin.site.register(BookNode)
admin.site.register(Article)
admin.site.register(ContentChunk)
