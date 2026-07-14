import React, { useState } from 'react';
import {
  useGetArticlesQuery,
  useDeleteArticleMutation,
  type Article,
  useGetAuthorsQuery,
} from '../../api/contentApi';
import { Modal } from '../../components/ui/Modal';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Clock,
  User,
  Tag,
  Calendar,
  Globe,
  FileText,
  Feather,
} from 'lucide-react';
import { ArticleForm } from './ArticleForm';
import './ArticleListScreen.css';

/* ─── Demo articles ──────────────────────────────────────── */
const DEMO_ARTICLES: Article[] = [
  {
    id: 'demo-art-1',
    title: 'The Eternal River: Understanding Dharma in Modern Life',
    author: 'demo-author-1',
    language: 'EN',
    content: '',
    created_at: '2024-03-15T08:30:00Z',
  },
  {
    id: 'demo-art-2',
    title: 'Pranayama & the Science of Breath — Ancient Wisdom Meets Neuroscience',
    author: 'demo-author-2',
    language: 'EN',
    content: '',
    created_at: '2024-04-02T10:00:00Z',
  },
  {
    id: 'demo-art-3',
    title: 'Decoding the Bhagavad Gita: Chapter 2 — The Yoga of Knowledge',
    author: 'demo-author-1',
    language: 'EN',
    content: '',
    created_at: '2024-04-20T14:15:00Z',
  },
  {
    id: 'demo-art-4',
    title: 'Ayurvedic Morning Rituals for the Digital Age',
    author: 'demo-author-3',
    language: 'EN',
    content: '',
    created_at: '2024-05-08T09:45:00Z',
  },
  {
    id: 'demo-art-5',
    title: 'The Ramayana\'s Seven Kandas: A Structural and Spiritual Map',
    author: 'demo-author-2',
    language: 'SA',
    content: '',
    created_at: '2024-05-22T11:30:00Z',
  },
];

const DEMO_AUTHORS: Record<string, string> = {
  'demo-author-1': 'Swami Vivekananda',
  'demo-author-2': 'Dr. Vasant Lad',
  'demo-author-3': 'Sadhguru Jaggi Vasudev',
};

/* ─── Seeded helpers ─────────────────────────────────────── */
const seededInt = (id: string, mod: number, off = 0) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffffff;
  return (Math.abs(h) % mod) + off;
};

/* ─── Thumbnail gradient palettes ───────────────────────── */
const THUMB_PALETTES = [
  { from: '#0f2027', mid: '#203a43', to: '#2c5364', accent: 'rgba(96,165,250,0.6)',  icon: '🏔️', label: 'Himalayan' },
  { from: '#1a0a00', mid: '#3d1a00', to: '#6b2d00', accent: 'rgba(251,146,60,0.5)',  icon: '🪔', label: 'Devotional' },
  { from: '#0d1b2a', mid: '#1b2a3b', to: '#0a3d62', accent: 'rgba(125,211,252,0.4)', icon: '📜', label: 'Manuscript' },
  { from: '#1a1a2e', mid: '#16213e', to: '#0f3460', accent: 'rgba(167,139,250,0.5)', icon: '🧘', label: 'Meditation' },
  { from: '#0b3d0b', mid: '#1a5c1a', to: '#0d5016', accent: 'rgba(110,231,183,0.4)', icon: '🌿', label: 'Wellness' },
];

/* ─── Category & engagement data ────────────────────────── */
const CATEGORIES = ['Dharma', 'Yoga', 'Mindfulness', 'Ayurveda', 'Vedanta', 'Tantra', 'Bhakti', 'Jnana'];
const READ_TIMES = [4, 5, 6, 7, 8, 10, 12, 15];

const formatViews = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`);

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'Unknown';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const LANG_LABELS: Record<string, string> = {
  EN: 'English',
  HI: 'Hindi',
  SA: 'Sanskrit',
  OT: 'Other',
};

/* ─── Thumbnail component ────────────────────────────────── */
const ArticleThumbnail: React.FC<{ id: string; title: string }> = ({ id, title }) => {
  const p = THUMB_PALETTES[seededInt(id, THUMB_PALETTES.length)];
  return (
    <div
      className="als-thumb"
      style={{
        background: `linear-gradient(135deg, ${p.from} 0%, ${p.mid} 50%, ${p.to} 100%)`,
      }}
      aria-label={`Thumbnail for "${title}"`}
    >
      {/* Radial accent glow */}
      <div
        className="als-thumb-glow"
        style={{ background: `radial-gradient(ellipse at 30% 50%, ${p.accent} 0%, transparent 70%)` }}
      />
      {/* Overlay grid texture */}
      <div className="als-thumb-grid" />
      {/* Icon centrepiece */}
      <span className="als-thumb-icon" role="img" aria-hidden="true">
        {p.icon}
      </span>
      {/* Label chip */}
      <span className="als-thumb-label">{p.label}</span>
    </div>
  );
};

/* ─── Article Row ────────────────────────────────────────── */
interface ArticleRowProps {
  article: Article;
  authorName: string;
  onEdit: (a: Article) => void;
  onDelete: (id: string) => void;
}

const ArticleRow: React.FC<ArticleRowProps> = ({ article, authorName, onEdit, onDelete }) => {
  const category   = CATEGORIES[seededInt(article.id, CATEGORIES.length)];
  const readTime   = READ_TIMES[seededInt(article.id + 'rt', READ_TIMES.length)];
  const viewCount  = seededInt(article.id + 'vc', 9500, 500);
  const langLabel  = LANG_LABELS[article.language] ?? article.language;

  return (
    <div className="als-row">

      {/* ── Thumbnail ────────────────────────────────────── */}
      <div className="als-row-thumb-wrap">
        <ArticleThumbnail id={article.id} title={article.title} />
      </div>

      {/* ── Editorial Body ───────────────────────────────── */}
      <div className="als-row-body">

        {/* Top badges row */}
        <div className="als-row-meta-top">
          <span className="als-badge category">
            <Tag size={10} />
            {category}
          </span>
          <span className="als-badge lang">
            <Globe size={10} />
            {langLabel}
          </span>
        </div>

        {/* Title */}
        <h2 className="als-row-title">{article.title}</h2>

        {/* Author + Date */}
        <div className="als-row-byline">
          <span className="als-byline-item">
            <User size={12} />
            {authorName}
          </span>
          <span className="als-byline-sep">·</span>
          <span className="als-byline-item">
            <Calendar size={12} />
            {formatDate(article.created_at)}
          </span>
        </div>

        {/* Engagement stats */}
        <div className="als-row-stats">
          <span className="als-stat">
            <Eye size={13} />
            {formatViews(viewCount)} views
          </span>
          <span className="als-stat-sep">•</span>
          <span className="als-stat">
            <Clock size={13} />
            {readTime} min read
          </span>
        </div>
      </div>

      {/* ── Actions ──────────────────────────────────────── */}
      <div className="als-row-actions">
        <button
          className="als-action-btn edit"
          title="Edit article"
          onClick={() => onEdit(article)}
          aria-label="Edit article"
        >
          <Edit2 size={15} />
        </button>
        <button
          className="als-action-btn delete"
          title="Delete article"
          onClick={() => onDelete(article.id)}
          aria-label="Delete article"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

/* ─── Main Screen ────────────────────────────────────────── */
const ArticleListScreen: React.FC = () => {
  const { data: fetchedArticles = [], isLoading } = useGetArticlesQuery();
  const { data: authors = [] } = useGetAuthorsQuery();
  const [deleteArticle] = useDeleteArticleMutation();

  const [isFormOpen, setIsFormOpen]       = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const handleCreate = () => { setEditingArticle(null); setIsFormOpen(true); };
  const handleEdit   = (a: Article) => { setEditingArticle(a); setIsFormOpen(true); };

  const handleDelete = async (id: string) => {
    if (id.startsWith('demo-')) { alert('Demo article cannot be deleted.'); return; }
    if (window.confirm('Are you sure you want to delete this article?')) {
      try { await deleteArticle(id).unwrap(); }
      catch (err) { console.error('Failed to delete article:', err); alert('Failed to delete article.'); }
    }
  };

  const getAuthorName = (authorId: string | null): string => {
    if (!authorId) return 'Unknown';
    if (DEMO_AUTHORS[authorId]) return DEMO_AUTHORS[authorId];
    const a = authors.find(x => x.id === authorId);
    return a ? a.name : 'Unknown Author';
  };

  const articles: Article[] = isLoading
    ? []
    : fetchedArticles.length > 0 ? fetchedArticles : DEMO_ARTICLES;

  return (
    <div className="als-page">

      {/* ── Header ──────────────────────────────────────── */}
      <div className="als-header">
        <div className="als-header-left">
          <h1 className="als-title">
            <Feather size={22} className="als-title-icon" />
            Articles
          </h1>
          <p className="als-subtitle">
            {articles.length} article{articles.length !== 1 ? 's' : ''} · Editorial management dashboard
          </p>
        </div>
        <button className="als-add-btn" onClick={handleCreate}>
          <Plus size={16} />
          New Article
        </button>
      </div>

      {/* ── Divider ─────────────────────────────────────── */}
      <div className="als-divider" />

      {/* ── Content ─────────────────────────────────────── */}
      {isLoading ? (
        <div className="als-loading">
          <div className="als-spinner" />
          Loading articles…
        </div>
      ) : articles.length === 0 ? (
        <div className="als-empty">
          <div className="als-empty-icon"><FileText size={48} /></div>
          <h2 className="als-empty-heading">No Articles Yet</h2>
          <p className="als-empty-sub">Create your first article to populate the editorial feed.</p>
        </div>
      ) : (
        <div className="als-list">
          {/* Column header */}
          <div className="als-list-header">
            <span className="als-lh-thumb">Cover</span>
            <span className="als-lh-content">Article</span>
            <span className="als-lh-actions">Actions</span>
          </div>

          {articles.map(article => (
            <ArticleRow
              key={article.id}
              article={article}
              authorName={getAuthorName(article.author)}
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
        title={editingArticle ? 'Edit Article' : 'Create Article'}
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
