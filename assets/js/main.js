/**
 * SaaSHub - Main JavaScript Module
 * Handles core functionality, navigation, and user interactions with Firebase
 */

// Import Firebase service
import { firebaseService } from './firebase-config.js'

// ===== GLOBAL STATE =====
const AppState = {
  currentUser: null,
  currentSection: "home",
  isLoading: true,
  saasData: [],
  filteredSaas: [],
  searchQuery: "",
  activeFilters: {
    category: "all",
    price: "all",
    rating: 0,
  },
  voiceEnabled: false,
  theme: "dark",
  unsubscribeFunctions: []
}

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", initializeApp)

async function initializeApp() {
  try {
    // Show loading screen
    showLoadingScreen()

    // Initialize core modules
    await Promise.all([
      initializeAuth(),
      initializeSaasData(),
      loadHeader(),
      initializeNavigation(),
      initializeVoiceCommands(),
      initializeTheme(),
      initializeAnimations(),
    ])

    // Hide loading screen after delay
    setTimeout(hideLoadingScreen, 2000)

    // Initialize page-specific functionality
    initializeHomePage()

    console.log("🚀 SaaSHub initialized successfully")
  } catch (error) {
    console.error("❌ Failed to initialize SaaSHub:", error)
    showNotification("Erro ao carregar a aplicação", "error")
  }
}

// ===== LOADING SCREEN =====
function showLoadingScreen() {
  const loadingScreen = document.getElementById("loadingScreen")
  if (loadingScreen) {
    loadingScreen.classList.remove("hidden")
    document.body.classList.add("loading")
  }
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById("loadingScreen")
  if (loadingScreen) {
    loadingScreen.classList.add("hidden")
    document.body.classList.remove("loading")

    // Trigger entrance animations
    setTimeout(() => {
      triggerEntranceAnimations()
    }, 300)
  }
}

// ===== HEADER LOADING =====
async function loadHeader() {
  try {
    // Determine the correct path to header.html based on current location
    const currentPath = window.location.pathname
    const isInHtmlFolder = currentPath.includes('/html/')
    const headerPath = isInHtmlFolder ? 'header.html' : 'html/header.html'
    
    const response = await fetch(headerPath)
    const headerHTML = await response.text()
    
    const headerContainer = document.getElementById('header')
    if (headerContainer) {
      headerContainer.innerHTML = headerHTML
    }
  } catch (error) {
    console.error('Erro ao carregar header:', error)
  }
}

// ===== AUTHENTICATION =====
async function initializeAuth() {
  // Set up Firebase auth listener
  const unsubscribe = firebaseService.onAuthStateChanged(async (user) => {
    if (user) {
      try {
        // Get user document from Firestore
        const userData = await firebaseService.getUserDocument(user.uid)
        if (userData) {
          AppState.currentUser = {
            uid: user.uid,
            email: user.email,
            name: userData.displayName || user.displayName,
            avatar: userData.avatar || user.photoURL,
            type: userData.type || 'user'
          }
        } else {
          // Create user document if it doesn't exist
          AppState.currentUser = await firebaseService.createUserDocument(user)
        }
        
        updateAuthUI()
        
        // Update last login
        await firebaseService.updateUserDocument(user.uid, { lastLogin: new Date() })
      } catch (error) {
        console.error("Error loading user data:", error)
        showNotification("Erro ao carregar dados do usuário", "error")
      }
    } else {
      AppState.currentUser = null
      updateAuthUI()
    }
  })
  
  AppState.unsubscribeFunctions.push(unsubscribe)
}

function updateAuthUI() {
  const authButtons = document.getElementById("authButtons")
  const userMenu = document.getElementById("userMenu")

  if (AppState.currentUser) {
    // Show user menu, hide auth buttons
    if (authButtons) authButtons.classList.add("hidden")
    if (userMenu) {
      userMenu.classList.remove("hidden")
      updateUserInfo()
    }
  } else {
    // Show auth buttons, hide user menu
    if (authButtons) authButtons.classList.remove("hidden")
    if (userMenu) userMenu.classList.add("hidden")
  }
}

function updateUserInfo() {
  const userName = document.getElementById("userName")
  const userEmail = document.getElementById("userEmail")
  const avatarImg = document.getElementById("avatarImg")

  if (AppState.currentUser) {
    if (userName) userName.textContent = AppState.currentUser.name
    if (userEmail) userEmail.textContent = AppState.currentUser.email
    if (avatarImg) {
      avatarImg.src = AppState.currentUser.avatar || "/placeholder.svg?height=40&width=40"
    }
  }
}

function logout() {
  firebaseService.logout().then((result) => {
    if (result.success) {
      AppState.currentUser = null
      updateAuthUI()
      showNotification("Logout realizado com sucesso", "success")
    } else {
      showNotification("Erro ao fazer logout", "error")
    }
  })
}

// ===== SAAS DATA MANAGEMENT =====
async function initializeSaasData() {
  try {
    // Load SaaS data from Firebase
    AppState.saasData = await firebaseService.getAllSaas()
    AppState.filteredSaas = [...AppState.saasData]
    
    // Set up real-time listener for SaaS updates
    const unsubscribe = firebaseService.subscribeSaasUpdates((saasList) => {
      AppState.saasData = saasList
      filterSaasData() // Re-apply current filters
    })
    
    AppState.unsubscribeFunctions.push(unsubscribe)
    
    console.log(`📦 Loaded ${AppState.saasData.length} SaaS from Firebase`)
  } catch (error) {
    console.error("Error loading SaaS data:", error)
    showNotification("Erro ao carregar dados dos SaaS", "error")
    
    // Fallback to sample data
    AppState.saasData = generateSampleSaasData()
    AppState.filteredSaas = [...AppState.saasData]
  }
}

function generateSampleSaasData() {
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
      id: 4,
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

// ===== NAVIGATION =====
function initializeNavigation() {
  // Initialize smooth scrolling navigation
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", handleNavigation)
  })

  // Initialize mobile menu
  const mobileToggle = document.getElementById("mobileToggle")
  const navMenu = document.getElementById("navMenu")

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("visible")
      mobileToggle.classList.toggle("active")
    })
  }

  // Initialize scroll spy
  initializeScrollSpy()

  // Initialize header scroll effect
  initializeHeaderScroll()
}

function handleNavigation(event) {
  event.preventDefault()
  const targetSection = event.currentTarget.dataset.section

  if (targetSection) {
    scrollToSection(targetSection)
    updateActiveNavLink(targetSection)
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

    AppState.currentSection = sectionId
  }
}

function updateActiveNavLink(activeSection) {
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.dataset.section === activeSection) {
      link.classList.add("active")
    }
  })
}

function initializeScrollSpy() {
  const sections = document.querySelectorAll("section[id]")
  const options = {
    threshold: 0.3,
    rootMargin: "-80px 0px -80px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id
        updateActiveNavLink(sectionId)
        AppState.currentSection = sectionId
      }
    })
  }, options)

  sections.forEach((section) => observer.observe(section))
}

function initializeHeaderScroll() {
  const header = document.getElementById("header")
  let lastScrollY = window.scrollY

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY

    if (header) {
      if (currentScrollY > 100) {
        header.classList.add("scrolled")
      } else {
        header.classList.remove("scrolled")
      }
    }

    lastScrollY = currentScrollY
  })
}

// ===== VOICE COMMANDS =====
async function initializeVoiceCommands() {
  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "pt-BR"

    const voiceBtn = document.getElementById("voiceBtn")
    const voiceIndicator = document.getElementById("voiceIndicator")

    if (voiceBtn) {
      voiceBtn.addEventListener("click", toggleVoiceCommand)
    }

    // Keyboard shortcut Alt+V
    document.addEventListener("keydown", (event) => {
      if (event.altKey && event.key === "v") {
        event.preventDefault()
        toggleVoiceCommand()
      }
    })

    recognition.onstart = () => {
      AppState.voiceEnabled = true
      if (voiceIndicator) voiceIndicator.classList.remove("hidden")
      if (voiceBtn) voiceBtn.classList.add("active")
    }

    recognition.onend = () => {
      AppState.voiceEnabled = false
      if (voiceIndicator) voiceIndicator.classList.add("hidden")
      if (voiceBtn) voiceBtn.classList.remove("active")
    }

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase()
      processVoiceCommand(command)
    }

    recognition.onerror = (event) => {
      console.error("Voice recognition error:", event.error)
      showNotification("Erro no reconhecimento de voz", "error")
    }

    window.speechRecognition = recognition
  } else {
    console.warn("Speech recognition not supported")
  }
}

function toggleVoiceCommand() {
  if (window.speechRecognition) {
    if (AppState.voiceEnabled) {
      window.speechRecognition.stop()
    } else {
      window.speechRecognition.start()
    }
  }
}

function processVoiceCommand(command) {
  console.log("Voice command:", command)

  // Navigation commands
  if (command.includes("início") || command.includes("home")) {
    scrollToSection("home")
    showNotification("Navegando para o início", "info")
  } else if (command.includes("catálogo") || command.includes("catalog")) {
    scrollToSection("catalog")
    showNotification("Navegando para o catálogo", "info")
  } else if (command.includes("sobre") || command.includes("about")) {
    scrollToSection("about")
    showNotification("Navegando para sobre", "info")
  }
  // Search commands
  else if (command.includes("buscar") || command.includes("procurar")) {
    const searchInput = document.getElementById("searchInput")
    if (searchInput) {
      searchInput.focus()
      showNotification("Campo de busca ativado", "info")
    }
  }
  // Login commands
  else if (command.includes("login") || command.includes("entrar")) {
    navigateToLogin()
    showNotification("Navegando para login", "info")
  }
  // Unknown command
  else {
    showNotification("Comando não reconhecido", "error")
  }
}

// ===== THEME MANAGEMENT =====
function initializeTheme() {
  const themeToggle = document.getElementById("themeToggle")
  const storedTheme = localStorage.getItem("saashub_theme") || "dark"

  AppState.theme = storedTheme
  applyTheme(storedTheme)

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme)
  }
}

function toggleTheme() {
  const newTheme = AppState.theme === "dark" ? "light" : "dark"
  AppState.theme = newTheme
  applyTheme(newTheme)
  localStorage.setItem("saashub_theme", newTheme)
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme)

  const themeToggle = document.getElementById("themeToggle")
  if (themeToggle) {
    const sunIcon = themeToggle.querySelector(".sun")
    const moonIcon = themeToggle.querySelector(".moon")

    if (theme === "light") {
      if (sunIcon) sunIcon.style.opacity = "0"
      if (moonIcon) moonIcon.style.opacity = "1"
    } else {
      if (sunIcon) sunIcon.style.opacity = "1"
      if (moonIcon) moonIcon.style.opacity = "0"
    }
  }
}

// ===== ANIMATIONS =====
const gsap = window.gsap
const ScrollTrigger = window.ScrollTrigger

function initializeAnimations() {
  // Initialize GSAP animations
  if (typeof gsap !== "undefined") {
    gsap.registerPlugin(ScrollTrigger)

    // Animate elements on scroll
    gsap.utils.toArray(".feature-card").forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        },
      )
    })
  }
}

function triggerEntranceAnimations() {
  // Animate hero elements
  const heroTitle = document.querySelector(".hero-title")
  const heroDescription = document.querySelector(".hero-description")
  const heroActions = document.querySelector(".hero-actions")

  if (typeof gsap !== "undefined") {
    const tl = gsap.timeline()

    tl.fromTo(".title-line", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 })
      .fromTo(heroDescription, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
      .fromTo(heroActions, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
  }
}

// ===== HOME PAGE FUNCTIONALITY =====
function initializeHomePage() {
  // Initialize search functionality
  initializeSearch()

  // Initialize filters
  initializeFilters()

  // Load initial SaaS grid
  loadSaasGrid()

  // Initialize FAB
  initializeFAB()

  // Initialize Three.js background
  initializeThreeJSBackground()
}

function initializeSearch() {
  const searchInput = document.getElementById("searchInput")
  const searchSuggestions = document.getElementById("searchSuggestions")

  if (searchInput) {
    let searchTimeout

    searchInput.addEventListener("input", (event) => {
      clearTimeout(searchTimeout)
      const query = event.target.value.trim()

      searchTimeout = setTimeout(() => {
        AppState.searchQuery = query
        filterSaasData()

        if (query.length > 2) {
          showSearchSuggestions(query)
        } else {
          hideSearchSuggestions()
        }
      }, 300)
    })

    searchInput.addEventListener("focus", () => {
      if (AppState.searchQuery.length > 2) {
        showSearchSuggestions(AppState.searchQuery)
      }
    })

    document.addEventListener("click", (event) => {
      if (!searchInput.contains(event.target) && !searchSuggestions?.contains(event.target)) {
        hideSearchSuggestions()
      }
    })
  }
}

function showSearchSuggestions(query) {
  const suggestions = generateSearchSuggestions(query)
  const suggestionsContainer = document.getElementById("searchSuggestions")

  if (suggestionsContainer && suggestions.length > 0) {
    suggestionsContainer.innerHTML = suggestions
      .map(
        (suggestion) =>
          `<div class="suggestion-item" onclick="applySuggestion('${suggestion}')">
        <span class="suggestion-icon">🔍</span>
        <span class="suggestion-text">${suggestion}</span>
      </div>`,
      )
      .join("")

    suggestionsContainer.classList.add("visible")
  }
}

function hideSearchSuggestions() {
  const suggestionsContainer = document.getElementById("searchSuggestions")
  if (suggestionsContainer) {
    suggestionsContainer.classList.remove("visible")
  }
}

function generateSearchSuggestions(query) {
  const suggestions = []
  const categories = ["productivity", "design", "marketing", "development"]
  const popularTerms = ["IA", "colaboração", "automação", "design", "código"]

  // Add category suggestions
  categories.forEach((category) => {
    if (category.toLowerCase().includes(query.toLowerCase())) {
      suggestions.push(category)
    }
  })

  // Add popular term suggestions
  popularTerms.forEach((term) => {
    if (term.toLowerCase().includes(query.toLowerCase())) {
      suggestions.push(term)
    }
  })

  return suggestions.slice(0, 5)
}

function applySuggestion(suggestion) {
  const searchInput = document.getElementById("searchInput")
  if (searchInput) {
    searchInput.value = suggestion
    AppState.searchQuery = suggestion
    filterSaasData()
    hideSearchSuggestions()
  }
}

function initializeFilters() {
  // Category filters
  const categoryFilters = document.querySelectorAll(".filter-pill")
  categoryFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
      // Remove active class from all filters
      categoryFilters.forEach((f) => f.classList.remove("active"))
      // Add active class to clicked filter
      filter.classList.add("active")

      const category = filter.dataset.category
      AppState.activeFilters.category = category
      filterSaasData()
    })
  })

  // Advanced filters toggle
  const advancedToggle = document.getElementById("advancedToggle")
  const advancedFilters = document.getElementById("advancedFilters")

  if (advancedToggle && advancedFilters) {
    advancedToggle.addEventListener("click", () => {
      advancedFilters.classList.toggle("visible")
      advancedToggle.classList.toggle("active")
    })
  }

  // Price filters
  const priceOptions = document.querySelectorAll(".price-option")
  priceOptions.forEach((option) => {
    option.addEventListener("click", () => {
      priceOptions.forEach((o) => o.classList.remove("active"))
      option.classList.add("active")

      AppState.activeFilters.price = option.dataset.price
      filterSaasData()
    })
  })
}

function filterSaasData() {
  let filtered = [...AppState.saasData]

  // Apply search filter
  if (AppState.searchQuery) {
    filtered = filtered.filter(
      (saas) =>
        saas.name.toLowerCase().includes(AppState.searchQuery.toLowerCase()) ||
        saas.description.toLowerCase().includes(AppState.searchQuery.toLowerCase()) ||
        saas.tags.some((tag) => tag.toLowerCase().includes(AppState.searchQuery.toLowerCase())),
    )
  }

  // Apply category filter
  if (AppState.activeFilters.category !== "all") {
    filtered = filtered.filter((saas) => saas.category === AppState.activeFilters.category)
  }

  // Apply price filter
  if (AppState.activeFilters.price !== "all") {
    filtered = filtered.filter((saas) => saas.price === AppState.activeFilters.price)
  }

  AppState.filteredSaas = filtered
  loadSaasGrid()
}

function loadSaasGrid() {
  const saasGrid = document.getElementById("saasGrid")
  if (!saasGrid) return

  if (AppState.filteredSaas.length === 0) {
    saasGrid.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>Nenhum SaaS encontrado</h3>
        <p>Tente ajustar os filtros ou termos de busca</p>
        <button class="btn btn-primary" onclick="clearFilters()">Limpar Filtros</button>
      </div>
    `
    return
  }

  saasGrid.innerHTML = AppState.filteredSaas.map((saas) => createSaasCard(saas)).join("")

  // Animate cards entrance
  if (typeof gsap !== "undefined") {
    gsap.fromTo(".saas-card", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 })
  }
}

function createSaasCard(saas) {
  return `
    <div class="saas-card" onclick="openSaasDetail(${saas.id})">
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
    </div>
  `
}

function getCategoryName(category) {
  const categories = {
    productivity: "Produtividade",
    design: "Design",
    marketing: "Marketing",
    development: "Desenvolvimento",
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

function clearFilters() {
  AppState.searchQuery = ""
  AppState.activeFilters = {
    category: "all",
    price: "all",
    rating: 0,
  }

  // Reset UI
  const searchInput = document.getElementById("searchInput")
  if (searchInput) searchInput.value = ""

  const categoryFilters = document.querySelectorAll(".filter-pill")
  categoryFilters.forEach((filter) => {
    filter.classList.remove("active")
    if (filter.dataset.category === "all") {
      filter.classList.add("active")
    }
  })

  const priceOptions = document.querySelectorAll(".price-option")
  priceOptions.forEach((option) => {
    option.classList.remove("active")
    if (option.dataset.price === "all") {
      option.classList.add("active")
    }
  })

  filterSaasData()
}

// ===== FAB (Floating Action Button) =====
function initializeFAB() {
  const fabMain = document.getElementById("fabMain")
  const fabMenu = document.getElementById("fabMenu")

  if (fabMain && fabMenu) {
    fabMain.addEventListener("click", () => {
      fabMenu.classList.toggle("visible")
      fabMain.classList.toggle("active")
    })

    // Close FAB menu when clicking outside
    document.addEventListener("click", (event) => {
      if (!fabMain.contains(event.target) && !fabMenu.contains(event.target)) {
        fabMenu.classList.remove("visible")
        fabMain.classList.remove("active")
      }
    })
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

// ===== THREE.JS BACKGROUND =====
const THREE = window.THREE

function initializeThreeJSBackground() {
  if (typeof THREE === "undefined") return

  const canvas = document.getElementById("heroCanvas")
  if (!canvas) return

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true })

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x000000, 0)

  // Create floating particles
  const particlesGeometry = new THREE.BufferGeometry()
  const particlesCount = 100
  const posArray = new Float32Array(particlesCount * 3)

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10
  }

  particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: 0x00d4ff,
    transparent: true,
    opacity: 0.8,
  })

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particlesMesh)

  camera.position.z = 3

  // Animation loop
  function animate() {
    requestAnimationFrame(animate)

    particlesMesh.rotation.x += 0.001
    particlesMesh.rotation.y += 0.002

    renderer.render(scene, camera)
  }

  animate()

  // Handle window resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })
}

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

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = "info", duration = 5000) {
  const container = document.getElementById("notificationContainer")
  if (!container) return

  const notification = document.createElement("div")
  notification.className = `notification ${type}`

  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
    warning: "⚠️",
  }

  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-icon">${icons[type] || icons.info}</div>
      <div class="notification-text">
        <div class="notification-message">${message}</div>
      </div>
    </div>
    <button class="notification-close" onclick="this.parentElement.remove()">✕</button>
  `

  container.appendChild(notification)

  // Trigger entrance animation
  setTimeout(() => {
    notification.classList.add("visible")
  }, 100)

  // Auto remove
  setTimeout(() => {
    notification.classList.remove("visible")
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove()
      }
    }, 300)
  }, duration)
}

// ===== NAVIGATION FUNCTIONS =====
function navigateToLogin() {
  window.location.href = "login.html"
}

function navigateToRegister() {
  window.location.href = "login.html?mode=register"
}

function navigateToDashboard() {
  if (AppState.currentUser) {
    const dashboardUrl = AppState.currentUser.type === "developer" ? "dashboard-dev.html" : "dashboard-user.html"
    window.location.href = dashboardUrl
  }
}

function navigateToSubmit() {
  if (AppState.currentUser) {
    window.location.href = "submit-saas.html"
  } else {
    showNotification("Faça login para enviar um SaaS", "warning")
    navigateToLogin()
  }
}

function openSaasDetail(saasId) {
  window.location.href = `saas-detail.html?id=${saasId}`
}

function toggleFavorite(saasId) {
  if (!AppState.currentUser) {
    showNotification("Faça login para favoritar SaaS", "warning")
    return
  }

  // Check if already favorited
  const favoriteBtn = event.target
  const isFavorited = favoriteBtn.classList.contains('favorited')
  
  if (isFavorited) {
    // Remove from favorites
    firebaseService.removeFromFavorites(AppState.currentUser.uid, saasId)
      .then(() => {
        favoriteBtn.classList.remove('favorited')
        favoriteBtn.innerHTML = '🤍'
        showNotification("SaaS removido dos favoritos", "info")
      })
      .catch((error) => {
        console.error("Error removing favorite:", error)
        showNotification("Erro ao remover dos favoritos", "error")
      })
  } else {
    // Add to favorites
    firebaseService.addToFavorites(AppState.currentUser.uid, saasId)
      .then(() => {
        favoriteBtn.classList.add('favorited')
        favoriteBtn.innerHTML = '❤️'
        showNotification("SaaS adicionado aos favoritos", "success")
      })
      .catch((error) => {
        console.error("Error adding favorite:", error)
        showNotification("Erro ao adicionar aos favoritos", "error")
      })
  }
}

// ===== FIREBASE HELPER FUNCTIONS =====
async function loadFeaturedSaas() {
  try {
    const featuredSaas = await firebaseService.getFeaturedSaas()
    return featuredSaas
  } catch (error) {
    console.error("Error loading featured SaaS:", error)
    return []
  }
}

async function loadSaasByCategory(category) {
  try {
    const categoryFilter = category === 'all' ? null : category
    const saasList = categoryFilter 
      ? await firebaseService.getSaasByCategory(category)
      : await firebaseService.getAllSaas()
    return saasList
  } catch (error) {
    console.error("Error loading SaaS by category:", error)
    return []
  }
}

async function addReview(saasId, rating, comment) {
  if (!AppState.currentUser) {
    showNotification("Faça login para avaliar", "warning")
    return false
  }

  try {
    await firebaseService.addReview(AppState.currentUser.uid, saasId, rating, comment)
    showNotification("Avaliação adicionada com sucesso", "success")
    return true
  } catch (error) {
    console.error("Error adding review:", error)
    showNotification("Erro ao adicionar avaliação", "error")
    return false
  }
}

async function loadUserFavorites() {
  if (!AppState.currentUser) return []

  try {
    const favorites = await firebaseService.getUserFavorites(AppState.currentUser.uid)
    return favorites.map(fav => fav.saasId)
  } catch (error) {
    console.error("Error loading user favorites:", error)
    return []
  }
}

// Clean up Firebase listeners when leaving the page
window.addEventListener('beforeunload', () => {
  AppState.unsubscribeFunctions.forEach(unsubscribe => {
    if (typeof unsubscribe === 'function') {
      unsubscribe()
    }
  })
})

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener("keydown", (event) => {
  // Alt + H - Home
  if (event.altKey && event.key === "h") {
    event.preventDefault()
    scrollToSection("home")
  }

  // Alt + C - Catalog
  if (event.altKey && event.key === "c") {
    event.preventDefault()
    scrollToSection("catalog")
  }

  // Alt + A - About
  if (event.altKey && event.key === "a") {
    event.preventDefault()
    scrollToSection("about")
  }

  // Escape - Close modals/menus
  if (event.key === "Escape") {
    const fabMenu = document.getElementById("fabMenu")
    const fabMain = document.getElementById("fabMain")

    if (fabMenu?.classList.contains("visible")) {
      fabMenu.classList.remove("visible")
      fabMain?.classList.remove("active")
    }

    hideSearchSuggestions()
  }

  // Ctrl/Cmd + K - Focus search
  if ((event.ctrlKey || event.metaKey) && event.key === "k") {
    event.preventDefault()
    const searchInput = document.getElementById("searchInput")
    if (searchInput) {
      searchInput.focus()
      scrollToSection("catalog")
    }
  }
})

// ===== EXPORT FOR GLOBAL ACCESS =====
window.SaaSHub = {
  AppState,
  showNotification,
  scrollToSection,
  navigateToLogin,
  navigateToRegister,
  navigateToDashboard,
  navigateToSubmit,
  openSaasDetail,
  toggleFavorite,
  toggleVoiceCommand,
  scrollToTop,
  clearFilters,
  logout,

}

console.log("🎯 SaaSHub Main Module Loaded")
