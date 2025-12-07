import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Fab,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  Chip,
} from '@mui/material';
import {
  Send,
  SmartToy,
  Close,
  AttachFile,
} from '@mui/icons-material';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your IOG Platform AI Assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    'File a complaint',
    'Track my complaint',
    'Report a crime',
    'Find jobs',
    'Check status',
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(input);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('complaint') || input.includes('file')) {
      return 'I can help you file a complaint. Please provide:\n1. Category (Infrastructure, Water, Electricity, etc.)\n2. Location\n3. Description of the issue\n\nOr click on "File Complaint" in the navigation menu.';
    }

    if (input.includes('track') || input.includes('status')) {
      return 'To track your complaint, please provide your complaint number (e.g., CMP-2024-001234). You can also go to "My Complaints" section to see all your submissions.';
    }

    if (input.includes('crime') || input.includes('fir')) {
      return 'For crime reporting:\n1. Go to "File FIR" section\n2. Select crime type\n3. Provide incident details\n4. Add location and time\n\nFor emergencies, please call 100 immediately.';
    }

    if (input.includes('job') || input.includes('employment')) {
      return 'I can help you find jobs! Visit the "Job Portal" section where you can:\n- Browse available positions\n- Filter by location and skills\n- Apply directly online\n- Take skill assessment tests';
    }

    if (input.includes('help') || input.includes('how')) {
      return 'I can assist you with:\n✓ Filing complaints\n✓ Tracking complaint status\n✓ Reporting crimes\n✓ Finding employment opportunities\n✓ Understanding platform features\n\nWhat would you like to know more about?';
    }

    return 'I understand you\'re asking about: "' + userInput + '". Could you please provide more details? I can help with complaints, crime reports, job searches, and general platform navigation.';
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
  };

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
        onClick={() => setOpen(true)}
      >
        <SmartToy />
      </Fab>

      {/* Chat Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 } },
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <AppBar position="static" elevation={0}>
            <Toolbar>
              <Avatar sx={{ bgcolor: 'white', color: 'primary.main', mr: 2 }}>
                <SmartToy />
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">AI Assistant</Typography>
                <Typography variant="caption">Always here to help</Typography>
              </Box>
              <IconButton color="inherit" onClick={() => setOpen(false)}>
                <Close />
              </IconButton>
            </Toolbar>
          </AppBar>

          {/* Quick Actions */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="caption" color="textSecondary" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              {quickActions.map((action) => (
                <Chip
                  key={action}
                  label={action}
                  size="small"
                  onClick={() => handleQuickAction(action)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              p: 2,
              bgcolor: '#f5f5f5',
            }}
          >
            <List>
              {messages.map((message) => (
                <ListItem
                  key={message.id}
                  sx={{
                    flexDirection: 'column',
                    alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2,
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      maxWidth: '80%',
                      bgcolor: message.sender === 'user' ? 'primary.main' : 'white',
                      color: message.sender === 'user' ? 'white' : 'text.primary',
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                      {message.text}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 0.5,
                        opacity: 0.7,
                      }}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </Paper>
                </ListItem>
              ))}
              <div ref={messagesEndRef} />
            </List>
          </Box>

          {/* Input */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'white' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small">
                <AttachFile />
              </IconButton>
              <TextField
                fullWidth
                size="small"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <IconButton color="primary" onClick={handleSend}>
                <Send />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
