import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useMarkdownProcessor } from '../useMarkdownProcessor';

describe('useMarkdownProcessor', () => {
  it('returns initial state correctly', () => {
    const { result } = renderHook(() => useMarkdownProcessor());

    expect(result.current.isProcessing).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.processContent).toBe('function');
    expect(typeof result.current.clearError).toBe('function');
  });

  it('processes simple markdown content', async () => {
    const { result } = renderHook(() => useMarkdownProcessor());

    const processedContent =
      await result.current.processContent('# Hello World');

    expect(processedContent).toBeDefined();
    expect(processedContent).toMatchObject({
      type: 'h1',
      props: {
        children: 'Hello World',
      },
    });
  });

  it('processes bold and italic text', async () => {
    const { result } = renderHook(() => useMarkdownProcessor());

    const processedContent = await result.current.processContent(
      '**bold** and *italic*',
    );

    expect(processedContent).toBeDefined();
    // Should contain strong and em elements
    expect(JSON.stringify(processedContent)).toContain('strong');
    expect(JSON.stringify(processedContent)).toContain('em');
  });

  it('processes lists correctly', async () => {
    const { result } = renderHook(() => useMarkdownProcessor());

    const markdown = '- Item 1\n- Item 2\n- Item 3';
    const processedContent = await result.current.processContent(markdown);

    expect(processedContent).toBeDefined();
    expect(JSON.stringify(processedContent)).toContain('ul');
    expect(JSON.stringify(processedContent)).toContain('li');
  });

  it('processes code blocks with syntax highlighting', async () => {
    const { result } = renderHook(() =>
      useMarkdownProcessor({
        enableGFM: true,
      }),
    );

    const markdown = '```javascript\nconst hello = "world";\n```';
    const processedContent = await result.current.processContent(markdown);

    expect(processedContent).toBeDefined();
    expect(JSON.stringify(processedContent)).toContain('code');
  });

  it('handles processing state during async operation', async () => {
    const { result } = renderHook(() => useMarkdownProcessor());

    const processPromise = result.current.processContent('# Processing test');

    // Should be processing immediately
    expect(result.current.isProcessing).toBe(true);

    await processPromise;

    // Should complete processing
    await waitFor(() => {
      expect(result.current.isProcessing).toBe(false);
    });
  });

  it('handles content that exceeds maximum length', async () => {
    const { result } = renderHook(() =>
      useMarkdownProcessor({
        maxLength: 100,
      }),
    );

    const longContent = 'x'.repeat(101);

    try {
      await result.current.processContent(longContent);
    } catch (error) {
      // Should throw or set error state
    }

    await waitFor(() => {
      expect(result.current.error).toContain('maximum length');
    });
  });

  it('clears errors when clearError is called', async () => {
    const { result } = renderHook(() =>
      useMarkdownProcessor({
        maxLength: 10,
      }),
    );

    // Trigger an error
    try {
      await result.current.processContent('x'.repeat(20));
    } catch (error) {
      // Expected to fail
    }

    await waitFor(() => {
      expect(result.current.error).not.toBe(null);
    });

    // Clear the error
    result.current.clearError();

    expect(result.current.error).toBe(null);
  });

  it('debounces multiple rapid calls', async () => {
    const { result } = renderHook(() =>
      useMarkdownProcessor({
        debounceMs: 100,
      }),
    );

    // Make multiple rapid calls
    const promise1 = result.current.processContent('# First');
    const promise2 = result.current.processContent('# Second');
    const promise3 = result.current.processContent('# Third');

    const results = await Promise.all([promise1, promise2, promise3]);

    // All should resolve, but only the last one should be processed
    expect(results[2]).toBeDefined();
    expect(JSON.stringify(results[2])).toContain('Third');
  });

  it('handles empty content gracefully', async () => {
    const { result } = renderHook(() => useMarkdownProcessor());

    const processedContent = await result.current.processContent('');

    expect(processedContent).toBeDefined();
    // Empty content should return empty fragment or null
    expect(processedContent === null || processedContent === '').toBe(true);
  });

  it('handles invalid markdown gracefully', async () => {
    const { result } = renderHook(() => useMarkdownProcessor());

    // Malformed markdown that might cause parsing issues
    const invalidMarkdown = '# Unclosed [link(';

    const processedContent =
      await result.current.processContent(invalidMarkdown);

    // Should not throw, might return as plain text
    expect(processedContent).toBeDefined();
  });

  it('supports GitHub Flavored Markdown when enabled', async () => {
    const { result } = renderHook(() =>
      useMarkdownProcessor({
        enableGFM: true,
      }),
    );

    // GFM table syntax
    const gfmTable =
      '| Column 1 | Column 2 |\n|----------|----------|\n| Row 1    | Data 1   |';

    const processedContent = await result.current.processContent(gfmTable);

    expect(processedContent).toBeDefined();
    expect(JSON.stringify(processedContent)).toContain('table');
  });

  it('disables GFM features when not enabled', async () => {
    const { result } = renderHook(() =>
      useMarkdownProcessor({
        enableGFM: false,
      }),
    );

    // Strikethrough syntax (GFM feature)
    const strikethrough = '~~strikethrough text~~';

    const processedContent = await result.current.processContent(strikethrough);

    expect(processedContent).toBeDefined();
    // Should not process as strikethrough without GFM
    expect(JSON.stringify(processedContent)).not.toContain('del');
  });

  it('handles concurrent processing requests', async () => {
    const { result } = renderHook(() => useMarkdownProcessor());

    // Start multiple concurrent processing requests
    const promises = [
      result.current.processContent('# Content 1'),
      result.current.processContent('# Content 2'),
      result.current.processContent('# Content 3'),
    ];

    const results = await Promise.all(promises);

    // All should complete successfully
    results.forEach((result) => {
      expect(result).toBeDefined();
    });
  });

  it('maintains processing state correctly across multiple calls', async () => {
    const { result } = renderHook(() => useMarkdownProcessor());

    expect(result.current.isProcessing).toBe(false);

    const promise = result.current.processContent('# Test content');
    expect(result.current.isProcessing).toBe(true);

    await promise;

    await waitFor(() => {
      expect(result.current.isProcessing).toBe(false);
    });
  });
});
