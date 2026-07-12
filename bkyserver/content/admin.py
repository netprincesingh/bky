from django.contrib import admin
from .models import Author, AuthorImage, Book, BookImage, BookNode, Article, ContentChunk, ContentChunkImage

admin.site.register(Author)
admin.site.register(AuthorImage)
admin.site.register(Book)
admin.site.register(BookImage)
admin.site.register(BookNode)
admin.site.register(Article)
admin.site.register(ContentChunk)
admin.site.register(ContentChunkImage)
