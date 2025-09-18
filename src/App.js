// Save as: src/App.js
import React, { useState } from 'react';
import './App.css';

// --- Backend resolver ---
const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://127.0.0.1:5000'
    : 'https://ai4u-top10-backend.vercel.app');

const BACKEND_API = `${API_BASE}/api/generate-list`;

function App() {
  const [prompt, setPrompt] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const generateList = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(BACKEND_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          email: email.trim(),
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ success: false, error: 'Network error — please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai4u-glow" style={{ minHeight: '100vh', padding: '20px', color: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="ai4u-topbar">
            <span className="ai4u-logo">AI4U</span>
            <a
              href="https://AI4Utech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ai4u-link"
            >
              AI4Utech.com (Home)
            </a>
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '16px' }}>
            AI4U Top 10 Lists ✨
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '640px', margin: '0 auto' }}>
            AI-Researched & Endorsed Amazon Products — Real data and working affiliate links!
          </p>
        </div>

        {/* Input Section */}
        <div style={{ maxWidth: '600px', margin: '0 auto 40px auto' }}>
          <div className="ai4u-card" style={{ padding: '30px' }}>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., fantasy football trophies, organic chips, gaming laptops…"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
              }}
              onKeyDown={(e) => e.key === 'Enter' && !loading && generateList()}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="leehanna8@gmail.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
              }}
            />
            <button
              onClick={generateList}
              disabled={loading || !prompt.trim()}
              className="ai4u-btn"
              style={{ width: '100%', padding: '15px', fontSize: '18px' }}
            >
              {loading ? 'Researching products…' : 'Generate Top 10 List'}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {result.success ? (
              <div className="ai4u-card" style={{ padding: '30px' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>
                  {result.title}
                </h2>
                <p style={{ opacity: 0.9, marginBottom: '8px' }}>{result.intro}</p>
                <p style={{ fontSize: '14px', color: '#86efac' }}>
                  ✅ All products have REAL Amazon ASINs and working affiliate links!
                </p>
                {email && (
                  <p style={{ fontSize: '14px', color: '#93c5fd' }}>📧 Results sent to your email</p>
                )}

                <div style={{ display: 'grid', gap: '16px', marginTop: '20px' }}>
                  {result.products &&
                    result.products.map((product, index) => (
                      <div key={product.asin || index} className="ai4u-card" style={{ padding: '20px' }}>
                        <div className="ai4u-row" style={{ display: 'flex', gap: '16px' }}>
                          <div
                            className="ai4u-rank"
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'linear-gradient(135deg,#9333ea 0%,#ec4899 100%)',
                            }}
                          >
                            {index + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h3 style={{ marginBottom: '8px' }}>{product.title}</h3>
                            {product.image_url && (
                              <img src={product.image_url} alt={product.title} className="ai4u-img" />
                            )}
                            <p style={{ marginBottom: '6px' }}>
                              <strong>{product.price}</strong> ⭐ {product.rating}/5
                            </p>
                            <p style={{ marginBottom: '12px' }}>{product.description}</p>
                            <a
                              href={product.affiliate_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ai4u-btn"
                            >
                              🛒 View on Amazon
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <p style={{ fontSize: '14px', opacity: 0.8 }}>
                    Generated: {result.generated_at} | Affiliate ID: {result.affiliate_id}
                  </p>
                  <p style={{ fontSize: '12px', opacity: 0.8 }}>
                    Visit{' '}
                    <a
                      href="https://AI4Utech.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ai4u-link"
                    >
                      AI4Utech.com
                    </a>{' '}
                    for more lists.
                  </p>
                </div>
              </div>
            ) : (
              <div className="ai4u-card" style={{ padding: '16px', border: '1px solid red' }}>
                <p style={{ color: 'red' }}>Error: {result.error}</p>
              </div>
            )}
          </div>
        )}

        {/* Features */}
        <div
          style={{
            display: 'grid',
            gap: '16px',
            marginTop: '40px',
            gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
          }}
        >
          <div className="ai4u-card" style={{ padding: '20px', textAlign: 'center' }}>
            <h3>🎯 Unlimited Categories</h3>
            <p>From potato chips to baby products — any category works!</p>
          </div>
          <div className="ai4u-card" style={{ padding: '20px', textAlign: 'center' }}>
            <h3>✅ Real Amazon Data</h3>
            <p>Actual ASINs, current prices, real customer ratings</p>
          </div>
          <div className="ai4u-card" style={{ padding: '20px', textAlign: 'center' }}>
            <h3>📧 Results Sent</h3>
            <p>Results sent to your email</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
