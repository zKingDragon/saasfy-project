/**
 * SaaSHub - Catalog Page JavaScript Module
 * Handles catalog page functionality including search, filters, and pagination
 */

// ===== CATALOG STATE =====
const CatalogState = {
  allSaas: [],
  filteredSaas: [],
  currentPage: 1,
  itemsPerPage: 24,
  totalPages: 1,
  currentView: "grid",
  isLoading: false,
  filters: {
    search: "",
    category: "all",
    price: "all",
    rating: 0,
    sort: "popular",
  },
  searchTimeout: null,
}

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", initializeCatalogPage)

function initializeCatalogPage() {
  try {
    // Load SaaS data
    loadSaasData()

    // Initialize components
    initializeSearch()
    initializeFilters()
    initializeViewToggle()
    initializePagination()
    initializeUrlParams()

    // Load initial results
    applyFiltersAndSearch()

    console.log("📚 Catalog page initialized successfully")
  } catch (error) {
    console.error("❌ Failed to initialize catalog page:", error)
  }
}

// ===== DATA LOADING =====
function loadSaasData() {
  // Get data from main app state or localStorage
  if (window.SaaSHub && window.SaaSHub.AppState && window.SaaSHub.AppState.saasData) {
    CatalogState.allSaas = [...window.SaaSHub.AppState.saasData]
  } else {
    const storedData = localStorage.getItem("saashub_saas_data")
    if (storedData) {
      try {
        CatalogState.allSaas = JSON.parse(storedData)
      } catch (error) {
        console.error("Error parsing stored SaaS data:", error)
        CatalogState.allSaas = generateExtendedSaasData()
      }
    } else {
      CatalogState.allSaas = generateExtendedSaasData()
    }
  }

  CatalogState.filteredSaas = [...CatalogState.allSaas]
  updateTotalCount()
}

function generateExtendedSaasData() {
  return [
    // Productivity
    {
      id: 1,
      name: "Notion AI",
      category: "productivity",
      description:
        "Workspace inteligente com IA integrada para produtividade máxima. Combine anotações, tarefas, wikis e bancos de dados em um só lugar.",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.8,
      reviews: 1250,
      price: "free",
      isPremium: false,
      tags: ["IA", "Produtividade", "Colaboração", "Anotações"],
      url: "https://notion.so",
      featured: true,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Todoist Premium",
      category: "productivity",
      description: "Gerenciador de tarefas avançado com recursos de IA para organização pessoal e profissional.",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.6,
      reviews: 890,
      price: "premium",
      isPremium: true,
      tags: ["Tarefas", "Organização", "Produtividade"],
      url: "https://todoist.com",
      featured: false,
      createdAt: "2024-01-10",
    },
    {
      id: 3,
      name: "Trello Power-Up",
      category: "productivity",
      description: "Quadros Kanban visuais para gerenciamento de projetos com automações inteligentes.",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.4,
      reviews: 2100,
      price: "free",
      isPremium: false,
      tags: ["Kanban", "Projetos", "Colaboração"],
      url: "https://trello.com",
      featured: false,
      createdAt: "2024-01-08",
    },
    {
      id: 4,
      name: "Asana Teams",
      category: "productivity",
      description: "Plataforma completa de gerenciamento de trabalho para equipes de todos os tamanhos.",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.5,
      reviews: 1560,
      price: "premium",
      isPremium: true,
      tags: ["Equipes", "Projetos", "Workflow"],
      url: "https://asana.com",
      featured: true,
      createdAt: "2024-01-12",
    },

    // Design
    {
      id: 5,
      name: "Figma Pro",
      category: "design",
      description:
        "Design colaborativo de próxima geração com recursos avançados de prototipagem e sistemas de design.",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.9,
      reviews: 3200,
      price: "premium",
      isPremium: true,
      tags: ["Design", "Colaboração", "Prototipagem", "UI/UX"],
      url: "https://figma.com",
      featured: true,
      createdAt: "2024-01-20",
    },
    {
      id: 6,
      name: "Canva Pro",
      category: "design",
      description: "Design gráfico simplificado com templates premium e recursos de IA para criação rápida.",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.5,
      reviews: 1800,
      price: "premium",
      isPremium: true,
      tags: ["Design", "Templates", "Marketing", "IA"],
      url: "https://canva.com",
      featured: false,
      createdAt: "2024-01-18",
    },
    {
      id: 7,
      name: "Adobe Creative Cloud",
      category: "design",
      description: "Suite completa de ferramentas criativas profissionais para design, vídeo e web.",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.7,
      reviews: 2500,
      price: "premium",
      isPremium: true,
      tags: ["Design", "Profissional", "Vídeo", "Web"],
      url: "https://adobe.com",
      featured: true,
      createdAt: "2024-01-16",
    },
    {
      id: 8,
      name: "Sketch Cloud",
      category: "design",
      description: "Ferramenta de design vetorial focada em interfaces digitais com colaboração em nuvem.",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.3,
      reviews: 950,
      price: "premium",
      isPremium: true,
      tags: ["Design", "Vetorial", "Interface", "Mac"],
      url: "https://sketch.com",
      featured: false,
      createdAt: "2024-01-14",
    },

    // Marketing
    {
      id: 9,
      name: "HubSpot CRM",
      category: "marketing",
      description: "CRM completo com automação de marketing e vendas, incluindo email marketing e analytics.",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.6,
      reviews: 1890,
      price: "free",
      isPremium: false,
      tags: ["CRM", "Marketing", "Vendas", "Automação"],
      url: "https://hubspot.com",
      featured: true,
      createdAt: "2024-01-22",
    },
    {
      id: 10,
      name: "Mailchimp Pro",
      category: "marketing",
      description: "Plataforma de email marketing com automação avançada e segmentação inteligente.",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.4,
      reviews: 1200,
      price: "premium",
      isPremium: true,
      tags: ["Email", "Marketing", "Automação", "Analytics"],
      url: "https://mailchimp.com",
      featured: false,
      createdAt: "2024-01-19",
    },
    {
      id: 11,
      name: "Buffer Analyze",
      category: "marketing",
      description: "Gerenciamento de redes sociais com analytics avançados e agendamento inteligente.",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.2,
      reviews: 780,
      price: "premium",
      isPremium: true,
      tags: ["Social Media", "Analytics", "Agendamento"],
      url: "https://buffer.com",
      featured: false,
      createdAt: "2024-01-17",
    },
    {
      id: 12,
      name: "Google Analytics 4",
      category: "marketing",
      description: "Analytics avançado para websites e aplicativos com insights baseados em IA.",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.5,
      reviews: 3500,
      price: "free",
      isPremium: false,
      tags: ["Analytics", "Web", "IA", "Insights"],
      url: "https://analytics.google.com",
      featured: true,
      createdAt: "2024-01-21",
    },

    // Development
    {
      id: 13,
      name: "VS Code AI",
      category: "development",
      description: "Editor de código com assistente IA para desenvolvimento, debugging e refatoração automática.",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.8,
      reviews: 4200,
      price: "free",
      isPremium: false,
      tags: ["Código", "IA", "Desenvolvimento", "Editor"],
      url: "https://code.visualstudio.com",
      featured: true,
      createdAt: "2024-01-25",
    },
    {
      id: 14,
      name: "GitHub Copilot",
      category: "development",
      description: "Assistente de programação com IA que sugere código em tempo real enquanto você desenvolve.",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.7,
      reviews: 2800,
      price: "premium",
      isPremium: true,
      tags: ["IA", "Código", "Assistente", "Programação"],
      url: "https://github.com/features/copilot",
      featured: true,
      createdAt: "2024-01-23",
    },
    {
      id: 15,
      name: "Vercel Platform",
      category: "development",
      description: "Plataforma de deployment para aplicações frontend com integração contínua e CDN global.",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.6,
      reviews: 1500,
      price: "free",
      isPremium: false,
      tags: ["Deploy", "Frontend", "CDN", "CI/CD"],
      url: "https://vercel.com",
      featured: false,
      createdAt: "2024-01-20",
    },
    {
      id: 16,
      name: "Docker Desktop",
      category: "development",
      description: "Containerização de aplicações para desenvolvimento e deployment consistente em qualquer ambiente.",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.4,
      reviews: 1900,
      price: "free",
      isPremium: false,
      tags: ["Container", "DevOps", "Deploy", "Desenvolvimento"],
      url: "https://docker.com",
      featured: false,
      createdAt: "2024-01-18",
    },

    // Finance
    {
      id: 17,
      name: "QuickBooks Online",
      category: "finance",
      description: "Software de contabilidade completo para pequenas e médias empresas com automação fiscal.",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.3,
      reviews: 1100,
      price: "premium",
      isPremium: true,
      tags: ["Contabilidade", "Fiscal", "Empresas", "Automação"],
      url: "https://quickbooks.intuit.com",
      featured: false,
      createdAt: "2024-01-16",
    },
    {
      id: 18,
      name: "Mint Personal Finance",
      category: "finance",
      description: "Gerenciamento de finanças pessoais com categorização automática e insights de gastos.",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.1,
      reviews: 850,
      price: "free",
      isPremium: false,
      tags: ["Finanças", "Pessoal", "Orçamento", "Insights"],
      url: "https://mint.com",
      featured: false,
      createdAt: "2024-01-14",
    },
    {
      id: 19,
      name: "Stripe Dashboard",
      category: "finance",
      description: "Plataforma de pagamentos online com analytics avançados e automação de cobrança.",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.7,
      reviews: 2200,
      price: "free",
      isPremium: false,
      tags: ["Pagamentos", "Online", "Analytics", "API"],
      url: "https://stripe.com",
      featured: true,
      createdAt: "2024-01-22",
    },

    // Communication
    {
      id: 20,
      name: "Slack AI",
      category: "communication",
      description: "Comunicação empresarial com assistente IA integrado para resumos e automações.",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.5,
      reviews: 2500,
      price: "premium",
      isPremium: true,
      tags: ["Comunicação", "IA", "Equipes", "Automação"],
      url: "https://slack.com",
      featured: true,
      createdAt: "2024-01-24",
    },
    {
      id: 21,
      name: "Microsoft Teams",
      category: "communication",
      description: "Plataforma de colaboração com videochamadas, chat e integração com Office 365.",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.2,
      reviews: 1800,
      price: "free",
      isPremium: false,
      tags: ["Colaboração", "Vídeo", "Chat", "Office"],
      url: "https://teams.microsoft.com",
      featured: false,
      createdAt: "2024-01-19",
    },
    {
      id: 22,
      name: "Discord Nitro",
      category: "communication",
      description: "Comunicação por voz e texto para comunidades com recursos premium e bots personalizados.",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.4,
      reviews: 1600,
      price: "premium",
      isPremium: true,
      tags: ["Comunidade", "Voz", "Chat", "Gaming"],
      url: "https://discord.com",
      featured: false,
      createdAt: "2024-01-17",
    },
    {
      id: 23,
      name: "Zoom Pro",
      category: "communication",
      description: "Videoconferências profissionais com recursos avançados de gravação e webinars.",
      logo: "/placeholder.svg?height=60&width=60",
      rating: 4.3,
      reviews: 2100,
      price: "premium",
      isPremium: true,
      tags: ["Vídeo", "Conferência", "Webinar", "Profissional"],
      url: "https://zoom.us",
      featured: false,
      createdAt: "2024-01-15",
    },
  ]
}

// ===== URL PARAMETERS =====
function initializeUrlParams() {
  const urlParams = new URLSearchParams(window.location.search)

  // Apply category filter from URL
  const category = urlParams.get("category")
  if (category && category !== "all") {
    CatalogState.filters.category = category
    updateCategoryFilterUI(category)
  }

  // Apply search from URL
  const search = urlParams.get("search")
  if (search) {
    CatalogState.filters.search = search
    const searchInput = document.getElementById("searchInput")
    if (searchInput) {
      searchInput.value = search
    }
  }
}

function updateCategoryFilterUI(category) {
  const categoryFilters = document.querySelectorAll(".filter-pill")
  categoryFilters.forEach((filter) => {
    filter.classList.remove("active")
    if (filter.dataset.category === category) {
      filter.classList.add("active")
    }
  })
}

// ===== SEARCH FUNCTIONALITY =====
function initializeSearch() {
  const searchInput = document.getElementById("searchInput")
  const searchClear = document.getElementById("searchClear")
  const searchSuggestions = document.getElementById("searchSuggestions")

  if (searchInput) {
    searchInput.addEventListener("input", handleSearchInput)
    searchInput.addEventListener("focus", handleSearchFocus)
    searchInput.addEventListener("keydown", handleSearchKeydown)
  }

  if (searchClear) {
    searchClear.addEventListener("click", clearSearch)
  }

  // Close suggestions when clicking outside
  document.addEventListener("click", (event) => {
    if (!searchInput?.contains(event.target) && !searchSuggestions?.contains(event.target)) {
      hideSuggestions()
    }
  })
}

function handleSearchInput(event) {
  const query = event.target.value.trim()
  const searchClear = document.getElementById("searchClear")

  // Show/hide clear button
  if (searchClear) {
    searchClear.style.display = query ? "block" : "none"
  }

  // Debounce search
  clearTimeout(CatalogState.searchTimeout)
  CatalogState.searchTimeout = setTimeout(() => {
    CatalogState.filters.search = query
    CatalogState.currentPage = 1

    if (query.length > 2) {
      showSuggestions(query)
    } else {
      hideSuggestions()
    }

    applyFiltersAndSearch()
    updateURL()
  }, 300)
}

function handleSearchFocus(event) {
  const query = event.target.value.trim()
  if (query.length > 2) {
    showSuggestions(query)
  }
}

function handleSearchKeydown(event) {
  if (event.key === "Escape") {
    event.target.blur()
    hideSuggestions()
  } else if (event.key === "Enter") {
    event.preventDefault()
    hideSuggestions()
    applyFiltersAndSearch()
  }
}

function clearSearch() {
  const searchInput = document.getElementById("searchInput")
  const searchClear = document.getElementById("searchClear")

  if (searchInput) {
    searchInput.value = ""
    searchInput.focus()
  }

  if (searchClear) {
    searchClear.style.display = "none"
  }

  CatalogState.filters.search = ""
  CatalogState.currentPage = 1
  hideSuggestions()
  applyFiltersAndSearch()
  updateURL()
}

function showSuggestions(query) {
  const suggestions = generateSearchSuggestions(query)
  const suggestionsContainer = document.getElementById("searchSuggestions")

  if (suggestionsContainer && suggestions.length > 0) {
    suggestionsContainer.innerHTML = suggestions
      .map(
        (suggestion) =>
          `<div class="suggestion-item" onclick="applySuggestion('${suggestion.text}')">
            <span class="suggestion-icon">${suggestion.icon}</span>
            <span class="suggestion-text">${suggestion.text}</span>
            <span class="suggestion-type">${suggestion.type}</span>
          </div>`,
      )
      .join("")

    suggestionsContainer.classList.add("visible")
  }
}

function hideSuggestions() {
  const suggestionsContainer = document.getElementById("searchSuggestions")
  if (suggestionsContainer) {
    suggestionsContainer.classList.remove("visible")
  }
}

function generateSearchSuggestions(query) {
  const suggestions = []
  const queryLower = query.toLowerCase()

  // Category suggestions
  const categories = [
    { name: "produtividade", icon: "⚡", type: "Categoria" },
    { name: "design", icon: "🎨", type: "Categoria" },
    { name: "marketing", icon: "📈", type: "Categoria" },
    { name: "desenvolvimento", icon: "💻", type: "Categoria" },
    { name: "finanças", icon: "💰", type: "Categoria" },
    { name: "comunicação", icon: "💬", type: "Categoria" },
  ]

  categories.forEach((category) => {
    if (category.name.includes(queryLower)) {
      suggestions.push({
        text: category.name,
        icon: category.icon,
        type: category.type,
      })
    }
  })

  // Popular terms
  const popularTerms = [
    { name: "ia", icon: "🧠", type: "Termo" },
    { name: "colaboração", icon: "👥", type: "Termo" },
    { name: "automação", icon: "🤖", type: "Termo" },
    { name: "analytics", icon: "📊", type: "Termo" },
    { name: "grátis", icon: "🆓", type: "Filtro" },
    { name: "premium", icon: "👑", type: "Filtro" },
  ]

  popularTerms.forEach((term) => {
    if (term.name.includes(queryLower)) {
      suggestions.push({
        text: term.name,
        icon: term.icon,
        type: term.type,
      })
    }
  })

  // SaaS name suggestions
  CatalogState.allSaas.forEach((saas) => {
    if (saas.name.toLowerCase().includes(queryLower)) {
      suggestions.push({
        text: saas.name,
        icon: "🚀",
        type: "SaaS",
      })
    }
  })

  return suggestions.slice(0, 6)
}

function applySuggestion(suggestion) {
  const searchInput = document.getElementById("searchInput")
  if (searchInput) {
    searchInput.value = suggestion
    CatalogState.filters.search = suggestion
    CatalogState.currentPage = 1
    hideSuggestions()
    applyFiltersAndSearch()
    updateURL()
  }
}

// ===== FILTERS FUNCTIONALITY =====
function initializeFilters() {
  // Category filters
  const categoryFilters = document.querySelectorAll(".filter-pill")
  categoryFilters.forEach((filter) => {
    filter.addEventListener("click", () => handleCategoryFilter(filter))
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
    option.addEventListener("click", () => handlePriceFilter(option))
  })

  // Rating filters
  const ratingOptions = document.querySelectorAll(".rating-option")
  ratingOptions.forEach((option) => {
    option.addEventListener("click", () => handleRatingFilter(option))
  })

  // Sort filter
  const sortSelect = document.getElementById("sortSelect")
  if (sortSelect) {
    sortSelect.addEventListener("change", (event) => {
      CatalogState.filters.sort = event.target.value
      CatalogState.currentPage = 1
      applyFiltersAndSearch()
    })
  }

  // Items per page
  const itemsSelect = document.getElementById("itemsPerPage")
  if (itemsSelect) {
    itemsSelect.addEventListener("change", (event) => {
      CatalogState.itemsPerPage = Number.parseInt(event.target.value)
      CatalogState.currentPage = 1
      applyFiltersAndSearch()
    })
  }
}

function handleCategoryFilter(filterElement) {
  // Remove active class from all filters
  document.querySelectorAll(".filter-pill").forEach((f) => f.classList.remove("active"))

  // Add active class to clicked filter
  filterElement.classList.add("active")

  const category = filterElement.dataset.category
  CatalogState.filters.category = category
  CatalogState.currentPage = 1

  applyFiltersAndSearch()
  updateURL()
}

function handlePriceFilter(optionElement) {
  // Remove active class from all price options
  document.querySelectorAll(".price-option").forEach((o) => o.classList.remove("active"))

  // Add active class to clicked option
  optionElement.classList.add("active")

  const price = optionElement.dataset.price
  CatalogState.filters.price = price
  CatalogState.currentPage = 1

  applyFiltersAndSearch()
}

function handleRatingFilter(optionElement) {
  // Remove active class from all rating options
  document.querySelectorAll(".rating-option").forEach((o) => o.classList.remove("active"))

  // Add active class to clicked option
  optionElement.classList.add("active")

  const rating = Number.parseFloat(optionElement.dataset.rating)
  CatalogState.filters.rating = rating
  CatalogState.currentPage = 1

  applyFiltersAndSearch()
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
      CatalogState.currentView = view

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

// ===== PAGINATION =====
function initializePagination() {
  // Pagination will be handled in renderPagination function
}

function renderPagination() {
  const paginationContainer = document.getElementById("pagination")
  if (!paginationContainer) return

  const totalPages = CatalogState.totalPages
  const currentPage = CatalogState.currentPage

  if (totalPages <= 1) {
    paginationContainer.innerHTML = ""
    return
  }

  let paginationHTML = ""

  // Previous button
  paginationHTML += `
    <button class="pagination-btn" ${currentPage === 1 ? "disabled" : ""} 
            onclick="goToPage(${currentPage - 1})">
      ←
    </button>
  `

  // Page numbers
  const startPage = Math.max(1, currentPage - 2)
  const endPage = Math.min(totalPages, currentPage + 2)

  if (startPage > 1) {
    paginationHTML += `<button class="pagination-btn" onclick="goToPage(1)">1</button>`
    if (startPage > 2) {
      paginationHTML += `<span class="pagination-ellipsis">...</span>`
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <button class="pagination-btn ${i === currentPage ? "active" : ""}" 
              onclick="goToPage(${i})">
        ${i}
      </button>
    `
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationHTML += `<span class="pagination-ellipsis">...</span>`
    }
    paginationHTML += `<button class="pagination-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`
  }

  // Next button
  paginationHTML += `
    <button class="pagination-btn" ${currentPage === totalPages ? "disabled" : ""} 
            onclick="goToPage(${currentPage + 1})">
      →
    </button>
  `

  paginationContainer.innerHTML = paginationHTML
}

function goToPage(page) {
  if (page < 1 || page > CatalogState.totalPages || page === CatalogState.currentPage) {
    return
  }

  CatalogState.currentPage = page
  renderSaasGrid()
  renderPagination()

  // Scroll to top of results
  const resultsSection = document.querySelector(".results-section")
  if (resultsSection) {
    resultsSection.scrollIntoView({ behavior: "smooth" })
  }
}

// ===== MAIN FILTER AND SEARCH LOGIC =====
function applyFiltersAndSearch() {
  showLoading()

  // Simulate API delay for better UX
  setTimeout(() => {
    filterSaasData()
    renderSaasGrid()
    renderPagination()
    updateResultsInfo()
    updateActiveFilters()
    hideLoading()
  }, 300)
}

function filterSaasData() {
  let filtered = [...CatalogState.allSaas]

  // Apply search filter
  if (CatalogState.filters.search) {
    const searchTerm = CatalogState.filters.search.toLowerCase()
    filtered = filtered.filter(
      (saas) =>
        saas.name.toLowerCase().includes(searchTerm) ||
        saas.description.toLowerCase().includes(searchTerm) ||
        saas.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
        getCategoryName(saas.category).toLowerCase().includes(searchTerm),
    )
  }

  // Apply category filter
  if (CatalogState.filters.category !== "all") {
    filtered = filtered.filter((saas) => saas.category === CatalogState.filters.category)
  }

  // Apply price filter
  if (CatalogState.filters.price !== "all") {
    filtered = filtered.filter((saas) => saas.price === CatalogState.filters.price)
  }

  // Apply rating filter
  if (CatalogState.filters.rating > 0) {
    filtered = filtered.filter((saas) => saas.rating >= CatalogState.filters.rating)
  }

  // Apply sorting
  switch (CatalogState.filters.sort) {
    case "name":
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case "rating":
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      break
    case "popular":
      filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
      break
    case "newest":
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
    default:
      break
  }

  CatalogState.filteredSaas = filtered
  CatalogState.totalPages = Math.ceil(filtered.length / CatalogState.itemsPerPage)

  // Reset to page 1 if current page is beyond total pages
  if (CatalogState.currentPage > CatalogState.totalPages) {
    CatalogState.currentPage = 1
  }
}

// ===== RENDERING =====
function renderSaasGrid() {
  const saasGrid = document.getElementById("saasGrid")
  const noResults = document.getElementById("noResults")

  if (!saasGrid) return

  if (CatalogState.filteredSaas.length === 0) {
    saasGrid.innerHTML = ""
    if (noResults) noResults.classList.remove("hidden")
    return
  }

  if (noResults) noResults.classList.add("hidden")

  // Calculate pagination
  const startIndex = (CatalogState.currentPage - 1) * CatalogState.itemsPerPage
  const endIndex = startIndex + CatalogState.itemsPerPage
  const paginatedSaas = CatalogState.filteredSaas.slice(startIndex, endIndex)

  saasGrid.innerHTML = paginatedSaas.map((saas) => createSaasCard(saas)).join("")

  // Animate cards entrance
  const gsap = window.gsap // Declare gsap variable
  if (gsap) {
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
          <button class="card-btn" onclick="event.stopPropagation(); toggleFavorite(${saas.id})" title="Favoritar">
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

function updateResultsInfo() {
  const resultsCount = document.getElementById("resultsCount")
  const resultsSubtitle = document.getElementById("resultsSubtitle")
  const totalSaasCount = document.getElementById("totalSaasCount")

  if (resultsCount) {
    resultsCount.textContent = CatalogState.filteredSaas.length
  }

  if (totalSaasCount) {
    totalSaasCount.textContent = `${CatalogState.allSaas.length}+`
  }

  if (resultsSubtitle) {
    let subtitle = "Mostrando todos os resultados"

    if (CatalogState.filters.search) {
      subtitle = `Resultados para "${CatalogState.filters.search}"`
    } else if (CatalogState.filters.category !== "all") {
      subtitle = `Categoria: ${getCategoryName(CatalogState.filters.category)}`
    }

    if (CatalogState.filteredSaas.length > CatalogState.itemsPerPage) {
      const startIndex = (CatalogState.currentPage - 1) * CatalogState.itemsPerPage + 1
      const endIndex = Math.min(CatalogState.currentPage * CatalogState.itemsPerPage, CatalogState.filteredSaas.length)
      subtitle += ` (${startIndex}-${endIndex} de ${CatalogState.filteredSaas.length})`
    }

    resultsSubtitle.textContent = subtitle
  }
}

function updateActiveFilters() {
  const activeFiltersContainer = document.getElementById("activeFilters")
  if (!activeFiltersContainer) return

  const activeFilters = []

  // Search filter
  if (CatalogState.filters.search) {
    activeFilters.push({
      type: "search",
      label: `Busca: ${CatalogState.filters.search}`,
      value: CatalogState.filters.search,
    })
  }

  // Category filter
  if (CatalogState.filters.category !== "all") {
    activeFilters.push({
      type: "category",
      label: `Categoria: ${getCategoryName(CatalogState.filters.category)}`,
      value: CatalogState.filters.category,
    })
  }

  // Price filter
  if (CatalogState.filters.price !== "all") {
    const priceLabel = CatalogState.filters.price === "free" ? "Grátis" : "Premium"
    activeFilters.push({
      type: "price",
      label: `Preço: ${priceLabel}`,
      value: CatalogState.filters.price,
    })
  }

  // Rating filter
  if (CatalogState.filters.rating > 0) {
    activeFilters.push({
      type: "rating",
      label: `Avaliação: ${CatalogState.filters.rating}+ estrelas`,
      value: CatalogState.filters.rating,
    })
  }

  if (activeFilters.length === 0) {
    activeFiltersContainer.innerHTML = ""
    return
  }

  activeFiltersContainer.innerHTML = activeFilters
    .map(
      (filter) =>
        `<div class="filter-tag">
          <span>${filter.label}</span>
          <button class="filter-tag-remove" onclick="removeFilter('${filter.type}', '${filter.value}')" title="Remover filtro">
            ✕
          </button>
        </div>`,
    )
    .join("")
}

// ===== LOADING STATES =====
function showLoading() {
  CatalogState.isLoading = true
  const loadingState = document.getElementById("loadingState")
  const saasGrid = document.getElementById("saasGrid")

  if (loadingState) loadingState.classList.remove("hidden")
  if (saasGrid) saasGrid.style.opacity = "0.5"
}

function hideLoading() {
  CatalogState.isLoading = false
  const loadingState = document.getElementById("loadingState")
  const saasGrid = document.getElementById("saasGrid")

  if (loadingState) loadingState.classList.add("hidden")
  if (saasGrid) saasGrid.style.opacity = "1"
}

// ===== URL MANAGEMENT =====
function updateURL() {
  const params = new URLSearchParams()

  if (CatalogState.filters.search) {
    params.set("search", CatalogState.filters.search)
  }

  if (CatalogState.filters.category !== "all") {
    params.set("category", CatalogState.filters.category)
  }

  if (CatalogState.currentPage > 1) {
    params.set("page", CatalogState.currentPage)
  }

  const newURL = `${window.location.pathname}${params.toString() ? "?" + params.toString() : ""}`
  window.history.replaceState({}, "", newURL)
}

function updateTotalCount() {
  const totalSaasCount = document.getElementById("totalSaasCount")
  if (totalSaasCount) {
    totalSaasCount.textContent = `${CatalogState.allSaas.length}+`
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

// Add favorites filter functionality
function toggleFavoritesView() {
  // Toggle showing only favorites
  console.log("Toggle favorites view")
  if (window.SaaSHub && window.SaaSHub.showNotification) {
    window.SaaSHub.showNotification("Funcionalidade em desenvolvimento", "info")
  }
}

// ===== GLOBAL FUNCTIONS =====
function clearAllFilters() {
  // Reset all filters
  CatalogState.filters = {
    search: "",
    category: "all",
    price: "all",
    rating: 0,
    sort: "popular",
  }
  CatalogState.currentPage = 1

  // Reset UI
  const searchInput = document.getElementById("searchInput")
  if (searchInput) {
    searchInput.value = ""
    document.getElementById("searchClear").style.display = "none"
  }

  // Reset category filters
  document.querySelectorAll(".filter-pill").forEach((filter) => {
    filter.classList.remove("active")
    if (filter.dataset.category === "all") {
      filter.classList.add("active")
    }
  })

  // Reset price filters
  document.querySelectorAll(".price-option").forEach((option) => {
    option.classList.remove("active")
    if (option.dataset.price === "all") {
      option.classList.add("active")
    }
  })

  // Reset rating filters
  document.querySelectorAll(".rating-option").forEach((option) => {
    option.classList.remove("active")
    if (option.dataset.rating === "0") {
      option.classList.add("active")
    }
  })

  // Reset sort
  const sortSelect = document.getElementById("sortSelect")
  if (sortSelect) {
    sortSelect.value = "popular"
  }

  hideSuggestions()
  applyFiltersAndSearch()
  updateURL()
}

function applyFilters() {
  applyFiltersAndSearch()
}

function removeFilter(type, value) {
  switch (type) {
    case "search":
      CatalogState.filters.search = ""
      const searchInput = document.getElementById("searchInput")
      if (searchInput) {
        searchInput.value = ""
        document.getElementById("searchClear").style.display = "none"
      }
      break
    case "category":
      CatalogState.filters.category = "all"
      document.querySelectorAll(".filter-pill").forEach((filter) => {
        filter.classList.remove("active")
        if (filter.dataset.category === "all") {
          filter.classList.add("active")
        }
      })
      break
    case "price":
      CatalogState.filters.price = "all"
      document.querySelectorAll(".price-option").forEach((option) => {
        option.classList.remove("active")
        if (option.dataset.price === "all") {
          option.classList.add("active")
        }
      })
      break
    case "rating":
      CatalogState.filters.rating = 0
      document.querySelectorAll(".rating-option").forEach((option) => {
        option.classList.remove("active")
        if (option.dataset.rating === "0") {
          option.classList.add("active")
        }
      })
      break
  }

  CatalogState.currentPage = 1
  applyFiltersAndSearch()
  updateURL()
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
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

function toggleVoiceCommand() {
  if (window.SaaSHub && window.SaaSHub.toggleVoiceCommand) {
    window.SaaSHub.toggleVoiceCommand()
  }
}

// ===== EXPORT FOR GLOBAL ACCESS =====
window.CatalogPageModule = {
  CatalogState,
  clearAllFilters,
  applyFilters,
  removeFilter,
  goToPage,
  openSaasDetail,
  toggleFavorite,
  toggleFavoritesView,
}

console.log("📚 Catalog Page Module Loaded")
