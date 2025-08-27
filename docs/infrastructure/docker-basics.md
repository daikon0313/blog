---
sidebar_position: 2
---

# Docker基礎

:::info サンプルページ
このページはサンプルページです。実際のコンテンツではありません。
:::

Dockerによるコンテナ技術の基本と活用方法について解説します。

## Dockerとは

Dockerはアプリケーションとその依存関係をコンテナという軽量な仮想化環境にパッケージ化するプラットフォームです。

## 主要な概念

### イメージ（Image）
- アプリケーションと実行環境のスナップショット
- 読み取り専用のテンプレート
- Dockerfileからビルドされる

### コンテナ（Container）
- イメージから作成される実行可能なインスタンス
- 分離されたプロセス空間で実行

### Dockerfile
- イメージを作成するための設定ファイル
- ベースイメージ、パッケージインストール、起動コマンドを定義

## 基本コマンド

### イメージ操作
```bash
# イメージのビルド
docker build -t myapp:latest .

# イメージ一覧表示
docker images

# イメージの削除
docker rmi image_name
```

### コンテナ操作
```bash
# コンテナの実行
docker run -p 8080:80 myapp:latest

# バックグラウンドで実行
docker run -d -p 8080:80 myapp:latest

# 実行中コンテナ一覧
docker ps

# コンテナ停止
docker stop container_id

# コンテナ削除
docker rm container_id
```

## Dockerfileの例

### Node.jsアプリケーション
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

USER node

CMD ["node", "server.js"]
```

### Pythonアプリケーション
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

USER 1000:1000

CMD ["python", "app.py"]
```

## Docker Compose

複数のコンテナを組み合わせてアプリケーションを構築するツールです。

### docker-compose.ymlの例
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8080:80"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 基本コマンド
```bash
# サービスの起動
docker-compose up -d

# サービスの停止
docker-compose down

# ログの確認
docker-compose logs
```

## ベストプラクティス

1. **軽量なベースイメージの使用**
   - Alpine Linuxベースのイメージを選択

2. **マルチステージビルド**
   - ビルド環境と実行環境を分離

3. **セキュリティ**
   - rootユーザーでの実行を避ける
   - 最新のベースイメージを使用

4. **レイヤーの最適化**
   - .dockerignoreで不要ファイルを除外
   - キャッシュを有効活用

## 参考リンク

- [Docker公式ドキュメント](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Docker Composeリファレンス](https://docs.docker.com/compose/)