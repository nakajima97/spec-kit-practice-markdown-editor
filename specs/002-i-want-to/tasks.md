# Tasks: マークダウンエディター

**Input**: 設計文書から `/specs/002-i-want-to/`
**Prerequisites**: plan.md (必須), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. plan.mdを読み込んで技術スタック、ライブラリ、構造を抽出
   → 技術スタック: Next.js 15, React 19, TypeScript, react-markdown, remark-gfm
2. オプション設計文書を読み込み:
   → data-model.md: EditorContent, EditorSettings エンティティ
   → contracts/: コンポーネントインターフェース契約
   → research.md: 技術決定事項
3. カテゴリ別にタスクを生成:
   → セットアップ: 依存関係、構造作成
   → テスト: コンポーネントテスト、統合テスト
   → コア: コンポーネント、フック、ユーティリティ
   → 統合: ページ統合、Storybook
   → 仕上げ: パフォーマンス、品質チェック
4. タスクルールを適用:
   → 異なるファイル = [P] 並列実行可能
   → 同一ファイル = 順次実行（[P]なし）
   → テスト優先実装（TDD）
5. タスクに順次番号付け（T001, T002...）
6. 依存関係グラフを生成
7. 並列実行例を作成
8. タスク完全性を検証
9. 戻り値: SUCCESS（タスク実行準備完了）
```

## Format: `[ID] [P?] 説明`
- **[P]**: 並列実行可能（異なるファイル、依存関係なし）
- 説明に正確なファイルパスを含める

## パス規約
- **フロントエンド専用**: `src/` リポジトリルート
- Next.js App Routerの構造を使用

## Phase 3.1: セットアップ
- [ ] T001 マークダウンエディター機能の依存関係をインストール（react-markdown, remark-gfm, prismjs, clsx）
- [ ] T002 [P] フィーチャーディレクトリ構造を作成 `src/features/markdown-editor/`
- [ ] T003 [P] 型定義ファイルを作成 `src/features/markdown-editor/types/markdown.ts`

## Phase 3.2: テスト優先（TDD）⚠️ 3.3より前に完了必須
**重要: これらのテストは実装前に作成し、失敗する必要があります**
- [ ] T004 [P] MarkdownEditorコンポーネントテスト `src/features/markdown-editor/components/containers/__tests__/MarkdownEditor.test.tsx`
- [ ] T005 [P] EditorPaneコンポーネントテスト `src/features/markdown-editor/components/presentational/__tests__/EditorPane.test.tsx`
- [ ] T006 [P] PreviewPaneコンポーネントテスト `src/features/markdown-editor/components/presentational/__tests__/PreviewPane.test.tsx`
- [ ] T007 [P] SplitLayoutコンポーネントテスト `src/features/markdown-editor/components/presentational/__tests__/SplitLayout.test.tsx`
- [ ] T008 [P] useMarkdownProcessorフックテスト `src/features/markdown-editor/hooks/__tests__/useMarkdownProcessor.test.ts`
- [ ] T009 [P] useDebouncedフックテスト `src/features/markdown-editor/hooks/__tests__/useDebounced.test.ts`
- [ ] T010 [P] 統合テスト：リアルタイムプレビュー `src/features/markdown-editor/__tests__/integration/real-time-preview.test.tsx`
- [ ] T011 [P] 統合テスト：エディター状態管理 `src/features/markdown-editor/__tests__/integration/editor-state.test.tsx`

## Phase 3.3: コア実装（テストが失敗した後のみ）
- [ ] T012 [P] マークダウンパーサーユーティリティ `src/features/markdown-editor/utils/markdown-parser.ts`
- [ ] T013 [P] useDebounced カスタムフック `src/features/markdown-editor/hooks/useDebounced.ts`
- [ ] T014 useMarkdownProcessor カスタムフック `src/features/markdown-editor/hooks/useMarkdownProcessor.ts`
- [ ] T015 [P] SplitLayout プレゼンテーショナルコンポーネント `src/features/markdown-editor/components/presentational/SplitLayout.tsx`
- [ ] T016 [P] EditorPane プレゼンテーショナルコンポーネント `src/features/markdown-editor/components/presentational/EditorPane.tsx`
- [ ] T017 [P] PreviewPane プレゼンテーショナルコンポーネント `src/features/markdown-editor/components/presentational/PreviewPane.tsx`
- [ ] T018 MarkdownEditor コンテナコンポーネント `src/features/markdown-editor/components/containers/MarkdownEditor.tsx`

## Phase 3.4: 統合
- [ ] T019 ルートページにMarkdownEditorを統合 `src/app/page.tsx`
- [ ] T020 [P] MarkdownEditor Storybookストーリー `src/features/markdown-editor/components/containers/MarkdownEditor.stories.tsx`
- [ ] T021 [P] EditorPane Storybookストーリー `src/features/markdown-editor/components/presentational/EditorPane.stories.tsx`
- [ ] T022 [P] PreviewPane Storybookストーリー `src/features/markdown-editor/components/presentational/PreviewPane.stories.tsx`
- [ ] T023 [P] SplitLayout Storybookストーリー `src/features/markdown-editor/components/presentational/SplitLayout.stories.tsx`

## Phase 3.5: 仕上げ
- [ ] T024 [P] エラーハンドリングのユニットテスト `src/features/markdown-editor/utils/__tests__/error-handling.test.ts`
- [ ] T025 [P] パフォーマンステスト（<100ms レンダリング） `src/features/markdown-editor/__tests__/performance/rendering.test.ts`
- [ ] T026 TypeScript型チェック（pnpm tc）
- [ ] T027 コード品質チェック（pnpm bc）
- [ ] T028 すべてのテストを実行してパス確認（pnpm test）
- [ ] T029 Storybookビルドとテスト（pnpm build-storybook）

## 依存関係
- テスト（T004-T011）が実装（T012-T018）より前
- T013がT014をブロック（useMarkdownProcessorがuseDebouncedに依存）
- T012がT014をブロック（useMarkdownProcessorがmarkdown-parserに依存）
- T015-T017がT018をブロック（MarkdownEditorが子コンポーネントに依存）
- T018がT019をブロック（ページ統合がコンポーネント完成後）
- 実装が仕上げ（T024-T029）より前

## 並列実行例
```
# フェーズ3.2：テストを並列実行
Task: "MarkdownEditorコンポーネントテスト src/features/markdown-editor/components/containers/__tests__/MarkdownEditor.test.tsx"
Task: "EditorPaneコンポーネントテスト src/features/markdown-editor/components/presentational/__tests__/EditorPane.test.tsx"
Task: "PreviewPaneコンポーネントテスト src/features/markdown-editor/components/presentational/__tests__/PreviewPane.test.tsx"
Task: "SplitLayoutコンポーネントテスト src/features/markdown-editor/components/presentational/__tests__/SplitLayout.test.tsx"

# フェーズ3.3：プレゼンテーショナルコンポーネントを並列実装
Task: "SplitLayout プレゼンテーショナルコンポーネント src/features/markdown-editor/components/presentational/SplitLayout.tsx"
Task: "EditorPane プレゼンテーショナルコンポーネント src/features/markdown-editor/components/presentational/EditorPane.tsx"
Task: "PreviewPane プレゼンテーショナルコンポーネント src/features/markdown-editor/components/presentational/PreviewPane.tsx"

# フェーズ3.4：Storybookストーリーを並列作成
Task: "MarkdownEditor Storybookストーリー src/features/markdown-editor/components/containers/MarkdownEditor.stories.tsx"
Task: "EditorPane Storybookストーリー src/features/markdown-editor/components/presentational/EditorPane.stories.tsx"
Task: "PreviewPane Storybookストーリー src/features/markdown-editor/components/presentational/PreviewPane.stories.tsx"
```

## 注記
- [P] タスク = 異なるファイル、依存関係なし
- 実装前にテストが失敗することを確認
- 各タスク後にコミット
- 回避事項：曖昧なタスク、同一ファイルの競合

## タスク生成ルール
*main()実行中に適用*

1. **契約から**:
   - 各コンポーネントインターフェース → コンポーネントテストタスク [P]
   - 各コンポーネント → 実装タスク
   
2. **データモデルから**:
   - EditorContent エンティティ → 型定義とvalidationタスク [P]
   - EditorSettings エンティティ → 設定管理タスク [P]
   
3. **ユーザーストーリーから**:
   - 各シナリオ → 統合テスト [P]
   - クイックスタートシナリオ → 検証タスク

4. **順序**:
   - セットアップ → テスト → ユーティリティ → フック → コンポーネント → 統合 → 仕上げ
   - 依存関係が並列実行をブロック

## 検証チェックリスト
*main()が戻り値を返す前にチェック*

- [x] すべてのコンポーネント契約に対応するテストあり
- [x] すべてのエンティティにモデル/型タスクあり  
- [x] すべてのテストが実装より前
- [x] 並列タスクが真に独立
- [x] 各タスクに正確なファイルパス指定
- [x] [P]タスクが同一ファイルを変更しない

## 成功基準
- すべてのテストがパス
- TypeScript型チェックがパス
- Biomeコード品質チェックがパス
- Storybookコンポーネントが正常動作
- 即座にマークダウンエディターにアクセス可能
- リアルタイムプレビューが動作
- コンテンツが永続化されない（仕様通り）