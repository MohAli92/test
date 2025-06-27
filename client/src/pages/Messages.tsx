import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { Person as PersonIcon, Restaurant as RestaurantIcon, Message as MessageIcon } from '@mui/icons-material';
import axios from 'axios';

interface Chat {
  _id: string;
  post: {
    _id: string;
    title: string;
    photo: string;
  };
  users: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  }>;
  messages: Array<{
    sender: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    text: string;
    createdAt: string;
  }>;
}

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      if (!user?._id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/chat/user/${user._id}`);
        setChats(response.data);
      } catch (err) {
        console.error('Error fetching chats:', err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || 'Failed to load conversations. Please try again later.');
        } else {
          setError('Failed to load conversations. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user?._id]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat || !user?._id) return;
    
    setSending(true);
    try {
      const otherUser = selectedChat.users.find(u => u._id !== user._id);
      if (!otherUser) {
        console.error('Could not find other user in chat');
        setError('Could not find the other user in this conversation.');
        return;
      }

      console.log('Sending message:', {
        postId: selectedChat.post._id,
        sender: user._id,
        receiver: otherUser._id,
        text: message
      });

      await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/chat/${selectedChat.post._id}/message`, {
        sender: user._id,
        receiver: otherUser._id,
        text: message
      });

      // Refresh the selected chat
      const chatResponse = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/chat/${selectedChat.post._id}/${user._id}/${otherUser._id}`);
      const updatedChat = { ...selectedChat, messages: chatResponse.data };
      setSelectedChat(updatedChat);
      
      // Update the chat in the list
      setChats(chats.map(chat => 
        chat._id === selectedChat._id ? updatedChat : chat
      ));
      
      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
      if (axios.isAxiosError(err)) {
        console.error('Response data:', err.response?.data);
        console.error('Response status:', err.response?.status);
        setError(`Failed to send message: ${err.response?.data?.error || err.message}`);
      } else {
        setError('Failed to send message. Please try again.');
      }
    } finally {
      setSending(false);
    }
  };

  const getOtherUser = (chat: Chat) => {
    return chat.users.find(u => u._id !== user?._id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 3, py: 1, border: '2px solid #e0e0e0', borderRadius: 3, bgcolor: '#fff', boxShadow: 1 }}>
          <MessageIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight={700} color="primary">
            Messages
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Conversations List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '70vh', overflow: 'auto' }}>
            <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              Conversations ({chats.length})
            </Typography>
            {chats.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  No conversations yet. Start by contacting a post publisher!
                </Typography>
              </Box>
            ) : (
              <List>
                {chats.map((chat) => {
                  const otherUser = getOtherUser(chat);
                  const lastMessage = chat.messages[chat.messages.length - 1];
                  
                  return (
                    <React.Fragment key={chat._id}>
                      <ListItem 
                        button 
                        onClick={() => setSelectedChat(chat)}
                        selected={selectedChat?._id === chat._id}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight={600}>
                              {otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : 'Unknown User'}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {chat.post?.title || 'Unknown Post'}
                              </Typography>
                              {lastMessage && (
                                <Typography variant="caption" color="text.secondary" noWrap>
                                  {lastMessage.text}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  );
                })}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Chat Area */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <RestaurantIcon color="primary" />
                    <Box>
                      <Typography variant="h6">
                        {getOtherUser(selectedChat)?.firstName} {getOtherUser(selectedChat)?.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        About: {selectedChat.post?.title || 'Unknown Post'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Messages */}
                <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                  {selectedChat.messages.length === 0 ? (
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                      <Typography color="text.secondary">
                        No messages yet. Start the conversation!
                      </Typography>
                    </Box>
                  ) : (
                    <Box display="flex" flexDirection="column" gap={1}>
                      {selectedChat.messages.map((msg, index) => {
                        const senderId = typeof msg.sender === 'string' ? msg.sender : msg.sender._id;
                        const isSent = String(senderId) === String(user?._id);
                        return (
                          <Box
                            key={index}
                            sx={{
                              alignSelf: isSent ? 'flex-end' : 'flex-start',
                              maxWidth: '70%',
                              mb: 1
                            }}
                          >
                            <Paper
                              sx={{
                                p: 1.5,
                                borderRadius: 3,
                                boxShadow: 2,
                                backgroundColor: isSent ? 'primary.main' : 'grey.200',
                                color: isSent ? 'white' : 'text.primary',
                                borderTopRightRadius: isSent ? 0 : 12,
                                borderTopLeftRadius: isSent ? 12 : 0,
                              }}
                            >
                              {isSent && (
                                <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.7 }}>
                                  You
                                </Typography>
                              )}
                              <Typography variant="body2">{msg.text}</Typography>
                              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                {formatDate(msg.createdAt)}
                              </Typography>
                            </Paper>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </Box>

                {/* Message Input */}
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Box display="flex" gap={1}>
                    <TextField
                      fullWidth
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      disabled={sending}
                    />
                    <Button
                      variant="contained"
                      onClick={handleSendMessage}
                      disabled={!message.trim() || sending}
                    >
                      {sending ? <CircularProgress size={20} /> : 'Send'}
                    </Button>
                  </Box>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography color="text.secondary">
                  Select a conversation to start messaging
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Messages; 