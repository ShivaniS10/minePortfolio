import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, ChevronDown } from 'lucide-react';
import botData from '../data.json';
import { getGeminiResponse } from '../lib/gemini';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: `Hi! I'm Shivani's AI assistant. Feel free to ask me anything about her projects, skills, or experience!`, sender: 'bot', time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastProject, setLastProject] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const query = input;
    const userMessage = { id: Date.now(), text: query, sender: 'user', time: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Try Gemini first
    let response = await getGeminiResponse(query);
    
    // Fallback to local logic if Gemini fails or is not configured
    if (!response) {
      response = generateResponse(query);
    }
    
    setTimeout(() => {
      const botMessage = { id: Date.now() + 1, text: response, sender: 'bot', time: new Date() };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 600);
  };

  const generateResponse = (query) => {
    const q = query.toLowerCase();
    
    // 1. Context-based follow-ups
    if (lastProject && (q.includes('link') || q.includes('live') || q.includes('demo') || q.includes('url'))) {
      if (lastProject.live) {
        return `You can check out the live demo for ${lastProject.title} here: ${lastProject.live}`;
      } else if (lastProject.github) {
        return `I don't have a live link for ${lastProject.title}, but you can see the source code on GitHub: ${lastProject.github}`;
      } else {
        return `I'm sorry, I don't have a link for ${lastProject.title} at the moment.`;
      }
    }

    if (lastProject && (q.includes('more') || q.includes('detail') || q.includes('explain') || q.includes('tell me more'))) {
      return `Sure! For ${lastProject.title}: ${lastProject.description} It was built using ${lastProject.tech}.`;
    }

    // 2. Specific Project Queries
    const project = botData.projects.find(p => q.includes(p.title.toLowerCase().split(' ')[0]) || q.includes(p.title.toLowerCase().split('-')[0].trim()));
    if (project) {
      setLastProject(project);
      let resp = `${project.title}: ${project.description.substring(0, 150)}...`;
      if (project.live) resp += `\n\nLive Link: ${project.live}`;
      return resp;
    }

    // 3. General Queries
    if (q.includes('who are you') || q.includes('about') || q.includes('intro')) {
      return botData.personal.about;
    }
    if (q.includes('project') || q.includes('work') || q.includes('experience')) {
      const projects = botData.projects.map(p => p.title).join(', ');
      return `I've worked on several projects including ${projects}. Which one would you like to hear more about?`;
    }
    if (q.includes('skill') || q.includes('tech') || q.includes('know') || q.includes('language')) {
      return `I'm proficient in languages like ${botData.skills.languages.join(', ')}. My framework expertise includes ${botData.skills.frameworks.join(', ')}.`;
    }
    if (q.includes('contact') || q.includes('reach') || q.includes('email')) {
      return botData.faqs.find(f => f.question.toLowerCase().includes('contact'))?.answer || "You can contact me through the 'Connect' section on this website!";
    }
    if (q.includes('internship')) {
      const exp = botData.experience[0];
      return `I interned at ${exp.company} as a ${exp.role} from ${exp.duration}. ${exp.description}`;
    }

    // 4. Fallback search in FAQs
    const faq = botData.faqs.find(f => q.includes(f.question.toLowerCase().split(' ').slice(-1)[0]));
    if (faq) return faq.answer;

    return "Good catch! I could try to give you a generic answer, but Shivani's actual approach to this is much more interesting. She is currently open to discussing such challenges over a call. Feel free to drop a message in the 'Connect' section to set up a quick meet!";
  };

  const linkify = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: 'inherit', textDecoration: 'underline', fontWeight: 'bold' }}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="chatbot-container">
      {/* Floating Bubble */}
      <motion.button
        className="chatbot-bubble"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <ChevronDown size={24} /> : <MessageSquare size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            {/* Header with Profile Info */}
            <div className="chatbot-header">
              <div className="chatbot-profile">
                <div className="chatbot-avatar-container">
                  <img src="/assets/img/shivani.png" alt="Shivani Singh" className="chatbot-avatar" />
                  <div className="chatbot-status-dot"></div>
                </div>
                <div className="chatbot-info">
                  <h3 className="chatbot-name">{botData.personal.name}</h3>
                  <p className="chatbot-title">AI Assistant • Active Now</p>
                </div>
              </div>
              <button className="chatbot-close" onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="chatbot-messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`chatbot-message-row ${msg.sender}`}>
                  <div className="chatbot-message-content">
                    {msg.sender === 'bot' && <div className="chatbot-msg-icon"><Bot size={14} /></div>}
                    <div className="chatbot-text">{linkify(msg.text)}</div>
                  </div>
                  <div className="chatbot-time">
                    {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="chatbot-message-row bot">
                  <div className="chatbot-message-content typing">
                    <div className="chatbot-typing-dot"></div>
                    <div className="chatbot-typing-dot"></div>
                    <div className="chatbot-typing-dot"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form className="chatbot-input-area" onSubmit={handleSend}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="chatbot-input"
              />
              <button type="submit" className="chatbot-send-btn" disabled={!input.trim()}>
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;
