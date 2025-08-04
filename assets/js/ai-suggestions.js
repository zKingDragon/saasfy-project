/**
 * SaaSHub - AI Suggestions Module
 * Intelligent recommendations and behavioral analysis
 */

// ===== AI SUGGESTION ENGINE =====
class AISuggestionEngine {
  constructor() {
    this.userBehavior = {
      searches: [],
      clicks: [],
      timeSpent: {},
      preferences: {},
      categories: {},
    }

    this.suggestions = []
    this.isLearning = true
    this.confidenceThreshold = 0.6

    this.init()
  }

  init() {
    this.loadUserBehavior()
    this.setupBehaviorTracking()
    this.startAnalysis()

    console.log("🧠 AI Suggestion Engine initialized")
  }

  // ===== BEHAVIOR TRACKING =====
  setupBehaviorTracking() {
    // Track search queries
    this.trackSearchBehavior()

    // Track clicks and interactions
    this.trackClickBehavior()

    // Track time spent on sections
    this.trackTimeSpent()

    // Track scroll patterns
    this.trackScrollBehavior()
  }

  trackSearchBehavior() {
    const searchInput = document.getElementById("searchInput")
    if (searchInput) {
      let searchTimeout

      searchInput.addEventListener("input", (event) => {
        clearTimeout(searchTimeout)

        searchTimeout = setTimeout(() => {
          const query = event.target.value.trim().toLowerCase()
          if (query.length > 2) {
            this.recordSearch(query)
            this.generateSearchSuggestions(query)
          }
        }, 500)
      })
    }
  }

  trackClickBehavior() {
    // Track SaaS card clicks
    document.addEventListener("click", (event) => {
      const saasCard = event.target.closest(".saas-card")
      if (saasCard) {
        const saasId = this.extractSaasId(saasCard)
        if (saasId) {
          this.recordClick("saas", saasId)
        }
      }

      // Track category filter clicks
      const filterPill = event.target.closest(".filter-pill")
      if (filterPill) {
        const category = filterPill.dataset.category
        if (category) {
          this.recordClick("category", category)
        }
      }

      // Track navigation clicks
      const navLink = event.target.closest(".nav-link")
      if (navLink) {
        const section = navLink.dataset.section
        if (section) {
          this.recordClick("navigation", section)
        }
      }
    })
  }

  trackTimeSpent() {
    const sections = document.querySelectorAll("section[id]")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id

          if (entry.isIntersecting) {
            this.startTimer(sectionId)
          } else {
            this.stopTimer(sectionId)
          }
        })
      },
      { threshold: 0.5 },
    )

    sections.forEach((section) => observer.observe(section))
  }

  trackScrollBehavior() {
    let scrollTimeout
    let lastScrollY = window.scrollY

    window.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout)

      const currentScrollY = window.scrollY
      const scrollDirection = currentScrollY > lastScrollY ? "down" : "up"
      const scrollSpeed = Math.abs(currentScrollY - lastScrollY)

      scrollTimeout = setTimeout(() => {
        this.recordScrollBehavior({
          direction: scrollDirection,
          speed: scrollSpeed,
          position: currentScrollY,
          timestamp: Date.now(),
        })
      }, 100)

      lastScrollY = currentScrollY
    })
  }

  // ===== DATA RECORDING =====
  recordSearch(query) {
    const searchRecord = {
      query,
      timestamp: Date.now(),
      context: this.getCurrentContext(),
    }

    this.userBehavior.searches.push(searchRecord)
    this.analyzeSearchPatterns()
    this.saveUserBehavior()
  }

  recordClick(type, target) {
    const clickRecord = {
      type,
      target,
      timestamp: Date.now(),
      context: this.getCurrentContext(),
    }

    this.userBehavior.clicks.push(clickRecord)
    this.analyzeClickPatterns()
    this.saveUserBehavior()
  }

  recordScrollBehavior(data) {
    if (!this.userBehavior.scrollPatterns) {
      this.userBehavior.scrollPatterns = []
    }

    this.userBehavior.scrollPatterns.push(data)

    // Keep only recent scroll data (last 100 entries)
    if (this.userBehavior.scrollPatterns.length > 100) {
      this.userBehavior.scrollPatterns = this.userBehavior.scrollPatterns.slice(-100)
    }
  }

  startTimer(sectionId) {
    if (!this.userBehavior.timeSpent[sectionId]) {
      this.userBehavior.timeSpent[sectionId] = 0
    }

    this.timers = this.timers || {}
    this.timers[sectionId] = Date.now()
  }

  stopTimer(sectionId) {
    if (this.timers && this.timers[sectionId]) {
      const timeSpent = Date.now() - this.timers[sectionId]
      this.userBehavior.timeSpent[sectionId] += timeSpent
      delete this.timers[sectionId]
      this.saveUserBehavior()
    }
  }

  getCurrentContext() {
    return {
      section: window.SaaSHub?.AppState?.currentSection || "unknown",
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    }
  }

  // ===== PATTERN ANALYSIS =====
  analyzeSearchPatterns() {
    const recentSearches = this.userBehavior.searches.slice(-10)
    const searchTerms = recentSearches.map((s) => s.query)

    // Find common terms
    const termFrequency = {}
    searchTerms.forEach((term) => {
      const words = term.split(" ")
      words.forEach((word) => {
        if (word.length > 2) {
          termFrequency[word] = (termFrequency[word] || 0) + 1
        }
      })
    })

    // Update preferences based on search patterns
    Object.entries(termFrequency).forEach(([term, frequency]) => {
      if (frequency > 1) {
        this.userBehavior.preferences[term] = (this.userBehavior.preferences[term] || 0) + frequency
      }
    })
  }

  analyzeClickPatterns() {
    const recentClicks = this.userBehavior.clicks.slice(-20)

    // Analyze category preferences
    const categoryClicks = recentClicks.filter((click) => click.type === "category")
    categoryClicks.forEach((click) => {
      this.userBehavior.categories[click.target] = (this.userBehavior.categories[click.target] || 0) + 1
    })

    // Analyze SaaS preferences
    const saasClicks = recentClicks.filter((click) => click.type === "saas")
    const saasPreferences = {}

    saasClicks.forEach((click) => {
      const saas = this.getSaasById(click.target)
      if (saas) {
        saas.tags?.forEach((tag) => {
          saasPreferences[tag] = (saasPreferences[tag] || 0) + 1
        })
      }
    })

    // Merge with existing preferences
    Object.entries(saasPreferences).forEach(([tag, count]) => {
      this.userBehavior.preferences[tag] = (this.userBehavior.preferences[tag] || 0) + count
    })
  }

  // ===== SUGGESTION GENERATION =====
  generateSuggestions() {
    const suggestions = []

    // Category-based suggestions
    suggestions.push(...this.generateCategorySuggestions())

    // Search-based suggestions
    suggestions.push(...this.generateSearchSuggestions())

    // Behavioral suggestions
    suggestions.push(...this.generateBehavioralSuggestions())

    // Time-based suggestions
    suggestions.push(...this.generateTimeBasedSuggestions())

    // Sort by confidence and relevance
    this.suggestions = suggestions
      .filter((s) => s.confidence >= this.confidenceThreshold)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 10)

    return this.suggestions
  }

  generateCategorySuggestions() {
    const suggestions = []
    const topCategories = Object.entries(this.userBehavior.categories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)

    topCategories.forEach(([category, count]) => {
      const categoryName = this.getCategoryName(category)
      suggestions.push({
        type: "category",
        title: `Mais SaaS de ${categoryName}`,
        description: `Baseado no seu interesse em ${categoryName.toLowerCase()}`,
        action: () => this.applyCategoryFilter(category),
        confidence: Math.min(0.9, count / 10),
        category: category,
      })
    })

    return suggestions
  }

  generateSearchSuggestions(currentQuery = "") {
    const suggestions = []
    const searchHistory = this.userBehavior.searches.slice(-10)

    if (currentQuery.length > 2) {
      // Find similar past searches
      const similarSearches = searchHistory.filter(
        (search) => search.query.includes(currentQuery) || currentQuery.includes(search.query),
      )

      similarSearches.forEach((search) => {
        if (search.query !== currentQuery) {
          suggestions.push({
            type: "search",
            title: search.query,
            description: "Busca anterior similar",
            action: () => this.performSearch(search.query),
            confidence: 0.7,
          })
        }
      })
    }

    // Popular search terms based on preferences
    const topPreferences = Object.entries(this.userBehavior.preferences)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)

    topPreferences.forEach(([term, frequency]) => {
      if (!currentQuery || term.includes(currentQuery.toLowerCase())) {
        suggestions.push({
          type: "search",
          title: term,
          description: "Baseado nos seus interesses",
          action: () => this.performSearch(term),
          confidence: Math.min(0.8, frequency / 20),
        })
      }
    })

    return suggestions
  }

  generateBehavioralSuggestions() {
    const suggestions = []

    // Suggest based on time spent in sections
    const mostVisitedSection = Object.entries(this.userBehavior.timeSpent).sort(([, a], [, b]) => b - a)[0]

    if (mostVisitedSection && mostVisitedSection[1] > 30000) {
      // 30 seconds
      const [section, time] = mostVisitedSection

      if (section === "catalog") {
        suggestions.push({
          type: "behavioral",
          title: "Explorar mais SaaS",
          description: "Você parece interessado em descobrir novas ferramentas",
          action: () => window.SaaSHub.scrollToSection("catalog"),
          confidence: 0.8,
        })
      }
    }

    // Suggest based on scroll patterns
    if (this.userBehavior.scrollPatterns) {
      const fastScrolls = this.userBehavior.scrollPatterns.filter((p) => p.speed > 100)

      if (fastScrolls.length > 5) {
        suggestions.push({
          type: "behavioral",
          title: "Usar busca por voz",
          description: "Navegue mais rapidamente com comandos de voz",
          action: () => window.SaaSHubVoice?.toggle(),
          confidence: 0.6,
        })
      }
    }

    return suggestions
  }

  generateTimeBasedSuggestions() {
    const suggestions = []
    const hour = new Date().getHours()

    // Morning suggestions (6-12)
    if (hour >= 6 && hour < 12) {
      suggestions.push({
        type: "time",
        title: "SaaS de Produtividade",
        description: "Comece o dia com ferramentas que aumentam sua produtividade",
        action: () => this.applyCategoryFilter("productivity"),
        confidence: 0.7,
      })
    }

    // Afternoon suggestions (12-18)
    else if (hour >= 12 && hour < 18) {
      suggestions.push({
        type: "time",
        title: "Ferramentas de Colaboração",
        description: "Hora de trabalhar em equipe",
        action: () => this.performSearch("colaboração"),
        confidence: 0.6,
      })
    }

    // Evening suggestions (18-22)
    else if (hour >= 18 && hour < 22) {
      suggestions.push({
        type: "time",
        title: "SaaS de Design",
        description: "Momento criativo - explore ferramentas de design",
        action: () => this.applyCategoryFilter("design"),
        confidence: 0.6,
      })
    }

    return suggestions
  }

  // ===== SMART SEARCH SUGGESTIONS =====
  generateSmartSearchSuggestions(query) {
    if (!query || query.length < 2) return []

    const suggestions = []
    const lowerQuery = query.toLowerCase()

    // Exact matches from SaaS data
    const saasData = window.SaaSHub?.AppState?.saasData || []
    saasData.forEach((saas) => {
      if (saas.name.toLowerCase().includes(lowerQuery)) {
        suggestions.push({
          type: "saas",
          title: saas.name,
          description: saas.description,
          icon: "🚀",
          action: () => window.SaaSHub.openSaasDetail(saas.id),
          confidence: 0.9,
        })
      }

      // Tag matches
      saas.tags?.forEach((tag) => {
        if (tag.toLowerCase().includes(lowerQuery)) {
          suggestions.push({
            type: "tag",
            title: tag,
            description: `Buscar SaaS relacionados a ${tag}`,
            icon: "🏷️",
            action: () => this.performSearch(tag),
            confidence: 0.7,
          })
        }
      })
    })

    // Category matches
    const categories = {
      produtividade: "productivity",
      design: "design",
      marketing: "marketing",
      desenvolvimento: "development",
    }

    Object.entries(categories).forEach(([portuguese, english]) => {
      if (portuguese.includes(lowerQuery) || english.includes(lowerQuery)) {
        suggestions.push({
          type: "category",
          title: this.getCategoryName(english),
          description: `Ver todos os SaaS de ${portuguese}`,
          icon: this.getCategoryIcon(english),
          action: () => this.applyCategoryFilter(english),
          confidence: 0.8,
        })
      }
    })

    // AI-powered suggestions based on context
    suggestions.push(...this.generateContextualSuggestions(query))

    return suggestions
      .filter((s) => s.confidence >= 0.5)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 8)
  }

  generateContextualSuggestions(query) {
    const suggestions = []
    const context = this.analyzeQueryContext(query)

    // Intent-based suggestions
    if (context.intent === "productivity") {
      suggestions.push({
        type: "intent",
        title: "Ferramentas de Produtividade",
        description: "SaaS para aumentar sua eficiência",
        icon: "⚡",
        action: () => this.applyCategoryFilter("productivity"),
        confidence: 0.7,
      })
    }

    if (context.intent === "collaboration") {
      suggestions.push({
        type: "intent",
        title: "Colaboração em Equipe",
        description: "Ferramentas para trabalho em grupo",
        icon: "👥",
        action: () => this.performSearch("colaboração"),
        confidence: 0.7,
      })
    }

    return suggestions
  }

  analyzeQueryContext(query) {
    const lowerQuery = query.toLowerCase()
    const context = { intent: null, entities: [] }

    // Intent detection
    const intents = {
      productivity: ["produtividade", "eficiência", "organização", "tarefas"],
      collaboration: ["colaboração", "equipe", "time", "grupo"],
      automation: ["automação", "automatizar", "workflow"],
      design: ["design", "criativo", "visual", "arte"],
      development: ["desenvolvimento", "código", "programação", "dev"],
    }

    Object.entries(intents).forEach(([intent, keywords]) => {
      if (keywords.some((keyword) => lowerQuery.includes(keyword))) {
        context.intent = intent
      }
    })

    return context
  }

  // ===== UI INTEGRATION =====
  displaySuggestions(suggestions, container) {
    if (!container || !suggestions.length) return

    container.innerHTML = suggestions
      .map(
        (suggestion) => `
      <div class="suggestion-item" onclick="handleSuggestionClick('${suggestion.type}', ${JSON.stringify(suggestion).replace(/"/g, "&quot;")})">
        <div class="suggestion-icon">${suggestion.icon || "💡"}</div>
        <div class="suggestion-content">
          <div class="suggestion-title">${suggestion.title}</div>
          <div class="suggestion-description">${suggestion.description}</div>
        </div>
        <div class="suggestion-confidence">${Math.round(suggestion.confidence * 100)}%</div>
      </div>
    `,
      )
      .join("")

    container.classList.add("visible")
  }

  // ===== UTILITY METHODS =====
  getSaasById(id) {
    const saasData = window.SaaSHub?.AppState?.saasData || []
    return saasData.find((saas) => saas.id === Number.parseInt(id))
  }

  getCategoryName(category) {
    const names = {
      productivity: "Produtividade",
      design: "Design",
      marketing: "Marketing",
      development: "Desenvolvimento",
    }
    return names[category] || category
  }

  getCategoryIcon(category) {
    const icons = {
      productivity: "⚡",
      design: "🎨",
      marketing: "📈",
      development: "💻",
    }
    return icons[category] || "🚀"
  }

  applyCategoryFilter(category) {
    const filterButton = document.querySelector(`[data-category="${category}"]`)
    if (filterButton) {
      filterButton.click()
    }
  }

  performSearch(query) {
    const searchInput = document.getElementById("searchInput")
    if (searchInput) {
      searchInput.value = query
      searchInput.dispatchEvent(new Event("input"))
      window.SaaSHub.scrollToSection("catalog")
    }
  }

  extractSaasId(element) {
    // Try to extract SaaS ID from onclick attribute or data attribute
    const onclick = element.getAttribute("onclick")
    if (onclick) {
      const match = onclick.match(/openSaasDetail$$(\d+)$$/)
      if (match) return Number.parseInt(match[1])
    }

    return element.dataset.saasId ? Number.parseInt(element.dataset.saasId) : null
  }

  // ===== DATA PERSISTENCE =====
  loadUserBehavior() {
    const stored = localStorage.getItem("saashub_user_behavior")
    if (stored) {
      try {
        this.userBehavior = { ...this.userBehavior, ...JSON.parse(stored) }
      } catch (error) {
        console.error("Error loading user behavior:", error)
      }
    }
  }

  saveUserBehavior() {
    try {
      localStorage.setItem("saashub_user_behavior", JSON.stringify(this.userBehavior))
    } catch (error) {
      console.error("Error saving user behavior:", error)
    }
  }

  clearUserBehavior() {
    this.userBehavior = {
      searches: [],
      clicks: [],
      timeSpent: {},
      preferences: {},
      categories: {},
    }
    localStorage.removeItem("saashub_user_behavior")
  }

  // ===== ANALYTICS =====
  getAnalytics() {
    return {
      totalSearches: this.userBehavior.searches.length,
      totalClicks: this.userBehavior.clicks.length,
      topCategories: Object.entries(this.userBehavior.categories)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5),
      topPreferences: Object.entries(this.userBehavior.preferences)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10),
      totalTimeSpent: Object.values(this.userBehavior.timeSpent).reduce((sum, time) => sum + time, 0),
      averageSessionTime: this.calculateAverageSessionTime(),
    }
  }

  calculateAverageSessionTime() {
    const sessions = this.identifySessions()
    if (sessions.length === 0) return 0

    const totalTime = sessions.reduce((sum, session) => sum + session.duration, 0)
    return totalTime / sessions.length
  }

  identifySessions() {
    // Simple session identification based on time gaps
    const allEvents = [
      ...this.userBehavior.searches.map((s) => ({ ...s, type: "search" })),
      ...this.userBehavior.clicks.map((c) => ({ ...c, type: "click" })),
    ].sort((a, b) => a.timestamp - b.timestamp)

    const sessions = []
    let currentSession = null
    const sessionGap = 30 * 60 * 1000 // 30 minutes

    allEvents.forEach((event) => {
      if (!currentSession || event.timestamp - currentSession.lastActivity > sessionGap) {
        currentSession = {
          start: event.timestamp,
          end: event.timestamp,
          lastActivity: event.timestamp,
          events: [event],
          duration: 0,
        }
        sessions.push(currentSession)
      } else {
        currentSession.end = event.timestamp
        currentSession.lastActivity = event.timestamp
        currentSession.events.push(event)
        currentSession.duration = currentSession.end - currentSession.start
      }
    })

    return sessions
  }
}

// ===== GLOBAL SUGGESTION HANDLER =====
function handleSuggestionClick(type, suggestionData) {
  try {
    const suggestion = typeof suggestionData === "string" ? JSON.parse(suggestionData) : suggestionData

    if (suggestion.action && typeof suggestion.action === "function") {
      suggestion.action()
    }

    // Hide suggestions
    const suggestionsContainer = document.getElementById("searchSuggestions")
    if (suggestionsContainer) {
      suggestionsContainer.classList.remove("visible")
    }

    // Track suggestion usage
    if (window.aiEngine) {
      window.aiEngine.recordClick("suggestion", suggestion.title)
    }
  } catch (error) {
    console.error("Error handling suggestion click:", error)
  }
}

// ===== INITIALIZE AI ENGINE =====
let aiEngine

document.addEventListener("DOMContentLoaded", () => {
  // Initialize AI suggestion engine
  aiEngine = new AISuggestionEngine()

  // Setup search suggestions
  const searchInput = document.getElementById("searchInput")
  const suggestionsContainer = document.getElementById("searchSuggestions")

  if (searchInput && suggestionsContainer) {
    let suggestionTimeout

    searchInput.addEventListener("input", (event) => {
      clearTimeout(suggestionTimeout)

      suggestionTimeout = setTimeout(() => {
        const query = event.target.value.trim()
        if (query.length > 1) {
          const suggestions = aiEngine.generateSmartSearchSuggestions(query)
          aiEngine.displaySuggestions(suggestions, suggestionsContainer)
        } else {
          suggestionsContainer.classList.remove("visible")
        }
      }, 300)
    })
  }

  // Generate and display general suggestions periodically
  setInterval(() => {
    if (aiEngine.isLearning) {
      const suggestions = aiEngine.generateSuggestions()
      console.log("Generated suggestions:", suggestions)
    }
  }, 60000) // Every minute
})

// ===== EXPORT FOR GLOBAL ACCESS =====
window.SaaSHubAI = {
  AISuggestionEngine,
  aiEngine,
  handleSuggestionClick,
}

console.log("🤖 SaaSHub AI Suggestions Module Loaded")
