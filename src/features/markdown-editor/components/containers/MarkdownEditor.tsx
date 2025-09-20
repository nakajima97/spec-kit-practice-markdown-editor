'use client';

import clsx from 'clsx';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useDebounced } from '../../hooks/useDebounced';
import { useMarkdownProcessor } from '../../hooks/useMarkdownProcessor';
import {
  DEFAULT_CONFIG,
  type EditorContent,
  type EditorSettings,
} from '../../types/markdown';
import { EditorPane } from '../presentational/EditorPane';
import { PreviewPane } from '../presentational/PreviewPane';
import { SplitLayout } from '../presentational/SplitLayout';

export interface MarkdownEditorProps {
  initialContent?: string;
  initialSettings?: Partial<EditorSettings>;
  onContentChange?: (content: EditorContent) => void;
  className?: string;
  'data-testid'?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialContent = '',
  initialSettings = {},
  onContentChange,
  className,
  'data-testid': testId,
}) => {
  // Initialize settings with defaults
  const [settings] = useState<EditorSettings>({
    theme: DEFAULT_CONFIG.defaultTheme,
    previewEnabled: DEFAULT_CONFIG.defaultPreviewEnabled,
    syntaxHighlighting: DEFAULT_CONFIG.defaultSyntaxHighlighting,
    livePreview: true,
    ...initialSettings,
  });

  // Content state
  const [rawContent, setRawContent] = useState(initialContent);
  const [processedContent, setProcessedContent] =
    useState<React.ReactNode | null>(null);
  const [lastModified, setLastModified] = useState(new Date());

  // Debounce content for processing
  const { debouncedValue: debouncedContent, isPending } = useDebounced(
    rawContent,
    DEFAULT_CONFIG.debounceDelay,
  );

  // Markdown processor
  const { processContent, isProcessing, error, clearError } =
    useMarkdownProcessor({
      debounceMs: DEFAULT_CONFIG.debounceDelay,
      maxLength: DEFAULT_CONFIG.maxContentLength,
      enableGFM: true,
    });

  // Process content when debounced value changes
  useEffect(() => {
    const processDebounced = async () => {
      if (!settings.livePreview) return;

      try {
        clearError();
        const processed = await processContent(debouncedContent);
        setProcessedContent(processed);
      } catch (err) {
        // Error is already handled by the hook
        setProcessedContent(null);
      }
    };

    processDebounced();
  }, [debouncedContent, settings.livePreview, processContent, clearError]);

  // Handle content changes
  const handleContentChange = useCallback((newContent: string) => {
    setRawContent(newContent);
    setLastModified(new Date());
  }, []);

  // Notify parent of content changes
  useEffect(() => {
    if (onContentChange) {
      const editorContent: EditorContent = {
        raw: rawContent,
        processed: processedContent,
        lastModified,
        isEmpty: rawContent.trim().length === 0,
      };
      onContentChange(editorContent);
    }
  }, [rawContent, processedContent, lastModified, onContentChange]);

  const leftPane = (
    <EditorPane
      content={rawContent}
      onChange={handleContentChange}
      syntaxHighlighting={settings.syntaxHighlighting}
      theme={settings.theme}
      placeholder="Start typing your markdown..."
      data-testid="editor-pane"
    />
  );

  const rightPane = (
    <PreviewPane
      content={processedContent}
      isProcessing={isProcessing || isPending}
      theme={settings.theme}
      visible={settings.previewEnabled}
      error={error}
      data-testid="preview-pane"
    />
  );

  return (
    <div
      className={clsx('markdown-editor', `theme-${settings.theme}`, className)}
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      data-testid={testId}
    >
      <SplitLayout
        left={leftPane}
        right={rightPane}
        rightVisible={settings.previewEnabled}
        splitRatio={0.5}
        resizable={false}
        theme={settings.theme}
        data-testid="split-layout"
      />
    </div>
  );
};
