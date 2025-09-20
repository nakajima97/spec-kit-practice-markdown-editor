import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { SplitLayout } from '../SplitLayout';

describe('SplitLayout', () => {
  afterEach(() => {
    cleanup();
  });

  const defaultProps = {
    left: <div data-testid="left-content">Left side content</div>,
    right: <div data-testid="right-content">Right side content</div>,
    rightVisible: true,
    theme: 'light' as const,
  };

  it('renders without crashing', () => {
    render(<SplitLayout {...defaultProps} data-testid="split-layout" />);
    expect(screen.getByTestId('split-layout')).toBeInTheDocument();
  });

  it('displays left content', () => {
    render(<SplitLayout {...defaultProps} data-testid="split-layout" />);
    expect(screen.getByTestId('left-content')).toBeInTheDocument();
    expect(screen.getByText('Left side content')).toBeInTheDocument();
  });

  it('displays right content when visible', () => {
    render(
      <SplitLayout
        {...defaultProps}
        rightVisible={true}
        data-testid="split-layout"
      />,
    );
    expect(screen.getByTestId('right-content')).toBeInTheDocument();
    expect(screen.getByText('Right side content')).toBeInTheDocument();
  });

  it('hides right content when not visible', () => {
    render(
      <SplitLayout
        {...defaultProps}
        rightVisible={false}
        data-testid="split-layout"
      />,
    );
    expect(screen.queryByTestId('right-content')).not.toBeInTheDocument();
  });

  it('applies light theme classes', () => {
    render(
      <SplitLayout
        {...defaultProps}
        theme="light"
        data-testid="split-layout"
      />,
    );

    const container = screen.getByTestId('split-layout');
    expect(container).toHaveClass('theme-light');
  });

  it('applies dark theme classes', () => {
    render(
      <SplitLayout {...defaultProps} theme="dark" data-testid="split-layout" />,
    );

    const container = screen.getByTestId('split-layout');
    expect(container).toHaveClass('theme-dark');
  });

  it('applies default split ratio', () => {
    render(<SplitLayout {...defaultProps} data-testid="split-layout" />);

    const leftPane = screen.getByTestId('left-pane');
    const rightPane = screen.getByTestId('right-pane');

    expect(leftPane).toHaveStyle('flex: 1');
    expect(rightPane).toHaveStyle('flex: 1');
  });

  it('applies custom split ratio', () => {
    render(
      <SplitLayout
        {...defaultProps}
        splitRatio={0.7}
        data-testid="split-layout"
      />,
    );

    const leftPane = screen.getByTestId('left-pane');
    const rightPane = screen.getByTestId('right-pane');

    expect(leftPane).toHaveStyle('flex: 0.7');
    expect(rightPane).toHaveStyle('flex: 0.3');
  });

  it('shows resize handle when resizable', () => {
    render(
      <SplitLayout
        {...defaultProps}
        resizable={true}
        data-testid="split-layout"
      />,
    );

    expect(screen.getByTestId('resize-handle')).toBeInTheDocument();
  });

  it('hides resize handle when not resizable', () => {
    render(
      <SplitLayout
        {...defaultProps}
        resizable={false}
        data-testid="split-layout"
      />,
    );

    expect(screen.queryByTestId('resize-handle')).not.toBeInTheDocument();
  });

  it('maintains layout in single pane mode', () => {
    render(
      <SplitLayout
        {...defaultProps}
        rightVisible={false}
        data-testid="split-layout"
      />,
    );

    const leftPane = screen.getByTestId('left-pane');
    expect(leftPane).toHaveStyle('flex: 1');
    expect(screen.queryByTestId('resize-handle')).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<SplitLayout {...defaultProps} data-testid="split-layout" />);

    const container = screen.getByTestId('split-layout');
    expect(container).toHaveAttribute('role', 'main');

    const leftPane = screen.getByTestId('left-pane');
    const rightPane = screen.getByTestId('right-pane');

    expect(leftPane).toHaveAttribute('aria-label', 'Editor pane');
    expect(rightPane).toHaveAttribute('aria-label', 'Preview pane');
  });

  it('handles responsive layout correctly', () => {
    render(<SplitLayout {...defaultProps} data-testid="split-layout" />);

    const container = screen.getByTestId('split-layout');
    expect(container).toHaveClass('responsive-layout');
  });

  it('applies correct CSS grid layout', () => {
    render(<SplitLayout {...defaultProps} data-testid="split-layout" />);

    const container = screen.getByTestId('split-layout');
    expect(container).toHaveClass('split-layout');
    expect(container).toHaveStyle('display: grid');
  });

  it('handles edge case split ratios', () => {
    const { rerender } = render(
      <SplitLayout
        {...defaultProps}
        splitRatio={0}
        data-testid="split-layout"
      />,
    );

    const leftPane = screen.getByTestId('left-pane');
    expect(leftPane).toHaveStyle('flex: 0');

    rerender(
      <SplitLayout
        {...defaultProps}
        splitRatio={1}
        data-testid="split-layout"
      />,
    );

    expect(leftPane).toHaveStyle('flex: 1');
  });

  it('preserves content during theme transitions', () => {
    const { rerender } = render(
      <SplitLayout
        {...defaultProps}
        theme="light"
        data-testid="split-layout"
      />,
    );

    expect(screen.getByText('Left side content')).toBeInTheDocument();
    expect(screen.getByText('Right side content')).toBeInTheDocument();

    rerender(
      <SplitLayout {...defaultProps} theme="dark" data-testid="split-layout" />,
    );

    expect(screen.getByText('Left side content')).toBeInTheDocument();
    expect(screen.getByText('Right side content')).toBeInTheDocument();
  });

  it('handles complex content in panes', () => {
    const complexLeft = (
      <div data-testid="complex-left">
        <h2>Editor</h2>
        <textarea>Complex editor content</textarea>
      </div>
    );

    const complexRight = (
      <div data-testid="complex-right">
        <h2>Preview</h2>
        <div>Complex preview content</div>
      </div>
    );

    render(
      <SplitLayout
        left={complexLeft}
        right={complexRight}
        rightVisible={true}
        theme="light"
        data-testid="split-layout"
      />,
    );

    expect(screen.getByTestId('complex-left')).toBeInTheDocument();
    expect(screen.getByTestId('complex-right')).toBeInTheDocument();
    expect(screen.getByText('Complex editor content')).toBeInTheDocument();
    expect(screen.getByText('Complex preview content')).toBeInTheDocument();
  });

  it('maintains focus management between panes', () => {
    render(<SplitLayout {...defaultProps} data-testid="split-layout" />);

    const leftPane = screen.getByTestId('left-pane');
    const rightPane = screen.getByTestId('right-pane');

    expect(leftPane).toHaveAttribute('tabindex', '0');
    expect(rightPane).toHaveAttribute('tabindex', '0');
  });
});
