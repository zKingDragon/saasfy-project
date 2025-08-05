/**
 * SaaSHub - Favorites Page JavaScript
 * Handles favorites page specific functionality
 */

// ===== PAGE STATE =====
const FavoritesPageState = {
  currentView: "grid",
  currentSort: "name",
  isLoading: false,
  favoritesSaas: [],
}

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", initializeFavoritesPage)

function initializeFavoritesPage() {
  try {
    // Wait for favorites system to initialize
    setTimeout(() => {
      loadFavoritesData()
      initializeViewToggle()
      initializeSorting()
      initializeImportExport()
      setupFavoritesListener()

      console.log("❤️ Favorites page initialized")
    }, 200)
  } catch (error) {
    console.error("❌ Failed to initialize favorites page:", error)
  }
}

// ===== DATA LOADING =====
function loadFavoritesData() {
  showLoading()

  // Get favorites data
  if (window.FavoritesSystem) {
    FavoritesPageState.favoritesSaas = window.FavoritesSystem.getFavoritesSaasData()
  }

  // Update stats
  updateFavoritesStats()

  // Render favorites
  renderFavorites()

  hideLoading()
}

function updateFavoritesStats() {
  const favoritesCount = document.getElementById("favoritesCount")
  const categoriesCount = document.getElementById("categoriesCount")

  const count = FavoritesPageState.favoritesSaas.length
  const categories = new Set(FavoritesPageState.favoritesSaas.map((saas) => saas.category)).size

  if (favoritesCount) {
    animateNumber(favoritesCount, 0, count, 1000)
  }

  if (categoriesCount) {
    animateNumber(categoriesCount, 0, categories, 1000)
  }
}

function animateNumber(element, start, end, duration) {
  const startTime = performance.now()
  const range = end - start

  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3)
    const current = start + range * easeOut

    element.textContent = Math.floor(current)

    if (progress < 1) {
      requestAnimationFrame(updateNumber)
    } else {
      element.textContent = end
    }
  }

  requestAnimationFrame(updateNumber)
}

// ===== VIEW TOGGLE =====
function initializeViewToggle() {
  const viewButtons = document.querySelectorAll(".view-btn")

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.view

      // Update active state
      viewButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Update current view
      FavoritesPageState.currentView = view

      // Update grid class
      const favoritesGrid = document.getElementById("favoritesGrid")
      if (favoritesGrid) {
        if (view === "list") {
          favoritesGrid.classList.add("list-view")
        } else {
          favoritesGrid.classList.remove("list-view")
        }
      }
    })
  })
}

// ===== SORTING =====
function initializeSorting() {
  const sortSelect = document.getElementById("sortFavorites")

  if (sortSelect) {
    sortSelect.addEventListener("change", (event) => {
      FavoritesPageState.currentSort = event.target.value
      sortAndRenderFavorites()
    })
  }
}

function sortAndRenderFavorites() {
  const sorted = [...FavoritesPageState.favoritesSaas]

  switch (FavoritesPageState.currentSort) {
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name))
      break
    case "rating":
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      break
    case "category":
      sorted.sort((a, b) => a.category.localeCompare(b.category))
      break
    case "recent":
      // For now, sort by ID (assuming higher ID = more recent)
      sorted.sort((a, b) => b.id - a.id)
      break
    default:
      break
  }

  FavoritesPageState.favoritesSaas = sorted
  renderFavorites()
}

// ===== RENDERING =====
function renderFavorites() {
  const favoritesGrid = document.getElementById("favoritesGrid")
  if (!favoritesGrid) return

  if (FavoritesPageState.favoritesSaas.length === 0) {
    favoritesGrid.innerHTML = `
      <div class="empty-favorites">
        <div class="empty-icon">💔</div>
        <h3>Nenhum favorito ainda</h3>
        <p>Explore nosso catálogo e adicione seus SaaS favoritos!</p>
        <div class="empty-actions">
          <a href="catalog.html" class="btn btn-primary">
            <i class="fas fa-search"></i>
            Explorar Catálogo
          </a>
          <a href="index.html" class="btn btn-outline">
            <i class="fas fa-home"></i>
            Voltar ao Início
          </a>
        </div>
      </div>
    `
    return
  }

  favoritesGrid.innerHTML = FavoritesPageState.favoritesSaas.map((saas) => createFavoriteCard(saas)).join("")

  // Animate cards entrance
  const gsap = window.gsap // Declare gsap variable
  if (gsap) {
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
      <div class="card-glow"></div>
    </div>
  `
}

// ===== IMPORT/EXPORT =====
function initializeImportExport() {
  const importFile = document.getElementById("importFile")

  if (importFile) {
    importFile.addEventListener("change", handleFileImport)
  }
}

function handleFileImport(event) {
  const file = event.target.files[0]
  if (!file) return

  if (file.type !== "application/json") {
    if (window.SaaSHub && window.SaaSHub.showNotification) {
      window.SaaSHub.showNotification("Por favor, selecione um arquivo JSON válido", "error")
    }
    return
  }

  showLoading()

  if (window.FavoritesSystem && window.FavoritesSystem.importFavorites) {
    window.FavoritesSystem.importFavorites(file)
      .then((count) => {
        // Reload page data
        loadFavoritesData()

        if (window.SaaSHub && window.SaaSHub.showNotification) {
          window.SaaSHub.showNotification(`${count} favoritos importados com sucesso!`, "success")
        }
      })
      .catch((error) => {
        console.error("Import error:", error)
        if (window.SaaSHub && window.SaaSHub.showNotification) {
          window.SaaSHub.showNotification("Erro ao importar favoritos: " + error.message, "error")
        }
      })
      .finally(() => {
        hideLoading()
        // Clear file input
        event.target.value = ""
      })
  }
}

// ===== FAVORITES LISTENER =====
function setupFavoritesListener() {
  if (window.FavoritesSystem && window.FavoritesSystem.onFavoritesChange) {
    window.FavoritesSystem.onFavoritesChange((action, saasId) => {
      // Reload data when favorites change
      loadFavoritesData()
    })
  }
}

// ===== LOADING STATES =====
function showLoading() {
  FavoritesPageState.isLoading = true
  const loadingState = document.getElementById("loadingFavorites")
  const favoritesGrid = document.getElementById("favoritesGrid")

  if (loadingState) loadingState.classList.remove("hidden")
  if (favoritesGrid) favoritesGrid.style.opacity = "0.5"
}

function hideLoading() {
  FavoritesPageState.isLoading = false
  const loadingState = document.getElementById("loadingFavorites")
  const favoritesGrid = document.getElementById("favoritesGrid")

  if (loadingState) loadingState.classList.add("hidden")
  if (favoritesGrid) favoritesGrid.style.opacity = "1"
}

// ===== CONFIRMATION MODAL =====
function confirmClearFavorites() {
  const modal = document.getElementById("confirmModal")
  const message = document.getElementById("confirmMessage")
  const confirmButton = document.getElementById("confirmButton")

  if (modal && message && confirmButton) {
    message.textContent = "Tem certeza que deseja remover todos os favoritos? Esta ação não pode ser desfeita."

    confirmButton.onclick = () => {
      clearAllFavorites()
      closeConfirmModal()
    }

    modal.classList.add("active")
  }
}

function closeConfirmModal() {
  const modal = document.getElementById("confirmModal")
  if (modal) {
    modal.classList.remove("active")
  }
}

function clearAllFavorites() {
  if (window.FavoritesSystem && window.FavoritesSystem.clearAllFavorites) {
    const count = window.FavoritesSystem.clearAllFavorites()

    // Reload page data
    loadFavoritesData()

    if (window.SaaSHub && window.SaaSHub.showNotification) {
      window.SaaSHub.showNotification(`${count} favoritos removidos`, "info")
    }
  }
}

// ===== EXPORT FUNCTION =====
function exportFavorites() {
  if (window.FavoritesSystem && window.FavoritesSystem.exportFavorites) {
    window.FavoritesSystem.exportFavorites()
  }
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

function toggleFavorite(saasId) {
  if (window.FavoritesSystem && window.FavoritesSystem.toggleFavorite) {
    window.FavoritesSystem.toggleFavorite(saasId)
  }
}

// Navigation functions
function navigateToLogin() {
  window.location.href = "login.html"
}

function navigateToRegister() {
  window.location.href = "login.html?mode=register"
}

function navigateToDashboard() {
  if (window.SaaSHub && window.SaaSHub.AppState && window.SaaSHub.AppState.currentUser) {
    const dashboardUrl =
      window.SaaSHub.AppState.currentUser.type === "developer" ? "dashboard-dev.html" : "dashboard-user.html"
    window.location.href = dashboardUrl
  }
}

function navigateToSubmit() {
  if (window.SaaSHub && window.SaaSHub.AppState && window.SaaSHub.AppState.currentUser) {
    window.location.href = "submit-saas.html"
  } else {
    if (window.SaaSHub && window.SaaSHub.showNotification) {
      window.SaaSHub.showNotification("Faça login para enviar um SaaS", "warning")
    }
    navigateToLogin()
  }
}

function logout() {
  if (window.SaaSHub && window.SaaSHub.logout) {
    window.SaaSHub.logout()
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

function toggleVoiceCommand() {
  if (window.SaaSHub && window.SaaSHub.toggleVoiceCommand) {
    window.SaaSHub.toggleVoiceCommand()
  }
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener("keydown", (event) => {
  // Ctrl/Cmd + E - Export favorites
  if ((event.ctrlKey || event.metaKey) && event.key === "e") {
    event.preventDefault()
    exportFavorites()
  }

  // Ctrl/Cmd + I - Import favorites
  if ((event.ctrlKey || event.metaKey) && event.key === "i") {
    event.preventDefault()
    document.getElementById("importFile")?.click()
  }

  // Delete - Clear all favorites (with confirmation)
  if (event.key === "Delete" && event.shiftKey) {
    event.preventDefault()
    confirmClearFavorites()
  }

  // Escape - Close modal
  if (event.key === "Escape") {
    closeConfirmModal()
  }
})

console.log("❤️ Favorites Page Module Loaded")
