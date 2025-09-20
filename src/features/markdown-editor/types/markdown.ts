/**
 * Type definitions for Markdown Editor feature
 * Based on data model and component contracts
 */

import type { ReactNode } from 'react';

export interface EditorContent {
  raw: string;
  processed: ReactNode | null;
  lastModified: Date;
  isEmpty: boolean;
}

export interface EditorSettings {
  theme: 'light' | 'dark';
  previewEnabled: boolean;
  syntaxHighlighting: boolean;
  livePreview: boolean;
}

export interface ValidationResult {
  valid: boolean;
  error: string | null;
}

export interface MarkdownEditorState {
  content: EditorContent;
  settings: EditorSettings;
  ui: {
    isProcessing: boolean;
    hasError: boolean;
    errorMessage: string | null;
  };
}

export type MarkdownEditorError =
  | 'CONTENT_TOO_LARGE'
  | 'INVALID_MARKDOWN'
  | 'PROCESSING_FAILED'
  | 'RENDER_ERROR'
  | 'VALIDATION_ERROR';

export interface EditorErrorInfo {
  type: MarkdownEditorError;
  message: string;
  timestamp: Date;
  recoverable: boolean;
}

export interface MarkdownEditorConfig {
  maxContentLength: number;
  debounceDelay: number;
  defaultTheme: 'light' | 'dark';
  defaultSyntaxHighlighting: boolean;
  defaultPreviewEnabled: boolean;
}

export const DEFAULT_CONFIG: MarkdownEditorConfig = {
  maxContentLength: 100000,
  debounceDelay: 300,
  defaultTheme: 'light',
  defaultSyntaxHighlighting: true,
  defaultPreviewEnabled: true,
};
