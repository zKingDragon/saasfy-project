// Home page JavaScript
document.addEventListener("DOMContentLoaded", () => {
  initializeHomePage()
})

const HomeState = {
  carousel: null,
  statsAnimated: false,
  popularSaas: [],
}

function initializeHomePage() {
  try {
    // Initialize home page components
    initializeCarousel()
    initializeStatsAnimation()
    loadPopularSaas()

    console.log("🏠 Home page initialized successfully")
  } catch (error) {
    console.error("❌ Failed to initialize home page:", error)
  }
}

function initializeCarousel() {
  // Check if Swiper is available
  const Swiper = window.Swiper // Declare Swiper variable
  if (typeof Swiper === "undefined") {
    console.warn("Swiper not loaded, carousel will not work")
    return
  }

  const carouselElement = document.getElementById("saasCarousel")
  if (!carouselElement) return

  // Initialize Swiper carousel
  HomeState.carousel = new Swiper(carouselElement, {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".carousel-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
    },
    on: {
      init: () => {
        console.log("🎠 Carousel initialized")
      },
      slideChange: () => {
        // Add analytics tracking here if needed
      },
    },
  })
}

function loadPopularSaas() {
  // Get popular SaaS from main app state
  if (window.SaaSHub && window.SaaSHub.AppState) {
    HomeState.popularSaas = window.SaaSHub.AppState.saasData
      .filter((saas) => saas.featured || saas.rating >= 4.5)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 8)
  } else {
    // Fallback data if main app state is not available
    HomeState.popularSaas = generateFallbackSaasData()
  }

  renderCarouselCards()
}

function generateFallbackSaasData() {
  return [
    {
      id: 1,
      name: "Notion AI",
      category: "productivity",
      description: "Workspace inteligente com IA integrada para produtividade máxima",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.8,
      reviews: 1250,
      price: "free",
      isPremium: false,
      tags: ["IA", "Produtividade", "Colaboração"],
      url: "https://notion.so",
      featured: true,
    },
    {
      id: 2,
      name: "Figma Pro",
      category: "design",
      description: "Design colaborativo de próxima geração com recursos avançados",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.9,
      reviews: 2100,
      price: "premium",
      isPremium: true,
      tags: ["Design", "Colaboração", "Prototipagem"],
      url: "https://figma.com",
      featured: true,
    },
    {
      id: 3,
      name: "VS Code AI",
      category: "development",
      description: "Editor de código com assistente IA para desenvolvimento",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.7,
      reviews: 3200,
      price: "free",
      isPremium: false,
      tags: ["Código", "IA", "Desenvolvimento"],
      url: "https://code.visualstudio.com",
      featured: true,
    },
    {
      id: 4,
      name: "HubSpot CRM",
      category: "marketing",
      description: "CRM completo com automação de marketing e vendas",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.6,
      reviews: 890,
      price: "free",
      isPremium: false,
      tags: ["CRM", "Marketing", "Vendas"],
      url: "https://hubspot.com",
      featured: false,
    },
    {
      id: 5,
      name: "Canva Pro",
      category: "design",
      description: "Design gráfico simplificado com templates premium",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.5,
      reviews: 1800,
      price: "premium",
      isPremium: true,
      tags: ["Design", "Templates", "Marketing"],
      url: "https://canva.com",
      featured: false,
    },
    {
      id: 6,
      name: "Slack AI",
      category: "productivity",
      description: "Comunicação empresarial com assistente IA integrado",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.4,
      reviews: 950,
      price: "premium",
      isPremium: true,
      tags: ["Comunicação", "IA", "Equipes"],
      url: "https://slack.com",
      featured: false,
    },
  ]
}

function renderCarouselCards() {
  const carouselWrapper = document.getElementById("carouselWrapper")
  if (!carouselWrapper) return

  carouselWrapper.innerHTML = HomeState.popularSaas.map((saas) => createCarouselCard(saas)).join("")

  // Update carousel after adding slides
  if (HomeState.carousel) {
    HomeState.carousel.update()
  }

  // Animate cards entrance
  const gsap = window.gsap // Declare gsap variable
  if (typeof gsap !== "undefined") {
    gsap.fromTo(".carousel-card", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 })
  }
}

function createCarouselCard(saas) {
  return `
    <div class="swiper-slide">
      <div class="carousel-card" onclick="openSaasDetail(${saas.id})">
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
            <button class="card-btn" onclick="event.stopPropagation(); toggleFavorite(${saas.id})">
              ❤️
            </button>
            <a href="${saas.url}" class="card-btn primary" target="_blank" onclick="event.stopPropagation()">
              Acessar
            </a>
          </div>
        </div>
        <div class="card-glow"></div>
      </div>
    </div>
  `
}

function initializeStatsAnimation() {
  const statsSection = document.getElementById("stats")
  if (!statsSection) return

  // Create intersection observer for stats animation
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !HomeState.statsAnimated) {
          animateStats()
          HomeState.statsAnimated = true
        }
      })
    },
    { threshold: 0.5 },
  )

  observer.observe(statsSection)
}

function animateStats() {
  const statNumbers = document.querySelectorAll(".stat-number")

  statNumbers.forEach((element) => {
    const target = Number.parseInt(element.dataset.target) || 0
    const isDecimal = element.dataset.target.includes(".")
    const finalValue = isDecimal ? Number.parseFloat(element.dataset.target) : target

    animateNumber(element, 0, finalValue, 2000, isDecimal)
  })
}

function animateNumber(element, start, end, duration, isDecimal = false) {
  const startTime = performance.now()
  const range = end - start

  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3)
    const current = start + range * easeOut

    if (isDecimal) {
      element.textContent = current.toFixed(1)
    } else if (end >= 1000) {
      element.textContent = Math.floor(current).toLocaleString()
    } else {
      element.textContent = Math.floor(current)
    }

    if (progress < 1) {
      requestAnimationFrame(updateNumber)
    } else {
      // Ensure final value is exact
      if (isDecimal) {
        element.textContent = end.toFixed(1)
      } else if (end >= 1000) {
        element.textContent = end.toLocaleString()
      } else {
        element.textContent = end
      }
    }
  }

  requestAnimationFrame(updateNumber)
}

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

// Update the toggleFavorite function to use the new favorites system
function toggleFavorite(saasId) {
  if (window.FavoritesSystem && window.FavoritesSystem.toggleFavorite) {
    window.FavoritesSystem.toggleFavorite(saasId)
  } else {
    console.log("Favorite toggled for SaaS:", saasId)
    if (window.SaaSHub && window.SaaSHub.showNotification) {
      window.SaaSHub.showNotification("Sistema de favoritos carregando...", "info")
    }
  }
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    const headerHeight = 80
    const targetPosition = section.offsetTop - headerHeight

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    })
  }
}

window.HomePageModule = {
  HomeState,
  scrollToSection,
  openSaasDetail,
  toggleFavorite,
}

console.log("🏠 Home Page Module Loaded")
