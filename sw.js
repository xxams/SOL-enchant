const CACHE_NAME = 'slog-pwa-v1';
const urlsToCache = [
  './',
  './index.html'
  // 만약 css나 js 파일이 따로 있다면 아래에 추가하세요. 예: './style.css', './script.js'
];

// 설치될 때 파일을 내 컴퓨터에 저장(캐싱)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 오프라인 상태에서도 저장된 파일을 불러와서 실행
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});