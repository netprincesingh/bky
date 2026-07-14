import React, { useState } from 'react';
import { useGetAuthorsQuery, useDeleteAuthorMutation, type Author } from '../../api/contentApi';
import { Modal } from '../../components/ui/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { AuthorForm } from './AuthorForm';
import './AuthorListScreen.css';

/* ── Static portrait map (demo data enrichment) ────────────── */
const PORTRAIT_MAP: Record<string, string> = {
  'ved vyasa':  '/authors/ved_vyasa.png',
  'valmiki':    '/authors/valmiki.png',
  'kalidasa':   '/authors/kalidasa.png',
  'bhasa':      '/authors/bhasa.png',
};

const getPortrait = (name: string): string | null =>
  PORTRAIT_MAP[name.toLowerCase().trim()] ?? null;

/* ── Demo authors shown when backend returns empty ──────────── */
const DEMO_AUTHORS: Author[] = [
  {
    id: 'demo-1',
    name: 'Ved Vyasa',
    bio: `Maharishi Veda Vyasa, revered as one of the greatest sages of ancient India, is the legendary author of the Mahabharata — the world's longest epic poem comprising over 100,000 shlokas. He is also credited with compiling the four Vedas into their present canonical form, composing the eighteen Puranas, and authoring the Brahmasutras, which form one of the three pillars of Vedantic philosophy.\n\nBorn Krishnadwaipayana to the sage Parashara and the fisher-woman Satyavati on an island in the Yamuna river, he was a master of transcendent spiritual knowledge and an incomparable storyteller. His epic work, the Mahabharata, encompasses the Bhagavad Gita — a sacred philosophical dialogue between Lord Krishna and the warrior Arjuna — which continues to guide humanity thousands of years after its composition.\n\nVyasa is considered a Chiranjivi (immortal) in the Hindu tradition, believed to be alive even today in deep meditation. The festival of Guru Purnima is celebrated in his honour, acknowledging his foundational role as the Adi-Guru of the Vedic tradition.`,
    profile_picture_key: '',
  },
  {
    id: 'demo-2',
    name: 'Valmiki',
    bio: `Maharishi Valmiki is celebrated as the Adi Kavi — the "First Poet" — of Sanskrit literature. His magnum opus, the Ramayana, is one of the two great epics of ancient India and recounts the life and deeds of Lord Rama, an avatar of Vishnu. Composed of approximately 24,000 verses across seven kandas (books), the Ramayana is not merely a story of heroism and devotion but a timeless manual of dharmic living.\n\nBorn as Ratnakar, he initially lived as a forest brigand before a transformative encounter with the sage Narada set him on the path of spiritual enlightenment. According to legend, he performed severe penance for so long that an anthill (valmika) grew around his body, giving him his name. The first shloka of the Ramayana is said to have spontaneously sprung from his lips upon witnessing a hunter slay a mated bird — grief crystallising into poetry in an instant.\n\nValmiki's influence on Indian literature, performing arts, sculpture, and philosophy is immeasurable. Countless retellings, dance forms, and theatrical traditions across South and Southeast Asia trace their inspiration directly to his original vision.`,
    profile_picture_key: '',
  },
  {
    id: 'demo-3',
    name: 'Kalidasa',
    bio: `Kalidasa is universally regarded as the greatest poet and playwright in the Sanskrit literary tradition. Flourishing during the Gupta golden age (circa 4th–5th century CE), his works represent the pinnacle of classical Indian literature in their lyrical beauty, metaphorical richness, and emotional depth. He is sometimes called the "Shakespeare of India," though many scholars argue the comparison underestimates him.\n\nHis three surviving plays — Abhijñānaśākuntalam, Vikramorvaśīyam, and Mālavikāgnimitram — remain masterpieces of dramatic art. Abhijñānaśākuntalam, the story of King Dushyanta and the forest nymph Shakuntala, so enchanted the German poet Goethe that he declared no words could adequately praise its beauty. His two epic poems, Raghuvaṃśa and Kumārasambhava, are celebrated for their majestic Sanskrit verse and sublime imagery.\n\nKalidasa's lyrical poem Meghadūta ("The Cloud Messenger"), in which a lovesick Yaksha asks a passing cloud to carry his message to his beloved, remains one of the finest romantic poems in world literature. His mastery of nature imagery, seasonal metaphors, and the human heart set a standard that centuries of poets have aspired to match.`,
    profile_picture_key: '',
  },
  {
    id: 'demo-4',
    name: 'Bhasa',
    bio: `Bhasa is one of the earliest and most prolific playwrights of classical Sanskrit drama, widely believed to have preceded Kalidasa by several centuries. For nearly a millennium, his works were considered lost — known only through scattered references and Kalidasa's own respectful allusions to him. In 1912, the scholar T. Ganapati Shastri made the remarkable discovery of thirteen plays attributed to Bhasa in a single manuscript trove in Kerala.\n\nHis plays are celebrated for their bold dramatic choices: unlike the convention demanding happy endings, Bhasa was not afraid to portray tragic conclusions. Works such as Madhyamavyāyoga, Karnabhāra, and Ūrubhaṅga (which depicts the death of the warrior Duryodhana with great pathos) reveal a playwright of extraordinary courage and technical skill. Ūrubhaṅga in particular has been praised by modern theatre practitioners as a proto-tragic masterpiece.\n\nBhasa drew extensively from the Mahabharata and Ramayana, breathing theatrical life into their characters with an immediacy that modern audiences continue to find compelling. His influence on the conventions of Sanskrit stagecraft was foundational, and his rediscovery in the twentieth century sparked a renaissance of interest in the earliest layer of India's dramatic heritage.`,
    profile_picture_key: '',
  },
];

/* ── Component ──────────────────────────────────────────────── */
const AuthorListScreen: React.FC = () => {
  const { data: fetchedAuthors = [], isLoading } = useGetAuthorsQuery();
  const [deleteAuthor] = useDeleteAuthorMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  const handleCreate = () => {
    setEditingAuthor(null);
    setIsFormOpen(true);
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (id.startsWith('demo-')) {
      alert('Demo author cannot be deleted.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this author?')) {
      try {
        await deleteAuthor(id).unwrap();
      } catch (err) {
        console.error('Failed to delete author:', err);
        alert('Failed to delete author.');
      }
    }
  };

  // Merge: real authors first, then demo authors not already present
  const authors: Author[] = isLoading
    ? []
    : fetchedAuthors.length > 0
    ? fetchedAuthors
    : DEMO_AUTHORS;

  return (
    <div className="authors-page">
      {/* Header */}
      <div className="authors-header">
        <h1 className="authors-title">Authors</h1>
        <button className="add-author-btn" onClick={handleCreate}>
          <Plus size={17} />
          Add Author
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="authors-loading">
          <div className="authors-loading-spinner" />
          Loading authors…
        </div>
      ) : authors.length === 0 ? (
        <div className="authors-empty">
          No authors found. Create one to get started.
        </div>
      ) : (
        <div className="authors-list">
          {authors.map((author) => {
            const portrait = getPortrait(author.name);
            return (
              <div key={author.id} className="author-card">
                {/* Portrait */}
                {portrait && (
                  <div className="author-portrait-wrap">
                    <img
                      src={portrait}
                      alt={`Portrait of ${author.name}`}
                      className="author-portrait"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="author-content">
                  <h2 className="author-name">{author.name}</h2>
                  {author.bio ? (
                    <>
                      <div className="author-bio-label">Bio</div>
                      <p className="author-bio">{author.bio}</p>
                    </>
                  ) : (
                    <p className="author-bio" style={{ fontStyle: 'italic', opacity: 0.5 }}>
                      No biography available.
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="author-actions">
                  <button
                    className="action-btn edit"
                    title="Edit author"
                    onClick={() => handleEdit(author)}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="action-btn delete"
                    title="Delete author"
                    onClick={() => handleDelete(author.id)}
                  >
                    <Trash2 size={16} />
                  </button>
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
        title={editingAuthor ? 'Edit Author' : 'Create Author'}
      >
        <AuthorForm
          author={editingAuthor}
          onSuccess={() => setIsFormOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default AuthorListScreen;
