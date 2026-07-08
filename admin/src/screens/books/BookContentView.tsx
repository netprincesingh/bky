import React, { useState } from 'react';
import { useGetBooksQuery, useGetBookIndexQuery, useGetContentChunksQuery, type BookNodeTree, type ContentChunk } from '../../api/contentApi';
import { Input } from '../../components/ui/Input';
import { BookOpen, Layers, AlignLeft } from 'lucide-react';
import './BookContentView.css';

const flattenNodes = (nodes: BookNodeTree[], depth = 0): (BookNodeTree & { depth: number })[] => {
  let flat: (BookNodeTree & { depth: number })[] = [];
  for (const node of nodes) {
    flat.push({ ...node, depth });
    if (node.children && node.children.length > 0) {
      flat = flat.concat(flattenNodes(node.children as any, depth + 1));
    }
  }
  return flat;
};

const BookContentView: React.FC = () => {
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState('');

  const { data: books = [] } = useGetBooksQuery();
  const { data: nodesTree = [], isLoading: isLoadingNodes } = useGetBookIndexQuery(
    selectedBookId,
    { skip: !selectedBookId }
  );
  
  const { data: allChunks = [], isLoading: isLoadingChunks } = useGetContentChunksQuery();

  const flatNodes = flattenNodes(nodesTree);
  const nodeChunks = allChunks
    .filter(chunk => chunk.node === selectedNodeId)
    .sort((a, b) => (a.chunk_order || 0) - (b.chunk_order || 0));

  return (
    <div className="book-content-view">
      <header className="content-header">
        <h1 className="content-title">Book Chapter View</h1>
        <p className="content-subtitle">Select a book and browse its content by index.</p>
      </header>

      <div className="book-selector-container">
        <Input 
          label="Select Book" 
          value={selectedBookId}
          onChange={(e) => {
            setSelectedBookId(e.target.value);
            setSelectedNodeId('');
          }}
          options={books.map(b => ({ label: b.title, value: b.id }))}
        />
      </div>

      {selectedBookId && (
        <div className="book-content-layout">
          {/* Left Side: Index */}
          <div className="book-index-sidebar">
            <h3 className="sidebar-title"><Layers size={18} /> Book Index</h3>
            
            {isLoadingNodes ? (
              <div className="loading-state">Loading index...</div>
            ) : flatNodes.length === 0 ? (
              <div className="empty-state">No nodes found in this book.</div>
            ) : (
              <ul className="node-list">
                {flatNodes.map((node) => (
                  <li 
                    key={node.id} 
                    className={`node-item ${selectedNodeId === node.id ? 'active' : ''}`}
                    style={{ paddingLeft: `${node.depth * 1.5 + 1}rem` }}
                    onClick={() => setSelectedNodeId(node.id)}
                  >
                    <span className="node-type-badge">{node.node_type}</span>
                    <span className="node-title">{node.title || `Node ${node.order}`}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right Side: Chunks */}
          <div className="book-chunks-area">
            {selectedNodeId ? (
              <>
                <h3 className="area-title"><AlignLeft size={18} /> Content Chunks</h3>
                {isLoadingChunks ? (
                  <div className="loading-state">Loading chunks...</div>
                ) : nodeChunks.length === 0 ? (
                  <div className="empty-state">No chunks found for this node.</div>
                ) : (
                  <div className="chunks-list">
                    {nodeChunks.map(chunk => (
                      <div key={chunk.id} className="chunk-card">
                        <div className="chunk-header">
                          <span className="chunk-order">Order: {chunk.chunk_order}</span>
                        </div>
                        <div className="chunk-body">
                          {chunk.chunk_text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="empty-selection-state">
                <BookOpen size={48} className="empty-icon" />
                <p>Select a node from the index to view its chunks.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookContentView;
