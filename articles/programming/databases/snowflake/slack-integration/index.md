---
title: "SnowflakeからSlackに画像付き通知を送る方法"
category: "programming/databases/snowflake"
tags: ["Snowflake", "Slack", "Python", "データベース"]
description: "SnowflakeのSTAGE機能を使用してSlackに画像付き通知を送信する方法を解説"
published: true
related: ["programming/languages/python"]
---

# はじめに

こちらの記事の続きだと勝手に思っています。
参考：[SnowflakeからSlackに通知を送る方法](https://zenn.dev/churadata/articles/a553092387708b)

今回は、Slack通知をSnowflakeから実行する際、画像を載せて通知を行います。

# 手順

## 1. 前提条件

`NETWORK RULE`、`SECRET`、`EXTERNAL ACCESS INTEGRATION` は事前に作成お願いしますmm

## 2. 画像保存用STAGEの作成

画像を保存するための `STAGE` を作成します。

```sql
CREATE OR REPLACE STAGE SAMPLE_STAGE ENCRYPTION = (TYPE = 'SNOWFLAKE_SSE');
```

> **⚠️ 重要な注意点**  
> STAGE 作成時に、`ENCRYPTION = (TYPE = 'SNOWFLAKE_SSE')`を指定する必要があります。指定しない場合、ファイルが破損する場合があります。

![STAGE暗号化設定](/articles/programming/databases/snowflake/slack-integration/image.png)

## 3. 画像ファイルの配置

適当な画像を作成した STAGE 配下に格納します。

## 4. プロシージャの作成

```sql
CREATE OR REPLACE PROCEDURE slack_send_image()
RETURNS STRING
LANGUAGE PYTHON
RUNTIME_VERSION = 3.8
HANDLER = 'main'
EXTERNAL_ACCESS_INTEGRATIONS = (XXXXX)
SECRETS = ('slack_url' = XXXXX)
PACKAGES = ('snowflake-snowpark-python', requests)
EXECUTE AS CALLER
AS
$
import snowflake.snowpark as snowpark
import json
import _snowflake

def get_image(session) -> str:
    df = session.sql("SELECT GET_PRESIGNED_URL('@SAMPLE_STAGE', 'sample.png', 15) as image_url").collect()
    return df[0][0]
    
def main(session): 
    webhook_url = _snowflake.get_generic_secret_string('slack_url')    
    image_url = get_image(session)
    slack_data = {
        "blocks": [
            {
                "type": "image",
                "title": {
                    "type": "plain_text",
                    "text": "sample画像だよ"
                },
                "block_id": "image4",
                "image_url": image_url,
                "alt_text": "test"
            }
        ]
    }
    response = requests.post(
        webhook_url, data=json.dumps(slack_data),
        headers={'Content-Type': 'application/json'}
    )
    if response.status_code != 200:
        raise ValueError(
            'Request to slack returned an error %s, Response:\n%s'
            % (response.status_code, response.text)
        )
    return "SUCCESS"
$;
```

### ポイント解説

- **GET_PRESIGNED_URL**: Snowflake STAGEに格納されたファイルへの一時的なアクセスURLを生成
- **15分間有効**: プリサインドURLの有効期限を15分に設定
- **Block Kit形式**: SlackのBlock Kit APIを使用して画像ブロックを作成
- **エラーハンドリング**: HTTPステータスコードをチェックして適切なエラー処理

## 5. プロシージャの実行

作成したプロシージャを呼び出します。

```sql
CALL slack_send_image();
```

## 6. 結果確認

SlackへSTAGEに格納した画像が送られてきます。

![Slack通知結果](/articles/programming/databases/snowflake/slack-integration/result.svg)

# まとめ

SnowflakeからSlackへの画像付き通知により、データの可視化結果やアラート情報をより効果的に共有できるようになります。

特にダッシュボードのスクリーンショットや、異常検知グラフなどを自動送信する際に威力を発揮します。

# 参考

- [GET_PRESIGNED_URL関数 - Snowflake Documentation](https://docs.snowflake.com/ja/sql-reference/functions/get_presigned_url)
- [Image Block - Slack API](https://api.slack.com/reference/block-kit/blocks#image)