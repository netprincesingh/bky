import React, { useState } from 'react';
import { useGetContentChunksQuery, useDeleteContentChunkMutation, type ContentChunk } from '../../api/contentApi';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { ChunkForm } from './ChunkForm';

const ChunkListScreen: React.FC = () => {
  const { data: chunks = [], isLoading } = useGetContentChunksQuery();
  const [deleteChunk] = useDeleteContentChunkMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingChunk, setEditingChunk] = useState<ContentChunk | null>(null);

  const handleCreate = () => {
    setEditingChunk(null);
    setIsFormOpen(true);
  };

  const handleEdit = (chunk: ContentChunk) => {
    setEditingChunk(chunk);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this chunk?")) {
      try {
        await deleteChunk(id).unwrap();
      } catch (err) {
        console.error("Failed to delete chunk:", err);
        alert("Failed to delete chunk.");
      }
    }
  };

  const columns = [
    {
      key: 'chunk_order',
      header: 'Order',
      render: (chunk: ContentChunk) => <strong>{chunk.chunk_order}</strong>,
    },
    {
      key: 'chunk_text',
      header: 'Text Content',
      render: (chunk: ContentChunk) => (
        <span style={{ color: '#94a3b8' }}>
          {chunk.chunk_text.length > 80 ? chunk.chunk_text.substring(0, 80) + '...' : chunk.chunk_text}
        </span>
      ),
    },
    {
      key: 'association',
      header: 'Associated With',
      render: (chunk: ContentChunk) => (
        <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', background: '#334155', borderRadius: '4px' }}>
          {chunk.node ? 'Book Node' : chunk.article ? 'Article' : 'None'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (chunk: ContentChunk) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" size="sm" onClick={() => handleEdit(chunk)}>
            <Edit2 size={16} />
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(chunk.id)}>
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Content Chunks</h1>
        <Button onClick={handleCreate}>
          <Plus size={18} /> Add Chunk
        </Button>
      </div>

      <Table 
        columns={columns} 
        data={chunks} 
        isLoading={isLoading} 
        emptyMessage="No chunks found. Create one to get started."
      />

      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        title={editingChunk ? "Edit Chunk" : "Create Chunk"}
      >
        <ChunkForm 
          chunk={editingChunk} 
          onSuccess={() => setIsFormOpen(false)} 
        />
      </Modal>
    </div>
  );
};

export default ChunkListScreen;
