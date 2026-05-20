// 🛠️ 캐시를 아예 생성하지 않고, 무조건 실시간 Vercel 서버로 직행하는 수문장 코드
const CACHE_NAME = 'slog-pwa-dynamic-' + new Date().getTime(); // 매번 새로운 이름 생성

self.addEventListener('install', event => {
  // 업데이트 대기 상태를 없애고 즉시 새로운 서비스 워커를 활성화
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // 활성화되자마자 즉시 기존의 모든 옛날 캐시를 싹 청소(삭제)
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim()) // 즉시 웹사이트 제어권 획득
  );
});

// 핵심: 네트워크(Vercel 서버)에서 항상 최신 코드를 먼저 가져오고, 실패했을 때만 임시 캐시를 씀
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // 서버 통신이 성공하면 무조건 서버에서 준 최신 화면을 그대로 반환! (자동 Ctrl+Shift+R 효과)
        return response;
      })
      .catch(() => {
        // 혹시나 사내 네트워크가 끊겼을 때만 예외적으로 열리도록 방어
        return caches.match(event.request);
      })
  );
});