import React, { useState } from 'react';
import { useDeleteBookNodeMutation, type BookNode, useGetBooksQuery, contentApi } from '../../api/contentApi';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { NodeForm } from './NodeForm';

import { Input } from '../../components/ui/Input';

const NodeListScreen: React.FC = () => {
  const [selectedBookId, setSelectedBookId] = useState('');
  const { data: books = [] } = useGetBooksQuery();

  // We fetch the node tree for the selected book
  const { data: nodesTree = [], isLoading: isLoadingNodes } = contentApi.endpoints.getBookIndex.useQuery(
    selectedBookId,
    { skip: !selectedBookId }
  );

  const [deleteNode] = useDeleteBookNodeMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<BookNode | null>(null);

  const handleCreate = () => {
    if (!selectedBookId) {
      alert("Please select a book first to create nodes.");
      return;
    }
    setEditingNode(null);
    setIsFormOpen(true);
  };

  const handleEdit = (node: BookNode) => {
    setEditingNode(node);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this node? This will also delete its children.")) {
      try {
        await deleteNode(id).unwrap();
      } catch (err) {
        console.error("Failed to delete node:", err);
        alert("Failed to delete node.");
      }
    }
  };

  // Flatten the tree for simple tabular display
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

  const flatNodes = flattenNodes(nodesTree);

  const columns = [
    {
      key: 'title',
      header: 'Structure',
      render: (node: any) => (
        <div style={{ paddingLeft: `${node.depth * 1.5}rem`, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{node.node_type} {node.order}:</span>
          <strong>{node.title || '(Untitled)'}</strong>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (node: BookNode) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" size="sm" onClick={() => handleEdit(node)}>
            <Edit2 size={16} />
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(node.id)}>
            <Trash2 size={16} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Book Structure (Nodes)</h1>
        <Button onClick={handleCreate}>
          <Plus size={18} /> Add Node
        </Button>
      </div>

      <div style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>
        <Input 
          label="Select Book to view structure"
          value={selectedBookId}
          onChange={(e) => setSelectedBookId(e.target.value)}
          options={books.map(b => ({ label: b.title, value: b.id }))}
        />
      </div>

      {!selectedBookId ? (
        <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#1e293b', borderRadius: '0.75rem', color: '#94a3b8' }}>
          Please select a book above to view its structure.
        </div>
      ) : (
        <Table 
          columns={columns} 
          data={flatNodes} 
          isLoading={isLoadingNodes} 
          emptyMessage="No nodes found for this book."
        />
      )}

      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        title={editingNode ? "Edit Node" : "Create Node"}
      >
        <NodeForm 
          node={editingNode} 
          selectedBookId={selectedBookId}
          nodes={flatNodes}
          onSuccess={() => setIsFormOpen(false)} 
        />
      </Modal>
    </div>
  );
};

export default NodeListScreen;
