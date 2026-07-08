from django.contrib import admin
from .models import Author, Book, BookNode, Article, ContentChunk

class TopLevelNodeFilter(admin.SimpleListFilter):
    title = 'Top-Level Parent Node'
    parameter_name = 'parent_id'

    def lookups(self, request, model_admin):
        top_level_nodes = BookNode.objects.filter(parent__isnull=True)
        return [(node.id, str(node)) for node in top_level_nodes]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(parent_id=self.value())
        return queryset

class ChunkTopLevelNodeFilter(admin.SimpleListFilter):
    title = 'Top-Level Parent Node'
    parameter_name = 'node__parent_id'

    def lookups(self, request, model_admin):
        top_level_nodes = BookNode.objects.filter(parent__isnull=True)
        return [(node.id, str(node)) for node in top_level_nodes]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(node__parent_id=self.value())
        return queryset


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'language')
    list_filter = ('language', 'author')
    search_fields = ('title', 'author__name')

@admin.register(BookNode)
class BookNodeAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'book', 'parent', 'node_type', 'order')
    list_filter = ('book', TopLevelNodeFilter, 'node_type')
    search_fields = ('title', 'book__title', 'node_type')
    # Use autocomplete for parent to avoid huge dropdowns
    autocomplete_fields = ('book', 'parent')

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'language')
    list_filter = ('language', 'author')
    search_fields = ('title', 'author__name')

@admin.register(ContentChunk)
class ContentChunkAdmin(admin.ModelAdmin):
    # Display the book, node, and a snippet of the text
    list_display = ('id', 'get_book', 'node', 'chunk_order', 'short_text')
    
    # This allows you to filter chunks by Book and Parent Node on the right sidebar!
    list_filter = ('node__book', ChunkTopLevelNodeFilter, 'article')
    
    search_fields = ('chunk_text', 'node__title', 'node__book__title', 'article__title')
    
    # This turns the 'node' dropdown into a searchable text input, solving the "too much data" problem
    autocomplete_fields = ('node', 'article')

    def short_text(self, obj):
        return obj.chunk_text[:75] + '...' if obj.chunk_text else ''
    short_text.short_description = 'Text Snippet'
    
    def get_book(self, obj):
        return obj.node.book.title if obj.node and obj.node.book else 'N/A'
    get_book.short_description = 'Book'
    get_book.admin_order_field = 'node__book'
