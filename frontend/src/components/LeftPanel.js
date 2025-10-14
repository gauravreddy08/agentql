import React, { useState } from 'react';
import './LeftPanel.css';
import { ChevronDown } from 'lucide-react';

const EXAMPLES = [
  {
    name: 'YC Jobs',
    url: 'https://www.ycombinator.com/jobs',
    schema: `{
  job_categories[]
  jobs[] {
    company_name
    role
  }
}`
  },
  {
    name: 'Books to Scrape',
    url: 'https://books.toscrape.com/',
    schema: `{
  products[] {
    product_name
    rating
    price
  }
}`
  },
  {
    name: 'Amazon iPhone 17',
    url: 'https://www.amazon.com/s?k=iphone+17',
    schema: `{
  products[] {
    product_name
    price
    rating
    rating_count
  }
}`
  }
];

const LeftPanel = ({
  url,
  setUrl,
  schema,
  setSchema,
  extractedData,
  isLoading,
  error,
  onFetchData,
  onUrlBlur,
  isPreloading
}) => {
  const [showExamples, setShowExamples] = useState(false);

  const getLineNumbers = () => {
    const lines = schema.split('\n');
    return lines.map((_, index) => index + 1);
  };

  const handleExampleSelect = (example) => {
    setUrl(example.url);
    setSchema(example.schema);
    setShowExamples(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const { selectionStart, selectionEnd, value } = e.target;
      
      if (e.shiftKey) {
        // Shift+Tab: Unindent
        const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
        const lineEnd = value.indexOf('\n', selectionStart);
        const line = value.substring(lineStart, lineEnd === -1 ? value.length : lineEnd);
        
        if (line.startsWith('  ')) {
          const newValue = value.substring(0, lineStart) + line.substring(2) + value.substring(lineEnd === -1 ? value.length : lineEnd);
          setSchema(newValue);
          setTimeout(() => {
            e.target.selectionStart = e.target.selectionEnd = selectionStart - 2;
          }, 0);
        }
      } else {
        // Tab: Insert 2 spaces
        const newValue = value.substring(0, selectionStart) + '  ' + value.substring(selectionEnd);
        setSchema(newValue);
        setTimeout(() => {
          e.target.selectionStart = e.target.selectionEnd = selectionStart + 2;
        }, 0);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const { selectionStart, value } = e.target;
      
      // Find the start of the current line
      const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
      const currentLine = value.substring(lineStart, selectionStart);
      
      // Count leading spaces
      const indent = currentLine.match(/^\s*/)[0];
      
      // Insert newline with same indentation
      const newValue = value.substring(0, selectionStart) + '\n' + indent + value.substring(selectionStart);
      setSchema(newValue);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 1 + indent.length;
      }, 0);
    }
  };

  return (
    <div className="left-panel-card">
      {/* Top Controls */}
      <div className="controls-bar">
        <div className="examples-dropdown" onClick={() => setShowExamples(!showExamples)}>
          <span>Examples</span>
          <ChevronDown size={14} />
          {showExamples && (
            <div className="examples-menu">
              {EXAMPLES.map((example, index) => (
                <div 
                  key={index}
                  className="example-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExampleSelect(example);
                  }}
                >
                  {example.name}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <input
          type="text"
          className="url-input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={onUrlBlur}
          placeholder="Enter website URL..."
        />
        
        <button 
          className="fetch-button"
          onClick={onFetchData}
          disabled={isLoading || isPreloading}
        >
          {isLoading ? 'Fetching...' : isPreloading ? 'Pre-loading...' : 'Fetch Data'}
        </button>
      </div>

      {/* Schema Editor with Line Numbers */}
      <div className="editor-container">
        <div className="line-numbers">
          {getLineNumbers().map(num => (
            <div key={num} className="line-number">{num}</div>
          ))}
        </div>
        <textarea
          className="schema-editor"
          value={schema}
          onChange={(e) => setSchema(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your schema here..."
          spellCheck="false"
        />
      </div>

      {/* Output Section */}
      {(extractedData || error) && (
        <div className="output-section">
          {error && (
            <pre className="output-content error-content">{error}</pre>
          )}
          {extractedData && !error && (
            <pre className="output-content">
              {JSON.stringify(extractedData, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default LeftPanel;