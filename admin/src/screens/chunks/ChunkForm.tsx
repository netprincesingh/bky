import React, { useState, useEffect } from 'react';
import { useCreateContentChunkMutation, useUpdateContentChunkMutation, type ContentChunk, useGetArticlesQuery, useGetBooksQuery, useGetBookIndexQuery } from '../../api/contentApi';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface ChunkFormProps {
  chunk: ContentChunk | null;
  onSuccess: () => void;
}

// Helper to flatten node tree for dropdown
const flattenNodes = (nodes: any[], depth = 0): any[] => {
  let flat: any[] = [];
  for (const node of nodes) {
    flat.push({ ...node, depth });
    if (node.children && node.children.length > 0) {
      flat = flat.concat(flattenNodes(node.children, depth + 1));
    }
  }
  return flat;
};

export const ChunkForm: React.FC<ChunkFormProps> = ({ chunk, onSuccess }) => {
  const [chunkText, setChunkText] = useState('');
  const [chunkOrder, setChunkOrder] = useState<number>(0);
  const [articleId, setArticleId] = useState('');
  
  // Book and Node Selection
  const [selectedBookId, setSelectedBookId] = useState('');
  const [nodeId, setNodeId] = useState('');

  const { data: articles = [] } = useGetArticlesQuery();
  const { data: books = [] } = useGetBooksQuery();
  
  const { data: nodesTree = [], isLoading: isLoadingNodes } = useGetBookIndexQuery(
    selectedBookId,
    { skip: !selectedBookId }
  );

  const [createChunk, { isLoading: isCreating }] = useCreateContentChunkMutation();
  const [updateChunk, { isLoading: isUpdating }] = useUpdateContentChunkMutation();

  useEffect(() => {
    if (chunk) {
      setChunkText(chunk.chunk_text || '');
      setChunkOrder(chunk.chunk_order || 0);
      setArticleId(chunk.article || '');
      setNodeId(chunk.node || '');
      // Note: we can't easily reverse-lookup the bookId from just the nodeId without an endpoint, 
      // so selectedBookId will remain empty initially unless we had it.
    } else {
      setChunkText('');
      setChunkOrder(0);
      setArticleId('');
      setNodeId('');
      setSelectedBookId('');
    }
  }, [chunk]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      chunk_text: chunkText,
      chunk_order: chunkOrder,
      article: articleId || null,
      node: nodeId || null,
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

      <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#1e293b', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#e2e8f0' }}>Associate with Article</h4>
        <Input 
          label="Select Article" 
          value={articleId} 
          onChange={(e) => {
            setArticleId(e.target.value);
            if (e.target.value) setNodeId(''); // Clear node if article selected
          }}
          options={articles.map(a => ({ label: a.title, value: a.id }))}
        />
      </div>

      <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#1e293b', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#e2e8f0' }}>Associate with Book Node</h4>
        <Input 
          label="1. Select Book" 
          value={selectedBookId} 
          onChange={(e) => {
            setSelectedBookId(e.target.value);
            setNodeId(''); // Clear node when book changes
          }}
          options={books.map(b => ({ label: b.title, value: b.id }))}
        />
        
        {selectedBookId && (
          <Input 
            label={isLoadingNodes ? "Loading Nodes..." : "2. Select Node"} 
            value={nodeId} 
            onChange={(e) => {
              setNodeId(e.target.value);
              if (e.target.value) setArticleId(''); // Clear article if node selected
            }}
            options={flattenNodes(nodesTree).map(n => ({ 
              label: `${'—'.repeat(n.depth)} ${n.node_type} ${n.order}: ${n.title || ''}`, 
              value: n.id 
            }))}
          />
        )}
        {chunk?.node && !selectedBookId && !nodeId && (
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>
            Current Node ID: {chunk.node} (Select a book above to change)
          </div>
        )}
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
