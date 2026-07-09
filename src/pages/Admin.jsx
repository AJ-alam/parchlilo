import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, Check, RefreshCw, Edit3, Trash2, CheckCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config';
import '../styles/Admin.css';

// Default Seed posts matching blogs.html
const defaultSeedPosts = [
  {
    id: "ai-trends",
    title: "The Evolution of Client-Side AI in Modern Web Applications",
    category: "AI & Technology",
    date: "July 8, 2026",
    readTime: "6 min read",
    author: "Sarah Jenkins",
    avatar: "SJ",
    avatarBg: "#c8f135",
    avatarColor: "#0a0a0a",
    svg: `<svg width="100%" height="100%" viewBox="0 0 350 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="background:#0b1120;">
            <circle cx="175" cy="100" r="50" stroke="#c8f135" stroke-width="1" stroke-dasharray="3 6" opacity="0.3"/>
            <circle cx="175" cy="100" r="20" fill="#c8f135" opacity="0.8"/>
            <path d="M40 30 L310 170" stroke="#c8f135" stroke-width="1" opacity="0.15"/>
          </svg>`,
    body: `
      <p>For years, running complex machine learning tasks meant sending user data back to hefty GPU servers, incurring latency penalties, high infrastructure costs, and data leakage concerns. Today, a paradigm shift is underway. Running inference directly inside the browser sandbox is finally practical.</p>
      <h2>Why Client-Side AI?</h2>
      <p>Local execution solves three core bottlenecks: latency, bandwidth cost, and privacy. When code runs client-side, it eliminates the roundtrip to a remote server. Interactions become instantaneous, unlocking fluid UI flows like real-time text analysis or live object detection on high-refresh-rate webcams.</p>
      <blockquote>"By executing machine learning models directly on the client, web apps can operate fully offline while maintaining absolute compliance with privacy acts like GDPR and HIPAA."</blockquote>
      <h2>Technological Pillars: WASM, WebGPU &amp; WebGL</h2>
      <p>This revolution is fueled by browser hardware acceleration. WebAssembly (Wasm) provides near-native execution speed for traditional CPU operations. Simultaneously, WebGL and the new WebGPU standard allow Javascript to tap directly into client graphics hardware, enabling highly parallelized tensor calculations.</p>
    `
  },
  {
    id: "local-storage",
    title: "Leveraging Local Browser Storage for Offline Web Apps",
    category: "Development",
    date: "July 7, 2026",
    readTime: "5 min read",
    author: "Marcus Evans",
    avatar: "ME",
    avatarBg: "#2563eb",
    avatarColor: "#ffffff",
    svg: `<svg width="100%" height="100%" viewBox="0 0 350 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="background:#131b2e;">
            <rect x="40" y="40" width="270" height="120" rx="8" stroke="#334155" stroke-width="2"/>
            <line x1="40" y1="70" x2="310" y2="70" stroke="#334155" stroke-width="2"/>
            <circle cx="75" cy="55" r="4" fill="#f59e0b"/>
            <circle cx="90" cy="55" r="4" fill="#10b981"/>
            <path d="M80 100 L120 140 M120 100 L80 140" stroke="#c8f135" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
          </svg>`,
    body: `
      <p>Modern applications are expected to work under any network condition. If a user enters a tunnel or boards a plane, the application should not freeze. Designing for offline-first is no longer a luxury; it is a core feature of engineering solid web solutions.</p>
      <h2>The Hierarchy of Browser Storage</h2>
      <p>To store state locally, browsers provide several storage vectors. Knowing when to use what is crucial:</p>
      <ul>
        <li><strong>LocalStorage:</strong> Synchronous, string-only key-value storage. Best used for light preference settings (like UI theme modes) under 5MB.</li>
        <li><strong>IndexedDB:</strong> Asynchronous, transactional object-store database. Excellent for handling large structured records, indices, and blob media binary files.</li>
      </ul>
    `
  }
];

export default function Admin() {
  const [supabaseClient, setSupabaseClient] = useState(null);
  const [dbStatus, setDbStatus] = useState("Offline Mode (LocalStorage)");
  const [dbConnected, setDbConnected] = useState(false);

  const [currentBlogs, setCurrentBlogs] = useState([]);
  
  // Search parameters for ref query checking
  const [searchParams] = useSearchParams();

  // Toast notifications state
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastTimeout, setToastTimeout] = useState(null);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  // Form states for blogs editing
  const [editId, setEditId] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postExcerpt, setPostExcerpt] = useState('');
  const [postCategory, setPostCategory] = useState('AI & Technology');
  const [postReadTime, setPostReadTime] = useState('');
  const [postAuthor, setPostAuthor] = useState('');
  const [postDate, setPostDate] = useState('');
  const [coverTheme, setCoverTheme] = useState('cyber');
  const [postBody, setPostBody] = useState('');

  // Initializing Supabase client, checking auth sessions, and pre-seeding local credentials
  useEffect(() => {
    // Always pre-seed local storage with default admin user if not present
    const localUsersJson = localStorage.getItem('parchilo_admin_users');
    const localUsers = localUsersJson ? JSON.parse(localUsersJson) : [];
    const adminExists = localUsers.some(u => u.email.toLowerCase() === 'admin@parchilo.com');
    if (!adminExists) {
      localUsers.push({ email: 'admin@parchilo.com', password: 'ParchiloAdmin2026!' });
      localStorage.setItem('parchilo_admin_users', JSON.stringify(localUsers));
    }

    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        setSupabaseClient(client);
        setDbConnected(true);
        setDbStatus("Connected to Supabase DB");

        // Check active Supabase auth session
        const checkSession = async () => {
          const { data: { session } } = await client.auth.getSession();
          if (session) {
            setCurrentUser(session.user);
          } else {
            // Check local fallback active session
            const localUser = localStorage.getItem('parchilo_active_user');
            if (localUser) {
              setCurrentUser(JSON.parse(localUser));
            }
          }
        };
        checkSession();

        // Listen for auth changes
        const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
          if (session) {
            setCurrentUser(session.user);
          } else {
            const localUser = localStorage.getItem('parchilo_active_user');
            if (localUser) {
              setCurrentUser(JSON.parse(localUser));
            } else {
              setCurrentUser(null);
            }
          }
        });

        return () => {
          subscription.unsubscribe();
        };

      } catch (err) {
        console.error("Supabase client init failed:", err);
      }
    } else {
      // Offline fallback only, check local active user
      const localUser = localStorage.getItem('parchilo_active_user');
      if (localUser) {
        setCurrentUser(JSON.parse(localUser));
      }
    }
  }, []);

  // Authentication Handlers
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      triggerToast("Please fill out all fields!");
      return;
    }

    if (authMode === 'login') {
      if (dbConnected && supabaseClient) {
        try {
          const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: authEmail.trim(),
            password: authPassword
          });
          if (error) throw error;
          setCurrentUser(data.user);
          triggerToast("Successfully signed in!");
        } catch (err) {
          console.warn("Supabase login failed, checking local registry:", err.message);
          localLogin();
        }
      } else {
        localLogin();
      }
    } else {
      // Signup Mode
      const inviteCode = searchParams.get('ref');
      if (inviteCode !== 'admin_invite') {
        triggerToast("Invalid referral invite link. Registration blocked!");
        return;
      }

      if (dbConnected && supabaseClient) {
        try {
          const { data, error } = await supabaseClient.auth.signUp({
            email: authEmail.trim(),
            password: authPassword
          });
          if (error) throw error;
          if (data?.user) {
            setCurrentUser(data.user);
            triggerToast("Successfully registered!");
          } else {
            triggerToast("Verification email sent! Check your inbox.");
          }
        } catch (err) {
          console.warn("Supabase signup failed, trying local register:", err.message);
          localRegister();
        }
      } else {
        localRegister();
      }
    }
  };

  const localLogin = () => {
    const usersJson = localStorage.getItem('parchilo_admin_users');
    const users = usersJson ? JSON.parse(usersJson) : [];
    const found = users.find(u => u.email.toLowerCase() === authEmail.toLowerCase() && u.password === authPassword);
    if (found) {
      const activeUser = { email: found.email };
      setCurrentUser(activeUser);
      localStorage.setItem('parchilo_active_user', JSON.stringify(activeUser));
      triggerToast("Signed in successfully (Offline Mode).");
    } else {
      triggerToast("Invalid email or password!");
    }
  };

  const localRegister = () => {
    const usersJson = localStorage.getItem('parchilo_admin_users');
    const users = usersJson ? JSON.parse(usersJson) : [];
    const exists = users.find(u => u.email.toLowerCase() === authEmail.toLowerCase());
    if (exists) {
      triggerToast("User already exists!");
      return;
    }
    const newUser = { email: authEmail, password: authPassword };
    users.push(newUser);
    localStorage.setItem('parchilo_admin_users', JSON.stringify(users));
    
    const activeUser = { email: authEmail };
    setCurrentUser(activeUser);
    localStorage.setItem('parchilo_active_user', JSON.stringify(activeUser));
    triggerToast("Registration complete (Offline Mode).");
  };

  const handleSignOut = async () => {
    if (dbConnected && supabaseClient) {
      try {
        await supabaseClient.auth.signOut();
      } catch (err) {
        console.error("Supabase signOut error:", err);
      }
    }
    setCurrentUser(null);
    localStorage.removeItem('parchilo_active_user');
    triggerToast("Successfully signed out.");
  };

  // Fetch blogs list
  const loadBlogs = async (clientInstance = supabaseClient) => {
    let posts = [];
    if (clientInstance) {
      try {
        const { data, error } = await clientInstance
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          posts = data.map(item => ({
            id: item.id,
            title: item.title,
            category: item.category,
            date: item.date,
            readTime: item.read_time,
            author: item.author,
            avatar: item.avatar,
            avatarBg: item.avatar_bg,
            avatarColor: item.avatar_color,
            excerpt: item.excerpt,
            svg: item.svg,
            body: item.body
          }));
          setCurrentBlogs(posts);
          return;
        }
      } catch (err) {
        console.warn("Supabase fetch failed in admin, checking localStorage:", err);
      }
    }

    const stored = localStorage.getItem('parchilo_blogs');
    if (stored) {
      posts = JSON.parse(stored);
    } else {
      posts = defaultSeedPosts;
      localStorage.setItem('parchilo_blogs', JSON.stringify(defaultSeedPosts));
    }
    setCurrentBlogs(posts);
  };

  useEffect(() => {
    loadBlogs(supabaseClient);
    
    // Set default publish date
    setPostDate(new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }));
  }, [supabaseClient]);

  // Toast handler
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    if (toastTimeout) clearTimeout(toastTimeout);
    const timeout = setTimeout(() => {
      setShowToast(false);
    }, 3000);
    setToastTimeout(timeout);
  };

  // Helper: generate abstract SVG based on theme selection
  const generateSVGForTheme = (theme) => {
    if (theme === 'cyber') {
      return `<svg width="100%" height="100%" viewBox="0 0 350 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="background:#0b1120;">
              <circle cx="175" cy="100" r="50" stroke="#c8f135" stroke-width="1" stroke-dasharray="3 6" opacity="0.3"/>
              <circle cx="175" cy="100" r="20" fill="#c8f135" opacity="0.8"/>
              <path d="M40 30 L310 170" stroke="#c8f135" stroke-width="1" opacity="0.15"/>
            </svg>`;
    } else if (theme === 'storage') {
      return `<svg width="100%" height="100%" viewBox="0 0 350 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="background:#131b2e;">
              <rect x="40" y="40" width="270" height="120" rx="8" stroke="#334155" stroke-width="2"/>
              <line x1="40" y1="70" x2="310" y2="70" stroke="#334155" stroke-width="2"/>
              <circle cx="75" cy="55" r="4" fill="#f59e0b"/>
              <circle cx="90" cy="55" r="4" fill="#10b981"/>
            </svg>`;
    } else if (theme === 'ux') {
      return `<svg width="100%" height="100%" viewBox="0 0 350 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="background:#1a102f;">
              <path d="M50 150 Q100 50, 150 120 T250 80 T300 150" stroke="#c8f135" stroke-width="3" fill="none" stroke-linecap="round"/>
              <circle cx="150" cy="120" r="6" fill="#2563eb"/>
              <circle cx="250" cy="80" r="6" fill="#10b981"/>
            </svg>`;
    } else {
      return `<svg width="100%" height="100%" viewBox="0 0 350 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="background:#091e16;">
              <rect x="60" y="40" width="230" height="120" rx="6" stroke="#10b981" stroke-width="2" fill="none"/>
              <path d="M90 70 H260 M90 100 H260 M90 130 H180" stroke="#334155" stroke-width="2" stroke-linecap="round"/>
              <circle cx="240" cy="130" r="15" fill="#c8f135"/>
            </svg>`;
    }
  };

  // Helper: generate avatar colors based on author initials
  const getAuthorDesign = (author) => {
    const initials = author.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const bgColors = ["#2563eb", "#10b981", "#ec4899", "#c8f135", "#f59e0b", "#8b5cf6"];
    const charSum = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
    const bg = bgColors[charSum % bgColors.length];
    const color = bg === "#c8f135" ? "#0a0a0a" : "#ffffff";
    return { initials, bg, color };
  };

  // Form Reset
  const resetForm = () => {
    setEditId('');
    setPostTitle('');
    setPostExcerpt('');
    setPostCategory('AI & Technology');
    setPostReadTime('');
    setPostAuthor('');
    setPostBody('');
    setPostDate(new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }));
    setCoverTheme('cyber');
  };

  // Form Submit (Publish or edit blog post)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const id = editId ? editId : 'blog_' + Date.now();
    const svg = generateSVGForTheme(coverTheme);
    const design = getAuthorDesign(postAuthor);

    const postData = {
      id,
      title: postTitle.trim(),
      category: postCategory,
      date: postDate.trim(),
      read_time: postReadTime.trim() || "5 min read",
      author: postAuthor.trim(),
      avatar: design.initials,
      avatar_bg: design.bg,
      avatar_color: design.color,
      excerpt: postExcerpt.trim(),
      svg,
      body: postBody.trim()
    };

    // 1. Supabase upsert
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('blogs')
          .upsert([postData]);

        if (error) throw error;
        triggerToast("Article saved to Supabase successfully!");
      } catch (err) {
        console.error("Supabase upsert failed, saving offline:", err);
        saveLocal(postData);
      }
    } else {
      saveLocal(postData);
    }

    resetForm();
    loadBlogs();
  };

  // Save to LocalStorage helper
  const saveLocal = (postData) => {
    const idx = currentBlogs.findIndex(b => b.id === postData.id);

    // Adapt keys for LocalStorage compatibility
    const adapted = {
      id: postData.id,
      title: postData.title,
      category: postData.category,
      date: postData.date,
      readTime: postData.read_time,
      author: postData.author,
      avatar: postData.avatar,
      avatarBg: postData.avatar_bg,
      avatarColor: postData.avatar_color,
      excerpt: postData.excerpt,
      svg: postData.svg,
      body: postData.body
    };

    const updatedBlogs = [...currentBlogs];
    if (idx !== -1) {
      updatedBlogs[idx] = adapted;
      triggerToast("Article updated locally.");
    } else {
      updatedBlogs.unshift(adapted);
      triggerToast("Article published locally.");
    }
    localStorage.setItem('parchilo_blogs', JSON.stringify(updatedBlogs));
  };

  // Load post details into form for edit
  const handleEditPost = (id) => {
    const blog = currentBlogs.find(b => b.id === id);
    if (!blog) return;

    setEditId(blog.id);
    setPostTitle(blog.title);
    setPostExcerpt(blog.excerpt);
    setPostCategory(blog.category);
    setPostReadTime(blog.readTime || blog.read_time);
    setPostAuthor(blog.author);
    setPostDate(blog.date);
    setPostBody(blog.body);

    // Try to restore visual theme from SVG if matching background colors
    if (blog.svg.includes('background:#0b1120;')) setCoverTheme('cyber');
    else if (blog.svg.includes('background:#131b2e;')) setCoverTheme('storage');
    else if (blog.svg.includes('background:#1a102f;')) setCoverTheme('ux');
    else setCoverTheme('fiscal');

    // Scroll to form panel
    const formCard = document.querySelector('.composer-card');
    if (formCard) formCard.scrollIntoView({ behavior: 'smooth' });
  };

  // Delete article
  const handleDeletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;

    // 1. Supabase delete
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('blogs')
          .delete()
          .eq('id', id);

        if (error) throw error;
        triggerToast("Article deleted from Supabase.");
      } catch (err) {
        console.error("Supabase delete failed, deleting locally:", err);
        deleteLocal(id);
      }
    } else {
      deleteLocal(id);
    }

    loadBlogs();
  };

  const deleteLocal = (id) => {
    const updated = currentBlogs.filter(b => b.id !== id);
    localStorage.setItem('parchilo_blogs', JSON.stringify(updated));
    triggerToast("Article deleted locally.");
  };

  // Seed Reset
  const triggerSeedReset = async () => {
    if (!window.confirm("This will restore default seed posts. Continue?")) return;

    if (supabaseClient) {
      try {
        // Delete all
        await supabaseClient.from('blogs').delete().neq('id', 'null');

        const adaptedSeeds = defaultSeedPosts.map(item => ({
          id: item.id,
          title: item.title,
          category: item.category,
          date: item.date,
          read_time: item.readTime || item.read_time,
          author: item.author,
          avatar: item.avatar,
          avatar_bg: item.avatarBg || item.avatar_bg,
          avatar_color: item.avatarColor || item.avatar_color,
          excerpt: item.excerpt,
          svg: item.svg,
          body: item.body
        }));

        const { error } = await supabaseClient.from('blogs').insert(adaptedSeeds);
        if (error) throw error;
        triggerToast("Database seeded successfully!");
      } catch (err) {
        console.error("Supabase seeding failed, resetting locally:", err);
        resetLocalSeeds();
      }
    } else {
      resetLocalSeeds();
    }

    loadBlogs();
  };

  const resetLocalSeeds = () => {
    localStorage.setItem('parchilo_blogs', JSON.stringify(defaultSeedPosts));
    triggerToast("Local seed articles restored.");
  };

  if (!currentUser) {
    return (
      <div className="auth-page-container">
        <div className="auth-card">
          <div className="auth-card-body">
            <div className="auth-logo-header">
              <span className="logo-wordmark">
                <span>PAR</span><span className="logo-invert">CHI</span><span>LO</span>
              </span>
              <p className="auth-subtitle">Blog Manager CMS Console</p>
            </div>

            <form className="auth-form" onSubmit={handleAuthSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  required 
                  placeholder="manager@parchilo.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className="btn-submit"
                style={{ marginTop: '20px' }}
              >
                Sign In to Console
              </button>
            </form>
          </div>
        </div>
        
        {/* Toast Notification */}
        <div className={`toast ${showToast ? 'show' : ''}`} id="toastMessage" style={{ bottom: '24px', left: '50%', transform: showToast ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(100px)' }}>
          <CheckCircle size={16} />
          <span>{toastMessage}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ══ HERO ══ */}
      <header className="admin-hero">
        <div className="auth-status-bar">
          <span>Signed in as <strong>{currentUser.email}</strong></span>
          <button className="btn-signout" onClick={handleSignOut}>Sign Out</button>
        </div>
        <h1>Blog Manager CMS</h1>
        <p>Compose and publish dynamic articles instantly. Write raw HTML or markdown content, style abstract geometric SVG covers, and sync with your database.</p>

        <div className="db-status-badge">
          <div className={`status-dot ${dbConnected ? 'active' : ''}`} id="dbStatusDot"></div>
          <span id="dbStatusText">{dbStatus}</span>
        </div>
      </header>

      {/* ══ MAIN LAYOUT ══ */}
      <main className="admin-container">

        {/* Left Column: Composer Form */}
        <section className="composer-card">
          <h2 className="composer-title" id="formTitle">
            <span>{editId ? "Edit Blog Post" : "Create Blog Post"}</span>
            {editId && (
              <button 
                type="button" 
                className="btn-reset" 
                style={{ margin: 0, width: 'auto', padding: '4px 12px', fontSize: '11px' }}
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </h2>

          <form id="composerForm" onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label>Article Title</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Scaling Real-Time Webhooks with Redis Streams"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Brief Excerpt</label>
              <input 
                type="text" 
                required
                placeholder="A short summary of the article displayed on the listing cards..."
                value={postExcerpt}
                onChange={(e) => setPostExcerpt(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select value={postCategory} onChange={(e) => setPostCategory(e.target.value)}>
                  <option value="AI & Technology">AI &amp; Tech</option>
                  <option value="Development">Development</option>
                  <option value="Design & UX">Design &amp; UX</option>
                  <option value="Workflows">Workflows</option>
                </select>
              </div>

              <div className="form-group">
                <label>Estimated Read Time</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. 5 min read"
                  value={postReadTime}
                  onChange={(e) => setPostReadTime(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Author Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Anya Lopez"
                  value={postAuthor}
                  onChange={(e) => setPostAuthor(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Publish Date</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. July 8, 2026"
                  value={postDate}
                  onChange={(e) => setPostDate(e.target.value)}
                />
              </div>
            </div>

            {/* Abstract SVG Cover Theme Selector */}
            <div className="form-group">
              <label>Cover Visual Theme</label>
              <div className="theme-grid">
                <label className="theme-radio">
                  <input 
                    type="radio" 
                    name="coverTheme" 
                    value="cyber" 
                    checked={coverTheme === 'cyber'}
                    onChange={() => setCoverTheme('cyber')}
                  />
                  <div className="theme-box" style={{ background: '#0b1120', color: '#c8f135' }}>AI Cyber</div>
                </label>
                <label className="theme-radio">
                  <input 
                    type="radio" 
                    name="coverTheme" 
                    value="storage"
                    checked={coverTheme === 'storage'}
                    onChange={() => setCoverTheme('storage')}
                  />
                  <div className="theme-box" style={{ background: '#131b2e', color: '#3b82f6' }}>Database</div>
                </label>
                <label className="theme-radio">
                  <input 
                    type="radio" 
                    name="coverTheme" 
                    value="ux"
                    checked={coverTheme === 'ux'}
                    onChange={() => setCoverTheme('ux')}
                  />
                  <div className="theme-box" style={{ background: '#1a102f', color: '#ec4899' }}>Design UX</div>
                </label>
                <label className="theme-radio">
                  <input 
                    type="radio" 
                    name="coverTheme" 
                    value="fiscal"
                    checked={coverTheme === 'fiscal'}
                    onChange={() => setCoverTheme('fiscal')}
                  />
                  <div className="theme-box" style={{ background: '#091e16', color: '#10b981' }}>Teal Flow</div>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>HTML / Content Body</label>
              <textarea 
                className="rich-textarea" 
                required
                placeholder="Write your full article body in HTML (use <p>, <h2>, <blockquote>, <pre><code> for formatting)..."
                value={postBody}
                onChange={(e) => setPostBody(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-submit" id="submitBtn">
              {editId ? (
                <>
                  <Check size={16} style={{ marginRight: '6px' }} /> Update Article
                </>
              ) : (
                <>
                  <Send size={16} style={{ marginRight: '6px' }} /> Publish Article
                </>
              )}
            </button>
          </form>
        </section>

        {/* Right Column: Listing Dashboard */}
        <section className="dashboard-card">
          <h2 className="dash-title">Published Articles</h2>

          <div id="articlesList">
            {currentBlogs.length > 0 ? (
              currentBlogs.map((blog) => (
                <div className="blog-item" key={blog.id}>
                  <div className="blog-meta-info">
                    <span className="blog-item-title">{blog.title}</span>
                    <div className="blog-item-sub">
                      <span><strong>Category:</strong> {blog.category}</span>
                      <span><strong>Author:</strong> {blog.author}</span>
                      <span>{blog.date}</span>
                    </div>
                  </div>
                  <div className="item-actions">
                    <button 
                      className="btn-icon" 
                      onClick={() => handleEditPost(blog.id)} 
                      title="Edit Article"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button 
                      className="btn-icon delete" 
                      onClick={() => handleDeletePost(blog.id)} 
                      title="Delete Article"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-blogs-prompt">No published articles yet. Compose your first blog on the left!</div>
            )}
          </div>

          <button className="btn-reset" onClick={triggerSeedReset}>
            <RefreshCw size={12} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} /> 
            Reset to Seed Articles
          </button>
        </section>

      </main>

      {/* Toast Notification */}
      <div className={`toast ${showToast ? 'show' : ''}`} id="toastMessage" style={{ bottom: '24px', left: '50%', transform: showToast ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(100px)' }}>
        <CheckCircle size={16} />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}
