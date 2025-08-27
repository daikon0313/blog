---
sidebar_position: 3
---

# Kubernetes基礎

:::info サンプルページ
このページはサンプルページです。実際のコンテンツではありません。
:::

Kubernetes（K8s）によるコンテナオーケストレーションの基本概念と使用方法について解説します。

## Kubernetesとは

Kubernetesはコンテナ化されたアプリケーションのデプロイ、スケーリング、管理を自動化するオープンソースのコンテナオーケストレーションプラットフォームです。

## 主要な概念

### クラスター構成
- **Master Node**: クラスターの制御プレーン
- **Worker Node**: アプリケーションコンテナが実行されるノード

### リソースオブジェクト

#### Pod
- Kubernetesで最小のデプロイ単位
- 1つ以上のコンテナをグループ化

#### Deployment
- Podのレプリカセットを管理
- ローリングアップデートをサポート

#### Service
- Podへのネットワークアクセスを提供
- ロードバランシング機能を含む

#### ConfigMap / Secret
- 設定情報や機密情報の管理

## 基本コマンド (kubectl)

### クラスター情報
```bash
# クラスター情報表示
kubectl cluster-info

# ノード一覧
kubectl get nodes

# ネームスペース一覧
kubectl get namespaces
```

### Pod操作
```bash
# Pod一覧表示
kubectl get pods

# Podの詳細情報
kubectl describe pod pod-name

# Podのログ表示
kubectl logs pod-name

# Pod内でコマンド実行
kubectl exec -it pod-name -- /bin/bash
```

### リソース管理
```bash
# YAMLファイルからリソース作成
kubectl apply -f deployment.yaml

# リソースの削除
kubectl delete -f deployment.yaml

# スケーリング
kubectl scale deployment myapp --replicas=3
```

## YAMLマニフェストの例

### Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deployment
  labels:
    app: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myapp:latest
        ports:
        - containerPort: 8080
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: myapp-secret
              key: database-url
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 256Mi
```

### Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  selector:
    app: myapp
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: LoadBalancer
```

### ConfigMap
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: myapp-config
data:
  app.properties: |
    server.port=8080
    logging.level=INFO
  database.host: "db.example.com"
```

### Secret
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: myapp-secret
type: Opaque
data:
  database-url: cG9zdGdyZXNxbDovL3VzZXI6cGFzc0BkYjo1NDMyL215ZGI=
  api-key: bXktc2VjcmV0LWFwaS1rZXk=
```

## ネットワーキング

### Serviceの種類
- **ClusterIP**: クラスター内部でのみアクセス可能
- **NodePort**: 各ノードの特定ポートでアクセス可能
- **LoadBalancer**: クラウドプロバイダーのLBを使用
- **ExternalName**: 外部サービスへのエイリアス

### Ingress
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp-service
            port:
              number: 80
```

## ストレージ

### Persistent Volume (PV)
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: myapp-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: fast
  hostPath:
    path: /data/myapp
```

### Persistent Volume Claim (PVC)
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: myapp-pvc
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: fast
```

## ヘルスチェック

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
```

## ベストプラクティス

1. **リソース制限**
   - CPU、メモリのrequests/limitsを設定

2. **ヘルスチョック**
   - liveness、readinessプローブの実装

3. **セキュリティ**
   - RBACの適用
   - Pod Security Standardsの使用

4. **モニタリング**
   - Prometheus + Grafana
   - ログ集約（ELK Stack）

## 参考リンク

- [Kubernetes公式ドキュメント](https://kubernetes.io/docs/)
- [kubectlチートシート](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Kubernetesパターン](https://k8spatterns.io/)