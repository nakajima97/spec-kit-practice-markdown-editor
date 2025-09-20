import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { PreviewPane } from '../PreviewPane';

describe('PreviewPane', () => {
  afterEach(() => {
    cleanup();
  });

  const defaultProps = {
    content: null,
    isProcessing: false,
    theme: 'light' as const,
    visible: true,
  };

  it('renders without crashing', () => {
    render(<PreviewPane {...defaultProps} data-testid="preview-pane" />);
    expect(screen.getByTestId('preview-pane')).toBeInTheDocument();
  });

  it('displays processed content when provided', () => {
    const content = <div>Processed markdown content</div>;
    render(
      <PreviewPane
        {...defaultProps}
        content={content}
        data-testid="preview-pane"
      />,
    );

    expect(screen.getByText('Processed markdown content')).toBeInTheDocument();
  });

  it('shows empty state when no content', () => {
    render(
      <PreviewPane
        {...defaultProps}
        content={null}
        data-testid="preview-pane"
      />,
    );

    expect(
      screen.getByText('Start typing to see preview...'),
    ).toBeInTheDocument();
  });

  it('displays processing indicator when processing', () => {
    render(
      <PreviewPane
        {...defaultProps}
        isProcessing={true}
        data-testid="preview-pane"
      />,
    );

    expect(screen.getByTestId('processing-indicator')).toBeInTheDocument();
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('hides content when not visible', () => {
    render(
      <PreviewPane
        {...defaultProps}
        visible={false}
        data-testid="preview-pane"
      />,
    );

    const container = screen.getByTestId('preview-pane');
    expect(container).toHaveStyle({ display: 'none' });
  });

  it('applies light theme classes', () => {
    render(
      <PreviewPane
        {...defaultProps}
        theme="light"
        data-testid="preview-pane"
      />,
    );

    const container = screen.getByTestId('preview-pane');
    expect(container).toHaveClass('theme-light');
  });

  it('applies dark theme classes', () => {
    render(
      <PreviewPane {...defaultProps} theme="dark" data-testid="preview-pane" />,
    );

    const container = screen.getByTestId('preview-pane');
    expect(container).toHaveClass('theme-dark');
  });

  it('displays error message when error occurs', () => {
    const errorMessage = 'Failed to process markdown';
    render(
      <PreviewPane
        {...defaultProps}
        error={errorMessage}
        data-testid="preview-pane"
      />,
    );

    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('shows error indicator with retry suggestion', () => {
    render(
      <PreviewPane
        {...defaultProps}
        error="Processing failed"
        data-testid="preview-pane"
      />,
    );

    expect(screen.getByText('Processing failed')).toBeInTheDocument();
    expect(screen.getByText(/try editing your content/i)).toBeInTheDocument();
  });

  it('renders complex markdown content correctly', () => {
    const complexContent = (
      <div>
        <h1>Heading 1</h1>
        <p>
          Paragraph with <strong>bold</strong> and <em>italic</em> text.
        </p>
        <ul>
          <li>List item 1</li>
          <li>List item 2</li>
        </ul>
        <pre>
          <code>Code block</code>
        </pre>
      </div>
    );

    render(
      <PreviewPane
        {...defaultProps}
        content={complexContent}
        data-testid="preview-pane"
      />,
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Heading 1',
    );
    expect(screen.getByText('bold')).toBeInTheDocument();
    expect(screen.getByText('italic')).toBeInTheDocument();
    expect(screen.getByText('List item 1')).toBeInTheDocument();
    expect(screen.getByText('Code block')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<PreviewPane {...defaultProps} data-testid="preview-pane" />);

    const container = screen.getByTestId('preview-pane');
    expect(container).toHaveAttribute('role', 'region');
    expect(container).toHaveAttribute('aria-label', 'Markdown preview');
  });

  it('handles processing state transitions correctly', () => {
    const { rerender } = render(
      <PreviewPane
        {...defaultProps}
        isProcessing={false}
        data-testid="preview-pane"
      />,
    );

    // Should not show processing indicator initially
    expect(
      screen.queryByTestId('processing-indicator'),
    ).not.toBeInTheDocument();

    // Should show processing indicator when processing starts
    rerender(
      <PreviewPane
        {...defaultProps}
        isProcessing={true}
        data-testid="preview-pane"
      />,
    );
    expect(screen.getByTestId('processing-indicator')).toBeInTheDocument();

    // Should hide processing indicator when done
    rerender(
      <PreviewPane
        {...defaultProps}
        isProcessing={false}
        content={<div>Processed content</div>}
        data-testid="preview-pane"
      />,
    );
    expect(
      screen.queryByTestId('processing-indicator'),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Processed content')).toBeInTheDocument();
  });

  it('supports scrollable content', () => {
    const longContent = (
      <div>
        {Array.from({ length: 100 }, (_, i) => (
          <p key={i}>This is paragraph {i + 1}</p>
        ))}
      </div>
    );

    render(
      <PreviewPane
        {...defaultProps}
        content={longContent}
        data-testid="preview-pane"
      />,
    );

    const container = screen.getByTestId('preview-pane');
    expect(container).toHaveClass('scrollable');
  });

  it('preserves content during theme changes', () => {
    const content = <div>Test content</div>;
    const { rerender } = render(
      <PreviewPane
        {...defaultProps}
        content={content}
        theme="light"
        data-testid="preview-pane"
      />,
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();

    rerender(
      <PreviewPane
        {...defaultProps}
        content={content}
        theme="dark"
        data-testid="preview-pane"
      />,
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('handles null and undefined content gracefully', () => {
    const { rerender } = render(
      <PreviewPane
        {...defaultProps}
        content={null}
        data-testid="preview-pane"
      />,
    );

    expect(
      screen.getByText('Start typing to see preview...'),
    ).toBeInTheDocument();

    rerender(
      <PreviewPane
        {...defaultProps}
        content={undefined}
        data-testid="preview-pane"
      />,
    );

    expect(
      screen.getByText('Start typing to see preview...'),
    ).toBeInTheDocument();
  });
});
