import React, { useState, useEffect } from 'react';
import { useCreateArticleMutation, useUpdateArticleMutation, type Article, type Author } from '../../api/contentApi';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface ArticleFormProps {
  article: Article | null;
  authors: Author[];
  onSuccess: () => void;
}

export const ArticleForm: React.FC<ArticleFormProps> = ({ article, authors, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [language, setLanguage] = useState('HI');
  const [content, setContent] = useState('');
  const [coverImageKey, setCoverImageKey] = useState('');

  const [createArticle, { isLoading: isCreating }] = useCreateArticleMutation();
  const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation();

  useEffect(() => {
    if (article) {
      setTitle(article.title || '');
      setAuthor(article.author || '');
      setLanguage(article.language || 'HI');
      setContent(article.content || '');
      setCoverImageKey(article.cover_image_key || '');
    } else {
      setTitle('');
      setAuthor('');
      setLanguage('HI');
      setContent('');
      setCoverImageKey('');
    }
  }, [article]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      author: author || null,
      language,
      content,
      cover_image_key: coverImageKey || undefined
    };

    try {
      if (article) {
        await updateArticle({ id: article.id, body: payload }).unwrap();
      } else {
        await createArticle(payload).unwrap();
      }
      onSuccess();
    } catch (err) {
      console.error("Failed to save article:", err);
      alert("Failed to save article.");
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit}>
      <Input 
        label="Title" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        required 
        placeholder="Article title..."
      />
      
      <Input 
        label="Author" 
        value={author} 
        onChange={(e) => setAuthor(e.target.value)}
        options={authors.map(a => ({ label: a.name, value: a.id }))}
      />

      <Input 
        label="Language" 
        value={language} 
        onChange={(e) => setLanguage(e.target.value)}
        options={[
          { label: 'Hindi', value: 'HI' },
          { label: 'Sanskrit', value: 'SA' },
          { label: 'English', value: 'EN' },
          { label: 'Other', value: 'OT' }
        ]}
      />

      <Input 
        label="Content" 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
        multiline 
        required
        placeholder="Full article content..."
      />

      <Input 
        label="Cover Image Key (R2)" 
        value={coverImageKey} 
        onChange={(e) => setCoverImageKey(e.target.value)} 
        placeholder="E.g., articles/cover.png"
      />
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
        <Button type="submit" isLoading={isLoading}>
          {article ? "Update Article" : "Create Article"}
        </Button>
      </div>
    </form>
  );
};
