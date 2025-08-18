---
title: "Next.jsで始める静的サイト生成"
tags: ["Next.js", "React", "静的サイト生成"]
published: true
---

# Next.jsで始める静的サイト生成

Next.jsは、Reactベースのフレームワークで、静的サイト生成（Static Site Generation, SSG）機能を提供しています。

## 静的サイト生成のメリット

静的サイト生成には以下のようなメリットがあります：

1. **高速な読み込み**
   - 事前にHTMLが生成されるため、サーバーサイドでの処理が不要
   - CDNでの配信に最適化されている

2. **SEO対応**
   - 検索エンジンがコンテンツをクロールしやすい
   - メタタグなどの設定も容易

3. **低コスト運用**
   - 静的ファイルのホスティングのみで済む
   - GitHub PagesやVercelなど無料プラットフォームが利用可能

## 実装のポイント

### getStaticPropsの活用

```javascript
export async function getStaticProps() {
  const data = await fetchData()
  return {
    props: {
      data,
    },
  }
}
```

`getStaticProps`を使用することで、ビルド時にデータを取得し、静的なHTMLを生成できます。

### 動的ルーティング

動的なパスを持つページも静的生成が可能です：

```javascript
export async function getStaticPaths() {
  const paths = await getAllPostIds()
  return {
    paths,
    fallback: false,
  }
}
```

## まとめ

Next.jsの静的サイト生成機能を活用することで、パフォーマンスに優れ、SEO対応されたWebサイトを構築できます。特に技術ブログのようなコンテンツサイトには最適な選択肢です。