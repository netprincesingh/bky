import React, { useState } from 'react';
import { useGetBooksQuery, useDeleteBookMutation, type Book, useGetAuthorsQuery } from '../../api/contentApi';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { BookForm } from './BookForm';

const BookListScreen: React.FC = () => {
  const { data: books = [], isLoading } = useGetBooksQuery();
  const { data: authors = [] } = useGetAuthorsQuery();
  const [deleteBook] = useDeleteBookMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const handleCreate = () => {
    setEditingBook(null);
    setIsFormOpen(true);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteBook(id).unwrap();
      } catch (err) {
        console.error("Failed to delete book:", err);
        alert("Failed to delete book.");
      }
    }
  };

  const getAuthorName = (authorId: string | null) => {
    if (!authorId) return 'Unknown';
    const author = authors.find(a => a.id === authorId);
    return author ? author.name : 'Unknown';
  };

  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (book: Book) => <strong>{book.title}</strong>,
    },
    {
      key: 'author',
      header: 'Author',
      render: (book: Book) => <span>{getAuthorName(book.author)}</span>,
    },
    {
      key: 'language',
      header: 'Language',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (book: Book) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" size="sm" onClick={() => handleEdit(book)}>
            <Edit2 size={16} />
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(book.id)}>
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Books</h1>
        <Button onClick={handleCreate}>
          <Plus size={18} /> Add Book
        </Button>
      </div>

      <Table 
        columns={columns} 
        data={books} 
        isLoading={isLoading} 
        emptyMessage="No books found. Create one to get started."
      />

      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        title={editingBook ? "Edit Book" : "Create Book"}
      >
        <BookForm 
          book={editingBook} 
          onSuccess={() => setIsFormOpen(false)} 
          authors={authors}
        />
      </Modal>
    </div>
  );
};

export default BookListScreen;
