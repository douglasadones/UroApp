const CACHE_NAME = "urohpb-v2"
const STATIC_CACHE = "urohpb-static-v2"
const DYNAMIC_CACHE = "urohpb-dynamic-v2"

// Lista completa de recursos para cache
const urlsToCache = [
  "/",
  "/manifest.json",
  "/offline.html",
  // Ícones
  "/icon-72x72.png",
  "/icon-96x96.png",
  "/icon-128x128.png",
  "/icon-144x144.png",
  "/icon-152x152.png",
  "/icon-192x192.png",
  "/icon-384x384.png",
  "/icon-512x512.png",
]

// Install event - cache recursos essenciais
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...")
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Service Worker: Caching static files")
        return cache.addAll(urlsToCache)
      })
      .then(() => {
        console.log("Service Worker: Static files cached successfully")
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error("Service Worker: Error caching static files", error)
      }),
  )
})

// Activate event - limpar caches antigos
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...")
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("Service Worker: Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("Service Worker: Claiming clients")
        return self.clients.claim()
      }),
  )
})

// Fetch event - estratégia cache-first para recursos estáticos, network-first para API
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Ignorar requisições não-HTTP
  if (!request.url.startsWith("http")) {
    return
  }

  // Estratégia para diferentes tipos de recursos
  if (request.destination === "document") {
    // Para páginas HTML - Network first, fallback para cache
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone da resposta para cache
          const responseClone = response.clone()
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone)
          })
          return response
        })
        .catch(() => {
          // Se falhar, tenta o cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }
            // Se não tem no cache, retorna página offline
            return caches.match("/")
          })
        }),
    )
  } else if (request.destination === "image" || request.url.includes("/icon-")) {
    // Para imagens e ícones - Cache first
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }
        return fetch(request).then((response) => {
          const responseClone = response.clone()
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone)
          })
          return response
        })
      }),
    )
  } else if (request.url.includes("/_next/")) {
    // Para recursos do Next.js - Cache first
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }
        return fetch(request)
          .then((response) => {
            if (response.status === 200) {
              const responseClone = response.clone()
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(request, responseClone)
              })
            }
            return response
          })
          .catch(() => {
            // Se falhar, retorna resposta vazia para evitar erros
            return new Response("", { status: 200 })
          })
      }),
    )
  } else {
    // Para outras requisições - Network first
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          return caches.match(request)
        }),
    )
  }
})

// Background sync para emails pendentes
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync triggered", event.tag)
  if (event.tag === "email-report") {
    event.waitUntil(sendPendingEmails())
  }
})

// Função para enviar emails pendentes
async function sendPendingEmails() {
  try {
    console.log("Service Worker: Processing pending emails...")

    // Abrir IndexedDB
    const db = await openDB()
    const transaction = db.transaction(["pendingEmails"], "readonly")
    const store = transaction.objectStore("pendingEmails")
    const emails = await getAllFromStore(store)

    console.log(`Service Worker: Found ${emails.length} pending emails`)

    for (const email of emails) {
      try {
        // Simular envio de email (substitua pela sua API real)
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            doctorEmail: email.doctorEmail,
            patientEmail: email.patientEmail,
            report: email.report,
          }),
        })

        if (response.ok) {
          // Email enviado com sucesso, remover da fila
          await deleteEmailFromDB(email.id)
          console.log(`Service Worker: Email ${email.id} sent successfully`)
        }
      } catch (error) {
        console.error(`Service Worker: Failed to send email ${email.id}:`, error)
      }
    }
  } catch (error) {
    console.error("Service Worker: Error processing pending emails:", error)
  }
}

// Funções auxiliares para IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("UroHPBDB", 1)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function getAllFromStore(store) {
  return new Promise((resolve, reject) => {
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function deleteEmailFromDB(emailId) {
  const db = await openDB()
  const transaction = db.transaction(["pendingEmails"], "readwrite")
  const store = transaction.objectStore("pendingEmails")
  return new Promise((resolve, reject) => {
    const request = store.delete(emailId)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// Notificar clientes sobre atualizações
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})
