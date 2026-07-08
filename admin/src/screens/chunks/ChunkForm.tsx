import React, { useState, useEffect } from 'react';
import { useCreateContentChunkMutation, useUpdateContentChunkMutation, type ContentChunk, useGetArticlesQuery } from '../../api/contentApi';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface ChunkFormProps {
  chunk: ContentChunk | null;
  onSuccess: () => void;
}

export const ChunkForm: React.FC<ChunkFormProps> = ({ chunk, onSuccess }) => {
  const [chunkText, setChunkText] = useState('');
  const [chunkOrder, setChunkOrder] = useState<number>(0);
  const [articleId, setArticleId] = useState('');
  // For simplicity we just link to article or leave node blank for now, a full node selector requires a tree view
  
  const { data: articles = [] } = useGetArticlesQuery();

  const [createChunk, { isLoading: isCreating }] = useCreateContentChunkMutation();
  const [updateChunk, { isLoading: isUpdating }] = useUpdateContentChunkMutation();

  useEffect(() => {
    if (chunk) {
      setChunkText(chunk.chunk_text || '');
      setChunkOrder(chunk.chunk_order || 0);
      setArticleId(chunk.article || '');
    } else {
      setChunkText('');
      setChunkOrder(0);
      setArticleId('');
    }
  }, [chunk]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      chunk_text: chunkText,
      chunk_order: chunkOrder,
      article: articleId || null,
      node: chunk?.node || null, // Preserve node if it exists
    };

    try {
      if (chunk) {
        await updateChunk({ id: chunk.id, body: payload }).unwrap();
      } else {
        await createChunk(payload).unwrap();
      }
      onSuccess();
    } catch (err) {
      console.error("Failed to save chunk:", err);
      alert("Failed to save chunk.");
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit}>
      <Input 
        label="Chunk Order" 
        type="number"
        value={chunkOrder} 
        onChange={(e) => setChunkOrder(parseInt(e.target.value))} 
        required 
      />

      <Input 
        label="Associated Article" 
        value={articleId} 
        onChange={(e) => setArticleId(e.target.value)}
        options={articles.map(a => ({ label: a.title, value: a.id }))}
      />
      <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem', marginTop: '-0.5rem' }}>
        Linking to Book Nodes is managed through the Node interface.
      </div>

      <Input 
        label="Chunk Text Content" 
        value={chunkText} 
        onChange={(e) => setChunkText(e.target.value)} 
        multiline 
        required
        placeholder="Content block..."
      />
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
        <Button type="submit" isLoading={isLoading}>
          {chunk ? "Update Chunk" : "Create Chunk"}
        </Button>
      </div>
    </form>
  );
};
