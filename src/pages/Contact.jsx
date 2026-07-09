import React, { useState, useRef } from 'react';
import { Mail, Phone, MapPin, ExternalLink, Send, CheckCircle, ChevronDown } from 'lucide-react';
import '../styles/Contact.css';

export default function Contact() {
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Accordion active index state
  const [activeAccordion, setActiveAccordion] = useState(null);

  // Toast notifications state
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = useRef(null);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setShowToast(true);

    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 3000);

    // Reset inputs
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  const toggleAccordion = (index) => {
    if (activeAccordion === index) {
      setActiveAccordion(null);
    } else {
      setActiveAccordion(index);
    }
  };

  const faqItems = [
    {
      q: "What is Parchilo Insights?",
      a: "Parchilo Insights is a technology publication created and curated by Nexaura Technologies. We specialize in bringing senior developers, UI/UX designers, and software engineers deep-dive articles, architectural patterns, and updates about the modern web, focusing especially on AI implementation and data compliance."
    },
    {
      q: "Can I use your code snippets in my projects?",
      a: "Absolutely! All code blocks, SVG graphic configurations, and helper scripts published on our pages are released under the open-source MIT License. You are free to integrate them, modify them, and use them for personal, educational, or commercial production projects."
    },
    {
      q: "How often are new articles published?",
      a: "We publish new content weekly, typically every Tuesday and Thursday. Our team conducts architectural analysis on real-world scenarios (like FBR tax integrations, local offline databases, or SVG visualizations) to provide fully tested developer tutorials."
    },
    {
      q: "How can I consult with Nexaura Technologies?",
      a: "If your enterprise is looking for tailored software consultancy, database architectures, or security reviews, you can fill out the contact form above with a brief overview of your project, or email us directly at partner@nexauratechs.com."
    }
  ];

  return (
    <div>
      {/* ══ CONTACT CONTAINER ══ */}
      <div className="contact-container">
        {/* Left Column: Form / Success state */}
        <div className="contact-form-wrap">
          {!success ? (
            <>
              <h1 className="contact-page-title">Get in Touch</h1>
              <p className="contact-page-desc">Have a question or feedback? Fill out the form below and we will get back to you shortly.</p>

              <form className="contact-form" onSubmit={handleContactSubmit}>
                <div className="contact-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter your full name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="contact-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="Enter your business email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="contact-group">
                  <label>Subject</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="How can we help you?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="contact-group">
                  <label>Message</label>
                  <textarea 
                    rows="6" 
                    required 
                    placeholder="Write your message detail here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn-contact-submit">
                  Send Message <Send size={14} style={{ marginLeft: '6px' }} />
                </button>
              </form>
            </>
          ) : (
            <div className="form-success-banner" style={{ display: 'flex' }}>
              <CheckCircle size={48} style={{ color: 'var(--green)' }} />
              <h2>Message Received!</h2>
              <p style={{ fontWeight: 500, fontSize: '13.5px', color: 'var(--muted)', marginTop: '8px', maxWidth: '400px', lineHeight: 1.5 }}>
                Thank you for reaching out. We have logged your request and a member of the Nexaura Technologies team will contact you within 24 business hours.
              </p>
              <button 
                type="button" 
                className="btn-contact-submit" 
                style={{ marginTop: '20px', width: 'auto', padding: '8px 24px' }}
                onClick={() => setSuccess(false)}
              >
                Send Another Message
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Info Cards */}
        <div className="info-column">
          <div className="info-card">
            <h2 className="info-card-title">Contact Channels</h2>

            <div className="info-list">
              {/* Item 1: Email */}
              <div className="info-item">
                <div className="info-icon">
                  <Mail size={18} />
                </div>
                <div className="info-item-content">
                  <span className="info-title">Email Us</span>
                  <span className="info-value">info@parchilo.com</span>
                  <span className="info-value" style={{ fontSize: '12.5px', color: 'var(--dim)', fontWeight: 400 }}>
                    contact@nexauratechs.com
                  </span>
                </div>
              </div>

              {/* Item 2: Phone */}
              <div className="info-item">
                <div className="info-icon">
                  <Phone size={18} />
                </div>
                <div className="info-item-content">
                  <span className="info-title">Call Us</span>
                  <span className="info-value">+44 20 7123 4567</span>
                  <span className="info-value" style={{ fontSize: '12.5px', color: 'var(--dim)', fontWeight: 400 }}>
                    Mon - Fri, 9AM - 6PM GMT
                  </span>
                </div>
              </div>

              {/* Item 3: Address */}
              <div className="info-item">
                <div className="info-icon">
                  <MapPin size={18} />
                </div>
                <div className="info-item-content">
                  <span className="info-title">Visit Us</span>
                  <span className="info-value">18-21 Northumberland Ave, London WC2N 5EA, United Kingdom</span>
                  <span className="info-value" style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 400 }}>
                    London, United Kingdom
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Corporate Info Card */}
          <div className="info-card" style={{ background: '#0f172a', color: 'var(--white)', borderColor: '#1e293b' }}>
            <h2 className="info-card-title" style={{ color: 'var(--white)' }}>Nexaura Corporate</h2>
            <p style={{ fontSize: '13.5px', color: 'var(--xdim)', lineHeight: 1.6, marginBottom: '16px' }}>
              Parchilo is an insights brand operated by Nexaura Technologies. We provide software engineering consultancy, cloud migrations, and digital compliance consulting globally.
            </p>
            <a 
              href="https://nexauratechs.com" 
              target="_blank" 
              rel="noreferrer"
              className="btn-open"
              style={{ width: '100%', justifyContent: 'center', borderRadius: '8px', textDecoration: 'none' }}
            >
              Visit Nexaura Corporate <ExternalLink size={14} style={{ marginLeft: '6px' }} />
            </a>
          </div>
        </div>
      </div>

      {/* ══ FAQ ACCORDION SECTION ══ */}
      <section className="faq-sect">
        <div className="faq-inner">
          <h2 className="faq-title">Frequently Asked Questions</h2>

          <div className="accordion-list">
            {faqItems.map((item, index) => (
              <div 
                className={`accordion-item ${activeAccordion === index ? 'active' : ''}`} 
                key={index}
              >
                <div className="accordion-header" onClick={() => toggleAccordion(index)}>
                  <span>{item.q}</span>
                  <ChevronDown size={18} className="accordion-icon" />
                </div>
                <div className="accordion-content">
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      <div className={`toast ${showToast ? 'show' : ''}`} id="toastMessage">
        <CheckCircle size={16} />
        <span>Message Sent successfully!</span>
      </div>
    </div>
  );
}
