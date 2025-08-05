/**
 * SaaSHub - Favorites Management System
 * Handles favorite SaaS management with persistence and synchronization
 */

// ===== FAVORITES STATE =====
const FavoritesState = {
  favorites: new Set(),
  isInitialized: false,
  storageKey: "saashub_favorites",
  callbacks: new Set(),
}

// ===== INITIALIZATION =====
function initializeFavorites() {
  if (FavoritesState.isInitialized) return

  try {
    loadFavoritesFromStorage()
    setupStorageListener()
    FavoritesState.isInitialized = true
    console.log("❤️ Favorites system initialized")
  } catch (error) {
    console.error("❌ Failed to initialize favorites:", error)
  }
}

// ===== STORAGE MANAGEMENT =====
function loadFavoritesFromStorage() {
  try {
    const stored = localStorage.getItem(FavoritesState.storageKey)
    if (stored) {
      const favoritesArray = JSON.parse(stored)
      FavoritesState.favorites = new Set(favoritesArray)
    }
  } catch (error) {
    console.error("Error loading favorites from storage:", error)
    FavoritesState.favorites = new Set()
  }
}

function saveFavoritesToStorage() {
  try {
    const favoritesArray = Array.from(FavoritesState.favorites)
    localStorage.setItem(FavoritesState.storageKey, JSON.stringify(favoritesArray))

    // Trigger storage event for cross-tab synchronization
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: FavoritesState.storageKey,
        newValue: JSON.stringify(favoritesArray),
        storageArea: localStorage,
      }),
    )
  } catch (error) {
    console.error("Error saving favorites to storage:", error)
  }
}

function setupStorageListener() {
  // Listen for storage changes from other tabs
  window.addEventListener("storage", (event) => {
    if (event.key === FavoritesState.storageKey) {
      try {
        const newFavorites = event.newValue ? JSON.parse(event.newValue) : []
        FavoritesState.favorites = new Set(newFavorites)
        notifyCallbacks("sync")
        updateAllFavoriteButtons()
      } catch (error) {
        console.error("Error syncing favorites from storage:", error)
      }
    }
  })
}

// ===== CORE FAVORITES FUNCTIONS =====
function addToFavorites(saasId) {
  if (!saasId) return false

  const wasAdded = !FavoritesState.favorites.has(saasId)
  FavoritesState.favorites.add(saasId)

  if (wasAdded) {
    saveFavoritesToStorage()
    notifyCallbacks("add", saasId)
    updateFavoriteButton(saasId, true)
    showFavoriteNotification(saasId, "added")

    // Add animation effect
    animateFavoriteAction(saasId, "add")
  }

  return wasAdded
}

function removeFromFavorites(saasId) {
  if (!saasId) return false

  const wasRemoved = FavoritesState.favorites.has(saasId)
  FavoritesState.favorites.delete(saasId)

  if (wasRemoved) {
    saveFavoritesToStorage()
    notifyCallbacks("remove", saasId)
    updateFavoriteButton(saasId, false)
    showFavoriteNotification(saasId, "removed")

    // Add animation effect
    animateFavoriteAction(saasId, "remove")
  }

  return wasRemoved
}

function toggleFavorite(saasId) {
  if (!saasId) return false

  const isFavorite = FavoritesState.favorites.has(saasId)

  if (isFavorite) {
    return removeFromFavorites(saasId)
  } else {
    return addToFavorites(saasId)
  }
}

function isFavorite(saasId) {
  return FavoritesState.favorites.has(saasId)
}

function getFavorites() {
  return Array.from(FavoritesState.favorites)
}

function getFavoritesCount() {
  return FavoritesState.favorites.size
}

function clearAllFavorites() {
  const count = FavoritesState.favorites.size
  FavoritesState.favorites.clear()
  saveFavoritesToStorage()
  notifyCallbacks("clear")
  updateAllFavoriteButtons()

  if (window.SaaSHub && window.SaaSHub.showNotification) {
    window.SaaSHub.showNotification(`${count} favoritos removidos`, "info")
  }

  return count
}

// ===== UI UPDATES =====
function updateFavoriteButton(saasId, isFavorited) {
  const buttons = document.querySelectorAll(`[data-saas-id="${saasId}"]`)

  buttons.forEach((button) => {
    const icon = button.querySelector("i, .favorite-icon")
    const text = button.querySelector(".favorite-text")

    if (isFavorited) {
      button.classList.add("favorited", "active")
      button.classList.remove("not-favorited")
      button.setAttribute("title", "Remover dos favoritos")

      if (icon) {
        icon.className = "fas fa-heart favorite-icon"
        icon.style.color = "#ff4757"
      }

      if (text) {
        text.textContent = "Favoritado"
      }
    } else {
      button.classList.remove("favorited", "active")
      button.classList.add("not-favorited")
      button.setAttribute("title", "Adicionar aos favoritos")

      if (icon) {
        icon.className = "far fa-heart favorite-icon"
        icon.style.color = ""
      }

      if (text) {
        text.textContent = "Favoritar"
      }
    }
  })
}

function updateAllFavoriteButtons() {
  // Update all favorite buttons on the page
  const allButtons = document.querySelectorAll("[data-saas-id]")

  allButtons.forEach((button) => {
    const saasId = Number.parseInt(button.dataset.saasId)
    if (saasId) {
      updateFavoriteButton(saasId, isFavorite(saasId))
    }
  })

  // Update favorites counter
  updateFavoritesCounter()
}

function updateFavoritesCounter() {
  const counters = document.querySelectorAll(".favorites-counter")
  const count = getFavoritesCount()

  counters.forEach((counter) => {
    counter.textContent = count
    counter.style.display = count > 0 ? "inline" : "none"
  })
}

// ===== ANIMATIONS =====
function animateFavoriteAction(saasId, action) {
  const buttons = document.querySelectorAll(`[data-saas-id="${saasId}"]`)

  buttons.forEach((button) => {
    // Add pulse animation
    button.classList.add("favorite-pulse")

    // Create floating heart effect
    if (action === "add") {
      createFloatingHeart(button)
    }

    // Remove animation class after animation completes
    setTimeout(() => {
      button.classList.remove("favorite-pulse")
    }, 600)
  })
}

function createFloatingHeart(button) {
  const heart = document.createElement("div")
  heart.className = "floating-heart"
  heart.innerHTML = "❤️"

  const rect = button.getBoundingClientRect()
  heart.style.position = "fixed"
  heart.style.left = rect.left + rect.width / 2 + "px"
  heart.style.top = rect.top + "px"
  heart.style.zIndex = "9999"
  heart.style.pointerEvents = "none"
  heart.style.fontSize = "1.5rem"
  heart.style.opacity = "1"
  heart.style.transform = "translateX(-50%)"
  heart.style.transition = "all 1s ease-out"

  document.body.appendChild(heart)

  // Animate heart floating up
  requestAnimationFrame(() => {
    heart.style.transform = "translateX(-50%) translateY(-50px)"
    heart.style.opacity = "0"
  })

  // Remove heart after animation
  setTimeout(() => {
    if (heart.parentNode) {
      heart.parentNode.removeChild(heart)
    }
  }, 1000)
}

// ===== NOTIFICATIONS =====
function showFavoriteNotification(saasId, action) {
  if (!window.SaaSHub || !window.SaaSHub.showNotification) return

  // Get SaaS name for notification
  let saasName = "SaaS"

  if (window.SaaSHub.AppState && window.SaaSHub.AppState.saasData) {
    const saas = window.SaaSHub.AppState.saasData.find((s) => s.id === saasId)
    if (saas) {
      saasName = saas.name
    }
  }

  const messages = {
    added: `${saasName} adicionado aos favoritos`,
    removed: `${saasName} removido dos favoritos`,
  }

  const types = {
    added: "success",
    removed: "info",
  }

  window.SaaSHub.showNotification(messages[action], types[action])
}

// ===== CALLBACK SYSTEM =====
function onFavoritesChange(callback) {
  if (typeof callback === "function") {
    FavoritesState.callbacks.add(callback)
  }
}

function offFavoritesChange(callback) {
  FavoritesState.callbacks.delete(callback)
}

function notifyCallbacks(action, saasId = null) {
  FavoritesState.callbacks.forEach((callback) => {
    try {
      callback(action, saasId, getFavorites())
    } catch (error) {
      console.error("Error in favorites callback:", error)
    }
  })
}

// ===== FAVORITES PAGE FUNCTIONS =====
function getFavoritesSaasData() {
  if (!window.SaaSHub || !window.SaaSHub.AppState || !window.SaaSHub.AppState.saasData) {
    return []
  }

  const favorites = getFavorites()
  return window.SaaSHub.AppState.saasData.filter((saas) => favorites.includes(saas.id))
}

function renderFavoritesGrid(containerId = "favoritesGrid") {
  const container = document.getElementById(containerId)
  if (!container) return

  const favoritesSaas = getFavoritesSaasData()

  if (favoritesSaas.length === 0) {
    container.innerHTML = `
      <div class="empty-favorites">
        <div class="empty-icon">💔</div>
        <h3>Nenhum favorito ainda</h3>
        <p>Explore nosso catálogo e adicione seus SaaS favoritos!</p>
        <a href="catalog.html" class="btn btn-primary">
          <i class="fas fa-search"></i>
          Explorar Catálogo
        </a>
      </div>
    `
    return
  }

  container.innerHTML = favoritesSaas.map((saas) => createFavoriteCard(saas)).join("")

  // Animate cards entrance
  const gsap = window.gsap // Declare gsap variable
  if (typeof gsap !== "undefined") {
    gsap.fromTo(".favorite-card", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 })
  }
}

function createFavoriteCard(saas) {
  return `
    <div class="favorite-card saas-card" onclick="openSaasDetail(${saas.id})">
      ${saas.isPremium ? '<div class="premium-badge">Premium</div>' : ""}
      <div class="card-header">
        <div class="card-logo">
          <img src="${saas.logo}" alt="${saas.name}" onerror="this.style.display='none'">
        </div>
        <div class="card-info">
          <h3 class="card-title">${saas.name}</h3>
          <span class="card-category">${getCategoryName(saas.category)}</span>
        </div>
      </div>
      <p class="card-description">${saas.description}</p>
      <div class="card-footer">
        <div class="card-rating">
          <div class="rating-stars">
            ${generateStars(saas.rating)}
          </div>
          <span class="rating-value">${saas.rating} (${saas.reviews})</span>
        </div>
        <div class="card-actions">
          <button class="card-btn favorited active" 
                  data-saas-id="${saas.id}"
                  onclick="event.stopPropagation(); toggleFavorite(${saas.id})" 
                  title="Remover dos favoritos">
            <i class="fas fa-heart favorite-icon"></i>
          </button>
          <a href="${saas.url}" class="card-btn primary" target="_blank" onclick="event.stopPropagation()">
            Acessar
          </a>
        </div>
      </div>
    </div>
  `
}

// ===== UTILITY FUNCTIONS =====
function getCategoryName(category) {
  const categories = {
    productivity: "Produtividade",
    design: "Design",
    marketing: "Marketing",
    development: "Desenvolvimento",
    finance: "Finanças",
    communication: "Comunicação",
  }
  return categories[category] || category
}

function generateStars(rating) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  let stars = ""

  for (let i = 0; i < fullStars; i++) {
    stars += "⭐"
  }

  if (hasHalfStar) {
    stars += "⭐"
  }

  return stars
}

function openSaasDetail(saasId) {
  window.location.href = `saas-detail.html?id=${saasId}`
}

// ===== EXPORT FUNCTIONS =====
function exportFavorites() {
  const favorites = getFavoritesSaasData()
  const exportData = {
    timestamp: new Date().toISOString(),
    count: favorites.length,
    favorites: favorites.map((saas) => ({
      id: saas.id,
      name: saas.name,
      category: saas.category,
      url: saas.url,
    })),
  }

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = `saashub-favorites-${new Date().toISOString().split("T")[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  URL.revokeObjectURL(url)

  if (window.SaaSHub && window.SaaSHub.showNotification) {
    window.SaaSHub.showNotification("Favoritos exportados com sucesso!", "success")
  }
}

function importFavorites(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)

        if (data.favorites && Array.isArray(data.favorites)) {
          const importedIds = data.favorites.map((fav) => fav.id)

          // Add imported favorites
          importedIds.forEach((id) => {
            FavoritesState.favorites.add(id)
          })

          saveFavoritesToStorage()
          updateAllFavoriteButtons()
          notifyCallbacks("import")

          if (window.SaaSHub && window.SaaSHub.showNotification) {
            window.SaaSHub.showNotification(`${importedIds.length} favoritos importados!`, "success")
          }

          resolve(importedIds.length)
        } else {
          reject(new Error("Formato de arquivo inválido"))
        }
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(new Error("Erro ao ler arquivo"))
    reader.readAsText(file)
  })
}

// ===== INITIALIZATION ON LOAD =====
document.addEventListener("DOMContentLoaded", () => {
  initializeFavorites()

  // Update UI after initialization
  setTimeout(() => {
    updateAllFavoriteButtons()
    updateFavoritesCounter()
  }, 100)
})

// ===== GLOBAL EXPORT =====
window.FavoritesSystem = {
  // Core functions
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  isFavorite,
  getFavorites,
  getFavoritesCount,
  clearAllFavorites,

  // UI functions
  updateFavoriteButton,
  updateAllFavoriteButtons,
  renderFavoritesGrid,

  // Data functions
  getFavoritesSaasData,
  exportFavorites,
  importFavorites,

  // Event system
  onFavoritesChange,
  offFavoritesChange,

  // State
  get state() {
    return {
      favorites: getFavorites(),
      count: getFavoritesCount(),
      isInitialized: FavoritesState.isInitialized,
    }
  },
}

console.log("❤️ Favorites System Module Loaded")
