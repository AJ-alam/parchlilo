import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Clock, Share2, AlertCircle, HelpCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config';
import '../styles/Blogs.css';

const fallbackSeedPosts = {
  "ai-trends": {
    title: "The Evolution of Client-Side AI in Modern Web Applications",
    category: "AI & Technology",
    date: "July 8, 2026",
    readTime: "6 min read",
    author: "Sarah Jenkins",
    avatar: "SJ",
    avatarBg: "#c8f135",
    avatarColor: "#0a0a0a",
    svg: `<svg width="100%" height="100%" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="background:#0b1120;">
            <circle cx="200" cy="120" r="100" stroke="#c8f135" stroke-width="1" stroke-dasharray="4 8" opacity="0.3"/>
            <circle cx="200" cy="120" r="60" stroke="#c8f135" stroke-width="2" opacity="0.5"/>
            <circle cx="200" cy="120" r="20" fill="#c8f135" opacity="0.8"/>
            <path d="M50 40 L350 200" stroke="#c8f135" stroke-width="1" stroke-dasharray="5 5" opacity="0.2"/>
          </svg>`,
    body: `
      <p>For years, running complex machine learning tasks meant sending user data back to hefty GPU servers, incurring latency penalties, high infrastructure costs, and data leakage concerns. Today, a paradigm shift is underway. Running inference directly inside the browser sandbox is finally practical.</p>
      
      <h2>Why Client-Side AI?</h2>
      <p>Local execution solves three core bottlenecks: latency, bandwidth cost, and privacy. When code runs client-side, it eliminates the roundtrip to a remote server. Interactions become instantaneous, unlocking fluid UI flows like real-time text analysis or live object detection on high-refresh-rate webcams.</p>
      <blockquote>"By executing machine learning models directly on the client, web apps can operate fully offline while maintaining absolute compliance with privacy acts like GDPR and HIPAA."</blockquote>
      
      <h2>Technological Pillars: WASM, WebGPU &amp; WebGL</h2>
      <p>This revolution is fueled by browser hardware acceleration. WebAssembly (Wasm) provides near-native execution speed for traditional CPU operations. Simultaneously, WebGL and the new WebGPU standard allow Javascript to tap directly into client graphics hardware, enabling highly parallelized tensor calculations.</p>
      <p>For instance, standard models compiled for web runtimes (such as ONNX models or TensorFlow.js instances) can query physical cores directly. Here is a simple demonstration of importing and executing an ONNX runtime session locally in browser memory:</p>
      
      <pre><code>// Importing client-side ONNX Web Runtime
import * as ort from 'onnxruntime-web';

async function runLocalInference(inputData) {
  // Load local pre-compiled model file
  const session = await ort.InferenceSession.create('./ai_model.onnx');
  
  // Package input tensors
  const inputTensor = new ort.Tensor('float32', inputData, [1, 10]);
  const feeds = { input: inputTensor };
  
  // Execute and read predictions instantly
  const results = await session.run(feeds);
  console.log("Prediction finished client-side:", results.output.data);
}</code></pre>
      
      <h2>Absolute Privacy by Design</h2>
      <p>Because files are parsed and evaluated inside the local browser context, no database tables on cloud servers store private credentials. A user can drag a bank statement or purchase ledger image directly into a container, extract layout grids, compile totals, and close the tab without a single byte escaping their machine. This is secure user-experience design at its peak.</p>
    `
  },
  "local-storage": {
    title: "Leveraging Local Browser Storage for Offline Web Apps",
    category: "Development",
    date: "July 7, 2026",
    readTime: "5 min read",
    author: "Marcus Evans",
    avatar: "ME",
    avatarBg: "#2563eb",
    avatarColor: "#ffffff",
    svg: `<svg width="100%" height="100%" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="background:#131b2e;">
            <rect x="50" y="50" width="300" height="140" rx="8" stroke="#334155" stroke-width="2"/>
            <line x1="50" y1="85" x2="350" y2="85" stroke="#334155" stroke-width="2"/>
            <circle cx="70" cy="67" r="4" fill="#ef4444"/>
            <circle cx="85" cy="67" r="4" fill="#f59e0b"/>
            <circle cx="100" cy="67" r="4" fill="#10b981"/>
            <path d="M90 115 L140 165 M140 115 L90 165" stroke="#c8f135" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
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
};

export default function BlogPost() {
  const [searchParams] = useSearchParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);

  const postId = searchParams.get('id');

  // Track reading progress scroll position
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setReadingProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch article
  useEffect(() => {
    const getPost = async () => {
      setLoading(true);
      if (!postId) {
        setPost(null);
        setLoading(false);
        return;
      }

      // 1. Try Supabase
      if (SUPABASE_URL && SUPABASE_ANON_KEY) {
        try {
          const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
          const { data, error } = await supabaseClient
            .from('blogs')
            .select('*')
            .eq('id', postId)
            .single();

          if (!error && data) {
            setPost({
              title: data.title,
              category: data.category,
              date: data.date,
              readTime: data.read_time,
              author: data.author,
              avatar: data.avatar,
              avatarBg: data.avatar_bg,
              avatarColor: data.avatar_color,
              svg: data.svg,
              body: data.body
            });
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn("Supabase fetch failed on Post detail, checking local storage:", err);
        }
      }

      // 2. Try LocalStorage
      const stored = localStorage.getItem('parchilo_blogs');
      if (stored) {
        const posts = JSON.parse(stored);
        const found = posts.find(p => p.id === postId);
        if (found) {
          setPost(found);
          setLoading(false);
          return;
        }
      }

      // 3. Try Fallback Seeds
      const seeded = fallbackSeedPosts[postId];
      if (seeded) {
        setPost(seeded);
      } else {
        setPost(null);
      }
      setLoading(false);
    };

    getPost();
  }, [postId]);

  // Share handler
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title || 'Parchilo Post',
        url: window.location.href,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="article-wrap" style={{ textAlign: 'center', padding: '160px 0' }}>
        <div className="spinner" style={{ borderTopColor: 'var(--black)', margin: '0 auto 16px' }}></div>
        <p>Loading article content...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Scroll indicator bar */}
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          id="readingProgress" 
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <main className="article-wrap">
        {post ? (
          <article className="article-container">
            <div className="article-header">
              <span className="article-category">{post.category}</span>
              <h1 className="article-title">{post.title}</h1>
              
              <div className="article-meta">
                <div className="author-block">
                  <div 
                    className="author-avatar" 
                    style={{ background: post.avatarBg || '#000', color: post.avatarColor || '#fff' }}
                  >
                    {post.avatar}
                  </div>
                  <div className="author-meta-text">
                    <span className="author-name">{post.author}</span>
                    <span className="publish-date">Published on {post.date}</span>
                  </div>
                </div>

                <div className="share-row">
                  <button className="btn-share" onClick={handleShare} title="Copy article link">
                    <Share2 size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Visual Cover */}
            <div 
              className="article-cover" 
              dangerouslySetInnerHTML={{ __html: post.svg }}
            />

            {/* Main Body */}
            <div 
              className="article-body" 
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          </article>
        ) : (
          <div className="not-found-block" style={{ display: 'block' }}>
            <AlertCircle size={48} />
            <h2>Article Not Found</h2>
            <p>The post you are trying to read does not exist in local database index or Supabase storage.</p>
            <Link to="/blogs" className="btn-modal-action primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
              Return to Blogs
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
