import React, { type ReactNode } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
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

    const components: Components = {
      code: ({ node, inline, className, children, ...props }) => {
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
      h1: ({ children, ...props }) =>
        React.createElement('h1', props, children),
      h2: ({ children, ...props }) =>
        React.createElement('h2', props, children),
      h3: ({ children, ...props }) =>
        React.createElement('h3', props, children),
      h4: ({ children, ...props }) =>
        React.createElement('h4', props, children),
      h5: ({ children, ...props }) =>
        React.createElement('h5', props, children),
      h6: ({ children, ...props }) =>
        React.createElement('h6', props, children),
      p: ({ children, ...props }) => React.createElement('p', props, children),
      strong: ({ children, ...props }) =>
        React.createElement('strong', props, children),
      em: ({ children, ...props }) =>
        React.createElement('em', props, children),
      ul: ({ children, ...props }) =>
        React.createElement('ul', props, children),
      ol: ({ children, ...props }) =>
        React.createElement('ol', props, children),
      li: ({ children, ...props }) =>
        React.createElement('li', props, children),
      a: ({ href, children, ...props }) =>
        React.createElement('a', { href, ...props }, children),
      table: ({ children, ...props }) =>
        React.createElement('table', props, children),
      thead: ({ children, ...props }) =>
        React.createElement('thead', props, children),
      tbody: ({ children, ...props }) =>
        React.createElement('tbody', props, children),
      tr: ({ children, ...props }) =>
        React.createElement('tr', props, children),
      th: ({ children, ...props }) =>
        React.createElement('th', props, children),
      td: ({ children, ...props }) =>
        React.createElement('td', props, children),
      del: ({ children, ...props }) =>
        React.createElement('del', props, children),
      input: ({ type, checked, disabled, ...props }) =>
        React.createElement('input', { type, checked, disabled, ...props }),
    };

    return React.createElement(
      ReactMarkdown,
      {
        remarkPlugins,
        components,
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
