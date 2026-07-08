import React, { useState, useEffect } from 'react';
import { useCreateBookNodeMutation, useUpdateBookNodeMutation, type BookNode } from '../../api/contentApi';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface NodeFormProps {
  node: BookNode | null;
  selectedBookId: string;
  nodes: any[]; // Flat nodes for parent selection
  onSuccess: () => void;
}

export const NodeForm: React.FC<NodeFormProps> = ({ node, selectedBookId, nodes, onSuccess }) => {
  const [nodeType, setNodeType] = useState('');
  const [title, setTitle] = useState('');
  const [order, setOrder] = useState<number>(0);
  const [parentId, setParentId] = useState('');

  const [createNode, { isLoading: isCreating }] = useCreateBookNodeMutation();
  const [updateNode, { isLoading: isUpdating }] = useUpdateBookNodeMutation();

  useEffect(() => {
    if (node) {
      setNodeType(node.node_type || '');
      setTitle(node.title || '');
      setOrder(node.order || 0);
      setParentId(node.parent || '');
    } else {
      setNodeType('');
      setTitle('');
      setOrder(0);
      setParentId('');
    }
  }, [node]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      book: selectedBookId,
      node_type: nodeType,
      title: title || undefined,
      order: order,
      parent: parentId || null
    };

    try {
      if (node) {
        await updateNode({ id: node.id, body: payload }).unwrap();
      } else {
        await createNode(payload).unwrap();
      }
      onSuccess();
    } catch (err) {
      console.error("Failed to save node:", err);
      alert("Failed to save node.");
    }
  };

  const isLoading = isCreating || isUpdating;

  // Filter out the node itself and its descendants to prevent circular dependencies in parent selection
  const availableParents = nodes.filter(n => n.id !== node?.id);

  return (
    <form onSubmit={handleSubmit}>
      <Input 
        label="Node Type" 
        value={nodeType} 
        onChange={(e) => setNodeType(e.target.value)} 
        required 
        placeholder="E.g., Skandh, Kand, Chapter"
      />
      
      <Input 
        label="Title (Optional)" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="E.g., Bala Kanda"
      />

      <Input 
        label="Order" 
        type="number"
        value={order} 
        onChange={(e) => setOrder(parseInt(e.target.value))} 
        required 
      />

      <Input 
        label="Parent Node (Optional)" 
        value={parentId} 
        onChange={(e) => setParentId(e.target.value)}
        options={availableParents.map(n => ({ 
          label: `${'—'.repeat(n.depth)} ${n.node_type} ${n.order}: ${n.title || ''}`, 
          value: n.id 
        }))}
      />
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
        <Button type="submit" isLoading={isLoading}>
          {node ? "Update Node" : "Create Node"}
        </Button>
      </div>
    </form>
  );
};
