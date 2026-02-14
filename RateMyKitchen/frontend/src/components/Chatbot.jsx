import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your Virtual Hygiene Inspector. Ask me about food safety rules, temperatures, or cleaning procedures!", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        // User Message
        const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        // Bot Response Logic (Mock AI)
        setTimeout(() => {
            const botResponse = getBotResponse(userMsg.text);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
            setIsTyping(false);
        }, 1000);
    };

    // --- COMPREHENSIVE KNOWLEDGE BASE ---
    const KNOWLEDGE_BASE = [
        // --- PLATFORM & APP INFO ---
        {
            keywords: ['register', 'sign up', 'join', 'create account', 'start'],
            response: "📝 **How to Join RateMyKitchen**:\n1. Click **'Register Hotel'** on the home page.\n2. Fill in your Hotel Name, Email, Address, and Contact Info.\n3. **No documents needed initially!**\n4. Your account will be **Pending** until an Admin approves it (usually within 24 hours).",
            priority: 2
        },
        {
            keywords: ['login', 'sign in', 'access', 'password', 'forgot'],
            response: "🔑 **Login Help**:\n- Use your registered **Email** and **Password**.\n- If you forgot your password, please contact support (feature coming soon!).\n- **Admins** and **Hotel Managers** use the same login page but see different dashboards.",
            priority: 2
        },
        {
            keywords: ['score', 'grade', 'rating', 'calculation', 'math'],
            response: "📊 **Understanding Your Scores**:\n\n1. **Official Score (0-100)**: Set manually by Admins after a physical or detailed review.\n2. **AI Score (Real-time)**: Calculated automatically: `100 - (Total Violations × 5)`.\n\n**Grades**:\n🟢 **A (90-100)**: Excellent\n🟡 **B (80-89)**: Good\n🟠 **C (70-79)**: Needs Improvement\n🔴 **D (<70)**: At Risk of Fines/Closure",
            priority: 3
        },
        {
            keywords: ['ai', 'camera', 'detect', 'robot', 'vision', 'yolo'],
            response: "🤖 **How Our AI Works**:\n- We use **YOLOv8 Computer Vision** technology.\n- Cameras scan your kitchen **24/7** for unsafe practices.\n- Detects: **Masks not worn**, **Pests**, **Dirty surfaces**, **Crowding**.\n- Alerts are sent instantly to your dashboard.",
            priority: 2
        },
        {
            keywords: ['report', 'complain', 'file', 'whistleblow'],
            response: "📢 **Filing a Report**:\n- Anyone (Guests/Staff) can file an **Anonymous Report**.\n- Go to **'Report Violation'** in the navbar.\n- Upload specific evidence (Photos/Videos).\n- Admins review all reports before taking action.",
            priority: 2
        },
        {
            keywords: ['fine', 'penalty', 'money', 'cost', 'charge'],
            response: "💸 **Fines & Penalties**:\n- Admins issue fines for repeated or critical violations.\n- **Minor**: Warnings or small fines ($50-$200).\n- **Major**: Significant fines ($500+) and potential score reduction.\n- Pay fines through the **'Actions'** tab in your dashboard.",
            priority: 2
        },

        // --- FOOD SAFETY (FDA) ---
        {
            keywords: ['temp', 'temperature', 'degree', 'heat', 'cook', 'internal'],
            response: "🌡️ **Critical Cooking Temperatures (Internal)**:\n- **Poultry** (Chicken/Turkey): **165°F (74°C)** (Instant kill)\n- **Ground Meat** (Beef/Pork): **155°F (68°C)**\n- **Whole Cuts** (Steak/Chops) & **Seafood**: **145°F (63°C)**\n- **Vegetables/Grains** (Hot holding): **135°F (57°C)**",
            priority: 3
        },
        {
            keywords: ['cooling', 'cool', 'chill', 'storage temp'],
            response: "❄️ **Proper Cooling Method (2-Stage)**:\n1. Cool from **135°F to 70°F** within **2 hours**.\n2. Cool from **70°F to 41°F** within **4 more hours** (Total 6 hours).\n*Tip: Use ice baths, shallow pans, or blast chillers!*",
            priority: 2
        },
        {
            keywords: ['danger zone', 'bacteria', 'growth'],
            response: "⚠️ **The Danger Zone**:\nBacteria grow fastest between **41°F and 135°F** (5°C - 57°C).\n- Keep **Hot Food** above 135°F.\n- Keep **Cold Food** below 41°F.\n- Discard food left in the Danger Zone for more than **4 hours**.",
            priority: 2
        },
        {
            keywords: ['thaw', 'defrost', 'frozen'],
            response: "🥩 **Safe Thawing Methods**:\n1. **Refrigerator**: Best method (requires planning).\n2. **Running Water**: Submerged under cool running water (<70°F).\n3. **Microwave**: Cook immediately after thawing.\n4. **Cooking**: Thaw as part of the cooking process.\n*NEVER thaw at room temperature!*",
            priority: 2
        },
        {
            keywords: ['store', 'fridge', 'shelf', 'hierarchy', 'order'],
            response: "📦 **Fridge Storage Hierarchy (Top to Bottom)**:\n1. **Top**: Ready-to-Eat Foods (Salads, Cooked Meats)\n2. **Seafood**\n3. **Whole Cuts** of Beef/Pork\n4. **Ground Meat**\n5. **Bottom**: Poultry (Chicken/Turkey)\n*This prevents juice dripping and cross-contamination!*",
            priority: 3
        },
        {
            keywords: ['date', 'label', 'sticker', 'mark'],
            response: "📅 **Date Marking Rules**:\n- Ready-to-eat TCS food prepared on-site and held for >24 hours must be marked.\n- **7-Day Rule**: Can be stored for a maximum of **7 days** if held at 41°F or lower.\n- Count the day of preparation as Day 1.",
            priority: 2
        },

        // --- HYGIENE & SANITATION ---
        {
            keywords: ['wash', 'hand', 'soap', 'clean hand'],
            response: "👐 **Proper Handwashing Steps** (20 Seconds):\n1. Wet hands with warm water.\n2. Apply soap.\n3. **Scrub vigorously** for 10-15 seconds (clean under nails/between fingers).\n4. Rinse thoroughly.\n5. Dry with a **single-use paper towel**.",
            priority: 3
        },
        {
            keywords: ['glove', 'latex', 'vinyl', 'change'],
            response: "🧤 **Glove Rules**:\n- **Wait!** Wash hands BEFORE putting on gloves.\n- Change gloves:\n  - When switching tasks (e.g., raw meat to produce).\n  - If they tear or get dirty.\n  - Every **4 hours** of continuous use.",
            priority: 2
        },
        {
            keywords: ['sick', 'ill', 'vomit', 'fever', 'symptom'],
            response: "🤢 **Employee Illness Policy**:\n- **EXCLUDE**: Vomiting, Diarrhea, Jaundice, or Fever + Sore Throat.\n- **RESTRICT**: Sore Throat with Fever (if working with high-risk population).\n- Staff must be symptom-free for **24 hours** before returning.",
            priority: 3
        },
        {
            keywords: ['hair', 'jewelry', 'appearance', 'nail'],
            response: "🧢 **Personal Hygiene Checklist**:\n- **Hair**: Must be restrained (hat/hairnet/beard net).\n- **Jewelry**: ONLY a plain wedding band is allowed. No watches/bracelets.\n- **Nails**: Short, clean, no polish/artificial nails (unless wearing gloves).\n- **Clothing**: Clean uniform and apron.",
            priority: 2
        },

        // --- CLEANING & MAINTENANCE ---
        {
            keywords: ['sanitize', 'bleach', 'quat', 'chemical'],
            response: "🧪 **Sanitizer Guidelines**:\n- **Chlorine (Bleach)**: 50-99 ppm (Soak for >7 sec).\n- **Quats (Quaternary Ammonium)**: Manufacturer's spec (usually 200-400 ppm, soak >30 sec).\n- **Heat**: Water at 171°F (77°C) for manual soaking (>30 sec).",
            priority: 2
        },
        {
            keywords: ['sink', 'dish', 'wash', '3 comp'],
            response: "🚰 **3-Compartment Sink Method**:\n1. **Wash**: Hot water (>110°F) + Detergent.\n2. **Rinse**: Clean water (Remove soap).\n3. **Sanitize**: Chemical solution or Hot water.\n4. **Air Dry**: NEVER towel dry dishes!",
            priority: 3
        },
        {
            keywords: ['pest', 'rat', 'cockroach', 'mouse'],
            response: "🚫 **Pest Control**:\n- **Deny Access**: Seal cracks, close doors/windows.\n- **Deny Food/Water**: Keep garbage covered, clean spills immediately.\n- **Deny Shelter**: Remove clutter and cardboard boxes.\n*Contact a PCO immediately if you see droppings or signs!*",
            priority: 2
        },

        // --- KITCHEN MANAGEMENT SUGGESTIONS ---
        {
            keywords: ['fifo', 'rotate', 'stock'],
            response: "🔄 **FIFO (First-In, First-Out)**:\n- Store items with the earliest use-by/expiration dates in front.\n- Use oldest stock first to minimize waste.\n- Check dates during every delivery!",
            priority: 2
        },
        {
            keywords: ['cross', 'contamination', 'separate'],
            response: "❌ **Preventing Cross-Contamination**:\n- Use **Color-Coded Cutting Boards** (Red=Meat, Green=Veg, Blue=Fish).\n- Store raw meats **below** ready-to-eat foods.\n- Wash, Rinse, Sanitize between tasks.\n- Designate separate prep areas if possible.",
            priority: 2
        },
        {
            keywords: ['train', 'staff', 'teach', 'educate'],
            response: "🎓 **Staff Training Tips**:\n- Hold weekly **10-minute Standups** on specific safety topics.\n- Post visual aids (handwashing charts, temp logs) at eye level.\n- Role-play scenarios: 'What do you do if the fridge breaks?'\n- Reward staff for catching safety issues!",
            priority: 2
        },

        // --- FALLBACKS ---
        {
            keywords: ['hello', 'hi', 'hey', 'start'],
            response: "👋 **Hello! I'm your RateMyKitchen Expert.**\nI can help with:\n- **App Features** (Scoring, Registration)\n- **FDA Food Code** (Temps, Storage)\n- **Kitchen Management** (Training, Cleaning)\n\n*What's on your mind?*",
            priority: 1
        }
    ];

    const getBotResponse = (text) => {
        const lower = text.toLowerCase();
        let bestMatch = null;
        let highestPriority = 0;

        // Iterate through Knowledge Base to find best match
        for (const entry of KNOWLEDGE_BASE) {
            // Check if ANY keyword matches
            const match = entry.keywords.some(keyword => lower.includes(keyword));
            if (match) {
                // If match found, check priority
                if (entry.priority > highestPriority) {
                    highestPriority = entry.priority;
                    bestMatch = entry;
                }
            }
        }

        if (bestMatch) {
            return bestMatch.response;
        }

        return "🤔 I'm not sure about that specific term. Try asking about **'Temperatures'**, **'Cleaning'**, **'Storage'**, or **'App Scoring'**!";
    };

    return (
        <>
            {/* Toggle Button */}
            <div
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    zIndex: 10000
                }}
            >
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary-600), var(--accent-600))',
                        border: 'none',
                        boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {isOpen ? <i className="fas fa-times fa-lg text-white"></i> : <i className="fas fa-robot fa-lg text-white"></i>}
                </Button>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <Card
                    className="animate-fadeInUp"
                    style={{
                        position: 'fixed',
                        bottom: '100px',
                        right: '30px',
                        width: '350px',
                        height: '500px',
                        borderRadius: '20px',
                        border: 'none',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                        zIndex: 10000,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, var(--primary-600), var(--accent-600))',
                        padding: '1rem',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <i className="fas fa-user-astronaut"></i>
                        </div>
                        <div>
                            <h6 className="mb-0 fw-bold">Virtual Inspector</h6>
                            <small style={{ opacity: 0.8 }}>Online • AI Assistant</small>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div style={{
                        flex: 1,
                        padding: '1rem',
                        overflowY: 'auto',
                        background: '#f8fafc',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                style={{
                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%',
                                    background: msg.sender === 'user' ? 'var(--primary-600)' : 'white',
                                    color: msg.sender === 'user' ? 'white' : 'var(--gray-800)',
                                    padding: '10px 15px',
                                    borderRadius: msg.sender === 'user' ? '15px 15px 0 15px' : '15px 15px 15px 0',
                                    boxShadow: msg.sender === 'user' ? '0 4px 10px rgba(59, 130, 246, 0.2)' : '0 2px 5px rgba(0,0,0,0.05)',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.4'
                                }}
                            >
                                {msg.text}
                            </div>
                        ))}
                        {isTyping && (
                            <div style={{
                                alignSelf: 'flex-start',
                                background: 'white',
                                padding: '10px 15px',
                                borderRadius: '15px 15px 15px 0',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                color: 'var(--gray-500)',
                                fontSize: '0.8rem'
                            }}>
                                <i className="fas fa-circle-notch fa-spin me-2"></i> Thinking...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Questions Chips */}
                    <div style={{
                        padding: '10px 1rem',
                        display: 'flex',
                        gap: '8px',
                        overflowX: 'auto',
                        whiteSpace: 'nowrap',
                        background: '#f8fafc',
                        borderTop: '1px solid var(--gray-200)'
                    }} className="no-scrollbar">
                        {[
                            "How to Register?",
                            "What is AI Score?",
                            "Hygiene Rules",
                            "Report Violation",
                            "Food Safety Tips"
                        ].map((q, idx) => (
                            <Button
                                key={idx}
                                variant="outline-primary"
                                size="sm"
                                onClick={() => {
                                    const userMsg = { id: Date.now(), text: q, sender: 'user' };
                                    setMessages(prev => [...prev, userMsg]);
                                    setIsTyping(true);

                                    setTimeout(() => {
                                        const botResponse = getBotResponse(q);
                                        setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
                                        setIsTyping(false);
                                    }, 1000);
                                }}
                                style={{
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    flex: '0 0 auto',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {q}
                            </Button>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div style={{ padding: '1rem', background: 'white', borderTop: '1px solid var(--gray-200)' }}>
                        <Form onSubmit={handleSend}>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    placeholder="Ask about hygiene rules..."
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    style={{
                                        borderRadius: '20px 0 0 20px',
                                        border: '1px solid var(--gray-300)',
                                        borderRight: 'none',
                                        paddingLeft: '15px',
                                        fontSize: '0.9rem'
                                    }}
                                />
                                <Button
                                    type="submit"
                                    style={{
                                        borderRadius: '0 20px 20px 0',
                                        background: 'var(--primary-600)',
                                        border: 'none',
                                        padding: '0 20px'
                                    }}
                                >
                                    <i className="fas fa-paper-plane"></i>
                                </Button>
                            </InputGroup>
                        </Form>
                    </div>
                </Card>
            )}
        </>
    );
};

export default Chatbot;
