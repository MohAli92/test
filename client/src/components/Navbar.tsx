import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MessageIcon from '@mui/icons-material/Message';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import Tooltip from '@mui/material/Tooltip';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user?._id) return;
      
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/messages/unread/${user._id}`);
        setUnreadCount(response.data.count);
      } catch (err) {
        console.error('Error fetching unread count:', err);
      }
    };

    fetchUnreadCount();
    // Set up polling for unread messages
    const interval = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [user?._id]);

  const handleLogout = async () => {
    try {
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          color="primary"
          sx={{ flexGrow: 1, fontWeight: 700, textDecoration: 'none' }}
        >
          Share Dish
        </Typography>
        <Box>
          <Tooltip title="Home" arrow>
            <Button
              color={location.pathname === '/' ? 'primary' : 'inherit'}
              component={Link}
              to="/"
              sx={{
                fontWeight: 700,
                mx: 0.5,
                px: 2,
                borderRadius: 2,
                gap: 0.5,
                bgcolor: location.pathname === '/' ? 'primary.main' : 'transparent',
                color: location.pathname === '/' ? 'white' : 'inherit',
                '&:hover': {
                  bgcolor: location.pathname === '/' ? 'primary.dark' : 'action.hover',
                },
              }}
              startIcon={<RestaurantIcon sx={{ fontSize: 26 }} />}
            >
              Home
            </Button>
          </Tooltip>
          <Tooltip title="Add Post" arrow>
            <Button
              color={location.pathname === '/add' ? 'primary' : 'inherit'}
              component={Link}
              to="/add"
              sx={{
                fontWeight: 700,
                mx: 0.5,
                px: 2,
                borderRadius: 2,
                gap: 0.5,
                bgcolor: location.pathname === '/add' ? 'primary.main' : 'transparent',
                color: location.pathname === '/add' ? 'white' : 'inherit',
                '&:hover': {
                  bgcolor: location.pathname === '/add' ? 'primary.dark' : 'action.hover',
                },
              }}
              startIcon={<AddIcon sx={{ fontSize: 26 }} />}
            >
              Add Post
            </Button>
          </Tooltip>
          <Tooltip title="Messages" arrow>
            <Button
              color={location.pathname === '/messages' ? 'primary' : 'inherit'}
              component={Link}
              to="/messages"
              sx={{
                fontWeight: 700,
                mx: 0.5,
                px: 2,
                borderRadius: 2,
                gap: 0.5,
                bgcolor: location.pathname === '/messages' ? 'primary.main' : 'transparent',
                color: location.pathname === '/messages' ? 'white' : 'inherit',
                '&:hover': {
                  bgcolor: location.pathname === '/messages' ? 'primary.dark' : 'action.hover',
                },
              }}
              startIcon={
                <Badge badgeContent={unreadCount} color="error">
                  <MessageIcon sx={{ fontSize: 26 }} />
                </Badge>
              }
            >
              Messages
            </Button>
          </Tooltip>
          <Tooltip title="Profile" arrow>
            <Button
              color={location.pathname === '/profile' ? 'primary' : 'inherit'}
              component={Link}
              to="/profile"
              sx={{
                fontWeight: 700,
                mx: 0.5,
                px: 2,
                borderRadius: 2,
                gap: 0.5,
                bgcolor: location.pathname === '/profile' ? 'primary.main' : 'transparent',
                color: location.pathname === '/profile' ? 'white' : 'inherit',
                '&:hover': {
                  bgcolor: location.pathname === '/profile' ? 'primary.dark' : 'action.hover',
                },
              }}
              startIcon={<PersonIcon sx={{ fontSize: 26 }} />}
            >
              Profile
            </Button>
          </Tooltip>
          <Button
            color="secondary"
            onClick={handleLogout}
            sx={{ fontWeight: 600, ml: 2 }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;