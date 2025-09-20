import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MarkdownEditor } from '../../components/containers/MarkdownEditor';

describe('Editor State Management Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it('maintains consistent state across components', async () => {
    const onContentChange = vi.fn();
    render(
      <MarkdownEditor
        onContentChange={onContentChange}
        data-testid="markdown-editor"
      />,
    );

    const editor = screen.getByRole('textbox');
    const testContent = '# Test Content\n\nSome **bold** text.';

    fireEvent.change(editor, { target: { value: testContent } });

    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(onContentChange).toHaveBeenCalledWith(
        expect.objectContaining({
          raw: testContent,
          isEmpty: false,
          lastModified: expect.any(Date),
        }),
      );
    });

    // Editor should maintain the content
    expect(editor).toHaveValue(testContent);

    // Preview should show processed content
    const preview = screen.getByTestId('preview-pane');
    expect(preview).toContainHTML('<h1>Test Content</h1>');
    expect(preview).toContainHTML('<strong>bold</strong>');
  });

  it('handles initial state correctly', () => {
    const initialContent = '# Initial Content';
    const initialSettings = {
      theme: 'dark' as const,
      previewEnabled: true,
      syntaxHighlighting: false,
      livePreview: true,
    };

    render(
      <MarkdownEditor
        initialContent={initialContent}
        initialSettings={initialSettings}
        data-testid="markdown-editor"
      />,
    );

    // Check initial content is loaded
    const editor = screen.getByRole('textbox');
    expect(editor).toHaveValue(initialContent);

    // Check initial settings are applied
    const container = screen.getByTestId('markdown-editor');
    expect(container).toHaveClass('theme-dark');

    const editorPane = screen.getByTestId('editor-pane');
    expect(editorPane).toHaveAttribute('data-syntax-highlighting', 'false');

    // Preview should be visible
    expect(screen.getByTestId('preview-pane')).toBeInTheDocument();
  });

  it('tracks content isEmpty state correctly', async () => {
    const onContentChange = vi.fn();
    render(
      <MarkdownEditor
        onContentChange={onContentChange}
        data-testid="markdown-editor"
      />,
    );

    const editor = screen.getByRole('textbox');

    // Initially empty
    expect(onContentChange).not.toHaveBeenCalled();

    // Add content
    fireEvent.change(editor, { target: { value: 'Not empty' } });

    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(onContentChange).toHaveBeenCalledWith(
        expect.objectContaining({
          raw: 'Not empty',
          isEmpty: false,
        }),
      );
    });

    // Clear content
    fireEvent.change(editor, { target: { value: '' } });

    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(onContentChange).toHaveBeenCalledWith(
        expect.objectContaining({
          raw: '',
          isEmpty: true,
        }),
      );
    });
  });

  it('updates lastModified timestamp on content changes', async () => {
    const onContentChange = vi.fn();
    render(
      <MarkdownEditor
        onContentChange={onContentChange}
        data-testid="markdown-editor"
      />,
    );

    const editor = screen.getByRole('textbox');
    const startTime = new Date();

    fireEvent.change(editor, { target: { value: 'First change' } });

    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(onContentChange).toHaveBeenCalledWith(
        expect.objectContaining({
          lastModified: expect.any(Date),
        }),
      );
    });

    const firstCall = onContentChange.mock.calls[0][0];
    expect(firstCall.lastModified.getTime()).toBeGreaterThanOrEqual(
      startTime.getTime(),
    );

    // Make another change
    vi.advanceTimersByTime(100); // Ensure different timestamp
    fireEvent.change(editor, { target: { value: 'Second change' } });

    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(onContentChange).toHaveBeenCalledTimes(2);
    });

    const secondCall = onContentChange.mock.calls[1][0];
    expect(secondCall.lastModified.getTime()).toBeGreaterThan(
      firstCall.lastModified.getTime(),
    );
  });

  it('handles settings changes correctly', () => {
    const { rerender } = render(
      <MarkdownEditor
        initialSettings={{ previewEnabled: true }}
        data-testid="markdown-editor"
      />,
    );

    // Preview should be visible
    expect(screen.getByTestId('preview-pane')).toBeInTheDocument();

    // Disable preview
    rerender(
      <MarkdownEditor
        initialSettings={{ previewEnabled: false }}
        data-testid="markdown-editor"
      />,
    );

    // Preview should be hidden
    expect(screen.queryByTestId('preview-pane')).not.toBeInTheDocument();
  });

  it('maintains processing state correctly', async () => {
    render(<MarkdownEditor data-testid="markdown-editor" />);

    const editor = screen.getByRole('textbox');

    // Should not be processing initially
    expect(
      screen.queryByTestId('processing-indicator'),
    ).not.toBeInTheDocument();

    // Start typing
    fireEvent.change(editor, { target: { value: '# Processing test' } });

    // Should show processing indicator
    expect(screen.getByTestId('processing-indicator')).toBeInTheDocument();

    // Complete processing
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(
        screen.queryByTestId('processing-indicator'),
      ).not.toBeInTheDocument();
    });
  });

  it('handles error states gracefully', async () => {
    render(<MarkdownEditor data-testid="markdown-editor" />);

    const editor = screen.getByRole('textbox');

    // Trigger validation error
    const tooLongContent = 'x'.repeat(100001);
    fireEvent.change(editor, { target: { value: tooLongContent } });

    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    // Should still maintain editor content
    expect(editor).toHaveValue(tooLongContent);

    // Clear error by fixing content
    fireEvent.change(editor, { target: { value: '# Valid content' } });

    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    });
  });

  it('preserves state during rapid interactions', async () => {
    const onContentChange = vi.fn();
    render(
      <MarkdownEditor
        onContentChange={onContentChange}
        data-testid="markdown-editor"
      />,
    );

    const editor = screen.getByRole('textbox');

    // Simulate very rapid typing
    const changes = ['#', '# H', '# He', '# Hel', '# Hell', '# Hello'];

    changes.forEach((content, index) => {
      fireEvent.change(editor, { target: { value: content } });
      vi.advanceTimersByTime(10); // Very short intervals
    });

    // Complete all debouncing
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      // Should only process the final state due to debouncing
      expect(onContentChange).toHaveBeenCalledWith(
        expect.objectContaining({
          raw: '# Hello',
        }),
      );
    });

    // Editor should show final content
    expect(editor).toHaveValue('# Hello');

    // Preview should show processed final content
    const preview = screen.getByTestId('preview-pane');
    expect(preview).toContainHTML('<h1>Hello</h1>');
  });

  it('handles concurrent state updates', async () => {
    const onContentChange = vi.fn();
    render(
      <MarkdownEditor
        onContentChange={onContentChange}
        data-testid="markdown-editor"
      />,
    );

    const editor = screen.getByRole('textbox');

    // Start multiple concurrent updates
    fireEvent.change(editor, { target: { value: 'Content 1' } });
    fireEvent.change(editor, { target: { value: 'Content 2' } });
    fireEvent.change(editor, { target: { value: 'Content 3' } });

    // Fast-forward through all processing
    vi.advanceTimersByTime(500);

    await waitFor(() => {
      // Should converge to final state
      expect(onContentChange).toHaveBeenCalledWith(
        expect.objectContaining({
          raw: 'Content 3',
        }),
      );
    });

    // UI should be consistent
    expect(editor).toHaveValue('Content 3');
    expect(screen.getByTestId('preview-pane')).toHaveTextContent('Content 3');
  });

  it('maintains accessibility state throughout interactions', async () => {
    render(<MarkdownEditor data-testid="markdown-editor" />);

    const editor = screen.getByRole('textbox');
    const preview = screen.getByTestId('preview-pane');

    // Check initial accessibility
    expect(editor).toHaveAttribute('aria-label', 'Markdown editor');
    expect(preview).toHaveAttribute('aria-label', 'Markdown preview');

    // Add content and check accessibility is maintained
    fireEvent.change(editor, { target: { value: '# Accessibility Test' } });

    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(preview).toContainHTML('<h1>Accessibility Test</h1>');
    });

    // Accessibility attributes should remain
    expect(editor).toHaveAttribute('aria-label', 'Markdown editor');
    expect(preview).toHaveAttribute('aria-label', 'Markdown preview');
    expect(preview).toHaveAttribute('role', 'region');
  });

  it('handles memory cleanup on state changes', async () => {
    const { unmount } = render(
      <MarkdownEditor data-testid="markdown-editor" />,
    );

    const editor = screen.getByRole('textbox');

    // Create some state
    fireEvent.change(editor, { target: { value: '# Test content' } });

    // Start processing
    vi.advanceTimersByTime(100);

    // Unmount during processing
    unmount();

    // Advance timers to ensure cleanup doesn't cause errors
    vi.advanceTimersByTime(500);

    // Should not throw any errors or cause memory leaks
    expect(true).toBe(true);
  });
});
