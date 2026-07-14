import React, { useState, useRef, useEffect } from 'react';
import {
  useDeleteBookNodeMutation,
  type BookNode,
  useGetBooksQuery,
  contentApi,
} from '../../api/contentApi';
import { Modal } from '../../components/ui/Modal';
import {
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  ChevronDown,
  Layers,
  FlaskConical,
  Hash,
  Tag,
  User,
  ChevronRight,
} from 'lucide-react';
import { NodeForm } from './NodeForm';
import './NodeListScreen.css';

/* ─── Flatten tree ────────────────────────────────────────── */
const flattenNodes = (nodes: any[], depth = 0, parentIdx: number[] = []): any[] => {
  let flat: any[] = [];
  nodes.forEach((node: any, i: number) => {
    const idx = [...parentIdx, i + 1];
    flat.push({ ...node, depth, nodeIdx: idx });
    if (node.children?.length) {
      flat = flat.concat(flattenNodes(node.children, depth + 1, idx));
    }
  });
  return flat;
};

/* ─── Demo data for when backend is unavailable ─────────── */
const DEMO_NODES_TREE = [
  {
    id: 'node-mb-01',
    book: 'demo-1',
    parent: null,
    node_type: 'Parva',
    title: 'Adi Parva',
    order: 1,
    created_at: '2024-01-01T00:00:00Z',
    children: [
      {
        id: 'node-mb-01-001',
        book: 'demo-1',
        parent: 'node-mb-01',
        node_type: 'Chapter',
        title: 'The Grief of Arjuna',
        order: 1,
        created_at: '2024-01-01T00:00:00Z',
        children: [],
      },
      {
        id: 'node-mb-01-002',
        book: 'demo-1',
        parent: 'node-mb-01',
        node_type: 'Chapter',
        title: 'The Divine Song Begins',
        order: 2,
        created_at: '2024-01-02T00:00:00Z',
        children: [],
      },
    ],
  },
  {
    id: 'node-mb-02',
    book: 'demo-1',
    parent: null,
    node_type: 'Parva',
    title: 'Sabha Parva',
    order: 2,
    created_at: '2024-01-03T00:00:00Z',
    children: [
      {
        id: 'node-mb-02-001',
        book: 'demo-1',
        parent: 'node-mb-02',
        node_type: 'Chapter',
        title: 'The Game of Dice',
        order: 1,
        created_at: '2024-01-04T00:00:00Z',
        children: [],
      },
    ],
  },
];

/* ─── Seeded helpers for demo meta-data ──────────────────── */
const seededInt = (id: string, mod: number, offset = 0) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffffff;
  return (Math.abs(h) % mod) + offset;
};

const STATUS_MAP = [
  { label: 'Verified',  cls: 'verified' },
  { label: 'Draft',     cls: 'draft'    },
  { label: 'Review',    cls: 'review'   },
  { label: 'Archived',  cls: 'archived' },
] as const;

const THEME_TAGS = ['Dharma', 'Karma', 'Moksha', 'Artha', 'Kama', 'Ahimsa', 'Yoga', 'Bhakti'];
const SPEAKER_TAGS = ['Krishna', 'Arjuna', 'Vyasa', 'Bhishma', 'Yudhishthira', 'Drona', 'Karna', 'Sanjaya'];

const SAMPLE_ORIGINALS = [
  'धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः। मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय॥',
  'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्। स्वधर्मे निधनं श्रेयः परधर्मो भयावहः॥',
  'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदाऽऽत्मानं सृजाम्यहम्॥',
  'न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः। अजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे॥',
  'सुखदुःखे समे कृत्वा लाभालाभौ जयाजयौ। ततो युद्धाय युज्यस्व नैवं पापमवाप्स्यसि॥',
];

const SAMPLE_TRANSLATIONS = [
  'On the holy field of Kurukshetra, assembled together eager for battle, what did my sons and the sons of Pandu do, O Sanjaya?',
  'Better is one\'s own dharma, though imperfectly performed, than the dharma of another well performed. Better is death in one\'s own dharma; another\'s dharma is fraught with fear.',
  'Whenever dharma declines and the purpose of life is forgotten, I manifest myself on earth. I am born in every age to protect the good, to destroy evil, and to reestablish dharma.',
  'The soul is never born nor dies; it has not come into being, does not come into being, and will not come into being. It is unborn, eternal, ever-existing, and primeval.',
  'Do thou fight for the sake of fighting, without considering happiness or distress, loss or gain, victory or defeat — and by so doing you shall never incur sin.',
];

const getNodeBadge = (id: string, order: number, nodeIdx: number[]) => {
  const prefix = id.startsWith('node-mb') ? 'MB' : id.startsWith('node-rm') ? 'RM' : 'ND';
  return `#${prefix}-${nodeIdx.join('.').padStart(5, '0')}`;
};

/* ─── Book Selector Dropdown ─────────────────────────────── */
interface BookSelectorProps {
  books: { id: string; title: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const BookSelector: React.FC<BookSelectorProps> = ({ books, selectedId, onSelect }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = books.find(b => b.id === selectedId);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div className="nls-book-selector" ref={ref}>
      <button
        className={`nls-selector-btn${open ? ' open' : ''}`}
        onClick={() => setOpen(v => !v)}
      >
        <Layers size={14} />
        <span>{selected ? selected.title : 'Select a Book…'}</span>
        <ChevronDown size={13} className={`nls-chevron${open ? ' rotated' : ''}`} />
      </button>
      {open && (
        <div className="nls-selector-dropdown">
          {books.length === 0
            ? <div className="nls-selector-empty">No books available</div>
            : books.map(b => (
                <button
                  key={b.id}
                  className={`nls-selector-option${b.id === selectedId ? ' selected' : ''}`}
                  onClick={() => { onSelect(b.id); setOpen(false); }}
                >
                  <BookOpen size={12} />
                  <span>{b.title}</span>
                  {b.id === selectedId && <span className="nls-opt-check">✓</span>}
                </button>
              ))
          }
        </div>
      )}
    </div>
  );
};

/* ─── Node Card ──────────────────────────────────────────── */
interface NodeCardProps {
  node: any;
  onEdit: (node: BookNode) => void;
  onDelete: (id: string) => void;
}

const NodeCard: React.FC<NodeCardProps> = ({ node, onEdit, onDelete }) => {
  const statusIdx = seededInt(node.id, STATUS_MAP.length);
  const status = STATUS_MAP[statusIdx];
  const themeTag = THEME_TAGS[seededInt(node.id, THEME_TAGS.length)];
  const speakerTag = SPEAKER_TAGS[seededInt(node.id + 'spk', SPEAKER_TAGS.length)];
  const origIdx = seededInt(node.id + 'orig', SAMPLE_ORIGINALS.length);
  const original = SAMPLE_ORIGINALS[origIdx];
  const translation = SAMPLE_TRANSLATIONS[origIdx];
  const badge = getNodeBadge(node.id, node.order, node.nodeIdx || [node.order]);
  const typeLabel = node.node_type
    ? node.node_type.charAt(0).toUpperCase() + node.node_type.slice(1).toLowerCase()
    : 'Node';

  return (
    <div className={`nls-card status-${status.cls}`} style={{ '--depth': node.depth } as React.CSSProperties}>
      {/* Glow border overlay */}
      <div className="nls-card-glow" />

      {/* Card top row: Badge + Type label + Status pill */}
      <div className="nls-card-top">
        <div className="nls-card-top-left">
          <span className="nls-node-badge">
            <Hash size={11} />
            {badge.replace('#', '')}
          </span>
          <span className="nls-type-label">{typeLabel} {(node.nodeIdx || [node.order]).join('.')}</span>
        </div>
        <span className={`nls-status-pill status-${status.cls}`}>{status.label}</span>
      </div>

      {/* Node title */}
      <h3 className="nls-card-title">
        {node.depth > 0 && <ChevronRight size={14} className="nls-depth-arrow" />}
        {node.title || `(Untitled Node ${node.order})`}
      </h3>

      {/* Divider */}
      <div className="nls-card-divider" />

      {/* Original text (Sanskrit / ancient script) */}
      <blockquote className="nls-original-text">
        {original}
      </blockquote>

      {/* Translation */}
      <p className="nls-translation">{translation}</p>

      {/* Footer: meta tags + actions */}
      <div className="nls-card-footer">
        <div className="nls-meta-tags">
          <span className="nls-pill theme">
            <Tag size={10} />
            {themeTag}
          </span>
          <span className="nls-pill speaker">
            <User size={10} />
            {speakerTag}
          </span>
          {node.order && (
            <span className="nls-pill order">
              Order: {node.order}
            </span>
          )}
        </div>
        <div className="nls-card-actions">
          <button
            className="nls-action-btn edit"
            title="Edit node"
            onClick={() => onEdit(node as BookNode)}
          >
            <Edit2 size={14} />
          </button>
          <button
            className="nls-action-btn delete"
            title="Delete node"
            onClick={() => onDelete(node.id)}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Screen ────────────────────────────────────────── */
const NodeListScreen: React.FC = () => {
  const [selectedBookId, setSelectedBookId] = useState('');
  const { data: books = [] } = useGetBooksQuery();
  const { data: nodesTree = [], isLoading } = contentApi.endpoints.getBookIndex.useQuery(
    selectedBookId,
    { skip: !selectedBookId }
  );
  const [deleteNode] = useDeleteBookNodeMutation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<BookNode | null>(null);

  const handleCreate = () => {
    if (!selectedBookId) { alert('Please select a book first.'); return; }
    setEditingNode(null);
    setIsFormOpen(true);
  };

  const handleEdit = (node: BookNode) => {
    setEditingNode(node);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (id.startsWith('demo-')) { alert('Demo node cannot be deleted.'); return; }
    if (window.confirm('Delete this node and all its children?')) {
      try { await deleteNode(id).unwrap(); }
      catch (err) { console.error('Failed to delete node:', err); alert('Failed to delete node.'); }
    }
  };

  /* Use demo data if no real data returned */
  const rawTree = nodesTree.length > 0 ? nodesTree : (selectedBookId ? DEMO_NODES_TREE : []);
  const flatNodes = flattenNodes(rawTree);
  const selectedBook = books.find(b => b.id === selectedBookId);

  return (
    <div className="nls-page">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="nls-header">
        <div className="nls-header-left">
          {/* Breadcrumb */}
          <nav className="nls-breadcrumb">
            <span className="nls-bc root"><BookOpen size={12} />Books</span>
            <ChevronRight size={11} className="nls-bc-sep" />
            <span className="nls-bc book">{selectedBook?.title || 'Select a Book'}</span>
            <ChevronRight size={11} className="nls-bc-sep" />
            <span className="nls-bc current">Nodes</span>
          </nav>
          <h1 className="nls-title">
            <FlaskConical size={22} className="nls-title-icon" />
            Scholarly Node Editor
          </h1>
          <p className="nls-subtitle">Browse and manage structural nodes with original texts and translations.</p>
        </div>

        <div className="nls-header-right">
          <BookSelector
            books={books}
            selectedId={selectedBookId}
            onSelect={setSelectedBookId}
          />
          <button className="nls-add-btn" onClick={handleCreate}>
            <Plus size={16} />
            Add Node
          </button>
        </div>
      </div>

      {/* ── Divider ────────────────────────────────────────── */}
      <div className="nls-divider" />

      {/* ── Content ────────────────────────────────────────── */}
      {!selectedBookId ? (
        <div className="nls-empty-prompt">
          <div className="nls-empty-icon">
            <BookOpen size={48} />
          </div>
          <h2 className="nls-empty-heading">Open a Manuscript</h2>
          <p className="nls-empty-sub">Select a book from the dropdown above to begin viewing and editing its nodes.</p>
        </div>
      ) : isLoading ? (
        <div className="nls-loading">
          <div className="nls-spinner" />
          Loading manuscript nodes…
        </div>
      ) : flatNodes.length === 0 ? (
        <div className="nls-empty-prompt">
          <div className="nls-empty-icon"><Layers size={48} /></div>
          <h2 className="nls-empty-heading">No Nodes Found</h2>
          <p className="nls-empty-sub">This book has no structural nodes yet. Add one to begin.</p>
        </div>
      ) : (
        <>
          {/* Stats bar */}
          <div className="nls-stats-bar">
            <span className="nls-stat"><strong>{flatNodes.length}</strong> nodes total</span>
            <span className="nls-stat-sep">·</span>
            <span className="nls-stat"><strong>{flatNodes.filter(n => n.depth === 0).length}</strong> top-level</span>
            <span className="nls-stat-sep">·</span>
            <span className="nls-stat"><strong>{flatNodes.filter(n => n.depth > 0).length}</strong> nested</span>
          </div>

          {/* Node cards grid */}
          <div className="nls-cards-grid">
            {flatNodes.map(node => (
              <NodeCard
                key={node.id}
                node={node}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}

      {/* ── Modal ──────────────────────────────────────────── */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingNode ? 'Edit Node' : 'Create Node'}
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
