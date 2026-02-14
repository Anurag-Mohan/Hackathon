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

    const getBotResponse = (text) => {
        const lower = text.toLowerCase();

        // Temperature Rules
        if (lower.includes('temp') || lower.includes('degree') || lower.includes('heat') || lower.includes('cold') || lower.includes('fridge') || lower.includes('freezer')) {
            if (lower.includes('chicken') || lower.includes('poultry')) return "🍗 Poultry must be cooked to an internal temperature of *165°F (74°C)* for at least 15 seconds.";
            if (lower.includes('beef') || lower.includes('steak')) return "🥩 Whole cuts of beef/pork should reach *145°F (63°C)* with a 3-minute rest time.";
            if (lower.includes('ground') || lower.includes('burger')) return "🍔 Ground meats must be cooked to *155°F (68°C)*.";
            if (lower.includes('fridge') || lower.includes('refrigerator')) return "❄️ Refrigerators must be kept at *40°F (4°C)* or below to prevent bacterial growth.";
            if (lower.includes('freezer')) return "🧊 Freezers should be kept at *0°F (-18°C)* or lower.";
            return "🌡️ Danger Zone: Bacteria grow rapidly between *41°F and 135°F*. Keep hot food hot (>135°F) and cold food cold (<41°F).";
        }

        // Cleaning / Sanitizing
        if (lower.includes('clean') || lower.includes('wash') || lower.includes('sanitize') || lower.includes('bleach') || lower.includes('soap')) {
            if (lower.includes('hand') || lower.includes('wash hands')) return "👐 Handwashing: Scrub with warm water and soap for at least *20 seconds*. Dry with single-use towel.";
            if (lower.includes('bleach')) return "🧪 For sanitizing surfaces: Mix *1 tablespoon* of bleach per gallon of water. Let air dry.";
            if (lower.includes('cutting board')) return "🔪 Wash, rinse, and sanitize cutting boards after each use. Use separate boards for raw meat and produce!";
            return "✨ The 3-Sink Method: 1. Wash (Detergent) → 2. Rinse (Water) → 3. Sanitize (Chemical/Hot Water).";
        }

        // Pests
        if (lower.includes('pest') || lower.includes('rat') || lower.includes('mouse') || lower.includes('cockroach') || lower.includes('fly')) {
            return "🚫 Pests are a critical violation! 1. Seal all cracks. 2. Keep garbage covered. 3. Call a licensed pest control operator immediately if you see signs.";
        }

        // Storage / Cross Contamination
        if (lower.includes('store') || lower.includes('storage') || lower.includes('shelf') || lower.includes('cross') || lower.includes('contaminat')) {
            return "📦 Refrigerator Hierarchy (Top to Bottom): \n1. Ready-to-eat foods \n2. Seafood \n3. Whole cuts of beef/pork \n4. Ground meat \n5. Poultry (Bottom)";
        }

        // Allergens
        if (lower.includes('allergen') || lower.includes('peanut') || lower.includes('gluten') || lower.includes('dairy')) {
            return "⚠️ The Big 9 Allergens: Milk, Eggs, Fish, Shellfish, Tree Nuts, Peanuts, Wheat, Soy, Sesame. Always prevent cross-contact using separate tools.";
        }

        // Illness / Sickness
        if (lower.includes('sick') || lower.includes('ill') || lower.includes('vomit') || lower.includes('diarrhea') || lower.includes('fever') || lower.includes('symptom')) {
            return "🤢 Employee Health Policy: Staff with vomiting, diarrhea, jaundice, or fever with sore throat must be EXCLUDED from the operation. They cannot return until symptom-free for 24 hours.";
        }

        // Personal Hygiene
        if (lower.includes('hair') || lower.includes('jewelry') || lower.includes('nail') || lower.includes('ring') || lower.includes('apron')) {
            return "🧢 Personal Hygiene: \n1. Hair restraints are required. \n2. No jewelry on arms/hands (except plain wedding band). \n3. Nails must be short and clean (no polish/fake nails). \n4. Remove aprons before using the restroom.";
        }

        // First Aid / Emergencies
        if (lower.includes('burn') || lower.includes('cut') || lower.includes('wound') || lower.includes('blood') || lower.includes('choke')) {
            return "🚑 First Aid: \n- Cuts: Cover with brightness bandage AND a finger cot/glove. \n- Burns: Run under cool water (no ice). \n- Choking: Perform abdominal thrusts (Heimlich). Call 911 for emergencies.";
        }

        // Nutrition / Healthy Options
        if (lower.includes('health') || lower.includes('nutrition') || lower.includes('calorie') || lower.includes('diet') || lower.includes('vegan')) {
            return "🥗 Healthy Kitchen Tips: \n- Use separate fryers for gluten-free items. \n- Offer steamed veggies as sides. \n- Label calories clearly on menus (FDA requirement for chains >20 locations). \n- Reduce salt by using fresh herbs/spices!";
        }

        // Platform - General Info (VERIFIED)
        if (lower.includes('what is') || lower.includes('about') || lower.includes('app') || lower.includes('site') || lower.includes('platform')) {
            return "🏨 **RateMyKitchen** is an AI-powered hygiene monitoring platform. We use **YOLOv8 computer vision** to detect kitchen violations in real-time, 24/7.";
        }

        // Platform - Registration (VERIFIED: RegisterPage.jsx)
        if (lower.includes('register') || lower.includes('sign up') || lower.includes('join') || lower.includes('create account')) {
            return "📝 **How to Join**: \n1. Go to **'Register Hotel'**. \n2. Enter Name, Email, Address, and Contact. \n3. **No documents needed initially.** \n4. Wait for **Admin Approval** to access your dashboard.";
        }

        // Platform - Reporting (VERIFIED: ReportPage.jsx)
        if (lower.includes('report') || lower.includes('complain') || lower.includes('violation') || lower.includes('anonymous')) {
            return "📢 **File a Report**: \n- Go to **'Report Violation'**. \n- Upload **JPG, PNG, MP4, or MOV** (Max 10MB). \n- Describe the issue. \n- **100% Anonymous** & reviewed by Admins.";
        }

        // Platform - Scoring System (VERIFIED: HotelDashboard.jsx + AdminDashboard.jsx)
        if (lower.includes('score') || lower.includes('grade') || lower.includes('rating') || lower.includes('ranking') || lower.includes('mark')) {
            return "📊 **Two Scores**: \n1. **Official Score**: Set manually by Admins (0-100). \n2. **AI Score**: Calculated as `100 - (Violations × 10)`. \n\n**Grades**: \n🟢 **A (90+)** \n🟡 **B (80-89)** \n🟠 **C (70-79)** \n🔴 **D (<70)**";
        }

        // Platform - AI / Technical (VERIFIED: inference.py)
        if (lower.includes('ai') || lower.includes('robot') || lower.includes('camera') || lower.includes('detect') || lower.includes('yolo')) {
            return "🤖 **My AI Brain**: \nI use **YOLOv8** models to analyze video feeds. I scan frames every **1 second** to detect unsafe practices like missing masks, pests, or dirty surfaces.";
        }

        // Dashboard Info
        if (lower.includes('dashboard') || lower.includes('feature') || lower.includes('tool')) {
            return "💻 **Dashboard**: \n- See your **Real-time AI Score**. \n- View **Total Fines** ($). \n- Check **Last Inspection Date**. \n- Read **Admin Memos**.";
        }

        // Illness / Sickness
        if (lower.includes('sick') || lower.includes('ill') || lower.includes('vomit') || lower.includes('diarrhea') || lower.includes('fever') || lower.includes('symptom')) {
            return "🤢 **Employee Health**: Staff with vomiting, diarrhea, jaundice, or fever + sore throat must be **EXCLUDED** until symptom-free for 24hrs.";
        }

        // Personal Hygiene
        if (lower.includes('hair') || lower.includes('jewelry') || lower.includes('nail') || lower.includes('ring') || lower.includes('apron')) {
            return "🧢 **Hygiene Rules**: \n- Wear Hair Restraints. \n- No jewelry on arms/hands (plain bands ok). \n- Short, clean nails (no polish). \n- Remove aprons before restroom use.";
        }

        // First Aid
        if (lower.includes('burn') || lower.includes('cut') || lower.includes('wound') || lower.includes('blood') || lower.includes('choke')) {
            return "🚑 **First Aid**: \n- **Cuts**: Bandage + Finger Cot/Glove. \n- **Burns**: Cool water (NO ice). \n- **Choking**: Heimlich Maneuver. \n*Call 911 for emergencies.*";
        }

        // Nutrition
        if (lower.includes('health') || lower.includes('nutrition') || lower.includes('calorie') || lower.includes('diet') || lower.includes('vegan')) {
            return "🥗 **Healthy Tips**: \n- Separate fryers for gluten-free. \n- Offer steamed sides. \n- Label calories. \n- Reduce salt usage.";
        }

        // Default / Greeting
        if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
            return "Hello! 👋 I'm the **RateMyKitchen Expert**. \nI know EXACTLY how this app works. Ask me about **Registration**, **AI Detection**, **Scoring Math**, or **Food Safety**!";
        }

        return "🤔 I can explain **App Features** (e.g., 'How is AI score calculated?') or **Hygiene Rules**. What do you need?";
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
