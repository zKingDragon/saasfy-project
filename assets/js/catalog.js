// Catalog page JavaScript
let currentView = "grid"
let currentFilters = {
  search: "",
  category: "all",
  plan: "all",
  sort: "name",
}

document.addEventListener("DOMContentLoaded", () => {
  initializeCatalogPage()
})

function initializeCatalogPage() {
  // Check URL parameters for initial filters
  const urlParams = new URLSearchParams(window.location.search)
  const category = urlParams.get("category")

  if (category) {
    currentFilters.category = category
    const categoryFilter = document.getElementById("categoryFilter")
    if (categoryFilter) {
      categoryFilter.value = category
    }
  }

  // Initialize filters
  initializeFilters()

  // Initialize view toggle
  initializeViewToggle()

  // Load initial results
  loadSaasResults()
}

function initializeFilters() {
  const searchInput = document.getElementById("searchInput")
  const categoryFilter = document.getElementById("categoryFilter")
  const planFilter = document.getElementById("planFilter")
  const sortFilter = document.getElementById("sortFilter")

  // Search input
  if (searchInput) {
    searchInput.addEventListener(
      "input",
      debounce((e) => {
        currentFilters.search = e.target.value
        loadSaasResults()
      }, 300),
    )
  }

  // Category filter
  if (categoryFilter) {
    categoryFilter.addEventListener("change", (e) => {
      currentFilters.category = e.target.value
      loadSaasResults()
    })
  }

  // Plan filter
  if (planFilter) {
    planFilter.addEventListener("change", (e) => {
      currentFilters.plan = e.target.value
      loadSaasResults()
    })
  }

  // Sort filter
  if (sortFilter) {
    sortFilter.addEventListener("change", (e) => {
      currentFilters.sort = e.target.value
      loadSaasResults()
    })
  }
}

function initializeViewToggle() {
  const viewButtons = document.querySelectorAll(".view-btn")

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.view

      // Update active state
      viewButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Update current view
      currentView = view

      // Update grid class
      const saasGrid = document.getElementById("saasGrid")
      if (saasGrid) {
        if (view === "list") {
          saasGrid.classList.add("list-view")
        } else {
          saasGrid.classList.remove("list-view")
        }
      }
    })
  })
}

function loadSaasResults() {
  const saasGrid = document.getElementById("saasGrid")
  const noResults = document.getElementById("noResults")
  const resultsCount = document.getElementById("resultsCount")

  if (!saasGrid) return

  const allSaas = window.SaaSFY.getAllSaas()
  const filteredSaas = window.SaaSFY.filterSaas(
    allSaas,
    currentFilters.search,
    currentFilters.category,
    currentFilters.plan,
    currentFilters.sort,
  )

  // Update results count
  if (resultsCount) {
    resultsCount.textContent = filteredSaas.length
  }

  if (filteredSaas.length === 0) {
    saasGrid.innerHTML = ""
    if (noResults) noResults.style.display = "block"
    return
  }

  if (noResults) noResults.style.display = "none"

  const currentUser = window.SaaSFY.getCurrentUser()
  const userPlan = currentUser ? window.SaaSFY.getUserPlan(currentUser.email) : "free"

  saasGrid.innerHTML = filteredSaas
    .map((saas) => {
      const canAccess = window.SaaSFY.canAccessSaas(saas, userPlan)
      const isFavorite = currentUser ? window.SaaSFY.getUserFavorites(currentUser.email).includes(saas.id) : false

      return `
        <div class="saas-card ${currentView === "list" ? "list-view" : ""}" onclick="goToSaasDetail(${saas.id})">
          ${saas.plan === "pro" ? '<div class="premium-badge"><i class="fas fa-crown"></i> Premium</div>' : ""}
          <div class="saas-card-header">
            <div class="saas-logo">
              <img src="${saas.logo}" alt="${saas.name} Logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
              <div class="saas-icon" style="display: none;">
                <i class="${window.SaaSFY.getCategoryIcon(saas.category)}"></i>
              </div>
            </div>
            <div class="saas-info">
              <h3>${saas.name}</h3>
              <span class="category-badge">${window.SaaSFY.getCategoryName(saas.category)}</span>
            </div>
          </div>
          <p class="saas-description">${saas.shortDescription}</p>
          <div class="saas-footer">
            <div class="saas-rating">
              <div class="stars">
                ${window.SaaSFY.generateStars(saas.rating)}
              </div>
              <span>${window.SaaSFY.formatRating(saas.rating)} (${saas.ratings.length})</span>
            </div>
            <div class="saas-actions" onclick="event.stopPropagation()">
              ${
                currentUser
                  ? `
                  <button class="action-btn ${isFavorite ? "active" : ""}" 
                          onclick="toggleFavorite(${saas.id})" 
                          title="${isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}">
                      <i class="fa${isFavorite ? "s" : "r"} fa-heart"></i>
                  </button>
              `
                  : ""
              }
              <button class="btn btn-primary" onclick="goToSaasDetail(${saas.id})">
                ${canAccess ? "Acessar" : "Ver Detalhes"}
              </button>
            </div>
          </div>
        </div>
      `
    })
    .join("")
}

function goToSaasDetail(saasId) {
  window.location.href = `saas-detail.html?id=${saasId}`
}

function toggleFavorite(saasId) {
  const currentUser = window.SaaSFY.getCurrentUser()

  if (!currentUser) {
    window.SaaSFY.showNotification("Faça login para adicionar favoritos", "error")
    return
  }

  const favorites = window.SaaSFY.getUserFavorites(currentUser.email)
  const isFavorite = favorites.includes(saasId)

  if (isFavorite) {
    window.SaaSFY.removeFromFavorites(currentUser.email, saasId)
    window.SaaSFY.showNotification("Removido dos favoritos")
  } else {
    window.SaaSFY.addToFavorites(currentUser.email, saasId)
    window.SaaSFY.showNotification("Adicionado aos favoritos")
  }

  // Reload results to update UI
  loadSaasResults()
}

function clearFilters() {
  // Reset filters
  currentFilters = {
    search: "",
    category: "all",
    plan: "all",
    sort: "name",
  }

  // Reset form elements
  const searchInput = document.getElementById("searchInput")
  const categoryFilter = document.getElementById("categoryFilter")
  const planFilter = document.getElementById("planFilter")
  const sortFilter = document.getElementById("sortFilter")

  if (searchInput) searchInput.value = ""
  if (categoryFilter) categoryFilter.value = "all"
  if (planFilter) planFilter.value = "all"
  if (sortFilter) sortFilter.value = "name"

  // Reload results
  loadSaasResults()
}

// Utility function for debouncing search
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
