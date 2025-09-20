# Data Model: Markdown Editor

**Date**: 2025-09-20  
**Feature**: Markdown Editor with Real-time Preview

## Entity Overview

### EditorContent
Represents the markdown text being edited and its processed state.

**Fields**:
- `raw: string` - The raw markdown text input by user
- `processed: ReactNode` - The parsed and rendered markdown content
- `lastModified: Date` - Timestamp of last content change
- `isEmpty: boolean` - Computed field indicating if content is empty

**Validation Rules**:
- `raw` must be valid UTF-8 string
- `raw.length` must be ≤ 100,000 characters (from research)
- `processed` must be valid React components/elements
- `lastModified` must be valid Date object

**State Transitions**:
1. **Empty** → **Editing**: User types first character
2. **Editing** → **Updating**: Content change triggers processing
3. **Updating** → **Editing**: Processing complete, UI updated
4. **Editing** → **Empty**: User clears all content

### EditorSettings
Represents user preferences for the editor interface (future extension point).

**Fields**:
- `theme: 'light' | 'dark'` - Visual theme preference
- `previewEnabled: boolean` - Whether preview pane is visible
- `syntaxHighlighting: boolean` - Whether to highlight markdown syntax
- `livePreview: boolean` - Whether preview updates in real-time

**Validation Rules**:
- `theme` must be one of defined enum values
- All boolean fields must be true/false
- Settings persist only during session (no storage)

## Relationships

### EditorContent ↔ EditorSettings
- **Type**: Composition (Settings affects Content rendering)
- **Cardinality**: 1:1 (One setting object per content instance)
- **Description**: Settings control how content is displayed and processed

## Data Flow

### Input Flow
```
User Input → Raw Markdown → Validation → State Update → Processing → Rendered Output
```

### Processing Pipeline
```
1. Raw text input (textarea onChange)
2. Debounce user input (300ms delay)
3. Validate content length and format
4. Parse markdown using remark/react-markdown
5. Generate React components for preview
6. Update state with processed content
7. Re-render preview pane
```

### Error States
- **Invalid Content**: Malformed markdown → Show raw text with error indicator
- **Content Too Large**: >100k chars → Truncate and warn user
- **Processing Error**: Parser failure → Fallback to plain text display

## Component State Schema

### MarkdownEditor State
```typescript
interface MarkdownEditorState {
  content: {
    raw: string;
    processed: ReactNode | null;
    lastModified: Date;
    isEmpty: boolean;
  };
  settings: {
    theme: 'light' | 'dark';
    previewEnabled: boolean;
    syntaxHighlighting: boolean;
    livePreview: boolean;
  };
  ui: {
    isProcessing: boolean;
    hasError: boolean;
    errorMessage: string | null;
  };
}
```

### State Management
- **Local component state** using React useState
- **No external state management** (Redux, Zustand) needed
- **No persistence** - state resets on page refresh
- **Memory only** - no localStorage or sessionStorage

## Validation Logic

### Content Validation
```typescript
const validateContent = (raw: string): ValidationResult => {
  if (raw.length > 100000) {
    return { valid: false, error: 'Content exceeds maximum length' };
  }
  
  if (!isValidUTF8(raw)) {
    return { valid: false, error: 'Invalid character encoding' };
  }
  
  return { valid: true, error: null };
};
```

### Processing Validation
```typescript
const validateProcessedContent = (processed: ReactNode): boolean => {
  return React.isValidElement(processed) || 
         Array.isArray(processed) || 
         typeof processed === 'string';
};
```

## Performance Considerations

### Memory Management
- Content processing is debounced to reduce memory pressure
- Large content warnings prevent browser memory issues
- Processed content is memoized to avoid re-processing

### State Update Optimization
- Only update state when content actually changes
- Separate state updates for content vs UI state
- Use React.memo for preview component to prevent unnecessary re-renders

## Type Definitions

### Core Types
```typescript
export interface EditorContent {
  raw: string;
  processed: ReactNode | null;
  lastModified: Date;
  isEmpty: boolean;
}

export interface EditorSettings {
  theme: 'light' | 'dark';
  previewEnabled: boolean;
  syntaxHighlighting: boolean;
  livePreview: boolean;
}

export interface ValidationResult {
  valid: boolean;
  error: string | null;
}

export interface MarkdownEditorState {
  content: EditorContent;
  settings: EditorSettings;
  ui: {
    isProcessing: boolean;
    hasError: boolean;
    errorMessage: string | null;
  };
}
```

This data model satisfies all functional requirements while maintaining simplicity and performance for a client-side only markdown editor.