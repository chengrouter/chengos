/**
 * ChengOS UI Service Worker
 * 支持离线缓存、自动更新、性能优化
 */

const CACHE_NAME = 'ChengOS-ui-v1.0.2'
const STATIC_CACHE = 'static-v3'
const DYNAMIC_CACHE = 'dynamic-v3'

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  // 其他静态资源会自动缓存
]

// 离线页面
const OFFLINE_URL = '/offline.html'

// 安装事件
self.addEventListener('install', (event) => {
  console.log('SW: 安装中...')

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('SW: 缓存静态资源')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('SW: 安装完成')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('SW: 安装失败', error)
      })
  )
})

// 激活事件
self.addEventListener('activate', (event) => {
  console.log('SW: 激活中...')

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // 删除旧版本缓存
              return cacheName !== STATIC_CACHE &&
                     cacheName !== DYNAMIC_CACHE &&
                     cacheName !== CACHE_NAME
            })
            .map((cacheName) => {
              console.log('SW: 删除旧缓存', cacheName)
              return caches.delete(cacheName)
            })
        )
      })
      .then(() => {
        console.log('SW: 激活完成')
        return self.clients.claim()
      })
  )
})

// 网络请求拦截
self.addEventListener('fetch', (event) => {
  const { request } = event

  // 跳过非 HTTP(S) 请求
  if (!request.url.startsWith('http')) {
    return
  }

  // 跳过 Chrome 扩展请求
  if (request.url.startsWith('chrome-extension://')) {
    return
  }

  // 处理 API 请求
  if (request.url.includes('/api/')) {
    event.respondWith(handleApiRequest(request))
    return
  }

  // runtime-config.js must always reflect container environment variables.
  if (new URL(request.url).pathname === '/runtime-config.js') {
    event.respondWith(fetch(request, { cache: 'no-store' }))
    return
  }

  // 处理静态资源请求
  if (request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'image' ||
      request.destination === 'font') {
    event.respondWith(handleStaticRequest(request))
    return
  }

  // 处理页面导航请求
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request))
    return
  }
})

/**
 * 处理 API 请求 - 网络优先策略
 */
async function handleApiRequest(request) {
  try {
    const response = await fetch(request)

    // 缓存成功的 GET 请求
    if (request.method === 'GET' && response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, response.clone())
    }

    return response
  } catch (error) {
    console.log('SW: API 请求失败，尝试缓存', request.url)

    // 尝试从缓存获取
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    // 返回离线响应
    return new Response(
      JSON.stringify({
        error: '网络连接失败',
        offline: true,
        timestamp: Date.now()
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

/**
 * 处理静态资源请求 - 缓存优先策略
 */
async function handleStaticRequest(request) {
  if (request.destination === 'script' || request.destination === 'style') {
    return handleNetworkFirstStaticRequest(request)
  }

  const cachedResponse = await caches.match(request)

  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const response = await fetch(request)

    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, response.clone())
    }

    return response
  } catch (error) {
    console.log('SW: 静态资源请求失败', request.url)
    throw error
  }
}

/**
 * 处理脚本/样式 - 网络优先，避免旧 bundle 长期接管登录链路
 */
async function handleNetworkFirstStaticRequest(request) {
  try {
    const response = await fetch(request)

    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, response.clone())
    }

    return response
  } catch (error) {
    console.log('SW: 脚本/样式请求失败，尝试缓存', request.url)

    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    throw error
  }
}

/**
 * 处理页面导航请求 - 网络优先，离线兜底
 */
async function handleNavigationRequest(request) {
  try {
    const response = await fetch(request)
    return response
  } catch (error) {
    console.log('SW: 页面导航失败，返回离线页面')

    const offlineResponse = await caches.match(OFFLINE_URL)
    if (offlineResponse) {
      return offlineResponse
    }

    // 如果没有离线页面，返回基本 HTML
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>离线模式 - ChengOS</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: #f8fafc;
              color: #334155;
            }
            .container {
              text-align: center;
              max-width: 400px;
              padding: 2rem;
            }
            .icon {
              font-size: 4rem;
              margin-bottom: 1rem;
            }
            h1 {
              font-size: 1.5rem;
              margin-bottom: 1rem;
            }
            p {
              margin-bottom: 1.5rem;
              color: #64748b;
            }
            button {
              background: #3b82f6;
              color: white;
              border: none;
              padding: 0.5rem 1rem;
              border-radius: 0.375rem;
              cursor: pointer;
            }
            button:hover {
              background: #2563eb;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">📱</div>
            <h1>离线模式</h1>
            <p>您当前处于离线状态。请检查网络连接后重试。</p>
            <button onclick="window.location.reload()">重新连接</button>
          </div>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    })
  }
}

// 消息处理
self.addEventListener('message', (event) => {
  const { type, payload } = event.data

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break

    case 'GET_VERSION':
      event.ports[0].postMessage({
        version: CACHE_NAME,
        timestamp: Date.now()
      })
      break

    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true })
      }).catch((error) => {
        event.ports[0].postMessage({ success: false, error: error.message })
      })
      break

    default:
      console.log('SW: 未知消息类型', type)
  }
})

/**
 * 清除所有缓存
 */
async function clearAllCaches() {
  const cacheNames = await caches.keys()
  await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)))
  console.log('SW: 已清除所有缓存')
}

// 后台同步（如果支持）
if ('sync' in self.registration) {
  self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
      event.waitUntil(doBackgroundSync())
    }
  })
}

async function doBackgroundSync() {
  console.log('SW: 执行后台同步')
  // 这里可以实现数据同步逻辑
}

// 推送通知（如果支持）
if ('push' in self.registration) {
  self.addEventListener('push', (event) => {
    const options = {
      body: event.data ? event.data.text() : '您有新的消息',
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: '查看详情',
          icon: '/images/checkmark.png'
        },
        {
          action: 'close',
          title: '关闭',
          icon: '/images/xmark.png'
        }
      ]
    }

    event.waitUntil(
      self.registration.showNotification('ChengOS', options)
    )
  })

  self.addEventListener('notificationclick', (event) => {
    event.notification.close()

    if (event.action === 'explore') {
      event.waitUntil(
        clients.openWindow('https://your-domain.com')
      )
    }
  })
}

console.log('SW: Service Worker 已加载')
