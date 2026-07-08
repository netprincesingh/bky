import React, { useState } from 'react';
import { useGetAuthorsQuery, useDeleteAuthorMutation, type Author } from '../../api/contentApi';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { AuthorForm } from './AuthorForm';

const AuthorListScreen: React.FC = () => {
  const { data: authors = [], isLoading } = useGetAuthorsQuery();
  const [deleteAuthor] = useDeleteAuthorMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  const handleCreate = () => {
    setEditingAuthor(null);
    setIsFormOpen(true);
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this author?")) {
      try {
        await deleteAuthor(id).unwrap();
      } catch (err) {
        console.error("Failed to delete author:", err);
        alert("Failed to delete author.");
      }
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (author: Author) => <strong>{author.name}</strong>,
    },
    {
      key: 'bio',
      header: 'Bio',
      render: (author: Author) => (
        <span style={{ color: '#94a3b8' }}>
          {author.bio ? (author.bio.length > 50 ? author.bio.substring(0, 50) + '...' : author.bio) : 'No bio'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (author: Author) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" size="sm" onClick={() => handleEdit(author)}>
            <Edit2 size={16} />
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(author.id)}>
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Authors</h1>
        <Button onClick={handleCreate}>
          <Plus size={18} /> Add Author
        </Button>
      </div>

      <Table 
        columns={columns} 
        data={authors} 
        isLoading={isLoading} 
        emptyMessage="No authors found. Create one to get started."
      />

      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        title={editingAuthor ? "Edit Author" : "Create Author"}
      >
        <AuthorForm 
          author={editingAuthor} 
          onSuccess={() => setIsFormOpen(false)} 
        />
      </Modal>
    </div>
  );
};

export default AuthorListScreen;
