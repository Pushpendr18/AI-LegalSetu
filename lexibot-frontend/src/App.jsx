///////////////////****************************************************************************** */

import AnalyticsDashboard from "./components/AnalyticsDashboard";
import ContractGenerator from "./components/ContractGenerator";
import ChatBot from "./components/ChatBot";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";

import axios from "axios";

axios.defaults.baseURL = "http://127.0.0.1:8000";

// Enhanced UI Components
const Button = ({ children, onClick, className = "", disabled = false, variant = "primary" }) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    outline: "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 md:px-6 md:py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "", hover = false }) => (
  <div className={`bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200 transition-all duration-300 ${hover ? "hover:shadow-xl hover:border-blue-300" : ""} ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children }) => <div className="p-2">{children}</div>;

// Enhanced Icons with proper styling
const SendIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const FileTextIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const BarChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const MessageSquareIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export default function LegalSetuApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [docAnswer, setDocAnswer] = useState("");
  

  // Login / Signup states
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    
    try {
      const res = await axios.post("/api/ask-query", { query: input });
      const aiMsg = { sender: "ai", text: res.data.answer };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg = { sender: "ai", text: "Sorry, I encountered an error. Please try again." };
      setMessages(prev => [...prev, errorMsg]);
    }
    
    setLoading(false);
  };

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    
    setFile(uploadedFile);
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      const res = await axios.post("/api/summarize", formData);
      setSummary(res.data.summary);
    } catch (error) {
      setSummary("Error summarizing file. Please try again with a different file.");
    }
    
    setLoading(false);
  };

  const handleAskFromDocument = async () => {
    if (!file) return alert("Upload a file first!");
    if (!input.trim()) return alert("Enter your question!");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("query", input);

      const res = await axios.post("/api/ask-doc-query", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setDocAnswer(res.data.answer);
    } catch (error) {
      alert("Error fetching answer from document.");
    }
    setLoading(false);
  };

  const handleFileClassify = async () => {
    if (!file) return alert("Upload a file first!");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/api/classify", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = res.data;
      alert(`Category: ${data.category || "N/A"}\nConfidence: ${data.confidence || 0}`);
    } catch (error) {
      alert("Error classifying file. Try again.");
    }

    setLoading(false);
  };

  // Enhanced sample data for charts
  const performanceData = [
    { metric: "Accuracy", value: 92 },
    { metric: "Response Time", value: 85 },
    { metric: "User Satisfaction", value: 95 },
    { metric: "Case Relevance", value: 88 }
  ];

  const caseLawData = [
    { case: "Smith v. Jones", citations: 15 },
    { case: "Doe v. State", citations: 9 },
    { case: "Brown Corp", citations: 12 },
    { case: "Wilson Appeal", citations: 6 },
    { case: "Taylor Ltd", citations: 8 },
    { case: "Miller Case", citations: 11 }
  ];

  const caseTypeData = [
    { name: "Civil", value: 35 },
    { name: "Criminal", value: 25 },
    { name: "Corporate", value: 20 },
    { name: "Family", value: 15 },
    { name: "Other", value: 5 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Enhanced Modal Rendering
  const renderModal = (type) => {
    const isLogin = type === "login";

    const handleSubmit = async () => {
      if (isLogin) {
        // LOGIN API
        try {
          const res = await axios.post("/api/login", {
            email: loginData.email,
            password: loginData.password,
          });

          localStorage.setItem("token", res.data.access_token);
          alert("Login successful!");

          setShowLogin(false);
          setLoginData({ email: "", password: "" });
        } catch (err) {
          alert(err.response?.data?.detail || "Invalid credentials!");
        }
      } else {
        // SIGNUP API
        try {
          if (signupData.password !== signupData.confirmPassword) {
            alert("Passwords do not match!");
            return;
          }

          const res = await axios.post("/api/signup", {
            name: signupData.name,
            email: signupData.email,
            password: signupData.password,
          });

          alert("Signup successful! You can login now.");

          setShowSignup(false);
          setSignupData({ name: "", email: "", password: "", confirmPassword: "" });

        } catch (err) {
          alert(err.response?.data?.detail || "Signup failed!");
        }
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
      >
        <div 
          className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
          onClick={() => isLogin ? setShowLogin(false) : setShowSignup(false)}
        ></div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="relative bg-white rounded-2xl p-6 md:p-8 w-full max-w-md z-50 shadow-2xl border border-gray-100"
        >
          <button
            className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-400 hover:text-gray-600 text-xl font-bold transition-colors"
            onClick={() => (isLogin ? setShowLogin(false) : setShowSignup(false))}
          >
            ✕
          </button>

          <div className="text-center mb-4 md:mb-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <UserIcon />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">{isLogin ? "Welcome Back" : "Create Account"}</h2>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              {isLogin ? "Sign in to your account" : "Join LegalSetu today"}
            </p>
          </div>

          <div className="flex flex-col gap-3 md:gap-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm md:text-base"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={isLogin ? loginData.email : signupData.email}
                onChange={(e) =>
                  isLogin
                    ? setLoginData({ ...loginData, email: e.target.value })
                    : setSignupData({ ...signupData, email: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm md:text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={isLogin ? loginData.password : signupData.password}
                onChange={(e) =>
                  isLogin
                    ? setLoginData({ ...loginData, password: e.target.value })
                    : setSignupData({ ...signupData, password: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm md:text-base"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm md:text-base"
                />
              </div>
            )}

            <Button
              onClick={handleSubmit}
              className={`w-full py-2 md:py-3 rounded-xl font-semibold text-sm md:text-base ${isLogin ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
            >
              {isLogin ? "Sign In" : "Create Account"}
            </Button>

            <p className="text-center text-gray-600 text-xs md:text-sm mt-3 md:mt-4">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => isLogin ? (setShowLogin(false), setShowSignup(true)) : (setShowSignup(false), setShowLogin(true))}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const renderContracts = () => (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 md:mb-12"
      >
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">
          Contract Generator
        </h2>
        <p className="text-blue-100 text-sm md:text-lg max-w-2xl mx-auto">
          Create professional legal contracts instantly with AI-powered templates
        </p>
      </motion.div>

      <ContractGenerator />
    </div>
  );

  // Enhanced Tab rendering functions
  const renderHome = () => (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 md:mb-16 px-3 md:px-4"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 md:mb-6 border border-white/20">
          <span className="text-2xl md:text-3xl text-white">⚖️</span>
        </div>
        <h1 className="text-2xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
          Welcome to LegalSetu
        </h1>
        <p className="text-base md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed px-2 md:px-4">
          Your intelligent AI legal assistant for instant legal insights, document analysis, 
          and comprehensive case law research powered by cutting-edge artificial intelligence.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-16">
        {[
          {
            icon: "💬",
            title: "Ask Legal Questions",
            description: "Get instant AI-powered responses to your legal queries with relevant case references and citations.",
            bgColor: "bg-blue-100"
          },
          {
            icon: "📄", 
            title: "Document Analysis",
            description: "Upload legal documents and receive comprehensive summaries, key insights, and actionable recommendations.",
            bgColor: "bg-emerald-100"
          },
          {
            icon: "📊",
            title: "Legal Analytics",
            description: "Track performance metrics and explore case law trends with interactive, real-time dashboards.",
            bgColor: "bg-purple-100"
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="text-center p-4 md:p-6 h-full">
              <div className={`w-12 h-12 md:w-16 md:h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <span className="text-xl md:text-2xl">{feature.icon}</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">{feature.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-12 border border-white/20 text-center">
          <h2 className="text-xl md:text-3xl font-bold text-white mb-3 md:mb-4">
            Ready to Transform Your Legal Research?
          </h2>
          <p className="text-blue-100 mb-6 md:mb-8 text-base md:text-lg max-w-2xl mx-auto">
            Join thousands of legal professionals who trust LegalSetu for accurate, 
            fast, and reliable legal assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <button 
              onClick={() => setActiveTab("chat")}
              className="bg-white text-blue-900 px-4 py-3 md:px-8 md:py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors text-base md:text-lg"
            >
              Start Chatting
            </button>
            <button 
              onClick={() => setActiveTab("docs")}
              className="bg-transparent border-2 border-white text-white px-4 py-3 md:px-8 md:py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors text-base md:text-lg"
            >
              Upload Document
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderDocs = () => (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 md:mb-12"
      >
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">
          Document Analysis
        </h2>
        <p className="text-blue-100 text-sm md:text-lg">
          Upload and analyze legal documents with AI-powered precision
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="p-4 md:p-6 h-full">
            <div className="text-center mb-4 md:mb-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                <UploadIcon />
              </div>
              <h3 className="text-lg md:text-2xl font-semibold mb-2 text-gray-800">Upload Legal Document</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Upload contracts, case files, or legal documents for AI-powered analysis
              </p>
            </div>
            
            <div className="space-y-4 md:space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl md:rounded-2xl p-4 md:p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={loading}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer block"
                >
                  <UploadIcon />
                  <p className="mt-3 md:mt-4 font-medium text-gray-700 text-sm md:text-base">Choose a file or drag & drop</p>
                  <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">PDF, DOC, DOCX up to 10MB</p>
                </label>
              </div>

              {file && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <FileTextIcon />
                      <div>
                        <p className="font-medium text-green-800 text-sm md:text-base">{file.name}</p>
                        <p className="text-xs md:text-sm text-green-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                <Button 
                  onClick={handleFileUpload} 
                  disabled={!file || loading}
                  className="flex-1"
                >
                  {loading ? "Analyzing..." : "Summarize Document"}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4 md:space-y-8"
        >
          {/* Document Question Section */}
          {file && (
            <Card className="p-4 md:p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <h3 className="text-base md:text-lg font-semibold text-purple-800 mb-3 md:mb-4 flex items-center">
                <MessageSquareIcon />
                <span className="ml-2">Ask About This Document</span>
              </h3>
              <div className="space-y-3 md:space-y-4">
                <input
                  type="text"
                  placeholder="What would you like to know about this document?"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm md:text-base"
                  onKeyPress={(e) => e.key === 'Enter' && handleAskFromDocument()}
                />
                <Button
                  onClick={handleAskFromDocument}
                  disabled={!file || loading || !input.trim()}
                  variant="outline"
                  className="w-full"
                >
                  {loading ? "Thinking..." : "Ask Question"}
                </Button>
              </div>
            </Card>
          )}

          {/* Results Sections */}
          <AnimatePresence>
            {summary && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card>
                  <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center text-gray-800">
                    <FileTextIcon />
                    <span className="ml-2">Document Summary</span>
                  </h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-3 md:p-4 text-sm md:text-base">
                      {summary}
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}

            {docAnswer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="border-purple-300 bg-purple-50">
                  <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-purple-700 flex items-center">
                    <MessageSquareIcon />
                    <span className="ml-2">AI Analysis</span>
                  </h3>
                  <div className="bg-white rounded-xl p-3 md:p-4 border border-purple-200">
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">{docAnswer}</p>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {loading && (
            <Card className="p-6 md:p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-blue-600 mx-auto mb-3 md:mb-4"></div>
              <p className="text-gray-600 text-sm md:text-base">Analyzing document with AI...</p>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
  const renderAnalytics = () => (
  <div className="max-w-7xl mx-auto p-4 md:p-6">
    <AnalyticsDashboard />
  </div>
);
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-xl flex items-center justify-center">
                <span className="text-blue-900 font-bold text-lg md:text-xl">⚖️</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">LegalSetu</h1>
                <p className="text-blue-200 text-xs md:text-sm">AI Legal Assistant</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {[
                { id: "home", label: "Home", icon: HomeIcon },
                { id: "chat", label: "AI Chat", icon: MessageSquareIcon },
                { id: "docs", label: "Documents", icon: FileTextIcon },
                { id: "analytics", label: "Analytics", icon: BarChartIcon },
                { id: "contracts", label: "Contracts", icon: FileTextIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-white text-blue-900 shadow-lg"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  <tab.icon />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-white p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Button
                onClick={() => setShowLogin(true)}
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Sign In
              </Button>
              <Button
                onClick={() => setShowSignup(true)}
                className="bg-green text-blue-900 hover:bg-blue-50"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden bg-white/5 backdrop-blur-lg border-t border-white/10">
          <div className="flex overflow-x-auto py-2 px-4 space-x-2">
            {["home", "chat", "docs", "analytics", "contracts"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-white text-blue-900"
                    : "text-white hover:bg-white/20"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "home" && renderHome()}
            {/* {activeTab === "chat" && renderChat()} */}
            {activeTab === "chat" && <ChatBot />}

            {activeTab === "docs" && renderDocs()}
            {activeTab === "analytics" && renderAnalytics()}
            {activeTab === "contracts" && renderContracts()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 mt-16 md:mt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-blue-900 font-bold">⚖️</span>
                </div>
                <h2 className="text-xl font-bold text-white">LegalSetu</h2>
              </div>
              <p className="text-blue-200 text-sm md:text-base leading-relaxed max-w-md">
                Empowering legal professionals with AI-driven insights, document analysis, 
                and comprehensive legal research tools for the modern era.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4 text-lg">Features</h3>
              <ul className="space-y-2 text-blue-200 text-sm md:text-base">
                <li><button onClick={() => setActiveTab("chat")} className="hover:text-white transition-colors">AI Legal Chat</button></li>
                <li><button onClick={() => setActiveTab("docs")} className="hover:text-white transition-colors">Document Analysis</button></li>
                <li><button onClick={() => setActiveTab("contracts")} className="hover:text-white transition-colors">Contract Generator</button></li>
                <li><button onClick={() => setActiveTab("analytics")} className="hover:text-white transition-colors">Legal Analytics</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4 text-lg">Support</h3>
              <ul className="space-y-2 text-blue-200 text-sm md:text-base">
                <li><button className="hover:text-white transition-colors">Help Center</button></li>
                <li><button className="hover:text-white transition-colors">Contact Us</button></li>
                <li><button className="hover:text-white transition-colors">Privacy Policy</button></li>
                <li><button className="hover:text-white transition-colors">Terms of Service</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 md:mt-12 pt-6 md:pt-8 text-center">
            <p className="text-blue-200 text-sm md:text-base">
              © 2024 LegalSetu. All rights reserved. AI-powered legal assistance.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modals */}
      <AnimatePresence>
        {showLogin && renderModal("login")}
        {showSignup && renderModal("signup")}
      </AnimatePresence>
    </div>
  );
}