/**
 * Component Interface Contracts for Markdown Editor
 * 
 * These interfaces define the contracts between components
 * for the markdown editor feature. All components must
 * implement these interfaces to ensure proper integration.
 */

import { ReactNode } from 'react';

// ===== Core Data Types =====

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

// ===== Component Props Contracts =====

/**
 * Container Component: MarkdownEditor
 * Main container that manages state and coordinates child components
 */
export interface MarkdownEditorProps {
  /** Optional initial content for the editor */
  initialContent?: string;
  /** Optional initial settings */
  initialSettings?: Partial<EditorSettings>;
  /** Callback fired when content changes (for testing/integration) */
  onContentChange?: (content: EditorContent) => void;
  /** CSS class name for styling */
  className?: string;
  /** Test ID for e2e testing */
  'data-testid'?: string;
}

/**
 * Presentational Component: EditorPane
 * Text input area for markdown editing
 */
export interface EditorPaneProps {
  /** Current raw markdown content */
  content: string;
  /** Callback when user types in editor */
  onChange: (content: string) => void;
  /** Whether syntax highlighting is enabled */
  syntaxHighlighting: boolean;
  /** Theme for styling */
  theme: 'light' | 'dark';
  /** Placeholder text when empty */
  placeholder?: string;
  /** Whether the editor is disabled */
  disabled?: boolean;
  /** Test ID for e2e testing */
  'data-testid'?: string;
}

/**
 * Presentational Component: PreviewPane
 * Displays rendered markdown content
 */
export interface PreviewPaneProps {
  /** Processed markdown content as React elements */
  content: ReactNode | null;
  /** Whether the preview is currently processing */
  isProcessing: boolean;
  /** Theme for styling */
  theme: 'light' | 'dark';
  /** Whether the pane is visible */
  visible: boolean;
  /** Error message if processing failed */
  error?: string | null;
  /** Test ID for e2e testing */
  'data-testid'?: string;
}

/**
 * Presentational Component: SplitLayout
 * Layout wrapper for editor and preview panes
 */
export interface SplitLayoutProps {
  /** Left side content (editor) */
  left: ReactNode;
  /** Right side content (preview) */
  right: ReactNode;
  /** Whether right pane is visible */
  rightVisible: boolean;
  /** Initial split ratio (0-1) */
  splitRatio?: number;
  /** Whether split is resizable */
  resizable?: boolean;
  /** Theme for styling */
  theme: 'light' | 'dark';
  /** Test ID for e2e testing */
  'data-testid'?: string;
}

// ===== Hook Contracts =====

/**
 * Custom Hook: useMarkdownProcessor
 * Handles markdown parsing and processing
 */
export interface UseMarkdownProcessorResult {
  /** Process raw markdown to React elements */
  processContent: (raw: string) => Promise<ReactNode>;
  /** Whether processing is currently happening */
  isProcessing: boolean;
  /** Last processing error if any */
  error: string | null;
  /** Clear any existing error */
  clearError: () => void;
}

export interface UseMarkdownProcessorOptions {
  /** Debounce delay in milliseconds */
  debounceMs?: number;
  /** Maximum content length to process */
  maxLength?: number;
  /** Enable GitHub Flavored Markdown */
  enableGFM?: boolean;
}

/**
 * Custom Hook: useDebounced
 * Provides debounced values
 */
export interface UseDebouncedResult<T> {
  /** The debounced value */
  debouncedValue: T;
  /** Whether the value is currently pending (being debounced) */
  isPending: boolean;
  /** Force immediate update of debounced value */
  forceUpdate: () => void;
}

// ===== Service Contracts =====

/**
 * Markdown Parser Service
 * Handles the actual markdown to React conversion
 */
export interface MarkdownParserService {
  /** Parse markdown string to React elements */
  parse(content: string): Promise<ReactNode>;
  /** Validate markdown content */
  validate(content: string): ValidationResult;
  /** Get supported markdown features */
  getSupportedFeatures(): string[];
}

// ===== Event Contracts =====

/**
 * Editor Events
 * Type-safe event handling for editor interactions
 */
export interface EditorEvents {
  /** Content changed in editor */
  onContentChange: (content: string) => void;
  /** Editor gained focus */
  onFocus: () => void;
  /** Editor lost focus */
  onBlur: () => void;
  /** User triggered save shortcut (Ctrl+S) */
  onSaveShortcut: () => void;
  /** Content validation failed */
  onValidationError: (error: string) => void;
}

// ===== Error Handling =====

/**
 * Error types that can occur in the markdown editor
 */
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

// ===== Testing Contracts =====

/**
 * Test utilities and contracts for component testing
 */
export interface EditorTestHelpers {
  /** Set content in editor */
  setContent: (content: string) => void;
  /** Get current content */
  getContent: () => string;
  /** Get rendered preview content */
  getPreviewContent: () => HTMLElement | null;
  /** Trigger content change */
  triggerChange: (content: string) => void;
  /** Wait for processing to complete */
  waitForProcessing: () => Promise<void>;
}

// ===== Configuration =====

/**
 * Configuration options for the markdown editor
 */
export interface MarkdownEditorConfig {
  /** Maximum content length */
  maxContentLength: number;
  /** Debounce delay for real-time updates */
  debounceDelay: number;
  /** Default theme */
  defaultTheme: 'light' | 'dark';
  /** Enable syntax highlighting by default */
  defaultSyntaxHighlighting: boolean;
  /** Show preview pane by default */
  defaultPreviewEnabled: boolean;
}

export const DEFAULT_CONFIG: MarkdownEditorConfig = {
  maxContentLength: 100000,
  debounceDelay: 300,
  defaultTheme: 'light',
  defaultSyntaxHighlighting: true,
  defaultPreviewEnabled: true,
};