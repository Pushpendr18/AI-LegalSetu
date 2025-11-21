///----------------------------------------------------------------

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";
import { ragChat, basicChat, uploadDocument, summarizeDocument } from "/src/services/api";
// Enhanced Button Component
const Button = ({ children, onClick, disabled = false, variant = "primary", className = "" }) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    outline: "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Sources Display Component
const SourcesDisplay = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-4 pt-3 border-t border-gray-300">
      <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
        <span className="mr-2">📚</span>
        Sources from your documents:
      </p>
      <div className="space-y-2">
        {sources.map((source, idx) => (
          <div key={idx} className="text-xs text-gray-600 bg-white p-3 rounded-lg border border-gray-200">
            <p className="font-medium text-blue-700">{source.document || `Document ${idx + 1}`}</p>
            {source.page && (
              <p className="text-gray-500 mt-1">Page: {source.page}</p>
            )}
            {source.content && (
              <p className="text-gray-600 mt-2">
                "{source.content}"
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Enhanced Icons
const SendIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const BotIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MicIcon = ({ recording = false }) => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {recording ? (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
      </>
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    )}
  </svg>
);

const UploadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const FileTextIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

// Legal Dictionary for Jargon Helper
const legalDictionary = {
  "force majeure": {
    term: "Force Majeure",
    definition: "A legal clause that frees both parties from liability or obligation when an extraordinary event or circumstance beyond their control occurs.",
    simple: "Unexpected events that make it impossible to fulfill contract promises",
    example: "Natural disasters, wars, strikes, or pandemics that prevent contract performance",
    usage: "Common in contracts to handle unforeseen circumstances"
  },
  "habeas corpus": {
    term: "Habeas Corpus",
    definition: "A writ requiring a person under arrest to be brought before a judge or into court, especially to secure the person's release unless lawful grounds are shown for their detention.",
    simple: "Your right to challenge unlawful detention in court",
    example: "If someone is arrested without proper reason, they can file a habeas corpus petition",
    usage: "Fundamental right against arbitrary imprisonment"
  },
  "pro bono": {
    term: "Pro Bono",
    definition: "Professional work undertaken voluntarily and without payment, typically for the public good.",
    simple: "Legal services provided for free to help those who can't afford it",
    example: "A lawyer representing a poor client without charging fees",
    usage: "Common in legal profession for social service"
  }
};

// ChatBot Component - COMPLETE MODIFIED VERSION WITH RAG
export default function ChatBot() {
  // Chat States
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Chat History States
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [showSessionSidebar, setShowSessionSidebar] = useState(false);

  // Voice & File States
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showFileUpload, setShowFileUpload] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Sample suggested questions
  const suggestedQuestions = [
    "What are the elements of a valid contract?",
    "How does copyright protection work?",
    "What is the difference between civil and criminal law?",
    "Explain the concept of 'reasonable doubt'",
    "How do I protect my intellectual property?"
  ];

  // Legal Templates
  const legalTemplates = [
    { icon: "📝", text: "Draft NDA", prompt: "Create a comprehensive non-disclosure agreement for business partners" },
    { icon: "🏠", text: "Rent Agreement", prompt: "Draft a residential rental agreement for 11 months" },
    { icon: "💼", text: "Service Contract", prompt: "Generate a professional service agreement between client and service provider" }
  ];

  // NEW: Load sessions from localStorage on component mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('LegalSetu-sessions');
    if (savedSessions) {
      const sessions = JSON.parse(savedSessions);
      setChatSessions(sessions);
      // Set the most recent session as current
      if (sessions.length > 0) {
        setCurrentSessionId(sessions[0].id);
        setMessages(sessions[0].messages);
      }
    }
  }, []);

  // NEW: Save sessions to localStorage whenever sessions change
  useEffect(() => {
    localStorage.setItem('legalsetu-sessions', JSON.stringify(chatSessions));
  }, [chatSessions]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + transcript);
        setIsRecording(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setMessages(prev => [...prev, {
          sender: "ai",
          text: "Sorry, I couldn't access your microphone. Please check your permissions.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognition);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // NEW: Create a new chat session
  const createNewSession = () => {
    const newSession = {
      id: Date.now(),
      title: "New Chat",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };
    
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setMessages([]);
    setShowSessionSidebar(false);
  };

  // NEW: Switch between chat sessions
  const switchSession = (sessionId) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setMessages(session.messages);
      setShowSessionSidebar(false);
    }
  };

  // NEW: Update session title based on first message
  const updateSessionTitle = (sessionId, firstMessage) => {
    setChatSessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? {
              ...session,
              title: firstMessage.substring(0, 30) + (firstMessage.length > 30 ? '...' : ''),
              updatedAt: new Date().toISOString()
            }
          : session
      )
    );
  };

  // NEW: Delete a chat session
  const deleteSession = (sessionId, e) => {
    e.stopPropagation();
    
    setChatSessions(prev => prev.filter(session => session.id !== sessionId));
    
    if (sessionId === currentSessionId) {
      if (chatSessions.length > 1) {
        const otherSession = chatSessions.find(s => s.id !== sessionId);
        if (otherSession) {
          switchSession(otherSession.id);
        }
      } else {
        createNewSession();
      }
    }
  };

  // Voice Recording Function
  const toggleRecording = () => {
    if (!recognition) {
      setMessages(prev => [...prev, {
        sender: "ai",
        text: "Speech recognition is not supported in your browser. Please try Chrome or Edge.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  // 🚨 MODIFIED: File Upload Handler - Knowledge base mein bhi add karega
// Puri handleFileUpload function ko yeh se replace karo:

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // File validation
  const validTypes = ['application/pdf', 'text/plain', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
  if (!validTypes.includes(file.type)) {
    alert('Please upload PDF, TXT, or DOCX files only.');
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    alert('File size should be less than 10MB.');
    return;
  }

  setUploadedFile(file);
  setShowFileUpload(false);
  setLoading(true);

  try {
    // Add to knowledge base
    const knowledgeRes = await uploadDocument(file);
    
    // Get summary
    const summaryRes = await summarizeDocument(file);

    const summaryMsg = {
      sender: "ai",
      text: `📚 **Document Added to Knowledge Base**\n\n**File:** ${file.name}\n**Chunks Processed:** ${knowledgeRes.chunks_added}\n\n**📄 Document Summary:**\n${summaryRes.summary}\n\nYou can now ask questions about this document!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const newMessages = [...messages, summaryMsg];
    setMessages(newMessages);
    
    if (currentSessionId) {
      setChatSessions(prev => 
        prev.map(session => 
          session.id === currentSessionId 
            ? { ...session, messages: newMessages }
            : session
        )
      );
    }

  } catch (error) {
    console.error('File Upload Error:', error);
    
    const errorMsg = {
      sender: "ai",
      text: `❌ Sorry, I couldn't process the document "${file.name}". Please try a different file.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const newMessages = [...messages, errorMsg];
    setMessages(newMessages);
    
    if (currentSessionId) {
      setChatSessions(prev => 
        prev.map(session => 
          session.id === currentSessionId 
            ? { ...session, messages: newMessages }
            : session
        )
      );
    }
  }
  
  setLoading(false);
};

  // Legal Jargon Detection
  const detectLegalJargon = (text) => {
    const foundTerms = [];
    Object.keys(legalDictionary).forEach(term => {
      if (text.toLowerCase().includes(term.toLowerCase())) {
        foundTerms.push(term);
      }
    });
    return foundTerms;
  };

  // 🚨 MODIFIED: handleSend function - RAG endpoint use karega
// Puri handleSend function ko yeh nayi function se replace karo:

const handleSend = async () => {
  if (!input.trim() || loading) return;

  const userMsg = { 
    sender: "user", 
    text: input,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  if (!currentSessionId) {
    createNewSession();
  }

  const newMessages = [...messages, userMsg];
  setMessages(newMessages);
  setInput("");
  setLoading(true);

  if (currentSessionId) {
    setChatSessions(prev => 
      prev.map(session => 
        session.id === currentSessionId 
          ? { ...session, messages: newMessages }
          : session
      )
    );

    if (messages.length === 0) {
      updateSessionTitle(currentSessionId, input);
    }
  }

  try {
    // RAG API call
    const ragResponse = await ragChat(input);
    
    let aiResponse = ragResponse.answer;
    
    // Jargon detection
    const foundJargon = detectLegalJargon(input);
    if (foundJargon.length > 0) {
      aiResponse += "\n\n📚 **Legal Terms Explained:**\n";
      foundJargon.forEach(term => {
        const jargon = legalDictionary[term];
        aiResponse += `\n**${jargon.term}**: ${jargon.simple}\n`;
      });
    }

    const aiMsg = { 
      sender: "ai", 
      text: aiResponse,
      sources: ragResponse.sources,
      hasContext: ragResponse.has_context,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const finalMessages = [...newMessages, aiMsg];
    setMessages(finalMessages);

    if (currentSessionId) {
      setChatSessions(prev => 
        prev.map(session => 
          session.id === currentSessionId 
            ? { ...session, messages: finalMessages }
            : session
        )
      );
    }

  } catch (ragError) {
    console.error('RAG Error:', ragError);
    
    try {
      // Fallback to basic chat
      const basicResponse = await basicChat(input);
      
      let aiResponse = basicResponse.answer;
      
      const foundJargon = detectLegalJargon(input);
      if (foundJargon.length > 0) {
        aiResponse += "\n\n📚 **Legal Terms Explained:**\n";
        foundJargon.forEach(term => {
          const jargon = legalDictionary[term];
          aiResponse += `\n**${jargon.term}**: ${jargon.simple}\n`;
        });
      }

      const aiMsg = { 
        sender: "ai", 
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalMessages = [...newMessages, aiMsg];
      setMessages(finalMessages);

      if (currentSessionId) {
        setChatSessions(prev => 
          prev.map(session => 
            session.id === currentSessionId 
              ? { ...session, messages: finalMessages }
              : session
          )
        );
      }

    } catch (fallbackError) {
      console.error('Fallback Error:', fallbackError);
      
      const errorMsg = { 
        sender: "ai", 
        text: "I apologize, but I'm having trouble connecting right now. Please check your internet connection and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalMessages = [...newMessages, errorMsg];
      setMessages(finalMessages);

      if (currentSessionId) {
        setChatSessions(prev => 
          prev.map(session => 
            session.id === currentSessionId 
              ? { ...session, messages: finalMessages }
              : session
          )
        );
      }
    }
  }
  
  setLoading(false);
};

  // NEW: Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  // Session Sidebar Component
  const SessionSidebar = () => (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      className="fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 z-40 shadow-xl"
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Chat History</h2>
          <button
            onClick={() => setShowSessionSidebar(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <button
          onClick={createNewSession}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-120px)] p-4">
        {chatSessions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p>No chat history yet</p>
            <p className="text-sm">Start a new conversation!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {chatSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => switchSession(session.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  currentSessionId === session.id
                    ? 'bg-blue-50 border-blue-200 shadow-sm'
                    : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-800 text-sm line-clamp-1 flex-1">
                    {session.title}
                  </h3>
                  <button
                    onClick={(e) => deleteSession(session.id, e)}
                    className="text-gray-400 hover:text-red-500 transition-colors ml-2 flex-shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>
                    {session.messages.length} messages
                  </span>
                  <span>
                    {formatDate(session.updatedAt)}
                  </span>
                </div>
                
                {session.messages.length > 0 && (
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                    {session.messages[session.messages.length - 1]?.text}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 h-[80vh] flex flex-col">
      {/* Session Sidebar Overlay */}
      {showSessionSidebar && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setShowSessionSidebar(false)}
          />
          <AnimatePresence>
            <SessionSidebar />
          </AnimatePresence>
        </>
      )}

      {/* File Upload Modal */}
      {showFileUpload && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowFileUpload(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">Upload Legal Document</h3>
            <p className="text-gray-600 mb-4">Upload a document for LegalSetu to analyze and summarize.</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt"
              className="w-full border border-gray-300 rounded-xl p-3 mb-4"
            />
            <div className="flex gap-3">
              <Button
                onClick={() => setShowFileUpload(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                Choose File
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* MODIFIED: Chat Header with Session Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          {/* Session History Button */}
          <button
            onClick={() => setShowSessionSidebar(true)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-2 text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-sm">History</span>
          </button>

          {/* Center Logo/Title */}
          <div className="flex items-center justify-center space-x-3 flex-1">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <BotIcon />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                LegalSetu Assistant
              </h2>
              <p className="text-l text-blue-100 max-w-3xl mx-auto leading-relaxed">AI Legal Research Specialist</p>
            </div>
          </div>

          {/* New Chat Button */}
          <button
            onClick={createNewSession}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-2 text-gray-600"
            disabled={loading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm">New</span>
          </button>
        </div>

        {/* Current Session Info */}
        {currentSessionId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-sm text-gray-600">
              {chatSessions.find(s => s.id === currentSessionId)?.title}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto mb-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
        <div className="p-6 h-full">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center h-full flex flex-col items-center justify-center"
            >
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <BotIcon />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Welcome to Legalsetu Legal Assistant
              </h3>
              <p className="text-gray-600 mb-8 max-w-md">
                I'm here to help with your legal questions. Ask me about contracts, intellectual property, case law, or any legal topic.
              </p>
              
              {/* Legal Templates */}
              <div className="grid gap-3 w-full max-w-md mb-6">
                <h4 className="font-semibold text-gray-700 mb-2">Quick Legal Templates</h4>
                {legalTemplates.map((template, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setInput(template.prompt)}
                    className="text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 hover:border-blue-300 transition-all duration-200 text-blue-700 hover:text-blue-800"
                  >
                    <span className="text-lg mr-2">{template.icon}</span>
                    {template.text}
                  </motion.button>
                ))}
              </div>
              
              {/* Suggested Questions */}
              <div className="grid gap-3 w-full max-w-md">
                <h4 className="font-semibold text-gray-700 mb-2">Suggested Questions</h4>
                {suggestedQuestions.map((question, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setInput(question)}
                    className="text-left p-4 bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 text-gray-700 hover:text-blue-700"
                  >
                    {question}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"} items-start space-x-3`}>
                      {/* Avatar */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        msg.sender === "user" 
                          ? "bg-blue-600 text-white" 
                          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      }`}>
                        {msg.sender === "user" ? <UserIcon /> : <BotIcon />}
                      </div>
                      
                      {/* Message Bubble */}
                      <div className={`rounded-2xl p-4 ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200"
                      }`}>
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        
                        {/* 🚨 SOURCES SECTION - Only for AI messages with sources */}
                        {msg.sender === "ai" && msg.sources && msg.sources.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-gray-300">
                            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <span className="mr-2">📚</span>
                              Sources:
                            </p>
                            <div className="space-y-2">
                              {msg.sources.map((source, idx) => (
                                                                  <div key={idx} className="text-xs text-gray-600 bg-white p-2 rounded-lg border border-gray-200">
                                    <p className="font-medium">{source.document || `Source ${idx + 1}`}</p>
                                    {source.page && <p className="text-gray-500">Page: {source.page}</p>}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Context Indicator */}
                        {msg.sender === "ai" && msg.hasContext && (
                          <div className="mt-2 text-xs text-emerald-600 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Answer based on your uploaded documents
                          </div>
                        )}
                        
                        <span className={`text-xs block mt-2 ${
                          msg.sender === "user" ? "text-blue-200" : "text-gray-500"
                        }`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading Indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-3 max-w-[85%]">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white">
                      <BotIcon />
                    </div>
                    <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-none p-4 border border-gray-200">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4"
      >
        {/* File Upload Status */}
        {uploadedFile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <FileTextIcon />
              <div>
                <p className="font-medium text-sm text-blue-800">{uploadedFile.name}</p>
                <p className="text-xs text-blue-600">Ready for analysis</p>
              </div>
            </div>
            <button
              onClick={() => setUploadedFile(null)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}

        <div className="flex space-x-3">
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={toggleRecording}
              disabled={loading}
              className={`p-3 rounded-xl border transition-all duration-200 ${
                isRecording 
                  ? 'bg-red-100 border-red-300 text-red-600 animate-pulse' 
                  : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title="Voice Input"
            >
              <MicIcon recording={isRecording} />
            </button>

            <button
              onClick={() => setShowFileUpload(true)}
              disabled={loading}
              className="p-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Upload Document"
            >
              <UploadIcon />
            </button>
          </div>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask any legal question or describe your issue..."
              disabled={loading}
              rows="1"
              className="w-full border border-gray-300 rounded-xl p-4 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minHeight: '56px', maxHeight: '120px' }}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <SendIcon />
            )}
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
          <div className="flex space-x-4">
            <span>Press Enter to send</span>
            <span>Shift + Enter for new line</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Secure & Confidential</span>
          </div>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-4"
      >
        <p className="text-xs text-gray-200">
          ⚖️ LegalSetu provides legal information, not legal advice. Consult a qualified attorney for specific legal matters.
        </p> 
      </motion.div>
    </div>
  );
}


