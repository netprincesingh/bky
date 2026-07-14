import React, { useState } from 'react';
import {
  useGetBooksQuery,
  useDeleteBookMutation,
  useGetAuthorsQuery,
  type Book,
} from '../../api/contentApi';
import { Modal } from '../../components/ui/Modal';
import { Plus, Edit2, Trash2, User, Globe, Calendar, BookOpen } from 'lucide-react';
import { BookForm } from './BookForm';
import './BookListScreen.css';

/* ── Cover map (matches by title keyword, case-insensitive) ── */
const COVER_MAP: Array<{ keyword: string; src: string }> = [
  { keyword: 'mahabharata', src: '/books/mahabharata.png' },
  { keyword: 'ramayana',    src: '/books/ramayana.png'    },
];

const getCover = (title: string): string | null => {
  const lower = title.toLowerCase();
  return COVER_MAP.find(({ keyword }) => lower.includes(keyword))?.src ?? null;
};

/* ── Placeholder colours per book index ──────────────────── */
const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(160deg, #1e1b4b 0%, #312e81 100%)',
  'linear-gradient(160deg, #064e3b 0%, #065f46 100%)',
  'linear-gradient(160deg, #1e3a5f 0%, #1e40af 100%)',
  'linear-gradient(160deg, #3b0764 0%, #6b21a8 100%)',
  'linear-gradient(160deg, #7c1d1d 0%, #991b1b 100%)',
];

/* ── Sanskrit ornament characters for placeholder covers ─── */
const SANSKRIT_GLYPHS = ['ॐ', '卐', '❊', '✦', '॥'];

/* ── Simulated completion percentages (demo) ─────────────── */
const seededPct = (id: string) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffffff;
  return Math.abs(h % 85) + 10; // 10–94 %
};

/* ── Demo books shown when backend returns empty ─────────── */
const DEMO_BOOKS: Book[] = [
  {
    id: 'demo-1',
    title: 'The Mahabharata',
    author: 'author-vyasa',
    language: 'Sanskrit',
    description:
      'The Mahabharata is one of two major Sanskrit epics of ancient India. It narrates the Kurukshetra War and the fates of the Kaurava and the Pandava princes. It also contains philosophical and devotional material, including the Bhagavad Gita, Anushasana Parva, the Shanti Parva — a discussion of peace and philosophical discourse.',
    published_date: 'c. 400 BCE – 400 CE',
  },
  {
    id: 'demo-2',
    title: 'Ramayana',
    author: 'author-valmiki',
    language: 'Sanskrit',
    description:
      'The Ramayana is an ancient Indian epic composed by sage Valmiki. It depicts the duties of relationships, portraying ideal characters such as the ideal father, ideal servant, the ideal brother, the ideal wife, and the ideal king. The narrative follows Prince Rama of Ayodhya, whose wife Sita is abducted by the demon-king of Lanka, Ravana.',
    published_date: 'c. 7th–4th century BCE',
  },
  {
    id: 'demo-3',
    title: 'Abhijñānaśākuntalam',
    author: 'author-kalidasa',
    language: 'Sanskrit',
    description:
      'Abhijñānaśākuntalam (The Recognition of Shakuntala) is a celebrated Sanskrit play by the poet Kalidasa. It tells the story of King Dushyanta who falls in love with Shakuntala, daughter of the sage Vishwamitra. Considered one of the greatest works of Sanskrit literature, it was among the first Sanskrit works to be translated into a European language.',
    published_date: 'c. 4th–5th century CE',
  },
  {
    id: 'demo-4',
    title: 'Bhagavad Gita',
    author: 'author-vyasa',
    language: 'Sanskrit',
    description:
      'The Bhagavad Gita, often referred to as the Gita, is a 700-verse Hindu scripture that is part of the epic Mahabharata. It is a philosophical dialogue between Prince Arjuna and his guide Lord Krishna, spoken on the battlefield of Kurukshetra. The Gita addresses the moral and philosophical dilemmas of Arjuna and presents concepts of dharma, devotion, knowledge, and the path to liberation.',
    published_date: 'c. 1st–2nd century BCE',
  },
];

/* ─────────────────────────────────────────────────────────── */
const BookListScreen: React.FC = () => {
  const { data: fetchedBooks = [], isLoading } = useGetBooksQuery();
  const { data: authors = [] } = useGetAuthorsQuery();
  const [deleteBook] = useDeleteBookMutation();

  const [isFormOpen, setIsFormOpen]   = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const handleCreate = () => { setEditingBook(null); setIsFormOpen(true); };
  const handleEdit   = (b: Book) => { setEditingBook(b); setIsFormOpen(true); };

  const handleDelete = async (id: string) => {
    if (id.startsWith('demo-')) { alert('Demo book cannot be deleted.'); return; }
    if (window.confirm('Are you sure you want to delete this book?')) {
      try { await deleteBook(id).unwrap(); }
      catch (err) { console.error('Failed to delete book:', err); alert('Failed to delete book.'); }
    }
  };

  const getAuthorName = (authorId: string | null) => {
    if (!authorId) return 'Unknown';
    const a = authors.find(x => x.id === authorId);
    return a ? a.name : authorId;
  };

  const books: Book[] = isLoading ? [] : fetchedBooks.length > 0 ? fetchedBooks : DEMO_BOOKS;

  return (
    <div className="books-page">
      {/* Header */}
      <div className="books-header">
        <h1 className="books-title">Books</h1>
        <button className="add-book-btn" onClick={handleCreate}>
          <Plus size={17} />
          Add Book
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="books-loading">
          <div className="books-loading-spinner" />
          Loading library…
        </div>
      ) : books.length === 0 ? (
        <div className="books-empty">No books found. Add one to begin your digital library.</div>
      ) : (
        <div className="books-list">
          {books.map((book, idx) => {
            const cover       = getCover(book.title);
            const pct         = seededPct(book.id);
            const gradient    = PLACEHOLDER_GRADIENTS[idx % PLACEHOLDER_GRADIENTS.length];
            const glyph       = SANSKRIT_GLYPHS[idx % SANSKRIT_GLYPHS.length];
            const authorName  = getAuthorName(book.author);

            return (
              <div key={book.id} className="book-card">

                {/* ── LEFT: Cover ─────────────────────────────── */}
                <div className="book-cover-wrap">
                  {cover ? (
                    <img
                      src={cover}
                      alt={`Cover of ${book.title}`}
                      className="book-cover"
                    />
                  ) : (
                    <div
                      className="book-cover-placeholder"
                      style={{ background: gradient }}
                    >
                      <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.4rem', opacity: 0.6 }}>
                        {glyph}
                      </span>
                      {book.title}
                    </div>
                  )}
                </div>

                {/* ── CENTER: Details ──────────────────────────── */}
                <div className="book-details">
                  <h2 className="book-title">{book.title}</h2>

                  <div className="book-badges">
                    <span className="book-badge author">
                      <User size={11} className="book-badge-icon" />
                      {authorName}
                    </span>
                    <span className="book-badge language">
                      <Globe size={11} className="book-badge-icon" />
                      {book.language || 'Unknown'}
                    </span>
                    {book.published_date && (
                      <span className="book-badge date">
                        <Calendar size={11} className="book-badge-icon" />
                        {book.published_date}
                      </span>
                    )}
                  </div>

                  {book.description && (
                    <p className="book-synopsis">{book.description}</p>
                  )}
                </div>

                {/* ── RIGHT: Progress + Actions ────────────────── */}
                <div className="book-right-col">
                  {/* Progress */}
                  <div className="book-progress-wrap">
                    <div className="book-progress-label">
                      <span>
                        <BookOpen size={10} style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                        Completion
                      </span>
                      <span className="book-progress-pct">{pct}%</span>
                    </div>
                    <div className="book-progress-track">
                      <div className="book-progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="book-actions">
                    <button
                      className="book-action-btn edit"
                      title="Edit book"
                      onClick={() => handleEdit(book)}
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      className="book-action-btn delete"
                      title="Delete book"
                      onClick={() => handleDelete(book.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingBook ? 'Edit Book' : 'Create Book'}
      >
        <BookForm
          book={editingBook}
          onSuccess={() => setIsFormOpen(false)}
          authors={authors}
        />
      </Modal>
    </div>
  );
};

export default BookListScreen;
