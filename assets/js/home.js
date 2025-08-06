// Home page JavaScript
document.addEventListener("DOMContentLoaded", () => {
  initializeHomePage()
})

function initializeHomePage() {
  loadPopularSaas()
}

function loadPopularSaas() {
  const popularSaasGrid = document.getElementById("popularSaasGrid")

  if (!popularSaasGrid) return

  const popularSaas = window.SaaSFY.getPopularSaas(6)
  const currentUser = window.SaaSFY.getCurrentUser()
  const userPlan = currentUser ? window.SaaSFY.getUserPlan(currentUser.email) : "free"

  if (popularSaas.length === 0) {
    popularSaasGrid.innerHTML = `
      <div class="no-results">
        <i class="fas fa-cube fa-3x"></i>
        <h3>Nenhum SaaS disponível</h3>
        <p>Em breve teremos novos SaaS para você explorar!</p>
      </div>
    `
    return
  }

  popularSaasGrid.innerHTML = popularSaas
    .map((saas) => {
      const canAccess = window.SaaSFY.canAccessSaas(saas, userPlan)
      const isFavorite = currentUser ? window.SaaSFY.getUserFavorites(currentUser.email).includes(saas.id) : false

      return `
        <div class="saas-card" onclick="goToSaasDetail(${saas.id})">
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
              <span class="saas-category">${window.SaaSFY.getCategoryName(saas.category)}</span>
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

  // Update UI
  const button = document.querySelector(`[onclick="toggleFavorite(${saasId})"]`)
  if (button) {
    const icon = button.querySelector("i")
    if (isFavorite) {
      button.classList.remove("active")
      icon.className = "far fa-heart"
      button.title = "Adicionar aos favoritos"
    } else {
      button.classList.add("active")
      icon.className = "fas fa-heart"
      button.title = "Remover dos favoritos"
    }
  }
}
