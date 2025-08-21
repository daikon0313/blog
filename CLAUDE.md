# Wikiライク技術ナレッジベースサイトの作成

現在のシンプルなブログをWikiライクなナレッジベースサイトに改修してください。以下の要件を満たすNext.jsアプリケーションを構築してください。

## 設計方針

### コンセプト
- **Wikipedia風のUI/UX**: 情報の階層化と相互リンクを重視
- **ナレッジベース**: 技術情報の体系的な整理
- **検索性**: 効率的な情報検索とナビゲーション
- **編集しやすさ**: マークダウンベースの記事管理

### 基本機能
- マークダウン形式での記事執筆（継続）
- タイトル、本文、タグ、カテゴリの管理
- 記事間の相互リンク（内部リンク）
- 階層的なカテゴリ構造
- 全文検索機能
- 目次（Table of Contents）自動生成
- サイドバーナビゲーション
- 自動的な公開日と編集日の挿入
- GitHub Pages または Vercel での無料ホスティング対応

### ディレクトリ構成
```
articles/
├── categories.json (カテゴリ定義)
├── programming/
│   ├── languages/
│   │   ├── javascript/
│   │   │   ├── index.md (JavaScript概要)
│   │   │   ├── frameworks/
│   │   │   │   ├── react/
│   │   │   │   │   └── index.md
│   │   │   │   └── nextjs/
│   │   │   │       └── index.md
│   │   │   └── basics/
│   │   │       └── index.md
│   │   └── python/
│   │       └── index.md
│   └── databases/
│       ├── snowflake/
│       │   ├── index.md
│       │   └── slack-integration/
│       │       └── index.md (既存記事)
│       └── sql/
│           └── index.md
└── tools/
    ├── git/
    │   └── index.md
    └── docker/
        └── index.md
```

### 記事フォーマット
各記事の `index.md` は以下のフロントマター形式（拡張）：
```markdown
---
title: "記事のタイトル"
category: "programming/databases/snowflake"
tags: ["Snowflake", "Slack", "Python"]
description: "記事の概要説明"
published: true
related: ["programming/languages/python", "tools/git"]
---

# 記事本文

マークダウン形式で記事を書く。
画像は相対パス `./image_1.png` で参照。

## 内部リンク
[[programming/languages/javascript]] - JavaScript基礎
[[programming/databases/sql]] - SQL入門

## 参考リンク
- 外部リンク例
```

### 技術スタック（追加・変更）
- Next.js (静的サイト生成)
- React
- gray-matter (フロントマター解析)
- remark (マークダウン→HTML変換)
- **remark-wiki-link** (内部リンク処理)
- **fuse.js** (全文検索)
- **remark-toc** (目次生成)

### ページ構成（Wiki化）

1. **ホームページ** (`/`)
   - **ダッシュボード風レイアウト**
   - カテゴリ別記事ツリー表示
   - 最近の更新記事
   - 検索バー
   - 人気記事ランキング

2. **カテゴリページ** (`/categories/[...path]`)
   - カテゴリ階層の表示
   - サブカテゴリ一覧
   - 該当記事一覧

3. **記事詳細ページ** (`/articles/[...path]`)
   - **Wikipediaライクレイアウト**
   - 左サイドバー: カテゴリナビゲーション
   - 右サイドバー: 目次、関連記事
   - メインコンテンツ: 記事本文
   - パンくずナビ
   - 内部リンクのハイライト
   - 編集履歴（GitHub連携）

4. **検索ページ** (`/search`)
   - 全文検索結果
   - カテゴリ・タグでのフィルタリング
   - 検索ハイライト

5. **タグページ** (`/tags/[tag]`)
   - タグ別記事一覧
   - 関連タグの提案

### UI/UXデザイン要件（Wiki化）

#### レイアウト
- **3カラムレイアウト**（記事詳細時）
  - 左サイドバー（250px）: カテゴリツリー
  - メインコンテンツ（可変）: 記事内容
  - 右サイドバー（200px）: 目次・関連記事
- **レスポンシブ対応**: モバイルではサイドバー折りたたみ
- **最大幅**: 1400px（Wikipediaライク）

#### カラーパレット
- **背景**: ホワイト/ライトグレー
- **プライマリ**: ブルー系（#0645ad - Wikipediaライク）
- **セカンダリ**: グレー系
- **アクセント**: グリーン系（編集・追加）

#### コンポーネント
- **ヘッダー**: ロゴ + 検索バー + ナビゲーション
- **フッター**: シンプルな情報
- **サイドバー**: 折りたたみ可能なツリー構造
- **目次**: スムーススクロール対応
- **パンくずナビ**: カテゴリ階層を表示

### デプロイ対応
- 静的エクスポート機能 (`next export`)
- GitHub Pages / Vercel での動作保証

## 実装ファイル構成（Wiki化対応）

```
├── package.json (依存関係追加)
├── next.config.js
├── components/
│   ├── Layout/
│   │   ├── Header.js (検索バー付きヘッダー)
│   │   ├── Footer.js
│   │   ├── Sidebar.js (カテゴリツリー)
│   │   └── TOC.js (目次)
│   ├── Wiki/
│   │   ├── WikiLink.js (内部リンクコンポーネント)
│   │   ├── Breadcrumb.js (パンくずナビ)
│   │   ├── CategoryTree.js (カテゴリツリー表示)
│   │   └── RelatedArticles.js (関連記事)
│   └── Search/
│       ├── SearchBar.js
│       ├── SearchResults.js
│       └── SearchFilters.js
├── pages/
│   ├── index.js (Wikiダッシュボード)
│   ├── _app.js (グローバルレイアウト)
│   ├── articles/
│   │   └── [...path].js (階層対応記事詳細)
│   ├── categories/
│   │   └── [...path].js (カテゴリページ)
│   ├── search.js (検索ページ)
│   └── tags/
│       └── [tag].js (タグページ)
├── lib/
│   ├── posts.js (記事読み込み - 階層対応)
│   ├── categories.js (カテゴリ管理)
│   ├── search.js (検索エンジン)
│   ├── wikilinks.js (内部リンク処理)
│   └── toc.js (目次生成)
├── styles/
│   ├── globals.css
│   ├── wiki.module.css (Wikiスタイル)
│   └── components/ (コンポーネント別CSS)
├── articles/ (階層化されたコンテンツ)
│   ├── categories.json
│   ├── programming/
│   │   └── databases/
│   │       └── snowflake/
│   │           └── slack-integration/
│   │               └── index.md (既存記事移行)
│   └── [その他のカテゴリ構造]
└── public/
    └── articles/ (画像等静的アセット)
```

## 実装フェーズ

### フェーズ1: 基盤整備
1. **既存記事の階層化移行**
   - `/articles/snowflake-slack-image-notification/` → `/articles/programming/databases/snowflake/slack-integration/`
2. **新しいファイル構造の実装**
3. **基本的なWikiレイアウトの実装**

### フェーズ2: Wiki機能実装
1. **カテゴリシステム**
2. **内部リンク機能**
3. **検索機能**
4. **目次生成**

### フェーズ3: UI/UX改善
1. **Wikipediaライクなデザイン**
2. **レスポンシブ対応**
3. **ナビゲーション改善**

## 移行要望
- 既存のSnowflake記事を適切なカテゴリに移行
- GitHub Pages での動作保証を維持
- 段階的な実装（既存機能を壊さない）
- `npm run dev` での動作確認を各フェーズで実施

## 参考情報（追加）
- Wikipedia UI/UX パターンの採用
- 内部リンクは `[[記事パス]]` 形式で記述
- カテゴリは階層構造で管理
- 検索はFuse.jsを使用した高速全文検索
- 目次は見出しから自動生成
- モバイル対応でサイドバーはハンバーガーメニュー化