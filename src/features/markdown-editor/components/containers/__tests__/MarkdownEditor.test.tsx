import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MarkdownEditor } from '../MarkdownEditor';

describe('MarkdownEditor', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders without crashing', () => {
    render(<MarkdownEditor data-testid="markdown-editor" />);
    expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
  });

  it('displays initial content when provided', () => {
    const initialContent = '# Hello World';
    render(
      <MarkdownEditor
        initialContent={initialContent}
        data-testid="markdown-editor"
      />,
    );

    const editor = screen.getByRole('textbox');
    expect(editor).toHaveValue(initialContent);
  });

  it('shows empty state when no content', () => {
    render(<MarkdownEditor data-testid="markdown-editor" />);

    const editor = screen.getByRole('textbox');
    expect(editor).toHaveValue('');
  });

  it('updates content when user types', async () => {
    const onContentChange = vi.fn();
    render(
      <MarkdownEditor
        onContentChange={onContentChange}
        data-testid="markdown-editor"
      />,
    );

    const editor = screen.getByRole('textbox');
    fireEvent.change(editor, { target: { value: '**Bold text**' } });

    expect(editor).toHaveValue('**Bold text**');

    // Wait for debounced callback
    await waitFor(() => {
      expect(onContentChange).toHaveBeenCalledWith(
        expect.objectContaining({
          raw: '**Bold text**',
          isEmpty: false,
        }),
      );
    });
  });

  it('displays preview pane by default', () => {
    render(<MarkdownEditor data-testid="markdown-editor" />);

    expect(screen.getByTestId('preview-pane')).toBeInTheDocument();
  });

  it('hides preview pane when disabled in settings', () => {
    render(
      <MarkdownEditor
        initialSettings={{ previewEnabled: false }}
        data-testid="markdown-editor"
      />,
    );

    expect(screen.queryByTestId('preview-pane')).not.toBeInTheDocument();
  });

  it('processes markdown content in real-time', async () => {
    render(<MarkdownEditor data-testid="markdown-editor" />);

    const editor = screen.getByRole('textbox');
    fireEvent.change(editor, { target: { value: '# Heading' } });

    // Wait for processing to complete
    await waitFor(() => {
      const preview = screen.getByTestId('preview-pane');
      expect(preview).toContainHTML('<h1>Heading</h1>');
    });
  });

  it('shows processing indicator during content processing', async () => {
    render(<MarkdownEditor data-testid="markdown-editor" />);

    const editor = screen.getByRole('textbox');
    fireEvent.change(editor, { target: { value: 'Large content...' } });

    // Should show processing indicator
    expect(screen.getByTestId('processing-indicator')).toBeInTheDocument();

    // Should hide after processing
    await waitFor(() => {
      expect(
        screen.queryByTestId('processing-indicator'),
      ).not.toBeInTheDocument();
    });
  });

  it('handles validation errors gracefully', async () => {
    const longContent = 'x'.repeat(100001); // Exceeds max length
    render(<MarkdownEditor data-testid="markdown-editor" />);

    const editor = screen.getByRole('textbox');
    fireEvent.change(editor, { target: { value: longContent } });

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(
        /Content exceeds maximum length/,
      );
    });
  });

  it('applies theme classes correctly', () => {
    render(
      <MarkdownEditor
        initialSettings={{ theme: 'dark' }}
        data-testid="markdown-editor"
      />,
    );

    const container = screen.getByTestId('markdown-editor');
    expect(container).toHaveClass('theme-dark');
  });

  it('supports custom CSS classes', () => {
    render(
      <MarkdownEditor
        className="custom-editor"
        data-testid="markdown-editor"
      />,
    );

    const container = screen.getByTestId('markdown-editor');
    expect(container).toHaveClass('custom-editor');
  });

  it('enables syntax highlighting by default', () => {
    render(<MarkdownEditor data-testid="markdown-editor" />);

    const editorPane = screen.getByTestId('editor-pane');
    expect(editorPane).toHaveAttribute('data-syntax-highlighting', 'true');
  });

  it('disables syntax highlighting when configured', () => {
    render(
      <MarkdownEditor
        initialSettings={{ syntaxHighlighting: false }}
        data-testid="markdown-editor"
      />,
    );

    const editorPane = screen.getByTestId('editor-pane');
    expect(editorPane).toHaveAttribute('data-syntax-highlighting', 'false');
  });
});
