# Markdown Editor Practice

このリポジトリは、spec-kitを使用したMarkdownエディターの実装練習プロジェクトです。  
リアルタイムプレビュー機能を持つMarkdownエディターをNext.js（App Router）で実装しています。

## 機能

- **リアルタイムプレビュー**: Markdownの入力と同時にプレビューが更新されます
- **分割レイアウト**: エディターペインとプレビューペインを並べて表示
- **GitHub Flavored Markdown対応**: テーブル、タスクリスト、コードブロックなどをサポート
- **シンタックスハイライト**: Prism.jsを使用したコードブロックのハイライト
- **デバウンス機能**: パフォーマンス最適化のための入力遅延処理

## 技術スタック

最新の情報は`package.json`を参照してください。

### フロントエンド
* Next.js 15.3.3 (App Router)
* React 19.1.0
* TypeScript
* react-markdown (Markdownレンダリング)
* remark-gfm (GitHub Flavored Markdown)
* Prism.js (シンタックスハイライト)

### 開発ツール
* Biome (Linter/Formatter)
* Vitest (テストフレームワーク)
* Testing Library (React コンポーネントテスト)
* Storybook (コンポーネント開発環境)
* pnpm (パッケージマネージャー)

## セットアップ

1. リポジトリをクローンします
2. 依存関係をインストールします: `pnpm install`
3. 開発サーバーを起動します: `pnpm dev`
4. ブラウザで http://localhost:3000 を開きます

## 開発コマンド

```bash
# 開発サーバー起動（Turbopack使用）
pnpm dev

# ビルド
pnpm build

# 本番サーバー起動
pnpm start

# テスト実行
pnpm test

# テスト（ウォッチモード）
pnpm test:watch

# テストカバレッジ
pnpm test:coverage

# Storybook起動
pnpm storybook

# コード品質チェック・修正
pnpm bc

# TypeScriptタイプチェック
pnpm tc
```

## プロジェクト構成

```
src/
├── app/                    # Next.js App Router
├── features/
│   └── markdown-editor/    # Markdownエディター機能
│       ├── components/     # React コンポーネント
│       │   ├── containers/ # コンテナコンポーネント
│       │   └── presentational/ # プレゼンテーショナルコンポーネント
│       ├── hooks/          # カスタムフック
│       ├── types/          # TypeScript型定義
│       └── utils/          # ユーティリティ関数
└── stories/                # Storybook ストーリー
```

## アーキテクチャ

- **Feature-Based Architecture**: 機能ごとにディレクトリを分割
- **Container/Presentational Pattern**: ロジックと表示を分離
- **Custom Hooks**: ビジネスロジックの再利用
- **TypeScript**: 型安全性の確保
