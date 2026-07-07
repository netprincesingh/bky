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



class Book(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    author = models.ForeignKey(Author, on_delete=models.SET_NULL, null=True, related_name='books')
    language = models.CharField(max_length=2, choices=LanguageChoices.choices, default=LanguageChoices.HINDI)
    description = models.TextField(blank=True, null=True)
    cover_image_key = models.CharField(max_length=255, blank=True, null=True, help_text="R2 Object Key")
    
    # Defines the structure/indexes this book uses. 
    # e.g., {"kand": "string", "doha_number": "number", "maas_parayan_day": "number"}
    metadata_schema = models.JSONField(default=dict, blank=True, help_text="Defines the required metadata structure for chunks in this book")
    
    published_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title



class Chapter(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='chapters')
    title = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.book.title} - {self.title}"



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



class ContentChunk(models.Model):
    """
    Stores small chunks of text (from a Chapter or Article).
    This will later hold the VectorField for RAG.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, null=True, blank=True, related_name='chunks')
    article = models.ForeignKey(Article, on_delete=models.CASCADE, null=True, blank=True, related_name='chunks')
    chunk_text = models.TextField()
    chunk_order = models.PositiveIntegerField(default=0)
    
    # Perfect for spiritual texts: Allows multiple simultaneous indexes
    # e.g., {"kand": "Bala", "sarga": 1, "maas_parayan_day": 5}
    metadata = models.JSONField(default=dict, blank=True)
    
    # Placeholder for pgvector embedding:
    # from pgvector.django import VectorField
    # embedding = VectorField(dimensions=1536, blank=True, null=True) 

    class Meta:
        ordering = ['chunk_order']

    def __str__(self):
        if self.chapter:
            return f"Chunk {self.chunk_order} - {self.chapter.title}"
        return f"Chunk {self.chunk_order} - Article: {self.article.title}"
