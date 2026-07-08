import React, { useState, useEffect } from 'react';
import { useCreateAuthorMutation, useUpdateAuthorMutation, type Author } from '../../api/contentApi';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface AuthorFormProps {
  author: Author | null;
  onSuccess: () => void;
}

export const AuthorForm: React.FC<AuthorFormProps> = ({ author, onSuccess }) => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePictureKey, setProfilePictureKey] = useState('');

  const [createAuthor, { isLoading: isCreating }] = useCreateAuthorMutation();
  const [updateAuthor, { isLoading: isUpdating }] = useUpdateAuthorMutation();

  useEffect(() => {
    if (author) {
      setName(author.name || '');
      setBio(author.bio || '');
      setProfilePictureKey(author.profile_picture_key || '');
    } else {
      setName('');
      setBio('');
      setProfilePictureKey('');
    }
  }, [author]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      bio,
      profile_picture_key: profilePictureKey || undefined
    };

    try {
      if (author) {
        await updateAuthor({ id: author.id, body: payload }).unwrap();
      } else {
        await createAuthor(payload).unwrap();
      }
      onSuccess();
    } catch (err) {
      console.error("Failed to save author:", err);
      alert("Failed to save author.");
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit}>
      <Input 
        label="Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        required 
        placeholder="E.g., Valmiki"
      />
      <Input 
        label="Bio" 
        value={bio} 
        onChange={(e) => setBio(e.target.value)} 
        multiline 
        placeholder="Brief biography..."
      />
      <Input 
        label="Profile Picture Key (R2)" 
        value={profilePictureKey} 
        onChange={(e) => setProfilePictureKey(e.target.value)} 
        placeholder="E.g., authors/valmiki.png"
      />
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
        <Button type="submit" isLoading={isLoading}>
          {author ? "Update Author" : "Create Author"}
        </Button>
      </div>
    </form>
  );
};
