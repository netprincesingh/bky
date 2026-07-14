import React, { useState, useRef, useEffect } from 'react';
import {
  useGetBooksQuery,
  useGetBookIndexQuery,
  useDeleteBookNodeMutation,
  type BookNodeTree,
} from '../../api/contentApi';
import {
  ChevronRight,
  BookOpen,
  MoreVertical,
  Edit2,
  Trash2,
  ChevronDown,
  BookMarked,
  Layers,
} from 'lucide-react';
import './BookContentView.css';

/* ─── Flatten tree → flat list with depth ────────────────── */
const flattenNodes = (
  nodes: BookNodeTree[],
  depth = 0,
  parentChapterIdx: number[] = []
): (BookNodeTree & { depth: number; chapterIdx: number[] })[] => {
  let flat: (BookNodeTree & { depth: number; chapterIdx: number[] })[] = [];
  nodes.forEach((node, i) => {
    const idx = [...parentChapterIdx, i + 1];
    flat.push({ ...node, depth, chapterIdx: idx });
    if (node.children?.length) {
      flat = flat.concat(flattenNodes(node.children as any, depth + 1, idx));
    }
  });
  return flat;
};

/* ─── Simulated stats per node (demo) ───────────────────── */
const seededNodeCount = (id: string) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffffff;
  return Math.abs(h % 80) + 5;
};

const STATUS_OPTIONS = ['Published', 'Draft', 'Review'] as const;
type StatusOption = (typeof STATUS_OPTIONS)[number];

const seededStatus = (id: string): StatusOption => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 17 + id.charCodeAt(i)) & 0xffffffff;
  return STATUS_OPTIONS[Math.abs(h) % STATUS_OPTIONS.length];
};

/* ─── Three-dot kebab menu ───────────────────────────────── */
interface KebabMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

const KebabMenu: React.FC<KebabMenuProps> = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="bcv-kebab-wrap" ref={ref}>
      <button
        className={`bcv-kebab-btn${open ? ' active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        title="More actions"
        aria-label="More actions"
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div className="bcv-kebab-menu" role="menu">
          <button
            className="bcv-kebab-item edit"
            role="menuitem"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onEdit();
            }}
          >
            <Edit2 size={13} />
            Edit
          </button>
          <button
            className="bcv-kebab-item delete"
            role="menuitem"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onDelete();
            }}
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────── */
const BookContentView: React.FC = () => {
  const [selectedBookId, setSelectedBookId] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: books = [] } = useGetBooksQuery();
  const { data: nodesTree = [], isLoading: isLoadingNodes } = useGetBookIndexQuery(
    selectedBookId,
    { skip: !selectedBookId }
  );
  const [deleteBookNode] = useDeleteBookNodeMutation();

  const selectedBook = books.find((b) => b.id === selectedBookId);
  const flatNodes = flattenNodes(nodesTree);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleEdit = (nodeId: string) => {
    alert(`Edit node: ${nodeId}`);
  };

  const handleDelete = async (nodeId: string) => {
    if (nodeId.startsWith('demo-')) {
      alert('Demo node cannot be deleted.');
      return;
    }
    if (window.confirm('Delete this chapter node?')) {
      try {
        await deleteBookNode(nodeId).unwrap();
      } catch (err) {
        console.error('Failed to delete node:', err);
        alert('Failed to delete.');
      }
    }
  };

  /* Build chapter label from node */
  const buildLabel = (
    node: BookNodeTree & { depth: number; chapterIdx: number[] }
  ) => {
    const typeLabel = node.node_type
      ? node.node_type.charAt(0).toUpperCase() + node.node_type.slice(1).toLowerCase()
      : 'Chapter';
    const numLabel = node.chapterIdx.join('.');
    const title = node.title || `Node ${node.order}`;
    return { typeLabel, numLabel, title };
  };

  return (
    <div className="bcv-page">
      {/* ── Top Header ─────────────────────────────────────── */}
      <div className="bcv-header">
        <div className="bcv-header-left">
          {/* Breadcrumb navigation */}
          <nav className="bcv-breadcrumb" aria-label="breadcrumb">
            <span className="bcv-bc-item root">
              <BookOpen size={12} />
              Books
            </span>
            <ChevronRight size={11} className="bcv-bc-sep" />
            <span className="bcv-bc-item book">
              {selectedBook ? selectedBook.title : 'Select a Book'}
            </span>
            <ChevronRight size={11} className="bcv-bc-sep" />
            <span className="bcv-bc-item current">Chapters</span>
          </nav>

          {/* Page title */}
          <h1 className="bcv-title">
            <BookMarked size={22} className="bcv-title-icon" />
            Book Chapter View
          </h1>
        </div>

        {/* ── Book dropdown selector ── */}
        <div className="bcv-book-selector" ref={dropdownRef}>
          <button
            className={`bcv-selector-btn${dropdownOpen ? ' open' : ''}`}
            onClick={() => setDropdownOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
          >
            <Layers size={14} className="bcv-selector-icon" />
            <span className="bcv-selector-label">
              {selectedBook ? selectedBook.title : 'Switch Book…'}
            </span>
            <ChevronDown
              size={13}
              className={`bcv-selector-chevron${dropdownOpen ? ' rotated' : ''}`}
            />
          </button>

          {dropdownOpen && (
            <div className="bcv-selector-dropdown" role="listbox">
              {books.length === 0 ? (
                <div className="bcv-selector-empty">No books available</div>
              ) : (
                books.map((book) => (
                  <button
                    key={book.id}
                    className={`bcv-selector-option${
                      book.id === selectedBookId ? ' selected' : ''
                    }`}
                    role="option"
                    aria-selected={book.id === selectedBookId}
                    onClick={() => {
                      setSelectedBookId(book.id);
                      setDropdownOpen(false);
                    }}
                  >
                    <BookOpen size={12} />
                    <span>{book.title}</span>
                    {book.id === selectedBookId && (
                      <span className="bcv-option-check">✓</span>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Divider ────────────────────────────────────────── */}
      <div className="bcv-header-divider" />

      {/* ── Content area ───────────────────────────────────── */}
      {!selectedBookId ? (
        <div className="bcv-empty-prompt">
          <div className="bcv-empty-icon-wrap">
            <BookOpen size={52} />
          </div>
          <h2 className="bcv-empty-heading">Select a Book to Begin</h2>
          <p className="bcv-empty-sub">
            Use the dropdown above to choose a book and browse its chapter structure.
          </p>
        </div>
      ) : isLoadingNodes ? (
        <div className="bcv-loading">
          <div className="bcv-loading-spinner" />
          Loading chapters…
        </div>
      ) : flatNodes.length === 0 ? (
        <div className="bcv-empty-prompt">
          <div className="bcv-empty-icon-wrap">
            <Layers size={52} />
          </div>
          <h2 className="bcv-empty-heading">No Chapters Found</h2>
          <p className="bcv-empty-sub">
            This book doesn't have any chapter nodes yet.
          </p>
        </div>
      ) : (
        <div className="bcv-chapter-list">
          {/* Column header bar */}
          <div className="bcv-list-header">
            <span className="bcv-lh-chapter">Chapter</span>
            <span className="bcv-lh-stats">Stats</span>
            <span className="bcv-lh-actions">Actions</span>
          </div>

          {/* Chapter rows */}
          {flatNodes.map((node) => {
            const { typeLabel, numLabel, title } = buildLabel(node);
            const nodeCount = seededNodeCount(node.id);
            const status = seededStatus(node.id);

            return (
              <div
                key={node.id}
                className={`bcv-chapter-row depth-${Math.min(node.depth, 3)}`}
                style={{ '--row-depth': node.depth } as React.CSSProperties}
              >
                {/* Left indent + connector line */}
                <div
                  className="bcv-row-indent"
                  style={{ width: node.depth > 0 ? `${node.depth * 22}px` : '0' }}
                >
                  {node.depth > 0 && <span className="bcv-row-connector" />}
                </div>

                {/* Chapter identity */}
                <div className="bcv-chapter-identity">
                  <strong className="bcv-chapter-num">
                    {typeLabel} {numLabel}
                  </strong>
                  <span className="bcv-chapter-colon">:</span>
                  <span className="bcv-chapter-title">{title}</span>
                </div>

                {/* Spacer */}
                <span className="bcv-row-spacer" />

                {/* Utility stats */}
                <div className="bcv-chapter-stats">
                  <span className="bcv-stat-pill nodes">
                    Nodes: {nodeCount}
                  </span>
                  <span className={`bcv-stat-pill status-${status.toLowerCase()}`}>
                    {status}
                  </span>
                </div>

                {/* Three-dot action menu */}
                <KebabMenu
                  onEdit={() => handleEdit(node.id)}
                  onDelete={() => handleDelete(node.id)}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookContentView;
