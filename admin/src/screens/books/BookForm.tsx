import React, { useState, useEffect } from 'react';
import { useCreateBookMutation, useUpdateBookMutation, type Book, type Author } from '../../api/contentApi';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface BookFormProps {
  book: Book | null;
  authors: Author[];
  onSuccess: () => void;
}

export const BookForm: React.FC<BookFormProps> = ({ book, authors, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [language, setLanguage] = useState('HI');
  const [description, setDescription] = useState('');
  const [coverImageKey, setCoverImageKey] = useState('');

  const [createBook, { isLoading: isCreating }] = useCreateBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();

  useEffect(() => {
    if (book) {
      setTitle(book.title || '');
      setAuthor(book.author || '');
      setLanguage(book.language || 'HI');
      setDescription(book.description || '');
      setCoverImageKey(book.cover_image_key || '');
    } else {
      setTitle('');
      setAuthor('');
      setLanguage('HI');
      setDescription('');
      setCoverImageKey('');
    }
  }, [book]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      author: author || null,
      language,
      description,
      cover_image_key: coverImageKey || undefined
    };

    try {
      if (book) {
        await updateBook({ id: book.id, body: payload }).unwrap();
      } else {
        await createBook(payload).unwrap();
      }
      onSuccess();
    } catch (err) {
      console.error("Failed to save book:", err);
      alert("Failed to save book.");
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
        placeholder="E.g., Ramayana"
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
        label="Description" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        multiline 
        placeholder="Book description..."
      />

      <Input 
        label="Cover Image Key (R2)" 
        value={coverImageKey} 
        onChange={(e) => setCoverImageKey(e.target.value)} 
        placeholder="E.g., books/ramayana.png"
      />
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
        <Button type="submit" isLoading={isLoading}>
          {book ? "Update Book" : "Create Book"}
        </Button>
      </div>
    </form>
  );
};
