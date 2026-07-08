import React, { useState } from 'react';
import { useGetArticlesQuery, useDeleteArticleMutation, type Article, useGetAuthorsQuery } from '../../api/contentApi';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { ArticleForm } from './ArticleForm';

const ArticleListScreen: React.FC = () => {
  const { data: articles = [], isLoading } = useGetArticlesQuery();
  const { data: authors = [] } = useGetAuthorsQuery();
  const [deleteArticle] = useDeleteArticleMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const handleCreate = () => {
    setEditingArticle(null);
    setIsFormOpen(true);
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteArticle(id).unwrap();
      } catch (err) {
        console.error("Failed to delete article:", err);
        alert("Failed to delete article.");
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
      render: (article: Article) => <strong>{article.title}</strong>,
    },
    {
      key: 'author',
      header: 'Author',
      render: (article: Article) => <span>{getAuthorName(article.author)}</span>,
    },
    {
      key: 'language',
      header: 'Language',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (article: Article) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" size="sm" onClick={() => handleEdit(article)}>
            <Edit2 size={16} />
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(article.id)}>
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Articles</h1>
        <Button onClick={handleCreate}>
          <Plus size={18} /> Add Article
        </Button>
      </div>

      <Table 
        columns={columns} 
        data={articles} 
        isLoading={isLoading} 
        emptyMessage="No articles found. Create one to get started."
      />

      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        title={editingArticle ? "Edit Article" : "Create Article"}
      >
        <ArticleForm 
          article={editingArticle} 
          onSuccess={() => setIsFormOpen(false)} 
          authors={authors}
        />
      </Modal>
    </div>
  );
};

export default ArticleListScreen;
