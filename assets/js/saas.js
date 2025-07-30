// SaaS page JavaScript
let currentSaas = null
let currentRating = 0
const SaaSFY = {} // Declare the SaaSFY variable here

document.addEventListener("DOMContentLoaded", () => {
  initializeSaasPage()
})

function initializeSaasPage() {
  // Get SaaS ID from URL
  const urlParams = new URLSearchParams(window.location.search)
  const saasId = urlParams.get("id")

  if (!saasId) {
    window.location.href = "index.html"
    return
  }

  // Load SaaS data
  loadSaasData(saasId)

  // Initialize rating system
  initializeRating()
}

function loadSaasData(saasId) {
  currentSaas = SaaSFY.getSaasById(saasId)

  if (!currentSaas) {
    showErrorState("SaaS não encontrado")
    return
  }

  // Update page title
  document.title = `${currentSaas.name} - SaaSFY`

  // Update SaaS info
  updateSaasInfo()

  // Check access and load SaaS
  checkAccessAndLoad()

  // Update view count
  incrementViewCount()
}

function updateSaasInfo() {
  const saasIcon = document.getElementById("saasIcon")
  const saasTitle = document.getElementById("saasTitle")
  const saasDescription = document.getElementById("saasDescription")
  const favoriteBtn = document.getElementById("favoriteBtn")
  const ratingStars = document.getElementById("ratingStars")
  const ratingText = document.getElementById("ratingText")

  // Update basic info
  if (saasIcon) {
    saasIcon.innerHTML = `<i class="${currentSaas.icon || SaaSFY.getCategoryIcon(currentSaas.category)}"></i>`
  }

  if (saasTitle) {
    saasTitle.textContent = currentSaas.name
  }

  if (saasDescription) {
    saasDescription.textContent = currentSaas.description
  }

  // Update favorite button
  const currentUser = SaaSFY.getCurrentUser()
  if (currentUser && favoriteBtn) {
    const favorites = SaaSFY.getUserFavorites(currentUser.email)
    const isFavorite = favorites.includes(currentSaas.id)

    favoriteBtn.innerHTML = `<i class="fa${isFavorite ? "s" : "r"} fa-heart"></i>`
    favoriteBtn.classList.toggle("active", isFavorite)
  }

  // Update rating display
  if (ratingStars) {
    ratingStars.innerHTML = SaaSFY.generateStars(currentSaas.rating)
  }

  if (ratingText) {
    if (currentSaas.ratings.length > 0) {
      ratingText.textContent = `${SaaSFY.formatRating(currentSaas.rating)} (${currentSaas.ratings.length} avaliações)`
    } else {
      ratingText.textContent = "Seja o primeiro a avaliar"
    }
  }
}

function checkAccessAndLoad() {
  const currentUser = SaaSFY.getCurrentUser()
  const userPlan = currentUser ? SaaSFY.getUserPlan(currentUser.email) : "free"
  const canAccess = SaaSFY.canAccessSaas(currentSaas, userPlan)

  if (!canAccess) {
    showPremiumRequired()
    return
  }

  loadSaasContent()
}

function loadSaasContent() {
  const loadingState = document.getElementById("loadingState")
  const saasFrame = document.getElementById("saasFrame")

  // Show loading
  loadingState.style.display = "block"

  // Configure iframe
  saasFrame.src = currentSaas.url
  saasFrame.style.display = "none"

  // Handle iframe load
  saasFrame.onload = () => {
    loadingState.style.display = "none"
    saasFrame.style.display = "block"
  }

  // Handle iframe error
  saasFrame.onerror = () => {
    showErrorState("Erro ao carregar o SaaS")
  }

  // Timeout for loading
  setTimeout(() => {
    if (loadingState.style.display !== "none") {
      loadingState.style.display = "none"
      saasFrame.style.display = "block"
    }
  }, 10000) // 10 second timeout
}

function showErrorState(message) {
  const loadingState = document.getElementById("loadingState")
  const errorState = document.getElementById("errorState")
  const saasFrame = document.getElementById("saasFrame")

  loadingState.style.display = "none"
  saasFrame.style.display = "none"
  errorState.style.display = "block"

  if (message) {
    const errorText = errorState.querySelector("p")
    if (errorText) {
      errorText.textContent = message
    }
  }
}

function showPremiumRequired() {
  const loadingState = document.getElementById("loadingState")
  const premiumRequired = document.getElementById("premiumRequired")
  const saasFrame = document.getElementById("saasFrame")

  loadingState.style.display = "none"
  saasFrame.style.display = "none"
  premiumRequired.style.display = "block"
}

function incrementViewCount() {
  const currentUser = SaaSFY.getCurrentUser()

  // Add to user's viewed list
  if (currentUser) {
    SaaSFY.addToViewed(currentUser.email, currentSaas.id)
  }

  // Increment SaaS view count
  const allSaas = SaaSFY.getAllSaas()
  const saasIndex = allSaas.findIndex((s) => s.id === currentSaas.id)

  if (saasIndex !== -1) {
    allSaas[saasIndex].views = (allSaas[saasIndex].views || 0) + 1
    SaaSFY.saveSaas(allSaas)
  }
}

function toggleFavorite() {
  const currentUser = SaaSFY.getCurrentUser()

  if (!currentUser) {
    SaaSFY.showNotification("Faça login para adicionar favoritos", "error")
    return
  }

  const favorites = SaaSFY.getUserFavorites(currentUser.email)
  const isFavorite = favorites.includes(currentSaas.id)
  const favoriteBtn = document.getElementById("favoriteBtn")

  if (isFavorite) {
    SaaSFY.removeFromFavorites(currentUser.email, currentSaas.id)
    SaaSFY.showNotification("Removido dos favoritos")

    favoriteBtn.innerHTML = '<i class="far fa-heart"></i>'
    favoriteBtn.classList.remove("active")
  } else {
    SaaSFY.addToFavorites(currentUser.email, currentSaas.id)
    SaaSFY.showNotification("Adicionado aos favoritos")

    favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>'
    favoriteBtn.classList.add("active")
  }
}

function initializeRating() {
  const ratingStars = document.querySelectorAll("#ratingStars i")

  ratingStars.forEach((star) => {
    star.addEventListener("click", () => {
      const currentUser = SaaSFY.getCurrentUser()

      if (!currentUser) {
        SaaSFY.showNotification("Faça login para avaliar", "error")
        return
      }

      openRatingModal()
    })
  })
}

function openRatingModal() {
  const modal = document.getElementById("ratingModal")
  const modalStars = document.querySelectorAll("#modalRatingStars i")

  // Reset modal
  currentRating = 0
  document.getElementById("ratingComment").value = ""

  // Initialize modal stars
  modalStars.forEach((star) => {
    star.className = "far fa-star"
    star.addEventListener("click", function () {
      const rating = Number.parseInt(this.dataset.rating)
      setModalRating(rating)
    })

    star.addEventListener("mouseenter", function () {
      const rating = Number.parseInt(this.dataset.rating)
      highlightModalStars(rating)
    })
  })

  // Reset stars on mouse leave
  const modalRatingStars = document.getElementById("modalRatingStars")
  modalRatingStars.addEventListener("mouseleave", () => {
    highlightModalStars(currentRating)
  })

  modal.classList.add("active")
}

function closeRatingModal() {
  const modal = document.getElementById("ratingModal")
  modal.classList.remove("active")
  currentRating = 0
}

function setModalRating(rating) {
  currentRating = rating
  highlightModalStars(rating)
}

function highlightModalStars(rating) {
  const modalStars = document.querySelectorAll("#modalRatingStars i")

  modalStars.forEach((star, index) => {
    if (index < rating) {
      star.className = "fas fa-star"
    } else {
      star.className = "far fa-star"
    }
  })
}

function submitRating() {
  if (currentRating === 0) {
    SaaSFY.showNotification("Selecione uma avaliação", "error")
    return
  }

  const currentUser = SaaSFY.getCurrentUser()
  const comment = document.getElementById("ratingComment").value

  // Add rating
  SaaSFY.addUserRating(currentUser.email, currentSaas.id, currentRating, comment)

  // Update current SaaS data
  currentSaas = SaaSFY.getSaasById(currentSaas.id)

  // Update UI
  updateSaasInfo()

  // Close modal
  closeRatingModal()

  // Show success message
  SaaSFY.showNotification("Avaliação enviada com sucesso!")
}

function reloadSaas() {
  loadSaasContent()
}

function goBack() {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    window.location.href = "index.html"
  }
}
