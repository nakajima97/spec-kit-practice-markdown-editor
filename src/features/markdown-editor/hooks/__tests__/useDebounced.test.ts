import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebounced } from '../useDebounced';

describe('useDebounced', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounced('initial', 300));

    expect(result.current.debouncedValue).toBe('initial');
    expect(result.current.isPending).toBe(false);
  });

  it('delays value updates', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounced(value, 300),
      { initialProps: { value: 'initial' } },
    );

    // Change the value
    rerender({ value: 'updated' });

    // Should still show old value and be pending
    expect(result.current.debouncedValue).toBe('initial');
    expect(result.current.isPending).toBe(true);

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should now show new value and not be pending
    expect(result.current.debouncedValue).toBe('updated');
    expect(result.current.isPending).toBe(false);
  });

  it('cancels previous timeout on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounced(value, 300),
      { initialProps: { value: 'initial' } },
    );

    // Make rapid changes
    rerender({ value: 'update1' });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'update2' });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'final' });

    // Should still be pending with old value
    expect(result.current.debouncedValue).toBe('initial');
    expect(result.current.isPending).toBe(true);

    // Complete the debounce
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should jump directly to final value
    expect(result.current.debouncedValue).toBe('final');
    expect(result.current.isPending).toBe(false);
  });

  it('handles different delay times', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounced(value, delay),
      { initialProps: { value: 'initial', delay: 500 } },
    );

    rerender({ value: 'updated', delay: 500 });

    expect(result.current.isPending).toBe(true);

    // Should not update after shorter time
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.debouncedValue).toBe('initial');
    expect(result.current.isPending).toBe(true);

    // Should update after full delay
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.debouncedValue).toBe('updated');
    expect(result.current.isPending).toBe(false);
  });

  it('forces immediate update when forceUpdate is called', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounced(value, 300),
      { initialProps: { value: 'initial' } },
    );

    rerender({ value: 'updated' });

    expect(result.current.debouncedValue).toBe('initial');
    expect(result.current.isPending).toBe(true);

    // Force update immediately
    act(() => {
      result.current.forceUpdate();
    });

    expect(result.current.debouncedValue).toBe('updated');
    expect(result.current.isPending).toBe(false);
  });

  it('handles complex object values', () => {
    const initial = { name: 'John', age: 30 };
    const updated = { name: 'Jane', age: 25 };

    const { result, rerender } = renderHook(
      ({ value }) => useDebounced(value, 300),
      { initialProps: { value: initial } },
    );

    expect(result.current.debouncedValue).toEqual(initial);

    rerender({ value: updated });

    expect(result.current.debouncedValue).toEqual(initial);
    expect(result.current.isPending).toBe(true);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.debouncedValue).toEqual(updated);
    expect(result.current.isPending).toBe(false);
  });

  it('handles undefined and null values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounced(value, 300),
      { initialProps: { value: 'initial' as string | null } },
    );

    rerender({ value: null });

    expect(result.current.isPending).toBe(true);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.debouncedValue).toBe(null);
    expect(result.current.isPending).toBe(false);

    rerender({ value: undefined });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.debouncedValue).toBeUndefined();
  });

  it('cleans up timeout on unmount', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value }) => useDebounced(value, 300),
      { initialProps: { value: 'initial' } },
    );

    rerender({ value: 'updated' });

    expect(result.current.isPending).toBe(true);

    // Unmount before timeout completes
    unmount();

    // Should not cause any errors or memory leaks
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // No way to test the specific cleanup, but this ensures no errors
    expect(true).toBe(true);
  });

  it('works with zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounced(value, 0),
      { initialProps: { value: 'initial' } },
    );

    rerender({ value: 'updated' });

    // With zero delay, should update on next tick
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current.debouncedValue).toBe('updated');
    expect(result.current.isPending).toBe(false);
  });

  it('handles rapid force updates', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounced(value, 300),
      { initialProps: { value: 'initial' } },
    );

    rerender({ value: 'update1' });
    rerender({ value: 'update2' });
    rerender({ value: 'final' });

    expect(result.current.isPending).toBe(true);

    // Force update multiple times
    act(() => {
      result.current.forceUpdate();
      result.current.forceUpdate();
      result.current.forceUpdate();
    });

    expect(result.current.debouncedValue).toBe('final');
    expect(result.current.isPending).toBe(false);
  });

  it('maintains referential equality for unchanged values', () => {
    const objectValue = { key: 'value' };
    const { result, rerender } = renderHook(
      ({ value }) => useDebounced(value, 300),
      { initialProps: { value: objectValue } },
    );

    const firstResult = result.current.debouncedValue;

    // Rerender with same object reference
    rerender({ value: objectValue });

    expect(result.current.debouncedValue).toBe(firstResult);
    expect(result.current.isPending).toBe(false);
  });

  it('correctly identifies changes in object values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounced(value, 300),
      { initialProps: { value: { key: 'value1' } } },
    );

    const initialResult = result.current.debouncedValue;

    // Change to different object with same structure
    rerender({ value: { key: 'value2' } });

    expect(result.current.isPending).toBe(true);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.debouncedValue).not.toBe(initialResult);
    expect(result.current.debouncedValue).toEqual({ key: 'value2' });
  });
});
