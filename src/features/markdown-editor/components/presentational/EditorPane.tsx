import clsx from 'clsx';
import type React from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';

export interface EditorPaneProps {
  content: string;
  onChange: (content: string) => void;
  syntaxHighlighting: boolean;
  theme: 'light' | 'dark';
  placeholder?: string;
  disabled?: boolean;
  'data-testid'?: string;
}

export const EditorPane: React.FC<EditorPaneProps> = ({
  content,
  onChange,
  syntaxHighlighting,
  theme,
  placeholder = 'Start typing your markdown...',
  disabled = false,
  'data-testid': testId,
}) => {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Tab key to insert tabs instead of losing focus
    if (event.key === 'Tab') {
      event.preventDefault();
      const textarea = event.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;

      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);

      // Restore cursor position after the inserted tab
      setTimeout(() => {
        textarea.setSelectionRange(start + 2, start + 2);
      }, 0);
    }
  };

  return (
    <div
      className={clsx('editor-pane', `theme-${theme}`, {
        'syntax-highlighting': syntaxHighlighting,
        disabled: disabled,
      })}
      style={{
        height: '100%',
        width: '100%',
        position: 'relative',
        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
        border: `1px solid ${theme === 'dark' ? '#444' : '#e0e0e0'}`,
      }}
      data-syntax-highlighting={syntaxHighlighting.toString()}
      data-testid={testId}
    >
      <textarea
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        aria-label="Markdown editor"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          outline: 'none',
          resize: 'none',
          padding: '16px',
          fontSize: '14px',
          lineHeight: '1.5',
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          backgroundColor: 'transparent',
          color: theme === 'dark' ? '#ffffff' : '#000000',
        }}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />

      {syntaxHighlighting && (
        <div
          className="syntax-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            padding: '16px',
            fontSize: '14px',
            lineHeight: '1.5',
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            whiteSpace: 'pre-wrap',
            overflow: 'hidden',
            opacity: 0.3,
          }}
          aria-hidden="true"
        >
          {/* Syntax highlighting would be rendered here */}
        </div>
      )}
    </div>
  );
};
