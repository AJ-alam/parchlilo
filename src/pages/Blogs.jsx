import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, HelpCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config';
import '../styles/Blogs.css';

// Seed Posts
const seedPosts = [
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
    excerpt: "Explore how running machine learning models locally on the browser is transforming UX, reducing server latency, and ensuring absolute user data privacy.",
    svg: `<svg width="100%" height="100%" viewBox="0 0 350 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="background:#0b1120;">
            <circle cx="175" cy="100" r="50" stroke="#c8f135" stroke-width="1" stroke-dasharray="3 6" opacity="0.3"/>
            <circle cx="175" cy="100" r="20" fill="#c8f135" opacity="0.8"/>
            <path d="M40 30 L310 170" stroke="#c8f135" stroke-width="1" opacity="0.15"/>
          </svg>`
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
    excerpt: "Learn best practices for structuring client-side offline stores using IndexedDB, cache parameters, and offline-first state syncing.",
    svg: `<svg width="100%" height="100%" viewBox="0 0 350 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="background:#131b2e;">
            <rect x="40" y="40" width="270" height="120" rx="8" stroke="#334155" stroke-width="2"/>
            <line x1="40" y1="70" x2="310" y2="70" stroke="#334155" stroke-width="2"/>
            <circle cx="60" cy="55" r="4" fill="#ef4444"/>
            <circle cx="75" cy="55" r="4" fill="#f59e0b"/>
            <circle cx="90" cy="55" r="4" fill="#10b981"/>
            <path d="M80 100 L120 140 M120 100 L80 140" stroke="#c8f135" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
          </svg>`
  },
  {
    id: "micro-animations",
    title: "Designing Micro-Animations for Delightful Interfaces",
    category: "Design & UX",
    date: "July 5, 2026",
    readTime: "4 min read",
    author: "Anya Lopez",
    avatar: "AL",
    avatarBg: "#ec4899",
    avatarColor: "#ffffff",
    excerpt: "How subtle physics-based visual feedback can guide navigation, reduce friction, and boost user interaction metrics.",
    svg: `<svg width="100%" height="100%" viewBox="0 0 350 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="background:#1a102f;">
            <path d="M50 150 Q100 50, 150 120 T250 80 T300 150" stroke="#c8f135" stroke-width="3" fill="none" stroke-linecap="round"/>
            <circle cx="150" cy="120" r="6" fill="#2563eb"/>
            <circle cx="250" cy="80" r="6" fill="#10b981"/>
          </svg>`
  },
  {
    id: "fbr-compliance",
    title: "Understanding FBR Compliance in Fintech Integrations",
    category: "Workflows",
    date: "July 3, 2026",
    readTime: "8 min read",
    author: "Hamza Riaz",
    avatar: "HR",
    avatarBg: "#10b981",
    avatarColor: "#ffffff",
    excerpt: "A developer's checklist for securing transaction pipelines, real-time logging, and handling tax authority verification hooks.",
    svg: `<svg width="100%" height="100%" viewBox="0 0 350 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="background:#091e16;">
            <rect x="60" y="40" width="230" height="120" rx="6" stroke="#10b981" stroke-width="2" fill="none"/>
            <path d="M90 70 H260 M90 100 H260 M90 130 H180" stroke="#334155" stroke-width="2" stroke-linecap="round"/>
            <circle cx="240" cy="130" r="15" fill="#c8f135"/>
          </svg>`
  },
  {
    id: "css-architecture",
    title: "Modern CSS Architectures: Beyond Utility Frameworks",
    category: "Development",
    date: "June 28, 2026",
    readTime: "7 min read",
    author: "Marcus Evans",
    avatar: "ME",
    avatarBg: "#2563eb",
    avatarColor: "#ffffff",
    excerpt: "Why vanilla CSS with modern properties like custom properties, CSS nesting, and container queries is making utility-first frameworks obsolete.",
    svg: `<svg width="100%" height="100%" viewBox="0 0 350 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="background:#13282f;">
            <rect x="50" y="30" width="250" height="140" rx="8" stroke="#00f2fe" stroke-width="2" fill="none"/>
            <path d="M80 70 H270 M80 100 H270 M80 130 H200" stroke="#334155" stroke-width="2" stroke-linecap="round"/>
            <rect x="220" y="110" width="50" height="30" rx="4" fill="#00f2fe" opacity="0.3"/>
          </svg>`
  },
  {
    id: "prompt-engineering",
    title: "Prompt Engineering for Developer Workflows",
    category: "AI & Technology",
    date: "June 25, 2026",
    readTime: "6 min read",
    author: "Sarah Jenkins",
    avatar: "SJ",
    avatarBg: "#c8f135",
    avatarColor: "#0a0a0a",
    excerpt: "A practical guide to integrating large language models in development pipelines, from git commits to automated code reviews.",
    svg: `<svg width="100%" height="100%" viewBox="0 0 350 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="background:#111827;">
            <circle cx="175" cy="100" r="45" fill="#374151" opacity="0.5"/>
            <path d="M120 100 Q175 40, 230 100 T340 100" stroke="#3b82f6" stroke-width="2" fill="none"/>
            <rect x="160" y="85" width="30" height="30" rx="6" fill="#c8f135"/>
          </svg>`
  }
];

export default function Blogs() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchBlogs = async () => {
      let loadedPosts = [];

      // 1. Try Supabase
      if (SUPABASE_URL && SUPABASE_ANON_KEY) {
        try {
          const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
          const { data, error } = await supabaseClient
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;

          if (data && data.length > 0) {
            loadedPosts = data.map(item => ({
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
              svg: item.svg
            }));
          }
        } catch (err) {
          console.warn("Supabase fetch failed on Blogs listing, falling back to local storage:", err);
        }
      }

      // 2. Try LocalStorage
      if (loadedPosts.length === 0) {
        const stored = localStorage.getItem('parchilo_blogs');
        if (stored) {
          loadedPosts = JSON.parse(stored);
        } else {
          loadedPosts = seedPosts;
          localStorage.setItem('parchilo_blogs', JSON.stringify(seedPosts));
        }
      }

      setBlogPosts(loadedPosts);
    };

    fetchBlogs();
  }, []);

  // Filter posts
  const filtered = blogPosts.filter(post => {
    const matchCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchQuery = !searchQuery || 
                       post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchQuery;
  });

  // Most recent post is featured if no active filter
  const featuredPost = filtered.length > 0 && activeCategory === 'all' && searchQuery === '' ? filtered[0] : null;

  // Grid items are items excluding featured post
  const gridItems = filtered.filter(post => !featuredPost || post.id !== featuredPost.id);

  return (
    <div>
      {/* ══ HERO ══ */}
      <header className="blogs-hero">
        <h1>Parchilo Insights</h1>
        <p>Read detailed analyses, step-by-step guides, and opinion pieces about technology, artificial intelligence workflows, and front-end system architectures.</p>
      </header>

      {/* ══ SEARCH & FILTER BAR ══ */}
      <div className="search-filter-wrap">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search articles by title or keyword..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <ul className="category-tabs">
          {['all', 'AI & Technology', 'Development', 'Design & UX', 'Workflows'].map((cat) => (
            <li key={cat}>
              <button 
                className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === 'all' ? 'All' : cat === 'AI & Technology' ? 'AI & Tech' : cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ══ FEATURED ARTICLE BOX ══ */}
      {featuredPost && (
        <div className="featured-highlight-wrap">
          <Link to={`/blog-post?id=${featuredPost.id}`} className="featured-card">
            <div className="featured-img-wrap">
              <div className="featured-badge">Featured Post</div>
              <div 
                style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                dangerouslySetInnerHTML={{ __html: featuredPost.svg }}
              />
              <div className="featured-img-overlay"></div>
            </div>
            
            <div className="featured-body">
              <div>
                <h2 className="featured-title">{featuredPost.title}</h2>
                <p className="featured-excerpt">{featuredPost.excerpt}</p>
              </div>

              <div className="featured-meta">
                <div className="author-info">
                  <div 
                    className="author-avatar" 
                    style={{ background: featuredPost.avatarBg, color: featuredPost.avatarColor }}
                  >
                    {featuredPost.avatar}
                  </div>
                  <span className="author-name">{featuredPost.author}</span>
                </div>
                <span className="post-read-time">
                  <Clock size={12} style={{ marginRight: '4px' }} />
                  {featuredPost.readTime}
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* ══ ARTICLES GRID ══ */}
      <section className="blogs-grid-sect">
        <div className="blogs-inner">
          {filtered.length > 0 ? (
            <div className="blog-grid">
              {gridItems.map((post) => (
                <Link to={`/blog-post?id=${post.id}`} className="blog-card" key={post.id}>
                  <div className="blog-card-img">
                    <span className="blog-card-badge">{post.category}</span>
                    <div 
                      style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      dangerouslySetInnerHTML={{ __html: post.svg }}
                    />
                  </div>
                  <div className="blog-card-body">
                    <div className="card-text-content">
                      <h3 className="blog-card-title">{post.title}</h3>
                      <p className="blog-card-excerpt">{post.excerpt}</p>
                    </div>
                    <div className="blog-card-footer">
                      <div className="blog-card-author">
                        <div 
                          className="blog-card-avatar" 
                          style={{ background: post.avatarBg, color: post.avatarColor }}
                        >
                          {post.avatar}
                        </div>
                        <span className="blog-card-author-name">{post.author}</span>
                      </div>
                      <span className="blog-card-date">{post.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <HelpCircle size={48} />
              <h3>No articles found</h3>
              <p>Try refining your search query or choosing another category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
