import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Divider
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Person, Edit, Delete, Save, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
}

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchUserData = async () => {
    if (!user) {
      setError('Please sign in to view your profile');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching user data for user ID:', user._id);
      
      // Fetch the full profile using the user ID from AuthContext
      const profileResponse = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/${user._id}`);
      console.log('Profile data response:', profileResponse.data);
      
      setProfile(profileResponse.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      setError(err.response?.data?.message || 'Failed to load user data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?._id) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/${profile._id}`, profile);
      if (response.data) {
        setProfile(response.data);
        setSuccess('Profile updated successfully!');
        setEditing(false);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to update profile. Please try again.');
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!profile?._id) {
      setError('User not authenticated');
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      console.log('Starting account deletion process for user:', profile._id);
      
      // Delete user from MongoDB
      console.log('Deleting user from MongoDB...');
      await axios.delete(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/${profile._id}`);
      console.log('MongoDB user deleted successfully');

      setSuccess('Account deleted successfully');
      setShowDeleteDialog(false);
      setDeletePassword('');
      
      // Logout and redirect to login
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);

    } catch (err: any) {
      console.error('Error deleting account:', err);
      if (axios.isAxiosError(err)) {
        console.error('Axios error details:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        });
        setError(`Failed to delete account: ${err.response?.data?.error || err.message}`);
      } else {
        setError(`Failed to delete account: ${err.message}`);
      }
    } finally {
      setDeleting(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Please log in to view your profile
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">
          Profile not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Person sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" fontWeight={700}>
            Profile
          </Typography>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleProfileUpdate}>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={600}>
                Personal Information
              </Typography>
              {!editing ? (
                <Button
                  startIcon={<Edit />}
                  onClick={() => setEditing(true)}
                  variant="outlined"
                  size="small"
                >
                  Edit
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    type="submit"
                    startIcon={<Save />}
                    variant="contained"
                    size="small"
                    disabled={loading}
                  >
                    Save
                  </Button>
                  <Button
                    startIcon={<Cancel />}
                    onClick={() => {
                      setEditing(false);
                      fetchUserData();
                    }}
                    variant="outlined"
                    size="small"
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="First Name"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                disabled={!editing}
                fullWidth
              />
              <TextField
                label="Last Name"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                disabled={!editing}
                fullWidth
              />
            </Box>

            <TextField
              label="Email"
              value={profile.email}
              disabled
              fullWidth
              helperText="Email cannot be changed"
            />

            <TextField
              label="Gender"
              value={profile.gender}
              onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
              disabled={!editing}
              fullWidth
              select
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </TextField>
          </Stack>
        </form>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600} color="error">
            Danger Zone
          </Typography>
        </Box>

        <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
          Once you delete your account, there is no going back. Please be certain.
        </Alert>

        <Button
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          onClick={() => setShowDeleteDialog(true)}
        >
          Delete Account
        </Button>
      </Paper>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            This action cannot be undone. This will permanently delete your account and remove all your data.
          </Typography>
          <TextField
            label="Confirm by typing 'DELETE'"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            fullWidth
            placeholder="Type DELETE to confirm"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            disabled={deletePassword !== 'DELETE' || deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;