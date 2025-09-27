import React, { useState, useRef, useEffect } from 'react';
import './SupportChatbot.css';

const SupportChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);
  const [messages, setMessages] = useState(() => {
    // Try to load previous messages from localStorage
    const savedMessages = localStorage.getItem('chatbotMessages');
    if (savedMessages) {
      try {
        // Parse stored messages and convert timestamp strings back to Date objects
        const parsedMessages = JSON.parse(savedMessages).map(msg => ({
          ...msg, 
          timestamp: new Date(msg.timestamp)
        }));
        return parsedMessages;
      } catch (e) {
        console.error("Error loading saved chat messages:", e);
      }
    }
    // Default initial message
    return [{ text: "Hello! I'm your Blood Bank Assistant. How can I help you today?", sender: 'bot', timestamp: new Date() }];
  });
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Check for donation eligibility date in localStorage
  useEffect(() => {
    const nextDonationDate = localStorage.getItem('nextDonationDate');
    
    if (nextDonationDate) {
      const nextDate = new Date(nextDonationDate);
      const today = new Date();
      
      // If the next donation date is within 7 days, show notification
      if (nextDate > today && (nextDate - today) / (1000 * 60 * 60 * 24) < 7) {
        setHasNotification(true);
        
        // Show the banner periodically
        const interval = setInterval(() => {
          if (!isOpen) {
            setShowNotificationBanner(true);
            setTimeout(() => {
              setShowNotificationBanner(false);
            }, 5000);
          }
        }, 30000); // Show every 30 seconds
        
        return () => clearInterval(interval);
      }
    }
  }, [isOpen]);

  // Predefined responses for common blood donation and recipient questions
  const responses = {
    donation: {
      eligibility: "To donate blood, you generally need to be at least 18 years old, weigh at least 50kg, and be in good health. Some medical conditions or medications might make you ineligible.",
      process: "The blood donation process takes about 30-45 minutes. It involves registration, mini health check, actual donation (8-10 minutes), and a short rest period afterward.",
      preparation: "Before donating blood, make sure you're well-hydrated, have eaten a healthy meal, and get adequate sleep. Avoid fatty foods, alcohol, and smoking before donation.",
      frequency: "You can donate whole blood every 3 months (12 weeks). This gives your body time to replenish the red blood cells."
    },
    recipient: {
      request: "To request blood, you need to submit a request through our platform with the required blood type, quantity, and medical purpose. Our team will process your request as soon as possible.",
      compatibility: "Blood compatibility is crucial. Type O- is the universal donor, while AB+ is the universal recipient. However, matching blood types is always preferred for transfusions.",
      emergency: "For emergency blood requests, please call our emergency hotline at +91 8544058609 available 24/7.",
      cost: "There may be processing fees associated with blood requests. Please contact our center for specific details on costs."
    },
    general: {
      location: "Our Blood Bank Center is located near District Hospital, Gajipur, Nalanda, Bihar 805105, India.",
      hours: "Our operating hours are Monday to Friday: 9AM-6PM and Weekends: 10AM-4PM.",
      contact: "You can contact us at +91 9142552982 or email us at abhishek842634@gmail.com.",
      appointment: "You can schedule a donation appointment through our website or by calling our center directly."
    },
    bloodTypes: {
      compatibility: "Here's a quick guide to blood type compatibility:\n\n" +
        "🅾️ Type O- : Universal donor (can donate to all blood types)\n" +
        "🅾️ Type O+ : Can donate to O+, A+, B+, AB+\n" +
        "🅰️ Type A- : Can donate to A-, A+, AB-, AB+\n" +
        "🅰️ Type A+ : Can donate to A+, AB+\n" +
        "🅱️ Type B- : Can donate to B-, B+, AB-, AB+\n" +
        "🅱️ Type B+ : Can donate to B+, AB+\n" +
        "🆎 Type AB- : Can donate to AB-, AB+\n" +
        "🆎 Type AB+ : Universal recipient (can receive all blood types)",
      donorMatch: "If you're a donor, here's who can receive your blood:\n\n" +
        "- Type O-: O-, O+, A-, A+, B-, B+, AB-, AB+\n" +
        "- Type O+: O+, A+, B+, AB+\n" +
        "- Type A-: A-, A+, AB-, AB+\n" +
        "- Type A+: A+, AB+\n" +
        "- Type B-: B-, B+, AB-, AB+\n" +
        "- Type B+: B+, AB+\n" +
        "- Type AB-: AB-, AB+\n" +
        "- Type AB+: AB+",
      recipientMatch: "If you need blood, here's who can donate to you:\n\n" +
        "- If you're O-: Only O-\n" +
        "- If you're O+: O-, O+\n" +
        "- If you're A-: O-, A-\n" +
        "- If you're A+: O-, O+, A-, A+\n" +
        "- If you're B-: O-, B-\n" +
        "- If you're B+: O-, O+, B-, B+\n" +
        "- If you're AB-: O-, A-, B-, AB-\n" +
        "- If you're AB+: Anyone can donate to you (universal recipient)",
      rarity: "Blood type rarity (from most common to rarest):\n" +
        "1. O+ (38%)\n" +
        "2. A+ (34%)\n" +
        "3. B+ (9%)\n" +
        "4. O- (7%)\n" +
        "5. A- (6%)\n" +
        "6. AB+ (3%)\n" +
        "7. B- (2%)\n" +
        "8. AB- (1%)\n\n" +
        "Rh-negative blood types (O-, A-, B-, AB-) are less common and often in high demand."
    },
    emergency: {
      immediate: "For life-threatening emergencies requiring immediate blood transfusion, please:\n\n" +
        "1. Call our 24/7 EMERGENCY HOTLINE: +91 8544058609\n" +
        "2. Provide patient details, blood type, and location\n" +
        "3. We will arrange priority dispatch of blood products\n\n" +
        "DO NOT WAIT - call immediately while arranging hospital transport.",
      hospital: "If the patient is already at a hospital, ask the hospital staff to contact us directly through our hospital integration system for the fastest response.",
      transport: "We offer emergency blood transport services in coordination with local hospitals. In critical situations, we can dispatch blood products via our rapid response team.",
      trauma: "For trauma situations where blood type is unknown, we maintain emergency supplies of O-negative blood (universal donor) at all times."
    }
  };

  // Function to handle sending messages
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputText.trim() === '') return;

    // Add user message to chat
    const newUserMessage = { text: inputText, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    
    // Show bot is typing indicator
    setIsTyping(true);
    
    // Process the message and respond after a short delay
    setTimeout(() => {
      const botResponse = generateResponse(inputText);
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot', timestamp: new Date() }]);
      setIsTyping(false);
    }, 1000);
  };

  // Function to generate responses based on user input
  const generateResponse = (input) => {
    const normalizedInput = input.toLowerCase();
    
    // Check for donation related queries
    if (normalizedInput.includes('eligible') || normalizedInput.includes('can i donate')) {
      return responses.donation.eligibility;
    } else if (normalizedInput.includes('donation process') || normalizedInput.includes('how to donate')) {
      return responses.donation.process;
    } else if (normalizedInput.includes('prepare') || normalizedInput.includes('before donating')) {
      return responses.donation.preparation;
    } else if (normalizedInput.includes('how often') || normalizedInput.includes('frequency')) {
      return responses.donation.frequency;
    } else if (normalizedInput.includes('just donated') || normalizedInput.includes('donated today') || normalizedInput.includes('set reminder')) {
      return setupDonationReminder(3); // 3 months reminder
    } else if (normalizedInput.includes('next donation') || normalizedInput.includes('when can i donate again')) {
      const nextDonationDate = localStorage.getItem('nextDonationDate');
      if (nextDonationDate) {
        const formattedDate = new Date(nextDonationDate).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        });
        return `Based on your last donation, you'll be eligible to donate again on ${formattedDate}.`;
      } else {
        return "I don't have your donation history yet. If you've recently donated, you can tell me 'I just donated' to set up a reminder.";
      }
    }
    
    // Check for blood type compatibility queries
    else if ((normalizedInput.includes('compatibility') || normalizedInput.includes('compatible')) && normalizedInput.includes('blood type')) {
      return responses.bloodTypes.compatibility;
    } else if (normalizedInput.includes('donor match') || (normalizedInput.includes('who') && normalizedInput.includes('donate') && normalizedInput.includes('to'))) {
      return responses.bloodTypes.donorMatch;
    } else if (normalizedInput.includes('recipient match') || (normalizedInput.includes('who') && normalizedInput.includes('donate') && normalizedInput.includes('me'))) {
      return responses.bloodTypes.recipientMatch;
    } else if (normalizedInput.includes('rare') || normalizedInput.includes('common') || normalizedInput.includes('percentage')) {
      return responses.bloodTypes.rarity;
    }
    
    // Check for emergency related queries
    else if ((normalizedInput.includes('emergency') || normalizedInput.includes('urgent')) && (normalizedInput.includes('immediate') || normalizedInput.includes('critical'))) {
      return responses.emergency.immediate;
    } else if ((normalizedInput.includes('emergency') || normalizedInput.includes('urgent')) && normalizedInput.includes('hospital')) {
      return responses.emergency.hospital;
    } else if ((normalizedInput.includes('emergency') || normalizedInput.includes('urgent')) && normalizedInput.includes('transport')) {
      return responses.emergency.transport;
    } else if (normalizedInput.includes('trauma') || normalizedInput.includes('accident')) {
      return responses.emergency.trauma;
    }
    
    // Check for recipient related queries
    else if (normalizedInput.includes('need blood') || normalizedInput.includes('request blood')) {
      return responses.recipient.request;
    } else if (normalizedInput.includes('compatibility') || normalizedInput.includes('blood type')) {
      return responses.bloodTypes.compatibility;
    } else if (normalizedInput.includes('emergency')) {
      return responses.emergency.immediate;
    } else if (normalizedInput.includes('cost') || normalizedInput.includes('fee')) {
      return responses.recipient.cost;
    }
    
    // Check for general queries
    else if (normalizedInput.includes('where') || normalizedInput.includes('location')) {
      return responses.general.location;
    } else if (normalizedInput.includes('hour') || normalizedInput.includes('time') || normalizedInput.includes('when')) {
      return responses.general.hours;
    } else if (normalizedInput.includes('contact') || normalizedInput.includes('phone') || normalizedInput.includes('email')) {
      return responses.general.contact;
    } else if (normalizedInput.includes('appointment') || normalizedInput.includes('schedule')) {
      return responses.general.appointment;
    }
    
    // Default response
    else {
      return "I'm not sure I understand your question. You can ask about donation eligibility, blood type compatibility, emergency procedures, requesting blood, our location, or how to contact us.";
    }
  };

  // Auto scroll to the bottom of the chat when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Save messages to localStorage whenever they change
    const messagesToSave = JSON.stringify(messages);
    localStorage.setItem('chatbotMessages', messagesToSave);
  }, [messages]);

  // Format time for chat messages
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Set up next donation date
  const setupDonationReminder = (months) => {
    const today = new Date();
    const nextDonationDate = new Date(today);
    nextDonationDate.setMonth(today.getMonth() + months);
    
    localStorage.setItem('nextDonationDate', nextDonationDate.toISOString());
    localStorage.setItem('lastDonationDate', today.toISOString());
    
    const formattedDate = nextDonationDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return `I've set a reminder for your next donation eligibility date: ${formattedDate}. I'll remind you as the date approaches.`;
  };

  return (
    <div className="chatbot-container">
      {/* Chat toggle button */}
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''} ${hasNotification ? 'has-notification' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle support chat"
      >
        {isOpen ? (
          <i className="fas fa-times"></i>
        ) : (
          <>
            <i className="fas fa-comment-medical"></i>
            <span className="chatbot-toggle-text">Support</span>
            {hasNotification && <span className="notification-dot"></span>}
          </>
        )}
      </button>
      
      {/* Notification banner */}
      {showNotificationBanner && !isOpen && hasNotification && (
        <div className="notification-banner">
          <i className="fas fa-calendar-check"></i>
          <p>You're eligible to donate blood soon! Click to check your donation date.</p>
          <button onClick={() => setShowNotificationBanner(false)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <i className="fas fa-heartbeat"></i>
              <span>Blood Bank Assistant</span>
            </div>
            <p className="chatbot-subtitle">Ask questions about donation or receiving blood</p>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                <div className="message-content">
                  {message.text}
                </div>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <form className="chatbot-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your question here..."
              aria-label="Type your message"
            />
            <button type="submit" disabled={inputText.trim() === ''}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
          
          <div className="chatbot-footer">
            <div className="chatbot-footer-options">
              <button 
                className="chatbot-footer-btn" 
                onClick={() => {
                  setMessages([{ 
                    text: "Hello! I'm your Blood Bank Assistant. How can I help you today?", 
                    sender: 'bot', 
                    timestamp: new Date() 
                  }]);
                  localStorage.removeItem('chatbotMessages');
                }}
              >
                Clear Chat
              </button>
              <button 
                className="chatbot-footer-btn"
                onClick={() => {
                  const msg = "What are the eligibility requirements for blood donation?";
                  setInputText(msg);
                  handleSendMessage(new Event('click', {cancelable: true}));
                }}
              >
                Eligibility
              </button>
              <button 
                className="chatbot-footer-btn"
                onClick={() => {
                  const msg = "How do I request blood?";
                  setInputText(msg);
                  handleSendMessage(new Event('click', {cancelable: true}));
                }}
              >
                Request Blood
              </button>
            </div>
            <div className="chatbot-footer-options mt-2">
              <button 
                className="chatbot-footer-btn emergency-btn"
                onClick={() => {
                  const msg = "Emergency blood needed! What should I do?";
                  setInputText(msg);
                  handleSendMessage(new Event('click', {cancelable: true}));
                }}
              >
                🚨 Emergency
              </button>
              <button 
                className="chatbot-footer-btn"
                onClick={() => {
                  const msg = "Show me blood type compatibility";
                  setInputText(msg);
                  handleSendMessage(new Event('click', {cancelable: true}));
                }}
              >
                Blood Types
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportChatbot;