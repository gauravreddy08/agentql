import React, { useState, useRef } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import Toast from './components/Toast';
import { fetchData, scrapeWebpage } from './services/api';

function App() {
  const [url, setUrl] = useState('https://www.ycombinator.com/jobs');
  const [schema, setSchema] = useState(`{
  job_categories[]
  jobs[] {
    company_name
    role
  }
}`);
  const [extractedData, setExtractedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [scrapedContent, setScrapedContent] = useState(null);
  const [isPreloading, setIsPreloading] = useState(false);
  const preloadTimeoutRef = useRef(null);
  const lastScrapedUrlRef = useRef(null);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const handleUrlBlur = () => {
    // Clear any existing timeout
    if (preloadTimeoutRef.current) {
      clearTimeout(preloadTimeoutRef.current);
    }
    
    // Debounce: wait 500ms after blur before pre-loading
    preloadTimeoutRef.current = setTimeout(async () => {
      if (!url || isPreloading) return;
      
      // Only preload if URL has actually changed
      if (lastScrapedUrlRef.current === url) return;
      
      setIsPreloading(true);
      
      try {
        const result = await scrapeWebpage(url);
        setScrapedContent(result);
        lastScrapedUrlRef.current = url;
        console.log('Pre-loaded successfully!');
      } catch (err) {
        console.error('Pre-scraping failed:', err);
        // Silently fail - will scrape normally on fetch
        setScrapedContent(null);
      } finally {
        setIsPreloading(false);
      }
    }, 500);
  };

  const handleFetchData = async () => {
    setIsLoading(true);
    setError(null);
    setExtractedData(null);
    showToast('Generating response...', 'loading');
    
    try {
      // Use preloaded content if available for the same URL
      const preloadedContent = scrapedContent && scrapedContent.url === url ? scrapedContent : null;
      const result = await fetchData(url, schema, preloadedContent);
      setExtractedData(result);
      showToast('Data extracted successfully!', 'success');
    } catch (err) {
      setError(err.message);
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <Navbar />
      <div className="main-content">
        <LeftPanel
          url={url}
          setUrl={setUrl}
          schema={schema}
          setSchema={setSchema}
          extractedData={extractedData}
          isLoading={isLoading}
          error={error}
          onFetchData={handleFetchData}
          onUrlBlur={handleUrlBlur}
          isPreloading={isPreloading}
        />
        <RightPanel url={url} />
      </div>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}

export default App;