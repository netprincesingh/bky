import React, { useState, useCallback } from 'react';
import {
  useGetContentChunksQuery,
  useDeleteContentChunkMutation,
  type ContentChunk,
} from '../../api/contentApi';
import { Modal } from '../../components/ui/Modal';
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  LayoutGrid,
  BookOpen,
  FileText,
  Unlink,
} from 'lucide-react';
import { ChunkForm } from './ChunkForm';
import './ChunkListScreen.css';

/* ─── Demo chunks for when backend is empty ──────────────── */
const DEMO_CHUNKS: ContentChunk[] = [
  { id: 'ck-001', node: 'node-mb-01-001', article: null, chunk_text: 'dharmaṃ kṣetra dharmaṃ, tato yuddha yuddhasya — On the holy field of Kurukshetra, the sons of Pandu and Dhritarashtra gathered, eager for battle.', chunk_order: 1 },
  { id: 'ck-002', node: 'node-mb-01-001', article: null, chunk_text: 'The ancient verse speaks of duty beyond the mortal frame — to act without attachment to the fruit of action is the highest yoga.', chunk_order: 2 },
  { id: 'ck-003', node: null, article: 'art-001', chunk_text: 'Pranayama, the extension of prana, regulates the breath and with it, the fluctuations of the mind. Nadi shodhana clears 72,000 channels.', chunk_order: 1 },
  { id: 'ck-004', node: 'node-mb-01-002', article: null, chunk_text: 'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात् — Better is one\'s own dharma, though imperfect, than the dharma of another perfectly performed.', chunk_order: 3 },
  { id: 'ck-005', node: null, article: 'art-002', chunk_text: 'The Himalayan sunrise pierces through the mist, gilding the stone temples. The valley below remains silent, as if holding its breath before prayer.', chunk_order: 1 },
  { id: 'ck-006', node: 'node-mb-02-001', article: null, chunk_text: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत — Whenever there is a decline of dharma and rise of adharma, I manifest Myself on earth, O Arjuna.', chunk_order: 1 },
  { id: 'ck-007', node: null, article: null, chunk_text: 'Ahimsa is not merely the absence of violence. It is the active presence of love — a force more potent than all the weapons of the world combined.', chunk_order: 4 },
  { id: 'ck-008', node: 'node-mb-01-001', article: null, chunk_text: 'The Bhagavad Gita contains 700 verses across 18 chapters, forming the philosophical heart of the Mahabharata. Its discourse takes place on the Kurukshetra battlefield.', chunk_order: 5 },
  { id: 'ck-009', node: null, article: 'art-003', chunk_text: 'Vata governs movement — in the body and in thought. When Vata is aggravated, the mind scatters like autumn leaves. Grounding foods and warm oils restore its balance.', chunk_order: 2 },
  { id: 'ck-010', node: 'node-mb-02-001', article: null, chunk_text: 'न जायते म्रियते वा कदाचिन् — The soul is never born, nor does it ever die. It is not slain when the body is slain.', chunk_order: 2 },
  { id: 'ck-011', node: null, article: 'art-001', chunk_text: 'Kapalbhati, or skull-shining breath, generates internal heat, detoxifies the respiratory system, and awakens the dormant fire of the solar plexus.', chunk_order: 3 },
  { id: 'ck-012', node: 'node-mb-01-002', article: null, chunk_text: 'The Adi Parva, the first of eighteen books in the Mahabharata, narrates the lineage of the Kuru dynasty from its mythological origins to the Pandava princes.', chunk_order: 1 },
];

/* ─── Seeded short code generator ───────────────────────── */
const buildSlug = (chunk: ContentChunk): string => {
  const prefix = chunk.node
    ? 'node_chunk'
    : chunk.article
    ? 'article_chunk'
    : 'chunk';
  const order = String(chunk.chunk_order).padStart(2, '0');
  // Take first word of text as a hint
  const firstWord = chunk.chunk_text
    .replace(/[^a-zA-Z\s]/g, '')
    .trim()
    .split(/\s+/)[0]
    ?.toLowerCase()
    .slice(0, 8) || 'raw';
  return `${prefix}_${firstWord}_${order}`;
};

/* ─── Association badge ──────────────────────────────────── */
const AssocBadge: React.FC<{ chunk: ContentChunk }> = ({ chunk }) => {
  if (chunk.node) return (
    <span className="cks-assoc-badge node">
      <BookOpen size={9} />
      Node
    </span>
  );
  if (chunk.article) return (
    <span className="cks-assoc-badge article">
      <FileText size={9} />
      Article
    </span>
  );
  return (
    <span className="cks-assoc-badge none">
      <Unlink size={9} />
      Standalone
    </span>
  );
};

/* ─── Copy-to-clipboard button ───────────────────────────── */
const CopyBtn: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* fallback: silent */
    }
  }, [text]);

  return (
    <button
      className={`cks-copy-btn${copied ? ' copied' : ''}`}
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy text'}
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
};

/* ─── Chunk Card ─────────────────────────────────────────── */
interface ChunkCardProps {
  chunk: ContentChunk;
  onEdit: (c: ContentChunk) => void;
  onDelete: (id: string) => void;
}

const ChunkCard: React.FC<ChunkCardProps> = ({ chunk, onEdit, onDelete }) => {
  const slug     = buildSlug(chunk);
  const charLen  = chunk.chunk_text.length;
  /* Soft cap shown in counter — use 280 as a reference max */
  const charMax  = 280;
  const pct      = Math.min(charLen / charMax, 1);
  const isOver   = charLen > charMax;

  return (
    <div className="cks-card">

      {/* ── Top bar: slug + copy + order ─────────────────── */}
      <div className="cks-card-top">
        <div className="cks-card-top-left">
          <span className="cks-slug" title={slug}>
            <span className="cks-slug-tick">`</span>
            {slug}
            <span className="cks-slug-tick">`</span>
          </span>
          <AssocBadge chunk={chunk} />
        </div>
        <div className="cks-card-top-right">
          <span className="cks-order-badge">#{chunk.chunk_order}</span>
          <CopyBtn text={chunk.chunk_text} />
        </div>
      </div>

      {/* ── Recessed text box ────────────────────────────── */}
      <div className="cks-text-box">
        <p className="cks-text-content">{chunk.chunk_text}</p>
      </div>

      {/* ── Footer: char counter + actions ───────────────── */}
      <div className="cks-card-footer">
        <div className="cks-char-wrap">
          {/* Mini progress bar */}
          <div className="cks-char-bar-track">
            <div
              className={`cks-char-bar-fill${isOver ? ' over' : ''}`}
              style={{ width: `${pct * 100}%` }}
            />
          </div>
          <span className={`cks-char-count${isOver ? ' over' : ''}`}>
            {charLen} / {charMax} chars
          </span>
        </div>

        <div className="cks-card-actions">
          <button
            className="cks-action-btn edit"
            title="Edit chunk"
            onClick={() => onEdit(chunk)}
            aria-label="Edit chunk"
          >
            <Edit2 size={12} />
          </button>
          <button
            className="cks-action-btn delete"
            title="Delete chunk"
            onClick={() => onDelete(chunk.id)}
            aria-label="Delete chunk"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Screen ────────────────────────────────────────── */
const ChunkListScreen: React.FC = () => {
  const { data: fetchedChunks = [], isLoading } = useGetContentChunksQuery();
  const [deleteChunk] = useDeleteContentChunkMutation();

  const [isFormOpen, setIsFormOpen]       = useState(false);
  const [editingChunk, setEditingChunk]   = useState<ContentChunk | null>(null);

  const handleCreate = () => { setEditingChunk(null); setIsFormOpen(true); };
  const handleEdit   = (c: ContentChunk) => { setEditingChunk(c); setIsFormOpen(true); };

  const handleDelete = async (id: string) => {
    if (id.startsWith('ck-')) { alert('Demo chunk cannot be deleted.'); return; }
    if (window.confirm('Are you sure you want to delete this chunk?')) {
      try { await deleteChunk(id).unwrap(); }
      catch (err) { console.error('Failed to delete chunk:', err); alert('Failed to delete chunk.'); }
    }
  };

  const chunks: ContentChunk[] = isLoading
    ? []
    : fetchedChunks.length > 0 ? fetchedChunks : DEMO_CHUNKS;

  const nodeChunks       = chunks.filter(c => c.node);
  const articleChunks    = chunks.filter(c => c.article && !c.node);
  const standaloneChunks = chunks.filter(c => !c.node && !c.article);

  return (
    <div className="cks-page">

      {/* ── Header ──────────────────────────────────────── */}
      <div className="cks-header">
        <div className="cks-header-left">
          <h1 className="cks-title">
            <LayoutGrid size={22} className="cks-title-icon" />
            Content Chunks
          </h1>
          <p className="cks-subtitle">
            {chunks.length} chunk{chunks.length !== 1 ? 's' : ''} ·{' '}
            <span className="cks-stat-node">{nodeChunks.length} node-linked</span>
            {' · '}
            <span className="cks-stat-article">{articleChunks.length} article-linked</span>
            {' · '}
            <span className="cks-stat-lone">{standaloneChunks.length} standalone</span>
          </p>
        </div>
        <button className="cks-add-btn" onClick={handleCreate}>
          <Plus size={15} />
          Add Chunk
        </button>
      </div>

      {/* ── Divider ─────────────────────────────────────── */}
      <div className="cks-divider" />

      {/* ── Content ─────────────────────────────────────── */}
      {isLoading ? (
        <div className="cks-loading">
          <div className="cks-spinner" />
          Loading chunks…
        </div>
      ) : chunks.length === 0 ? (
        <div className="cks-empty">
          <div className="cks-empty-icon"><LayoutGrid size={46} /></div>
          <h2 className="cks-empty-heading">No Chunks Yet</h2>
          <p className="cks-empty-sub">Add content chunks to populate this modular text library.</p>
        </div>
      ) : (
        <div className="cks-masonry">
          {chunks
            .slice()
            .sort((a, b) => a.chunk_order - b.chunk_order)
            .map(chunk => (
              <ChunkCard
                key={chunk.id}
                chunk={chunk}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
        </div>
      )}

      {/* ── Modal ───────────────────────────────────────── */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingChunk ? 'Edit Chunk' : 'Create Chunk'}
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
