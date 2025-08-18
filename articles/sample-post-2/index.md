---
title: "Reactフックの基本と活用法"
tags: ["React", "JavaScript", "フック"]
published: true
---

# Reactフックの基本と活用法

React 16.8で導入されたフック（Hooks）は、関数コンポーネントでstateやライフサイクルメソッドを使用できる機能です。

## 基本的なフック

### useState

stateを管理するための最も基本的なフックです：

```javascript
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        +1
      </button>
    </div>
  )
}
```

### useEffect

副作用を扱うためのフックです：

```javascript
import { useEffect, useState } from 'react'

function UserProfile({ userId }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchUser(userId).then(setUser)
  }, [userId])

  return user ? <div>{user.name}</div> : <div>Loading...</div>
}
```

## 高度なフック

### useCallback

関数のメモ化に使用します：

```javascript
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b)
  },
  [a, b]
)
```

### useMemo

値のメモ化に使用します：

```javascript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])
```

## カスタムフック

独自のフックを作成することで、ロジックを再利用できます：

```javascript
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}
```

## フック使用時の注意点

1. **フックの呼び出し順序を変更しない**
   - 条件分岐内でフックを呼び出さない
   - ループ内でフックを呼び出さない

2. **依存配列を正しく設定する**
   - useEffectやuseMemoの依存配列に必要な値をすべて含める

3. **無限ループを避ける**
   - useEffectの依存配列に含める値に注意する

## まとめ

Reactフックは、関数コンポーネントを強力にし、コードの再利用性を高める優れた機能です。基本的なフックから始めて、徐々に高度な機能も活用していきましょう。