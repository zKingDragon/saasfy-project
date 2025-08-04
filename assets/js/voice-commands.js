/**
 * SaaSHub - Voice Commands Module
 * Advanced voice recognition and natural language processing
 */

// Import gsap for animations
import gsap from "gsap"

// ===== VOICE COMMAND CONTROLLER =====
class VoiceCommandController {
  constructor() {
    this.recognition = null
    this.isListening = false
    this.isSupported = false
    this.commands = new Map()
    this.confidence = 0.7
    this.language = "pt-BR"
    this.init()
  }

  init() {
    // Check for speech recognition support
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      this.isSupported = true
      this.setupRecognition()
      this.registerCommands()
      console.log("🎤 Voice Commands initialized")
    } else {
      console.warn("Speech recognition not supported")
    }
  }

  setupRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    this.recognition = new SpeechRecognition()

    this.recognition.continuous = false
    this.recognition.interimResults = false
    this.recognition.lang = this.language
    this.recognition.maxAlternatives = 3

    this.recognition.onstart = () => {
      this.isListening = true
      this.showVoiceIndicator()
      this.updateVoiceButton(true)
    }

    this.recognition.onend = () => {
      this.isListening = false
      this.hideVoiceIndicator()
      this.updateVoiceButton(false)
    }

    this.recognition.onresult = (event) => {
      const results = Array.from(event.results[0])
      const bestResult = results.reduce((best, current) => (current.confidence > best.confidence ? current : best))

      if (bestResult.confidence >= this.confidence) {
        this.processCommand(bestResult.transcript.toLowerCase().trim())
      } else {
        this.showFeedback("Comando não compreendido", "warning")
      }
    }

    this.recognition.onerror = (event) => {
      console.error("Voice recognition error:", event.error)
      this.handleError(event.error)
    }
  }

  registerCommands() {
    // Navigation commands
    this.addCommand(["início", "home", "voltar ao início"], () => {
      window.SaaSHub.scrollToSection("home")
      this.showFeedback("Navegando para o início")
    })

    this.addCommand(["catálogo", "catalog", "mostrar saas", "ver saas"], () => {
      window.SaaSHub.scrollToSection("catalog")
      this.showFeedback("Abrindo catálogo")
    })

    this.addCommand(["sobre", "about", "informações"], () => {
      window.SaaSHub.scrollToSection("about")
      this.showFeedback("Mostrando informações")
    })

    // Search commands
    this.addCommand(["buscar", "procurar", "pesquisar"], (transcript) => {
      const searchTerm = this.extractSearchTerm(transcript)
      if (searchTerm) {
        this.performSearch(searchTerm)
      } else {
        this.focusSearch()
      }
    })

    // Filter commands
    this.addCommand(["filtrar por", "mostrar categoria", "categoria"], (transcript) => {
      const category = this.extractCategory(transcript)
      if (category) {
        this.applyFilter(category)
      }
    })

    // Authentication commands
    this.addCommand(["login", "entrar", "fazer login"], () => {
      window.SaaSHub.navigateToLogin()
      this.showFeedback("Abrindo página de login")
    })

    this.addCommand(["cadastrar", "registrar", "criar conta"], () => {
      window.SaaSHub.navigateToRegister()
      this.showFeedback("Abrindo cadastro")
    })

    this.addCommand(["dashboard", "painel"], () => {
      window.SaaSHub.navigateToDashboard()
      this.showFeedback("Abrindo dashboard")
    })

    // Utility commands
    this.addCommand(["voltar ao topo", "subir", "topo"], () => {
      window.SaaSHub.scrollToTop()
      this.showFeedback("Voltando ao topo")
    })

    this.addCommand(["limpar filtros", "resetar filtros", "mostrar todos"], () => {
      window.SaaSHub.clearFilters()
      this.showFeedback("Filtros limpos")
    })

    this.addCommand(["tema escuro", "modo escuro"], () => {
      this.toggleTheme("dark")
    })

    this.addCommand(["tema claro", "modo claro"], () => {
      this.toggleTheme("light")
    })

    // Help command
    this.addCommand(["ajuda", "help", "comandos"], () => {
      this.showHelp()
    })

    // Fun commands
    this.addCommand(["surpresa", "aleatório", "sortear"], () => {
      this.randomAction()
    })
  }

  addCommand(triggers, action) {
    triggers.forEach((trigger) => {
      this.commands.set(trigger, action)
    })
  }

  processCommand(transcript) {
    console.log("Processing command:", transcript)

    let commandFound = false

    // Check for exact matches first
    for (const [trigger, action] of this.commands) {
      if (transcript.includes(trigger)) {
        action(transcript)
        commandFound = true
        break
      }
    }

    // If no exact match, try fuzzy matching
    if (!commandFound) {
      const bestMatch = this.findBestMatch(transcript)
      if (bestMatch) {
        bestMatch.action(transcript)
        commandFound = true
      }
    }

    if (!commandFound) {
      this.showFeedback('Comando não reconhecido. Diga "ajuda" para ver os comandos disponíveis.', "warning")
    }
  }

  findBestMatch(transcript) {
    let bestMatch = null
    let bestScore = 0

    for (const [trigger, action] of this.commands) {
      const score = this.calculateSimilarity(transcript, trigger)
      if (score > bestScore && score > 0.6) {
        bestScore = score
        bestMatch = { trigger, action }
      }
    }

    return bestMatch
  }

  calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1

    if (longer.length === 0) return 1.0

    const distance = this.levenshteinDistance(longer, shorter)
    return (longer.length - distance) / longer.length
  }

  levenshteinDistance(str1, str2) {
    const matrix = []

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        }
      }
    }

    return matrix[str2.length][str1.length]
  }

  // ===== COMMAND IMPLEMENTATIONS =====
  extractSearchTerm(transcript) {
    const searchPhrases = ["buscar por", "procurar por", "pesquisar por", "buscar", "procurar"]

    for (const phrase of searchPhrases) {
      const index = transcript.indexOf(phrase)
      if (index !== -1) {
        return transcript.substring(index + phrase.length).trim()
      }
    }

    return null
  }

  extractCategory(transcript) {
    const categories = {
      produtividade: "productivity",
      design: "design",
      marketing: "marketing",
      desenvolvimento: "development",
    }

    for (const [portuguese, english] of Object.entries(categories)) {
      if (transcript.includes(portuguese)) {
        return english
      }
    }

    return null
  }

  performSearch(searchTerm) {
    const searchInput = document.getElementById("searchInput")
    if (searchInput) {
      searchInput.value = searchTerm
      searchInput.dispatchEvent(new Event("input"))
      window.SaaSHub.scrollToSection("catalog")
      this.showFeedback(`Buscando por "${searchTerm}"`)
    }
  }

  focusSearch() {
    const searchInput = document.getElementById("searchInput")
    if (searchInput) {
      window.SaaSHub.scrollToSection("catalog")
      setTimeout(() => {
        searchInput.focus()
        this.showFeedback("Campo de busca ativado")
      }, 500)
    }
  }

  applyFilter(category) {
    const filterButton = document.querySelector(`[data-category="${category}"]`)
    if (filterButton) {
      filterButton.click()
      this.showFeedback(`Filtrando por ${this.getCategoryName(category)}`)
    }
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

  toggleTheme(theme) {
    const themeToggle = document.getElementById("themeToggle")
    if (themeToggle) {
      themeToggle.click()
      this.showFeedback(`Tema ${theme === "dark" ? "escuro" : "claro"} ativado`)
    }
  }

  randomAction() {
    const actions = [
      () => {
        window.SaaSHub.scrollToSection("catalog")
        this.showFeedback("Mostrando catálogo aleatoriamente!")
      },
      () => {
        const categories = ["productivity", "design", "marketing", "development"]
        const randomCategory = categories[Math.floor(Math.random() * categories.length)]
        this.applyFilter(randomCategory)
      },
      () => {
        window.SaaSHub.scrollToSection("about")
        this.showFeedback("Descobrindo mais sobre o SaaSHub!")
      },
    ]

    const randomAction = actions[Math.floor(Math.random() * actions.length)]
    randomAction()
  }

  showHelp() {
    const helpCommands = [
      'Navegação: "início", "catálogo", "sobre"',
      'Busca: "buscar [termo]", "procurar [termo]"',
      'Filtros: "filtrar por [categoria]", "limpar filtros"',
      'Conta: "login", "cadastrar", "dashboard"',
      'Utilidades: "voltar ao topo", "tema escuro/claro"',
    ]

    const helpText = "Comandos disponíveis:\n" + helpCommands.join("\n")
    this.showFeedback(helpText, "info", 8000)
  }

  // ===== UI METHODS =====
  showVoiceIndicator() {
    const indicator = document.getElementById("voiceIndicator")
    if (indicator) {
      indicator.classList.remove("hidden")

      // Animate pulse
      if (window.SaaSHubAnimations?.animationController) {
        const pulse = indicator.querySelector(".voice-pulse")
        if (pulse) {
          gsap.to(pulse, {
            scale: 1.5,
            opacity: 0.5,
            duration: 0.8,
            yoyo: true,
            repeat: -1,
            ease: "power2.inOut",
          })
        }
      }
    }
  }

  hideVoiceIndicator() {
    const indicator = document.getElementById("voiceIndicator")
    if (indicator) {
      indicator.classList.add("hidden")

      // Stop animation
      const pulse = indicator.querySelector(".voice-pulse")
      if (pulse) {
        gsap.killTweensOf(pulse)
        gsap.set(pulse, { scale: 1, opacity: 1 })
      }
    }
  }

  updateVoiceButton(isActive) {
    const voiceBtn = document.getElementById("voiceBtn")
    if (voiceBtn) {
      if (isActive) {
        voiceBtn.classList.add("active")
        voiceBtn.style.background = "var(--accent-cyan)"
        voiceBtn.style.boxShadow = "0 0 20px var(--accent-glow)"
      } else {
        voiceBtn.classList.remove("active")
        voiceBtn.style.background = ""
        voiceBtn.style.boxShadow = ""
      }
    }
  }

  showFeedback(message, type = "success", duration = 3000) {
    if (window.SaaSHub?.showNotification) {
      window.SaaSHub.showNotification(message, type, duration)
    } else {
      console.log("Voice feedback:", message)
    }
  }

  handleError(error) {
    const errorMessages = {
      "no-speech": "Nenhuma fala detectada. Tente novamente.",
      "audio-capture": "Erro no microfone. Verifique as permissões.",
      "not-allowed": "Permissão de microfone negada.",
      network: "Erro de conexão. Verifique sua internet.",
      "service-not-allowed": "Serviço de reconhecimento não disponível.",
    }

    const message = errorMessages[error] || "Erro no reconhecimento de voz"
    this.showFeedback(message, "error")
  }

  // ===== PUBLIC METHODS =====
  startListening() {
    if (!this.isSupported) {
      this.showFeedback("Reconhecimento de voz não suportado", "error")
      return
    }

    if (this.isListening) {
      this.stopListening()
      return
    }

    try {
      this.recognition.start()
    } catch (error) {
      console.error("Error starting voice recognition:", error)
      this.showFeedback("Erro ao iniciar reconhecimento de voz", "error")
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
    }
  }

  toggle() {
    if (this.isListening) {
      this.stopListening()
    } else {
      this.startListening()
    }
  }

  setLanguage(language) {
    this.language = language
    if (this.recognition) {
      this.recognition.lang = language
    }
  }

  setConfidence(confidence) {
    this.confidence = Math.max(0, Math.min(1, confidence))
  }

  // ===== CLEANUP =====
  destroy() {
    if (this.recognition) {
      this.recognition.stop()
      this.recognition = null
    }
    this.commands.clear()
    console.log("🎤 Voice Commands destroyed")
  }
}

// ===== SPEECH SYNTHESIS (TEXT-TO-SPEECH) =====
class SpeechSynthesisController {
  constructor() {
    this.synth = window.speechSynthesis
    this.voice = null
    this.isSupported = "speechSynthesis" in window
    this.init()
  }

  init() {
    if (!this.isSupported) {
      console.warn("Speech synthesis not supported")
      return
    }

    // Wait for voices to load
    if (this.synth.getVoices().length === 0) {
      this.synth.addEventListener("voiceschanged", () => {
        this.setupVoice()
      })
    } else {
      this.setupVoice()
    }

    console.log("🔊 Speech Synthesis initialized")
  }

  setupVoice() {
    const voices = this.synth.getVoices()

    // Prefer Portuguese voices
    this.voice =
      voices.find((voice) => voice.lang.startsWith("pt") && voice.localService) ||
      voices.find((voice) => voice.lang.startsWith("pt")) ||
      voices[0]
  }

  speak(text, options = {}) {
    if (!this.isSupported || !text) return

    // Cancel any ongoing speech
    this.synth.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    utterance.voice = this.voice
    utterance.rate = options.rate || 1
    utterance.pitch = options.pitch || 1
    utterance.volume = options.volume || 0.8

    utterance.onstart = () => {
      console.log("Speech started:", text)
    }

    utterance.onend = () => {
      console.log("Speech ended")
      if (options.onEnd) options.onEnd()
    }

    utterance.onerror = (event) => {
      console.error("Speech error:", event.error)
      if (options.onError) options.onError(event.error)
    }

    this.synth.speak(utterance)
  }

  stop() {
    if (this.synth) {
      this.synth.cancel()
    }
  }

  pause() {
    if (this.synth) {
      this.synth.pause()
    }
  }

  resume() {
    if (this.synth) {
      this.synth.resume()
    }
  }
}

// ===== INITIALIZE VOICE COMMANDS =====
let voiceController
let speechController

document.addEventListener("DOMContentLoaded", () => {
  // Initialize voice command controller
  voiceController = new VoiceCommandController()

  // Initialize speech synthesis
  speechController = new SpeechSynthesisController()

  // Setup voice button
  const voiceBtn = document.getElementById("voiceBtn")
  if (voiceBtn) {
    voiceBtn.addEventListener("click", () => {
      voiceController.toggle()
    })
  }

  // Setup keyboard shortcut (Alt + V)
  document.addEventListener("keydown", (event) => {
    if (event.altKey && event.key.toLowerCase() === "v") {
      event.preventDefault()
      voiceController.toggle()
    }
  })
})

// ===== EXPORT FOR GLOBAL ACCESS =====
window.SaaSHubVoice = {
  VoiceCommandController,
  SpeechSynthesisController,
  voiceController,
  speechController,

  // Convenience methods
  startListening: () => voiceController?.startListening(),
  stopListening: () => voiceController?.stopListening(),
  speak: (text, options) => speechController?.speak(text, options),
  toggle: () => voiceController?.toggle(),
}

console.log("🎙️ SaaSHub Voice Commands Module Loaded")
