import clsx from 'clsx';
import type React from 'react';
import type { ReactNode } from 'react';

export interface SplitLayoutProps {
  left: ReactNode;
  right: ReactNode;
  rightVisible: boolean;
  splitRatio?: number;
  resizable?: boolean;
  theme: 'light' | 'dark';
  'data-testid'?: string;
}

export const SplitLayout: React.FC<SplitLayoutProps> = ({
  left,
  right,
  rightVisible,
  splitRatio = 0.5,
  resizable = false,
  theme,
  'data-testid': testId,
}) => {
  const leftRatio = splitRatio;
  const rightRatio = 1 - splitRatio;

  return (
    <div
      className={clsx('split-layout', 'responsive-layout', `theme-${theme}`, {
        'single-pane': !rightVisible,
      })}
      style={{
        display: 'grid',
        gridTemplateColumns: rightVisible
          ? `${leftRatio}fr ${resizable ? 'auto' : '0'} ${rightRatio}fr`
          : '1fr',
        height: '100%',
        width: '100%',
      }}
      role="main"
      data-testid={testId}
    >
      <div
        className="split-pane left-pane"
        style={{
          flex: rightVisible ? leftRatio : 1,
          overflow: 'hidden',
        }}
        aria-label="Editor pane"
        tabIndex={0}
        data-testid="left-pane"
      >
        {left}
      </div>

      {rightVisible && resizable && (
        <div
          className="resize-handle"
          style={{
            width: '4px',
            cursor: 'col-resize',
            backgroundColor: theme === 'dark' ? '#444' : '#e0e0e0',
            borderLeft: '1px solid',
            borderRight: '1px solid',
            borderColor: theme === 'dark' ? '#666' : '#ccc',
          }}
          data-testid="resize-handle"
        />
      )}

      {rightVisible && (
        <div
          className="split-pane right-pane"
          style={{
            flex: rightRatio,
            overflow: 'hidden',
          }}
          aria-label="Preview pane"
          tabIndex={0}
          data-testid="right-pane"
        >
          {right}
        </div>
      )}
    </div>
  );
};
