import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MarkdownEditor } from '../../components/containers/MarkdownEditor';

describe('Real-time Preview Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it('updates preview in real-time when typing', async () => {
    render(<MarkdownEditor data-testid="markdown-editor" />);

    const editor = screen.getByRole('textbox');
    const preview = screen.getByTestId('preview-pane');

    // Type markdown content
    fireEvent.change(editor, { target: { value: '# Hello World' } });

    // Fast-forward past debounce delay
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(preview).toContainHTML('<h1>Heading</h1>');
    });
  });

  it('handles rapid typing with debouncing', async () => {
    render(<MarkdownEditor data-testid="markdown-editor" />);

    const editor = screen.getByRole('textbox');

    // Simulate rapid typing
    fireEvent.change(editor, { target: { value: '#' } });
    vi.advanceTimersByTime(50);

    fireEvent.change(editor, { target: { value: '# H' } });
    vi.advanceTimersByTime(50);

    fireEvent.change(editor, { target: { value: '# Hello' } });
    vi.advanceTimersByTime(50);

    fireEvent.change(editor, { target: { value: '# Hello World' } });

    // Should still be processing due to debouncing
    expect(screen.getByTestId('processing-indicator')).toBeInTheDocument();

    // Complete debounce
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      const preview = screen.getByTestId('preview-pane');
      expect(preview).toContainHTML('<h1>Hello World</h1>');
      expect(
        screen.queryByTestId('processing-indicator'),
      ).not.toBeInTheDocument();
    });
  });

  it('renders complex markdown with formatting', async () => {
    const complexMarkdown = `
# Main Heading

## Subheading

This is a paragraph with **bold text** and *italic text*.

- Bullet point 1
- Bullet point 2
- Bullet point 3

1. Numbered list item 1
2. Numbered list item 2

\`\`\`javascript
const hello = "world";
console.log(hello);
\`\`\`

[Link text](https://example.com)
`;

    render(<MarkdownEditor data-testid="markdown-editor" />);

    const editor = screen.getByRole('textbox');
    fireEvent.change(editor, { target: { value: complexMarkdown } });

    vi.advanceTimersByTime(300);

    await waitFor(() => {
      const preview = screen.getByTestId('preview-pane');

      // Check for various markdown elements
      expect(preview).toContainHTML('<h1>Main Heading</h1>');
      expect(preview).toContainHTML('<h2>Subheading</h2>');
      expect(preview).toContainHTML('<strong>bold text</strong>');
      expect(preview).toContainHTML('<em>italic text</em>');
      expect(preview).toContainHTML('<ul>');
      expect(preview).toContainHTML('<ol>');
      expect(preview).toContainHTML('<code>');
      expect(preview).toContainHTML('<a href="https://example.com">');
    });
  });

  it('handles GitHub Flavored Markdown features', async () => {
    const gfmMarkdown = `
## Table

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Row 1    | Data 1   | Info 1   |
| Row 2    | Data 2   | Info 2   |

## Strikethrough

~~This text is crossed out~~

## Task Lists

- [x] Completed task
- [ ] Incomplete task

## Code with syntax highlighting

\`\`\`typescript
interface User {
  name: string;
  age: number;
}
\`\`\`
`;

    render(<MarkdownEditor data-testid="markdown-editor" />);

    const editor = screen.getByRole('textbox');
    fireEvent.change(editor, { target: { value: gfmMarkdown } });

    vi.advanceTimersByTime(300);

    await waitFor(() => {
      const preview = screen.getByTestId('preview-pane');

      // Check for GFM features
      expect(preview).toContainHTML('<table>');
      expect(preview).toContainHTML('<th>');
      expect(preview).toContainHTML('<td>');
      expect(preview).toContainHTML('<del>');
      expect(preview).toContainHTML('<input type="checkbox"');
    });
  });

  it('shows empty state when content is cleared', async () => {
    render(
      <MarkdownEditor
        initialContent="# Initial content"
        data-testid="markdown-editor"
      />,
    );

    const editor = screen.getByRole('textbox');

    // Clear the content
    fireEvent.change(editor, { target: { value: '' } });

    vi.advanceTimersByTime(300);

    await waitFor(() => {
      const preview = screen.getByTestId('preview-pane');
      expect(preview).toHaveTextContent('Start typing to see preview...');
    });
  });

  it('handles processing errors gracefully', async () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<MarkdownEditor data-testid="markdown-editor" />);

    const editor = screen.getByRole('textbox');

    // Simulate content that might cause processing error
    const problematicContent = 'x'.repeat(100001); // Exceeds max length
    fireEvent.change(editor, { target: { value: problematicContent } });

    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(
        screen.getByText(/Content exceeds maximum length/),
      ).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('maintains scroll position during updates', async () => {
    const longContent = Array.from(
      { length: 50 },
      (_, i) => `## Heading ${i + 1}\n\nContent for section ${i + 1}`,
    ).join('\n\n');

    render(<MarkdownEditor data-testid="markdown-editor" />);

    const editor = screen.getByRole('textbox');
    const preview = screen.getByTestId('preview-pane');

    fireEvent.change(editor, { target: { value: longContent } });
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(preview).toContainHTML('<h2>Heading 1</h2>');
    });

    // Simulate scrolling in preview
    Object.defineProperty(preview, 'scrollTop', {
      value: 500,
      writable: true,
    });

    // Add more content
    fireEvent.change(editor, {
      target: { value: longContent + '\n\n## New Section' },
    });
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      // Scroll position should be maintained
      expect(preview.scrollTop).toBe(500);
    });
  });

  it('syncs editor and preview themes', async () => {
    render(
      <MarkdownEditor
        initialSettings={{ theme: 'dark' }}
        data-testid="markdown-editor"
      />,
    );

    const editorPane = screen.getByTestId('editor-pane');
    const preview = screen.getByTestId('preview-pane');

    expect(editorPane).toHaveClass('theme-dark');
    expect(preview).toHaveClass('theme-dark');
  });

  it('handles rapid theme switching', async () => {
    const { rerender } = render(
      <MarkdownEditor
        initialSettings={{ theme: 'light' }}
        data-testid="markdown-editor"
      />,
    );

    const editor = screen.getByRole('textbox');
    fireEvent.change(editor, { target: { value: '# Test content' } });

    vi.advanceTimersByTime(300);

    // Switch theme multiple times rapidly
    rerender(
      <MarkdownEditor
        initialSettings={{ theme: 'dark' }}
        data-testid="markdown-editor"
      />,
    );

    rerender(
      <MarkdownEditor
        initialSettings={{ theme: 'light' }}
        data-testid="markdown-editor"
      />,
    );

    await waitFor(() => {
      const preview = screen.getByTestId('preview-pane');
      expect(preview).toHaveClass('theme-light');
      expect(preview).toContainHTML('<h1>Test content</h1>');
    });
  });
});
