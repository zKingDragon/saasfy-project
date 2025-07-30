// SaaS Detail page JavaScript
let currentSaas = null
let currentRating = 0

document.addEventListener("DOMContentLoaded", () => {
  initializeSaasDetailPage()
})

function initializeSaasDetailPage() {
  // Get SaaS ID from URL
  const urlParams = new URLSearchParams(window.location.search)
  const saasId = urlParams.get("id")

  if (!saasId) {
    window.location.href = "catalog.html"
    return
  }

  // Load SaaS data
  loadSaasData(saasId)

  // Initialize rating system
  initializeRating()
}

function loadSaasData(saasId) {
  currentSaas = window.SaaSFY.getSaasById(saasId)

  if (!currentSaas) {
    window.SaaSFY.showNotification("SaaS não encontrado", "error")
    setTimeout(() => {
      window.location.href = "catalog.html"
    }, 2000)
    return
  }

  // Update page title
  document.title = `${currentSaas.name} - SaaSFY`

  // Update breadcrumb
  updateBreadcrumb()

  // Update SaaS info
  updateSaasInfo()

  // Load gallery
  loadGallery()

  // Load features
  loadFeatures()

  // Load related SaaS
  loadRelatedSaas()

  // Load reviews
  loadReviews()

  // Update view count
  incrementViewCount()
}

function updateBreadcrumb() {
  const breadcrumbSaasName = document.getElementById("breadcrumbSaasName")
  if (breadcrumbSaasName) {
    breadcrumbSaasName.textContent = currentSaas.name
  }
}

function updateSaasInfo() {
  // Update logo
  const saasLogoImg = document.getElementById("saasLogoImg")
  if (saasLogoImg) {
    saasLogoImg.src = currentSaas.logo
    saasLogoImg.alt = `${currentSaas.name} Logo`
  }

  // Update title
  const saasTitle = document.getElementById("saasTitle")
  if (saasTitle) {
    saasTitle.textContent = currentSaas.name
  }

  // Update category
  const saasCategory = document.getElementById("saasCategory")
  if (saasCategory) {
    saasCategory.textContent = window.SaaSFY.getCategoryName(currentSaas.category)
  }

  // Update rating
  const saasRating = document.getElementById("saasRating")
  const ratingText = document.getElementById("ratingText")
  if (saasRating) {
    saasRating.innerHTML = window.SaaSFY.generateStars(currentSaas.rating)
  }
  if (ratingText) {
    ratingText.textContent = `${window.SaaSFY.formatRating(currentSaas.rating)} (${currentSaas.ratings.length} avaliações)`
  }

  // Update short description
  const saasShortDescription = document.getElementById("saasShortDescription")
  if (saasShortDescription) {
    saasShortDescription.textContent = currentSaas.shortDescription
  }

  // Update description
  const saasDescription = document.getElementById("saasDescription")
  if (saasDescription) {
    saasDescription.innerHTML = `<p>${currentSaas.description}</p>`
  }

  // Update favorite button
  updateFavoriteButton()

  // Update access button
  updateAccessButton()

  // Update sidebar info
  updateSidebarInfo()

  // Update pricing
  updatePricing()
}

function updateFavoriteButton() {
  const currentUser = window.SaaSFY.getCurrentUser()
  const favoriteBtn = document.getElementById("favoriteBtn")

  if (!favoriteBtn) return

  if (!currentUser) {
    favoriteBtn.style.display = "none"
    return
  }

  const favorites = window.SaaSFY.getUserFavorites(currentUser.email)
  const isFavorite = favorites.includes(currentSaas.id)

  const icon = favoriteBtn.querySelector("i")
  const span = favoriteBtn.querySelector("span")

  if (isFavorite) {
    favoriteBtn.classList.remove("btn-outline")
    favoriteBtn.classList.add("btn-primary")
    icon.className = "fas fa-heart"
    span.textContent = "Favoritado"
  } else {
    favoriteBtn.classList.remove("btn-primary")
    favoriteBtn.classList.add("btn-outline")
    icon.className = "far fa-heart"
    span.textContent = "Favoritar"
  }
}

function updateAccessButton() {
  const currentUser = window.SaaSFY.getCurrentUser()
  const userPlan = currentUser ? window.SaaSFY.getUserPlan(currentUser.email) : "free"
  const canAccess = window.SaaSFY.canAccessSaas(currentSaas, userPlan)
  const accessBtn = document.getElementById("accessBtn")

  if (!accessBtn) return

  const icon = accessBtn.querySelector("i")
  const span = accessBtn.querySelector("span")

  if (canAccess) {
    accessBtn.classList.remove("btn-outline")
    accessBtn.classList.add("btn-primary")
    icon.className = "fas fa-external-link-alt"
    span.textContent = "Acessar SaaS"
    accessBtn.onclick = () => accessSaas()
  } else {
    accessBtn.classList.remove("btn-primary")
    accessBtn.classList.add("btn-outline")
    icon.className = "fas fa-crown"
    span.textContent = "Upgrade Necessário"
    accessBtn.onclick = () => openPremiumModal()
  }
}

function updateSidebarInfo() {
  const sidebarCategory = document.getElementById("sidebarCategory")
  const sidebarPlan = document.getElementById("sidebarPlan")
  const sidebarRating = document.getElementById("sidebarRating")
  const sidebarViews = document.getElementById("sidebarViews")

  if (sidebarCategory) {
    sidebarCategory.textContent = window.SaaSFY.getCategoryName(currentSaas.category)
  }

  if (sidebarPlan) {
    sidebarPlan.innerHTML =
      currentSaas.plan === "pro" ? '<i class="fas fa-crown"></i> Premium' : '<i class="fas fa-gift"></i> Grátis'
  }

  if (sidebarRating) {
    sidebarRating.textContent = `${window.SaaSFY.formatRating(currentSaas.rating)} ⭐`
  }

  if (sidebarViews) {
    sidebarViews.textContent = currentSaas.views || 0
  }
}

function updatePricing() {
  const priceTag = document.getElementById("priceTag")
  const pricingDescription = document.getElementById("pricingDescription")

  if (priceTag) {
    if (currentSaas.plan === "pro") {
      priceTag.innerHTML = '<span class="price">Premium</span>'
    } else {
      priceTag.innerHTML = '<span class="price">Grátis</span>'
    }
  }

  if (pricingDescription) {
    if (currentSaas.plan === "pro") {
      pricingDescription.innerHTML = "<p>Requer plano Premium para acesso completo</p>"
    } else {
      pricingDescription.innerHTML = "<p>Acesso gratuito com recursos básicos</p>"
    }
  }
}

function loadGallery() {
  const mainImage = document.getElementById("mainImage")
  const galleryThumbnails = document.getElementById("galleryThumbnails")

  if (!currentSaas.images || currentSaas.images.length === 0) return

  // Set main image
  if (mainImage) {
    mainImage.src = currentSaas.images[0]
    mainImage.alt = `${currentSaas.name} Screenshot`
  }

  // Set thumbnails
  if (galleryThumbnails) {
    galleryThumbnails.innerHTML = currentSaas.images
      .map(
        (image, index) => `
        <img src="${image}" 
             alt="Screenshot ${index + 1}" 
             class="thumbnail ${index === 0 ? "active" : ""}" 
             onclick="changeMainImage(this, '${image}')">
      `,
      )
      .join("")
  }
}

function changeMainImage(thumbnail, imageSrc) {
  const mainImage = document.getElementById("mainImage")
  const thumbnails = document.querySelectorAll(".thumbnail")

  if (mainImage) {
    mainImage.src = imageSrc || thumbnail.src
  }

  // Update active thumbnail
  thumbnails.forEach((thumb) => thumb.classList.remove("active"))
  thumbnail.classList.add("active")
}

function loadFeatures() {
  const featuresGrid = document.getElementById("featuresGrid")

  if (!currentSaas.features || !featuresGrid) return

  featuresGrid.innerHTML = currentSaas.features
    .map(
      (feature) => `
      <div class="feature-item">
        <div class="feature-icon">
          <i class="${feature.icon}"></i>
        </div>
        <div class="feature-content">
          <h4>${feature.title}</h4>
          <p>${feature.description}</p>
        </div>
      </div>
    `,
    )
    .join("")
}

function loadRelatedSaas() {
  const relatedSaas = document.getElementById("relatedSaas")

  if (!relatedSaas) return

  const allSaas = window.SaaSFY.getAllSaas()
  const related = allSaas
    .filter((saas) => saas.category === currentSaas.category && saas.id !== currentSaas.id)
    .slice(0, 3)

  if (related.length === 0) {
    relatedSaas.innerHTML = '<p class="text-center">Nenhum SaaS relacionado encontrado.</p>'
    return
  }

  relatedSaas.innerHTML = related
    .map(
      (saas) => `
      <a href="saas-detail.html?id=${saas.id}" class="related-item">
        <div class="related-logo">
          <img src="${saas.logo}" alt="${saas.name} Logo" onerror="this.style.display='none'">
        </div>
        <div class="related-info">
          <h4>${saas.name}</h4>
          <p>${window.SaaSFY.formatRating(saas.rating)} ⭐</p>
        </div>
      </a>
    `,
    )
    .join("")
}

function loadReviews() {
  const reviewsContainer = document.getElementById("reviewsContainer")
  const noReviews = document.getElementById("noReviews")
  const addReviewBtn = document.getElementById("addReviewBtn")

  const currentUser = window.SaaSFY.getCurrentUser()

  // Show/hide add review button
  if (addReviewBtn) {
    if (currentUser) {
      addReviewBtn.style.display = "flex"
    } else {
      addReviewBtn.style.display = "none"
    }
  }

  if (!currentSaas.ratings || currentSaas.ratings.length === 0) {
    if (reviewsContainer) reviewsContainer.innerHTML = ""
    if (noReviews) noReviews.style.display = "block"
    return
  }

  if (noReviews) noReviews.style.display = "none"

  if (reviewsContainer) {
    reviewsContainer.innerHTML = currentSaas.ratings
      .map(
        (rating) => `
        <div class="review-item">
          <div class="review-header">
            <div class="review-user">
              <div class="user-avatar">
                ${rating.user.charAt(0).toUpperCase()}
              </div>
              <div class="user-info">
                <h4>${rating.user}</h4>
                <span>${window.SaaSFY.formatDate(rating.createdAt)}</span>
              </div>
            </div>
            <div class="review-rating">
              <div class="stars">
                ${window.SaaSFY.generateStars(rating.rating)}
              </div>
            </div>
          </div>
          ${rating.comment ? `<div class="review-content">${rating.comment}</div>` : ""}
        </div>
      `,
      )
      .join("")
  }
}

function incrementViewCount() {
  const currentUser = window.SaaSFY.getCurrentUser()

  // Add to user's viewed list
  if (currentUser) {
    window.SaaSFY.addToViewed(currentUser.email, currentSaas.id)
  }

  // Increment SaaS view count
  const allSaas = window.SaaSFY.getAllSaas()
  const saasIndex = allSaas.findIndex((s) => s.id === currentSaas.id)

  if (saasIndex !== -1) {
    allSaas[saasIndex].views = (allSaas[saasIndex].views || 0) + 1
    window.SaaSFY.saveSaas(allSaas)
    currentSaas.views = allSaas[saasIndex].views
  }
}

function toggleFavorite() {
  const currentUser = window.SaaSFY.getCurrentUser()

  if (!currentUser) {
    window.SaaSFY.showNotification("Faça login para adicionar favoritos", "error")
    return
  }

  const favorites = window.SaaSFY.getUserFavorites(currentUser.email)
  const isFavorite = favorites.includes(currentSaas.id)

  if (isFavorite) {
    window.SaaSFY.removeFromFavorites(currentUser.email, currentSaas.id)
    window.SaaSFY.showNotification("Removido dos favoritos")
  } else {
    window.SaaSFY.addToFavorites(currentUser.email, currentSaas.id)
    window.SaaSFY.showNotification("Adicionado aos favoritos")
  }

  // Update button
  updateFavoriteButton()
}

function accessSaas() {
  // Open SaaS in new tab
  window.open(currentSaas.url, "_blank")

  window.SaaSFY.showNotification(`Abrindo ${currentSaas.name}...`)
}

function openPremiumModal() {
  const modal = document.getElementById("premiumModal")
  if (modal) {
    modal.classList.add("active")
  }
}

function closePremiumModal() {
  const modal = document.getElementById("premiumModal")
  if (modal) {
    modal.classList.remove("active")
  }
}

function upgradeToPremium() {
  const currentUser = window.SaaSFY.getCurrentUser()

  if (!currentUser) {
    window.SaaSFY.showNotification("Faça login para fazer upgrade", "error")
    return
  }

  // Simulate upgrade process
  window.SaaSFY.setUserPlan(currentUser.email, "pro")

  // Close modal
  closePremiumModal()

  // Update access button
  updateAccessButton()

  // Show success message
  window.SaaSFY.showNotification("Parabéns! Você agora tem acesso Premium!")
}

// Rating system
function initializeRating() {
  const ratingStars = document.querySelectorAll("#saasRating i")

  ratingStars.forEach((star) => {
    star.addEventListener("click", () => {
      const currentUser = window.SaaSFY.getCurrentUser()

      if (!currentUser) {
        window.SaaSFY.showNotification("Faça login para avaliar", "error")
        return
      }

      openReviewModal()
    })
  })
}

function openReviewModal() {
  const modal = document.getElementById("reviewModal")
  const modalStars = document.querySelectorAll("#modalRatingStars i")

  // Reset modal
  currentRating = 0
  document.getElementById("reviewComment").value = ""

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

function closeReviewModal() {
  const modal = document.getElementById("reviewModal")
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

function submitReview() {
  if (currentRating === 0) {
    window.SaaSFY.showNotification("Selecione uma avaliação", "error")
    return
  }

  const currentUser = window.SaaSFY.getCurrentUser()
  const comment = document.getElementById("reviewComment").value

  // Add rating
  window.SaaSFY.addUserRating(currentUser.email, currentSaas.id, currentRating, comment)

  // Update current SaaS data
  currentSaas = window.SaaSFY.getSaasById(currentSaas.id)

  // Update UI
  updateSaasInfo()
  loadReviews()

  // Close modal
  closeReviewModal()

  // Show success message
  window.SaaSFY.showNotification("Avaliação enviada com sucesso!")
}

// Share functions
function shareOnTwitter() {
  const text = `Confira este SaaS incrível: ${currentSaas.name} - ${currentSaas.shortDescription}`
  const url = window.location.href
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  window.open(twitterUrl, "_blank")
}

function shareOnLinkedIn() {
  const url = window.location.href
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  window.open(linkedinUrl, "_blank")
}

function copyLink() {
  navigator.clipboard
    .writeText(window.location.href)
    .then(() => {
      window.SaaSFY.showNotification("Link copiado para a área de transferência!")
    })
    .catch(() => {
      window.SaaSFY.showNotification("Erro ao copiar link", "error")
    })
}
