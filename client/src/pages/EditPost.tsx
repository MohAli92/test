import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, TextField, Button, Box, Stack, Alert, CircularProgress
} from '@mui/material';
import { getApiUrl } from '../utils/api';
import axios from 'axios';

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  console.log('Edit page loaded for post ID:', id);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<any>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<string>('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [title, setTitle] = useState('');
  const [allergies, setAllergies] = useState<string[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${getApiUrl()}/api/posts`);
        const foundPost = response.data.find((p: any) => p._id === id);
        if (foundPost) {
          setPost(foundPost);
          setTitle(foundPost.title || '');
          setDescription(foundPost.description || '');
          setPhoto(foundPost.photo || '');
          setCity(foundPost.city || '');
          setAddress(foundPost.address || '');
          setPickupTime(foundPost.time ? new Date(foundPost.time) : new Date());
          setIngredients(foundPost.ingredients || []);
          setAllergies(foundPost.allergies || []);
        } else {
          setError('Post not found');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handlePhotoUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      setSaving(true);
      const response = await axios.post(`${getApiUrl()}/api/posts/upload`, formData);
      setPhoto(response.data.imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await axios.patch(`${getApiUrl()}/api/posts/${id}`, {
        title,
        description,
        photo,
        city,
        address,
        time: pickupTime,
        ingredients: ingredients.map(i => `${i.name} (${i.quantity})`),
        allergies
      });
      navigate('/');
    } catch (error: any) {
      console.error('Error updating post:', error);
      alert(error.response?.data?.error || 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Box p={4} textAlign="center"><CircularProgress /></Box>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} align="center" gutterBottom>
          Edit Post
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Box sx={{ textAlign: 'center' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
                ref={fileInputRef}
              />
              <Button
                variant="outlined"
                onClick={() => fileInputRef.current?.click()}
                disabled={saving}
              >
                Change Photo
              </Button>
              {photo && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={photo}
                    alt="Meal"
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                  />
                </Box>
              )}
            </Box>
            <TextField
              label="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              fullWidth
              multiline
              minRows={2}
              required
            />
            <TextField
              label="Ingredients (comma separated)"
              value={ingredients}
              onChange={e => setIngredients(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="City"
              value={city}
              onChange={e => setCity(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Pickup Address"
              value={address}
              onChange={e => setAddress(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Pickup Time"
              type="datetime-local"
              value={pickupTime}
              onChange={e => setPickupTime(e.target.value)}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={saving}
              fullWidth
              sx={{ fontWeight: 600 }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default EditPost; 