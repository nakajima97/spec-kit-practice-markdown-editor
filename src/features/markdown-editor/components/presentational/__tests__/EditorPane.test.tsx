import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EditorPane } from '../EditorPane';

describe('EditorPane', () => {
  afterEach(() => {
    cleanup();
  });

  const defaultProps = {
    content: '',
    onChange: vi.fn(),
    syntaxHighlighting: true,
    theme: 'light' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<EditorPane {...defaultProps} data-testid="editor-pane" />);
    expect(screen.getByTestId('editor-pane')).toBeInTheDocument();
  });

  it('displays the provided content', () => {
    const content = '# Hello World\n\nThis is **bold** text.';
    render(
      <EditorPane
        {...defaultProps}
        content={content}
        data-testid="editor-pane"
      />,
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue(content);
  });

  it('shows placeholder when empty', () => {
    const placeholder = 'Start typing your markdown...';
    render(
      <EditorPane
        {...defaultProps}
        placeholder={placeholder}
        data-testid="editor-pane"
      />,
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('placeholder', placeholder);
  });

  it('calls onChange when content changes', () => {
    const onChange = vi.fn();
    render(
      <EditorPane
        {...defaultProps}
        onChange={onChange}
        data-testid="editor-pane"
      />,
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New content' } });

    expect(onChange).toHaveBeenCalledWith('New content');
  });

  it('applies light theme classes', () => {
    render(
      <EditorPane {...defaultProps} theme="light" data-testid="editor-pane" />,
    );

    const container = screen.getByTestId('editor-pane');
    expect(container).toHaveClass('theme-light');
  });

  it('applies dark theme classes', () => {
    render(
      <EditorPane {...defaultProps} theme="dark" data-testid="editor-pane" />,
    );

    const container = screen.getByTestId('editor-pane');
    expect(container).toHaveClass('theme-dark');
  });

  it('enables syntax highlighting when configured', () => {
    render(
      <EditorPane
        {...defaultProps}
        syntaxHighlighting={true}
        data-testid="editor-pane"
      />,
    );

    const container = screen.getByTestId('editor-pane');
    expect(container).toHaveAttribute('data-syntax-highlighting', 'true');
  });

  it('disables syntax highlighting when configured', () => {
    render(
      <EditorPane
        {...defaultProps}
        syntaxHighlighting={false}
        data-testid="editor-pane"
      />,
    );

    const container = screen.getByTestId('editor-pane');
    expect(container).toHaveAttribute('data-syntax-highlighting', 'false');
  });

  it('disables textarea when disabled prop is true', () => {
    render(
      <EditorPane
        {...defaultProps}
        disabled={true}
        data-testid="editor-pane"
      />,
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
  });

  it('enables textarea when disabled prop is false', () => {
    render(
      <EditorPane
        {...defaultProps}
        disabled={false}
        data-testid="editor-pane"
      />,
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).not.toBeDisabled();
  });

  it('has proper accessibility attributes', () => {
    render(<EditorPane {...defaultProps} data-testid="editor-pane" />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('aria-label', 'Markdown editor');
  });

  it('supports multiline input', () => {
    const multilineContent = 'Line 1\nLine 2\nLine 3';
    const onChange = vi.fn();
    render(
      <EditorPane
        {...defaultProps}
        onChange={onChange}
        data-testid="editor-pane"
      />,
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: multilineContent } });

    expect(onChange).toHaveBeenCalledWith(multilineContent);
  });

  it('handles keyboard shortcuts correctly', () => {
    render(<EditorPane {...defaultProps} data-testid="editor-pane" />);

    const textarea = screen.getByRole('textbox');

    // Test Tab key doesn't lose focus
    fireEvent.keyDown(textarea, { key: 'Tab', code: 'Tab' });
    expect(textarea).toHaveFocus();
  });

  it('maintains cursor position during content updates', () => {
    render(
      <EditorPane
        {...defaultProps}
        content="Hello World"
        data-testid="editor-pane"
      />,
    );

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

    // Set cursor position
    textarea.setSelectionRange(5, 5);

    // Simulate external content update
    fireEvent.change(textarea, { target: { value: 'Hello Beautiful World' } });

    // Cursor position should be maintained relative to content
    expect(textarea.selectionStart).toBe(5);
  });

  it('handles large content efficiently', () => {
    const largeContent = 'x'.repeat(10000);
    const onChange = vi.fn();

    render(
      <EditorPane
        {...defaultProps}
        onChange={onChange}
        data-testid="editor-pane"
      />,
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: largeContent } });

    expect(onChange).toHaveBeenCalledWith(largeContent);
  });

  it('applies custom CSS classes correctly', () => {
    render(<EditorPane {...defaultProps} data-testid="editor-pane" />);

    const container = screen.getByTestId('editor-pane');
    expect(container).toHaveClass('editor-pane');
  });
});
