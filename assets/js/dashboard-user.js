// User Dashboard JavaScript
const SaaSFY = {} // Declare the SaaSFY variable here

document.addEventListener("DOMContentLoaded", () => {
  initializeUserDashboard()
})

function initializeUserDashboard() {
  // Check if user is logged in
  const currentUser = SaaSFY.getCurrentUser()
  if (!currentUser || currentUser.type !== "user") {
    window.location.href = "login.html"
    return
  }

  // Update user info
  updateUserInfo()

  // Load dashboard data
  loadDashboardStats()

  // Initialize tabs
  initializeTabs()

  // Load initial tab content
  loadTabContent("favorites")
}

function updateUserInfo() {
  const currentUser = SaaSFY.getCurrentUser()
  const userName = document.getElementById("userName")
  const planBadge = document.getElementById("planBadge")

  if (userName) {
    userName.textContent = currentUser.name
  }

  if (planBadge) {
    const userPlan = SaaSFY.getUserPlan(currentUser.email)
    const planText = userPlan === "pro" ? "Plano Pro" : "Plano Grátis"
    const planIcon = userPlan === "pro" ? "fas fa-crown" : "fas fa-user"

    planBadge.innerHTML = `<i class="${planIcon}"></i> <span>${planText}</span>`

    if (userPlan === "pro") {
      planBadge.style.background = "var(--accent-color)"
    }
  }
}

function loadDashboardStats() {
  const currentUser = SaaSFY.getCurrentUser()
  const favorites = SaaSFY.getUserFavorites(currentUser.email)
  const viewed = SaaSFY.getUserViewed(currentUser.email)
  const ratings = SaaSFY.getUserRatings(currentUser.email)

  // Update stats
  const favoritesCount = document.getElementById("favoritesCount")
  const viewedCount = document.getElementById("viewedCount")
  const ratingsCount = document.getElementById("ratingsCount")

  if (favoritesCount) favoritesCount.textContent = favorites.length
  if (viewedCount) viewedCount.textContent = viewed.length
  if (ratingsCount) ratingsCount.textContent = ratings.length
}

function initializeTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabName = this.dataset.tab

      // Update active tab
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      this.classList.add("active")

      // Show corresponding content
      const tabContents = document.querySelectorAll(".tab-content")
      tabContents.forEach((content) => content.classList.remove("active"))

      const activeContent = document.getElementById(tabName)
      if (activeContent) {
        activeContent.classList.add("active")
        loadTabContent(tabName)
      }
    })
  })
}

function loadTabContent(tabName) {
  switch (tabName) {
    case "favorites":
      loadFavorites()
      break
    case "recent":
      loadRecent()
      break
    case "all":
      loadAllSaas()
      break
    case "upgrade":
      // Upgrade tab is static, no loading needed
      break
  }
}

function loadFavorites() {
  const currentUser = SaaSFY.getCurrentUser()
  const favorites = SaaSFY.getUserFavorites(currentUser.email)
  const allSaas = SaaSFY.getAllSaas()
  const userPlan = SaaSFY.getUserPlan(currentUser.email)

  const favoritesGrid = document.getElementById("favoritesGrid")
  const emptyFavorites = document.getElementById("emptyFavorites")

  if (favorites.length === 0) {
    favoritesGrid.innerHTML = ""
    emptyFavorites.style.display = "block"
    return
  }

  const favoriteSaas = allSaas.filter((saas) => favorites.includes(saas.id))

  favoritesGrid.innerHTML = favoriteSaas
    .map((saas) => {
      const canAccess = SaaSFY.canAccessSaas(saas, userPlan)

      return `
            <div class="saas-card">
                ${saas.plan === "pro" ? '<div class="premium-badge"><i class="fas fa-crown"></i> Pro</div>' : ""}
                <div class="saas-card-header">
                    <div class="saas-icon">
                        <i class="${saas.icon || SaaSFY.getCategoryIcon(saas.category)}"></i>
                    </div>
                    <div>
                        <h3 class="saas-title">${saas.name}</h3>
                        <span class="saas-category">${SaaSFY.getCategoryName(saas.category)}</span>
                    </div>
                </div>
                <p class="saas-description">${saas.description}</p>
                <div class="saas-footer">
                    <div class="saas-rating">
                        <div class="stars">
                            ${SaaSFY.generateStars(saas.rating)}
                        </div>
                        <span>${SaaSFY.formatRating(saas.rating)} (${saas.ratings.length})</span>
                    </div>
                    <div class="saas-actions">
                        <button class="action-btn active" 
                                onclick="toggleFavoriteInDashboard(${saas.id})" 
                                title="Remover dos favoritos">
                            <i class="fas fa-heart"></i>
                        </button>
                        <a href="saas.html?id=${saas.id}" class="btn btn-primary">
                            ${canAccess ? "Acessar" : "Ver Detalhes"}
                        </a>
                    </div>
                </div>
            </div>
        `
    })
    .join("")

  emptyFavorites.style.display = "none"
}

function loadRecent() {
  const currentUser = SaaSFY.getCurrentUser()
  const viewed = SaaSFY.getUserViewed(currentUser.email)
  const allSaas = SaaSFY.getAllSaas()
  const userPlan = SaaSFY.getUserPlan(currentUser.email)
  const favorites = SaaSFY.getUserFavorites(currentUser.email)

  const recentGrid = document.getElementById("recentGrid")
  const emptyRecent = document.getElementById("emptyRecent")

  if (viewed.length === 0) {
    recentGrid.innerHTML = ""
    emptyRecent.style.display = "block"
    return
  }

  const recentSaas = viewed
    .map((item) => {
      const saas = allSaas.find((s) => s.id === item.id)
      return saas ? { ...saas, viewedAt: item.viewedAt } : null
    })
    .filter(Boolean)

  recentGrid.innerHTML = recentSaas
    .map((saas) => {
      const canAccess = SaaSFY.canAccessSaas(saas, userPlan)
      const isFavorite = favorites.includes(saas.id)

      return `
            <div class="saas-card">
                ${saas.plan === "pro" ? '<div class="premium-badge"><i class="fas fa-crown"></i> Pro</div>' : ""}
                <div class="saas-card-header">
                    <div class="saas-icon">
                        <i class="${saas.icon || SaaSFY.getCategoryIcon(saas.category)}"></i>
                    </div>
                    <div>
                        <h3 class="saas-title">${saas.name}</h3>
                        <span class="saas-category">${SaaSFY.getCategoryName(saas.category)}</span>
                        <div style="font-size: 0.75rem; color: var(--text-light); margin-top: 0.25rem;">
                            Visto em ${SaaSFY.formatDate(saas.viewedAt)}
                        </div>
                    </div>
                </div>
                <p class="saas-description">${saas.description}</p>
                <div class="saas-footer">
                    <div class="saas-rating">
                        <div class="stars">
                            ${SaaSFY.generateStars(saas.rating)}
                        </div>
                        <span>${SaaSFY.formatRating(saas.rating)} (${saas.ratings.length})</span>
                    </div>
                    <div class="saas-actions">
                        <button class="action-btn ${isFavorite ? "active" : ""}" 
                                onclick="toggleFavoriteInDashboard(${saas.id})" 
                                title="${isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}">
                            <i class="fa${isFavorite ? "s" : "r"} fa-heart"></i>
                        </button>
                        <a href="saas.html?id=${saas.id}" class="btn btn-primary">
                            ${canAccess ? "Acessar" : "Ver Detalhes"}
                        </a>
                    </div>
                </div>
            </div>
        `
    })
    .join("")

  emptyRecent.style.display = "none"
}

function loadAllSaas() {
  const allSaas = SaaSFY.getAllSaas()
  const currentUser = SaaSFY.getCurrentUser()
  const userPlan = SaaSFY.getUserPlan(currentUser.email)
  const favorites = SaaSFY.getUserFavorites(currentUser.email)
  const searchInput = document.getElementById("dashboardSearch")

  // Initialize search
  if (searchInput) {
    searchInput.addEventListener(
      "input",
      debounce(() => {
        const searchTerm = searchInput.value
        const filteredSaas = SaaSFY.filterSaas(allSaas, searchTerm, "all")
        renderAllSaasGrid(filteredSaas, userPlan, favorites)
      }, 300),
    )
  }

  renderAllSaasGrid(allSaas, userPlan, favorites)
}

function renderAllSaasGrid(saasArray, userPlan, favorites) {
  const allSaasGrid = document.getElementById("allSaasGrid")

  allSaasGrid.innerHTML = saasArray
    .map((saas) => {
      const canAccess = SaaSFY.canAccessSaas(saas, userPlan)
      const isFavorite = favorites.includes(saas.id)

      return `
            <div class="saas-card">
                ${saas.plan === "pro" ? '<div class="premium-badge"><i class="fas fa-crown"></i> Pro</div>' : ""}
                <div class="saas-card-header">
                    <div class="saas-icon">
                        <i class="${saas.icon || SaaSFY.getCategoryIcon(saas.category)}"></i>
                    </div>
                    <div>
                        <h3 class="saas-title">${saas.name}</h3>
                        <span class="saas-category">${SaaSFY.getCategoryName(saas.category)}</span>
                    </div>
                </div>
                <p class="saas-description">${saas.description}</p>
                <div class="saas-footer">
                    <div class="saas-rating">
                        <div class="stars">
                            ${SaaSFY.generateStars(saas.rating)}
                        </div>
                        <span>${SaaSFY.formatRating(saas.rating)} (${saas.ratings.length})</span>
                    </div>
                    <div class="saas-actions">
                        <button class="action-btn ${isFavorite ? "active" : ""}" 
                                onclick="toggleFavoriteInDashboard(${saas.id})" 
                                title="${isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}">
                            <i class="fa${isFavorite ? "s" : "r"} fa-heart"></i>
                        </button>
                        <a href="saas.html?id=${saas.id}" class="btn btn-primary">
                            ${canAccess ? "Acessar" : "Ver Detalhes"}
                        </a>
                    </div>
                </div>
            </div>
        `
    })
    .join("")
}

function toggleFavoriteInDashboard(saasId) {
  const currentUser = SaaSFY.getCurrentUser()
  const favorites = SaaSFY.getUserFavorites(currentUser.email)
  const isFavorite = favorites.includes(saasId)

  if (isFavorite) {
    SaaSFY.removeFromFavorites(currentUser.email, saasId)
    SaaSFY.showNotification("Removido dos favoritos")
  } else {
    SaaSFY.addToFavorites(currentUser.email, saasId)
    SaaSFY.showNotification("Adicionado aos favoritos")
  }

  // Update stats
  loadDashboardStats()

  // Reload current tab
  const activeTab = document.querySelector(".tab-btn.active")
  if (activeTab) {
    loadTabContent(activeTab.dataset.tab)
  }
}

function upgradeToPro() {
  const currentUser = SaaSFY.getCurrentUser()

  // Simulate upgrade process
  SaaSFY.setUserPlan(currentUser.email, "pro")

  // Update UI
  updateUserInfo()

  // Show success message
  SaaSFY.showNotification("Parabéns! Você agora tem acesso ao Plano Pro!")

  // Reload current tab to show new access
  const activeTab = document.querySelector(".tab-btn.active")
  if (activeTab) {
    loadTabContent(activeTab.dataset.tab)
  }
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
