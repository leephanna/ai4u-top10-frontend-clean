import React, { useState } from 'react';
import './App.css';

// Read backend URL from env var, with sensible fallbacks
const API_BASE =
  process.env.REACT_APP_API_URL?.replace(/\/+$/, '') ||
  (window.location.hostname === 'localhost'
    ? 'http://127.0.0.1:5000'
    : 'https://ai4u-top10-backend.vercel.app');

function App() {
  const [query, setQuery] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(`${API_BASE}/api/generate-list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query.trim(),
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResults(data);
      } else {
        setError(data.error || 'Failed to retrieve results from backend.');
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>AI4U Top 10 Lists ✨</h1>
        <p>AI-Researched & Endorsed Amazon Products - Real data and working affiliate links!</p>
      </header>

      <div className="search-container">
        <div className="search-box">
          <label>What products are you looking for?</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., vitamins, gaming headphones, baby toys..."
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleSearch()}
          />

          <label>Email address (optional - to receive your list)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />

          <button onClick={handleSearch} disabled={loading || !query.trim()}>
            {loading ? 'Searching...' : 'Generate Top 10 List'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}

      {results?.success && (
        <div className="results">
          <div className="results-header">
            <h2>{results.title}</h2>
            <p>{results.intro}</p>
            <p className="green-text">✅ All products have REAL Amazon ASINs and working affiliate links!</p>
            {email && <p className="blue-text">📧 List sent to your email!</p>}
          </div>

          <div className="product-list">
            {results.products.map((product, index) => (
              <div key={product.asin || index} className="product-card">
                <div className="product-number">{index + 1}</div>
                <div className="product-details">
                  <h3>{product.title}</h3>
                  <div className="product-meta">
                    <span className="price">{product.price}</span>
                    <span className="rating">⭐ {product.rating}/5</span>
                  </div>
                  <p>{product.description}</p>
                  <div className="product-actions">
                    <a
                      href={product.affiliate_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="amazon-button"
                    >
                      🛒 View on Amazon
                    </a>
                    <span className="asin">ASIN: {product.asin}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="results-footer">
            <p>Generated: {results.generated_at} | Affiliate ID: {results.affiliate_id}</p>
          </div>
        </div>
      )}

      <div className="features">
        <div className="feature-card">
          <h3>🎯 Unlimited Categories</h3>
          <p>From potato chips to baby products - any category works!</p>
        </div>
        <div className="feature-card">
          <h3>✅ Real Amazon Data</h3>
          <p>Actual ASINs, current prices, real customer ratings</p>
        </div>
        <div className="feature-card">
          <h3>💰 Revenue Ready</h3>
          <p>Working affiliate links with your ID: ai4u0c-20</p>
        </div>
      </div>
    </div>
  );
}

export default App;
