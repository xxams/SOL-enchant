const CACHE_NAME = 'slog-pwa-v2'; // 👈 버전을 v2로 올렸습니다!
const urlsToCache = [
  './',
  './index.html'
];

// 1. 설치될 때 파일을 내 컴퓨터에 저장(캐싱)
self.addEventListener('install', event => {
  self.skipWaiting(); // 👈 대기하지 말고 즉시 새 버전으로 갈아끼우라는 마법의 코드
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. 옛날 캐시(v1)를 강제로 지워버리는 청소부 역할 (새로 추가됨!)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('이전 버전 캐시 삭제 완료:', cacheName);
            return caches.delete(cacheName); // 옛날 기억 삭제!
          }
        })
      );
    }).then(() => self.clients.claim()) // 👈 즉시 웹사이트 통제권 획득
  );
});

// 3. 오프라인 상태에서도 저장된 파일을 불러와서 실행
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});