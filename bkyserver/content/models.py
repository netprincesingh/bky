import uuid
from django.db import models




class LanguageChoices(models.TextChoices):
    HINDI = 'HI', 'Hindi'
    SANSKRIT = 'SA', 'Sanskrit'
    ENGLISH = 'EN', 'English'
    OTHER = 'OT', 'Other'



class Author(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    bio = models.TextField(blank=True, null=True)
    profile_picture_key = models.CharField(max_length=255, blank=True, null=True, help_text="R2 Object Key")

    def __str__(self):
        return self.name



class AuthorImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='images')
    image_key = models.CharField(max_length=255, help_text="R2 Object Key")
    caption = models.CharField(max_length=255, blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Image for {self.author.name}"



class Book(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    author = models.ForeignKey(Author, on_delete=models.SET_NULL, null=True, related_name='books')
    language = models.CharField(max_length=2, choices=LanguageChoices.choices, default=LanguageChoices.HINDI)
    description = models.TextField(blank=True, null=True)
    cover_image_key = models.CharField(max_length=255, blank=True, null=True, help_text="R2 Object Key")
    

    published_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title



class BookImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='images')
    image_key = models.CharField(max_length=255, help_text="R2 Object Key")
    caption = models.CharField(max_length=255, blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Image for {self.book.title}"



class BookNode(models.Model):
    """
    A dynamic, hierarchical structure to represent any index format.
    Allows structures like: Book -> Skandh -> Chapter, OR Book -> Kand -> Sarga.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='nodes')
    
    # A node can belong to another node (null parent = top-level node)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    
    # Identifies the level in the hierarchy (e.g., "Skandh", "Chapter", "Kand")
    node_type = models.CharField(max_length=50, help_text="e.g., 'Skandh', 'Chapter', 'Kand'") 
    
    title = models.CharField(max_length=255, blank=True, null=True)
    
    # Order relative to its siblings
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        if self.parent:
            return f"{self.parent} > {self.node_type} {self.order}: {self.title or ''}".strip(': ')
        return f"{self.book.title} - {self.node_type} {self.order}: {self.title or ''}".strip(': ')

    @property
    def is_leaf(self):
        """Returns True if this node has no children."""
        return not self.children.exists()



class Article(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    author = models.ForeignKey(Author, on_delete=models.SET_NULL, null=True, related_name='articles')
    language = models.CharField(max_length=2, choices=LanguageChoices.choices, default=LanguageChoices.HINDI)
    content = models.TextField()
    cover_image_key = models.CharField(max_length=255, blank=True, null=True, help_text="R2 Object Key")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class ChunkTypeChoices(models.TextChoices):
    VERSE = 'VERSE', 'Verse (Shloka/Mantra)'
    TRANSLATION = 'TRANS', 'Translation'
    EXPLANATION = 'EXPL', 'Explanation (Bhavarth/Commentary)'
    PARAGRAPH = 'PARA', 'Paragraph'
    FOOTNOTE = 'FOOT', 'Footnote'
    HEADING = 'HEAD', 'Heading'



class ContentChunk(models.Model):
    """
    Stores small chunks of text (from a Chapter or Article).
    This will later hold the VectorField for RAG.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    node = models.ForeignKey(BookNode, on_delete=models.CASCADE, null=True, blank=True, related_name='chunks', help_text="Deepest node this chunk belongs to")
    article = models.ForeignKey(Article, on_delete=models.CASCADE, null=True, blank=True, related_name='chunks')
    
    chunk_type = models.CharField(max_length=5, choices=ChunkTypeChoices.choices, default=ChunkTypeChoices.PARAGRAPH)
    language = models.CharField(max_length=2, choices=LanguageChoices.choices, blank=True, null=True)
    
    is_markdown_format = models.BooleanField(default=False)
    chunk_text = models.TextField()
    markdown_text = models.TextField(blank=True, null=True)
    chunk_order = models.PositiveIntegerField(default=0)
    
    # metadata can store block-level formatting and relationships. Example schemas:
    # - Alignment: {"align": "center" | "left" | "right" | "justify"}
    # - Spacing: {"margin_top": "20px", "margin_bottom": "30px"}
    # - Footnote Reference: {"is_footnote_ref": true, "footnote_marker": "*", "footnote_chunk_id": "uuid"}
    # - UI Styling: {"bg_color": "#f4f4f4", "text_color": "#d32f2f", "font_family": "SanskritFont"}
    # - Custom Indentation: {"indent_level": 1}
    metadata = models.JSONField(default=dict, blank=True, help_text="Store formatting like spacing, alignment, or footnote markers here.")
    

    # Placeholder for pgvector embedding:
    # from pgvector.django import VectorField
    # embedding = VectorField(dimensions=1536, blank=True, null=True) 

    class Meta:
        ordering = ['chunk_order']

    def __str__(self):
        if self.node:
            return f"Chunk {self.chunk_order} - {self.node.node_type} {self.node.order}"
        if self.article:
            return f"Chunk {self.chunk_order} - Article: {self.article.title}"
        return f"Chunk {self.chunk_order}"


class ContentChunkImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chunk = models.ForeignKey(ContentChunk, on_delete=models.CASCADE, related_name='images')
    image_key = models.CharField(max_length=255, help_text="R2 Object Key")
    caption = models.CharField(max_length=255, blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Image for Chunk {self.chunk.id}"
