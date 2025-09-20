import clsx from 'clsx';
import type React from 'react';
import type { ReactNode } from 'react';

export interface PreviewPaneProps {
  content: ReactNode | null;
  isProcessing: boolean;
  theme: 'light' | 'dark';
  visible: boolean;
  error?: string | null;
  'data-testid'?: string;
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({
  content,
  isProcessing,
  theme,
  visible,
  error,
  'data-testid': testId,
}) => {
  const renderContent = () => {
    if (error) {
      return (
        <div
          className="error-state"
          style={{
            padding: '16px',
            color: '#d32f2f',
            backgroundColor: theme === 'dark' ? '#2e1515' : '#fef2f2',
            border: `1px solid ${theme === 'dark' ? '#5d2f2f' : '#fecaca'}`,
            borderRadius: '4px',
            margin: '16px',
          }}
          data-testid="error-message"
        >
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{error}</div>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>
            Please try editing your content to fix this issue.
          </div>
        </div>
      );
    }

    if (isProcessing) {
      return (
        <div
          className="processing-state"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100px',
            color: theme === 'dark' ? '#888' : '#666',
          }}
          data-testid="processing-indicator"
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                border: `2px solid ${theme === 'dark' ? '#444' : '#e0e0e0'}`,
                borderTop: `2px solid ${theme === 'dark' ? '#888' : '#666'}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 8px',
              }}
            />
            <div>Processing...</div>
          </div>
        </div>
      );
    }

    if (!content) {
      return (
        <div
          className="empty-state"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px',
            color: theme === 'dark' ? '#888' : '#666',
            fontStyle: 'italic',
          }}
        >
          Start typing to see preview...
        </div>
      );
    }

    return (
      <div
        className="content-wrapper"
        style={{
          padding: '16px',
          lineHeight: '1.6',
          color: theme === 'dark' ? '#ffffff' : '#000000',
        }}
      >
        {content}
      </div>
    );
  };

  return (
    <div
      className={clsx('preview-pane', 'scrollable', `theme-${theme}`, {
        hidden: !visible,
      })}
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
        border: `1px solid ${theme === 'dark' ? '#444' : '#e0e0e0'}`,
        overflow: 'auto',
        display: visible ? 'block' : 'none',
      }}
      role="region"
      aria-label="Markdown preview"
      data-testid={testId}
    >
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .preview-pane h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
          border-bottom: 1px solid ${theme === 'dark' ? '#444' : '#e0e0e0'};
          padding-bottom: 0.3em;
        }
        
        .preview-pane h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.83em 0;
          border-bottom: 1px solid ${theme === 'dark' ? '#444' : '#e0e0e0'};
          padding-bottom: 0.3em;
        }
        
        .preview-pane h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 1em 0;
        }
        
        .preview-pane h4,
        .preview-pane h5,
        .preview-pane h6 {
          font-weight: bold;
          margin: 1.33em 0;
        }
        
        .preview-pane p {
          margin: 1em 0;
        }
        
        .preview-pane ul,
        .preview-pane ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        
        .preview-pane li {
          margin: 0.5em 0;
        }
        
        .preview-pane code {
          background-color: ${theme === 'dark' ? '#2d2d2d' : '#f5f5f5'};
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: Monaco, Menlo, "Ubuntu Mono", monospace;
          font-size: 0.9em;
        }
        
        .preview-pane pre {
          background-color: ${theme === 'dark' ? '#2d2d2d' : '#f5f5f5'};
          padding: 1em;
          border-radius: 4px;
          overflow-x: auto;
          margin: 1em 0;
        }
        
        .preview-pane pre code {
          background-color: transparent;
          padding: 0;
        }
        
        .preview-pane table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }
        
        .preview-pane th,
        .preview-pane td {
          border: 1px solid ${theme === 'dark' ? '#444' : '#e0e0e0'};
          padding: 0.5em;
          text-align: left;
        }
        
        .preview-pane th {
          background-color: ${theme === 'dark' ? '#2d2d2d' : '#f5f5f5'};
          font-weight: bold;
        }
        
        .preview-pane a {
          color: ${theme === 'dark' ? '#4fc3f7' : '#1976d2'};
          text-decoration: none;
        }
        
        .preview-pane a:hover {
          text-decoration: underline;
        }
        
        .preview-pane del {
          text-decoration: line-through;
          opacity: 0.7;
        }
        
        .preview-pane input[type="checkbox"] {
          margin-right: 0.5em;
        }
      `}</style>

      {renderContent()}
    </div>
  );
};
