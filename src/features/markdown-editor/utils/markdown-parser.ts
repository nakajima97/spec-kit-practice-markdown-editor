import React, { type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ValidationResult } from '../types/markdown';

export interface MarkdownParserOptions {
  enableGFM?: boolean;
  maxLength?: number;
}

export class MarkdownParser {
  private options: Required<MarkdownParserOptions>;

  constructor(options: MarkdownParserOptions = {}) {
    this.options = {
      enableGFM: true,
      maxLength: 100000,
      ...options,
    };
  }

  async parse(content: string): Promise<ReactNode> {
    const validation = this.validate(content);
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid content');
    }

    if (!content.trim()) {
      return null;
    }

    const remarkPlugins = this.options.enableGFM ? [remarkGfm] : [];

    return React.createElement(
      ReactMarkdown,
      {
        remarkPlugins,
        components: {
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';

            if (!inline && language) {
              return React.createElement(
                'pre',
                {
                  className: `language-${language}`,
                },
                React.createElement(
                  'code',
                  {
                    className: `language-${language}`,
                    ...props,
                  },
                  children,
                ),
              );
            }

            return React.createElement(
              'code',
              {
                className,
                ...props,
              },
              children,
            );
          },
          h1: ({ children, ...props }: any) =>
            React.createElement('h1', props, children),
          h2: ({ children, ...props }: any) =>
            React.createElement('h2', props, children),
          h3: ({ children, ...props }: any) =>
            React.createElement('h3', props, children),
          h4: ({ children, ...props }: any) =>
            React.createElement('h4', props, children),
          h5: ({ children, ...props }: any) =>
            React.createElement('h5', props, children),
          h6: ({ children, ...props }: any) =>
            React.createElement('h6', props, children),
          p: ({ children, ...props }: any) =>
            React.createElement('p', props, children),
          strong: ({ children, ...props }: any) =>
            React.createElement('strong', props, children),
          em: ({ children, ...props }: any) =>
            React.createElement('em', props, children),
          ul: ({ children, ...props }: any) =>
            React.createElement('ul', props, children),
          ol: ({ children, ...props }: any) =>
            React.createElement('ol', props, children),
          li: ({ children, ...props }: any) =>
            React.createElement('li', props, children),
          a: ({ href, children, ...props }: any) =>
            React.createElement('a', { href, ...props }, children),
          table: ({ children, ...props }: any) =>
            React.createElement('table', props, children),
          thead: ({ children, ...props }: any) =>
            React.createElement('thead', props, children),
          tbody: ({ children, ...props }: any) =>
            React.createElement('tbody', props, children),
          tr: ({ children, ...props }: any) =>
            React.createElement('tr', props, children),
          th: ({ children, ...props }: any) =>
            React.createElement('th', props, children),
          td: ({ children, ...props }: any) =>
            React.createElement('td', props, children),
          del: ({ children, ...props }: any) =>
            React.createElement('del', props, children),
          input: ({ type, checked, disabled, ...props }: any) =>
            React.createElement('input', { type, checked, disabled, ...props }),
        },
      },
      content,
    );
  }

  validate(content: string): ValidationResult {
    if (typeof content !== 'string') {
      return {
        valid: false,
        error: 'Content must be a string',
      };
    }

    if (content.length > this.options.maxLength) {
      return {
        valid: false,
        error: `Content exceeds maximum length of ${this.options.maxLength} characters`,
      };
    }

    try {
      // Basic UTF-8 validation
      new TextEncoder().encode(content);
    } catch (error) {
      return {
        valid: false,
        error: 'Invalid character encoding',
      };
    }

    return {
      valid: true,
      error: null,
    };
  }

  getSupportedFeatures(): string[] {
    const baseFeatures = [
      'headers',
      'paragraphs',
      'emphasis',
      'strong',
      'lists',
      'links',
      'code-blocks',
      'inline-code',
    ];

    if (this.options.enableGFM) {
      return [
        ...baseFeatures,
        'tables',
        'strikethrough',
        'task-lists',
        'autolinks',
      ];
    }

    return baseFeatures;
  }
}

// Default parser instance
export const defaultMarkdownParser = new MarkdownParser({
  enableGFM: true,
  maxLength: 100000,
});

// Utility functions for common use cases
export const parseMarkdown = (content: string): Promise<ReactNode> => {
  return defaultMarkdownParser.parse(content);
};

export const validateMarkdown = (content: string): ValidationResult => {
  return defaultMarkdownParser.validate(content);
};

export const isValidUTF8 = (str: string): boolean => {
  try {
    new TextEncoder().encode(str);
    return true;
  } catch {
    return false;
  }
};
