import React, { useState, useEffect } from 'react';
import './RightPanel.css';
import { getScreenshot } from '../services/api';

const RightPanel = ({ url }) => {
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Debounce: wait 800ms after user stops typing before fetching
    const timeoutId = setTimeout(() => {
      const fetchScreenshot = async () => {
        if (!url) return;
        
        setLoading(true);
        setError(null);
        
        try {
          const screenshotData = await getScreenshot(url);
          setScreenshot(screenshotData);
        } catch (err) {
          console.error('Screenshot error:', err);
          setError('Failed to load webpage preview');
          setScreenshot(null);
        } finally {
          setLoading(false);
        }
      };

      fetchScreenshot();
    }, 800);

    // Cleanup: cancel the timeout if url changes before it fires
    return () => clearTimeout(timeoutId);
  }, [url]);

  return (
    <div className="right-panel-card">
      <div className="screenshot-wrapper">
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading webpage preview...</p>
          </div>
        )}
        
        {error && !screenshot && (
          <div className="error-state">
            <p>{error}</p>
            <p className="error-hint">Trying iframe fallback...</p>
            <iframe
              src={url}
              title="Webpage Preview"
              className="webpage-iframe"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
        )}
        
        {screenshot && (
          <img 
            src={`data:image/png;base64,${screenshot}`} 
            alt="Webpage Screenshot"
            className="webpage-screenshot"
          />
        )}
        
        {!loading && !screenshot && !error && (
          <iframe
            src={url}
            title="Webpage Preview"
            className="webpage-iframe"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        )}
      </div>
    </div>
  );
};

export default RightPanel;