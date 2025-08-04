/**
 * Authentication Functions for Firebase
 */

import { firebaseService } from './firebase-config.js'

// ===== LOGIN FUNCTIONS =====
export async function handleLogin(email, password) {
  try {
    showLoadingSpinner(true)
    
    const result = await firebaseService.login(email, password)
    
    if (result.success) {
      showNotification("Login realizado com sucesso!", "success")
      
      // Redirect based on user type
      setTimeout(() => {
        window.location.href = "index.html"
      }, 1000)
      
      return true
    } else {
      showNotification(getErrorMessage(result.error), "error")
      return false
    }
  } catch (error) {
    console.error("Login error:", error)
    showNotification("Erro interno do servidor", "error")
    return false
  } finally {
    showLoadingSpinner(false)
  }
}

export async function handleRegister(email, password, displayName, userType = 'user') {
  try {
    showLoadingSpinner(true)
    
    // Validate inputs
    if (!email || !password || !displayName) {
      showNotification("Todos os campos são obrigatórios", "warning")
      return false
    }
    
    if (password.length < 6) {
      showNotification("A senha deve ter pelo menos 6 caracteres", "warning")
      return false
    }
    
    const result = await firebaseService.register(email, password, displayName)
    
    if (result.success) {
      // Update user document with additional info
      await firebaseService.updateUserDocument(result.user.uid, {
        type: userType,
        displayName: displayName
      })
      
      showNotification("Conta criada com sucesso!", "success")
      
      setTimeout(() => {
        window.location.href = "index.html"
      }, 1000)
      
      return true
    } else {
      showNotification(getErrorMessage(result.error), "error")
      return false
    }
  } catch (error) {
    console.error("Registration error:", error)
    showNotification("Erro interno do servidor", "error")
    return false
  } finally {
    showLoadingSpinner(false)
  }
}
    }
    
    .notification-close:hover {
      color: var(--accent-white);
      background: rgba(248, 250, 252, 0.1);
    }
    
    @keyframes errorSlideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @media (max-width: 768px) {
      .notification-container {
        top: var(--space-lg);
        right: var(--space-lg);
        left: var(--space-lg);
        max-width: none;
      }
    }
  `
  document.head.appendChild(style)
})

console.log("🔑 SaaSHub Auth Module Loaded")

/**
 * SaaSHub - Authentication Module
 * Handles login, registration, and user management
 */

// ===== AUTHENTICATION CONTROLLER =====
class AuthController {
  constructor() {
    this.currentUser = null
    this.isLoading = false
    this.validationRules = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      name: /^[a-zA-ZÀ-ÿ\s]{2,50}$/,
    }

    this.init()
  }

  init() {
    this.setupFormHandlers()
    this.setupPasswordStrength()
    this.setupFormValidation()
    this.checkUrlParams()
    this.setupAnimations()

    console.log("🔐 Auth Controller initialized")
  }

  // ===== FORM SETUP =====
  setupFormHandlers() {
    // Login form
    const loginForm = document.getElementById("loginFormElement")
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => this.handleLogin(e))
    }

    // Register form
    const registerForm = document.getElementById("registerFormElement")
    if (registerForm) {
      registerForm.addEventListener("submit", (e) => this.handleRegister(e))
    }

    // Forgot password form
    const forgotForm = document.getElementById("forgotPasswordFormElement")
    if (forgotForm) {
      forgotForm.addEventListener("submit", (e) => this.handleForgotPassword(e))
    }
  }

  setupPasswordStrength() {
    const passwordInput = document.getElementById("registerPassword")
    const strengthIndicator = document.getElementById("passwordStrength")

    if (passwordInput && strengthIndicator) {
      passwordInput.addEventListener("input", (e) => {
        this.updatePasswordStrength(e.target.value, strengthIndicator)
      })
    }
  }

  setupFormValidation() {
    // Real-time validation for all inputs
    const inputs = document.querySelectorAll(".form-input")
    inputs.forEach((input) => {
      input.addEventListener("blur", (e) => this.validateField(e.target))
      input.addEventListener("input", (e) => this.clearFieldError(e.target))
    })

    // Password confirmation validation
    const confirmPassword = document.getElementById("confirmPassword")
    const registerPassword = document.getElementById("registerPassword")

    if (confirmPassword && registerPassword) {
      confirmPassword.addEventListener("input", () => {
        this.validatePasswordMatch(registerPassword.value, confirmPassword.value)
      })
    }
  }

  checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search)
    const mode = urlParams.get("mode")

    if (mode === "register") {
      this.switchToRegister()
    }
  }

  setupAnimations() {
    // Animate form elements on load
    if (typeof window.gsap !== "undefined") {
      gsap = window.gsap // Assign gsap variable
      gsap.fromTo(
        ".auth-card",
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
      )

      gsap.fromTo(
        ".back-home-btn",
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.6, delay: 0.3, ease: "power2.out" },
      )
    }
  }

  // ===== FORM SWITCHING =====
  switchToLogin() {
    this.hideAllForms()
    const loginForm = document.getElementById("loginForm")
    if (loginForm) {
      loginForm.classList.add("active")
      this.animateFormSwitch()
    }
  }

  switchToRegister() {
    this.hideAllForms()
    const registerForm = document.getElementById("registerForm")
    if (registerForm) {
      registerForm.classList.add("active")
      this.animateFormSwitch()
    }
  }

  showForgotPassword() {
    this.hideAllForms()
    const forgotForm = document.getElementById("forgotPasswordForm")
    if (forgotForm) {
      forgotForm.classList.add("active")
      this.animateFormSwitch()
    }
  }

  hideAllForms() {
    const forms = document.querySelectorAll(".auth-form")
    forms.forEach((form) => form.classList.remove("active"))
  }

  animateFormSwitch() {
    if (typeof gsap !== "undefined") {
      gsap.fromTo(".auth-form.active", { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" })
    }
  }

  // ===== VALIDATION =====
  validateField(field) {
    const value = field.value.trim()
    const fieldType = field.type
    const fieldId = field.id

    let isValid = true
    let errorMessage = ""

    // Required field validation
    if (!value) {
      isValid = false
      errorMessage = "Este campo é obrigatório"
    }
    // Email validation
    else if (fieldType === "email" && !this.validationRules.email.test(value)) {
      isValid = false
      errorMessage = "Digite um email válido"
    }
    // Password validation
    else if (fieldType === "password" && fieldId.includes("Password") && !fieldId.includes("confirm")) {
      if (value.length < 8) {
        isValid = false
        errorMessage = "A senha deve ter pelo menos 8 caracteres"
      } else if (!this.validationRules.password.test(value)) {
        isValid = false
        errorMessage = "A senha deve conter maiúscula, minúscula, número e símbolo"
      }
    }
    // Name validation
    else if (fieldId.includes("Name") && !this.validationRules.name.test(value)) {
      isValid = false
      errorMessage = "Digite um nome válido (2-50 caracteres)"
    }

    this.showFieldValidation(field, isValid, errorMessage)
    return isValid
  }

  validatePasswordMatch(password, confirmPassword) {
    const confirmField = document.getElementById("confirmPassword")
    const isMatch = password === confirmPassword

    if (confirmPassword && !isMatch) {
      this.showFieldValidation(confirmField, false, "As senhas não coincidem")
    } else if (confirmPassword && isMatch) {
      this.showFieldValidation(confirmField, true, "")
    }

    return isMatch
  }

  showFieldValidation(field, isValid, message) {
    const wrapper = field.closest(".input-wrapper") || field.closest(".select-wrapper")

    // Remove existing error
    const existingError = wrapper.parentNode.querySelector(".field-error")
    if (existingError) {
      existingError.remove()
    }

    if (!isValid && message) {
      // Add error styling
      field.style.borderColor = "#EF4444"

      // Add error message
      const errorElement = document.createElement("div")
      errorElement.className = "field-error"
      errorElement.textContent = message
      errorElement.style.cssText = `
        color: #EF4444;
        font-size: 0.75rem;
        margin-top: 0.25rem;
        animation: errorSlideIn 0.3s ease-out;
      `

      wrapper.parentNode.appendChild(errorElement)
    } else {
      // Remove error styling
      field.style.borderColor = isValid ? "#10B981" : ""
    }
  }

  clearFieldError(field) {
    field.style.borderColor = ""
    const wrapper = field.closest(".input-wrapper") || field.closest(".select-wrapper")
    const existingError = wrapper.parentNode.querySelector(".field-error")
    if (existingError) {
      existingError.remove()
    }
  }

  updatePasswordStrength(password, indicator) {
    const strengthBar = indicator.querySelector(".strength-fill")
    const strengthText = indicator.querySelector(".strength-text")

    let strength = 0
    let text = "Muito fraca"
    let color = "#EF4444"

    if (password.length >= 8) strength += 20
    if (/[a-z]/.test(password)) strength += 20
    if (/[A-Z]/.test(password)) strength += 20
    if (/\d/.test(password)) strength += 20
    if (/[@$!%*?&]/.test(password)) strength += 20

    if (strength >= 80) {
      text = "Muito forte"
      color = "#10B981"
    } else if (strength >= 60) {
      text = "Forte"
      color = "#F59E0B"
    } else if (strength >= 40) {
      text = "Média"
      color = "#F97316"
    } else if (strength >= 20) {
      text = "Fraca"
      color = "#EF4444"
    }

    strengthBar.style.width = strength + "%"
    strengthBar.style.background = color
    strengthText.textContent = text
    strengthText.style.color = color
  }

  // ===== FORM HANDLERS =====
  async handleLogin(event) {
    event.preventDefault()

    if (this.isLoading) return

    const formData = new FormData(event.target)
    const email = formData.get("email") || document.getElementById("loginEmail").value
    const password = formData.get("password") || document.getElementById("loginPassword").value
    const rememberMe = document.getElementById("rememberMe").checked

    // Validate inputs
    if (!this.validateLoginForm(email, password)) {
      return
    }

    this.setLoading(true)

    try {
      const result = await this.authenticateUser(email, password)

      if (result.success) {
        // Store user data
        this.currentUser = result.user
        this.storeUserSession(result.user, rememberMe)

        // Show success and redirect
        this.showSuccess("Login realizado com sucesso!")
        setTimeout(() => {
          this.redirectToDashboard(result.user.type)
        }, 2000)
      } else {
        this.showNotification(result.message || "Erro ao fazer login", "error")
      }
    } catch (error) {
      console.error("Login error:", error)
      this.showNotification("Erro interno. Tente novamente.", "error")
    } finally {
      this.setLoading(false)
    }
  }

  async handleRegister(event) {
    event.preventDefault()

    if (this.isLoading) return

    const formData = new FormData(event.target)
    const userData = {
      firstName: formData.get("firstName") || document.getElementById("registerFirstName").value,
      lastName: formData.get("lastName") || document.getElementById("registerLastName").value,
      email: formData.get("email") || document.getElementById("registerEmail").value,
      password: formData.get("password") || document.getElementById("registerPassword").value,
      confirmPassword: document.getElementById("confirmPassword").value,
      userType: formData.get("userType") || document.getElementById("userType").value,
      agreeTerms: document.getElementById("agreeTerms").checked,
    }

    // Validate form
    if (!this.validateRegisterForm(userData)) {
      return
    }

    this.setLoading(true)

    try {
      const result = await this.createUser(userData)

      if (result.success) {
        // Store user data
        this.currentUser = result.user
        this.storeUserSession(result.user, false)

        // Show success and redirect
        this.showSuccess("Conta criada com sucesso!")
        setTimeout(() => {
          this.redirectToDashboard(result.user.type)
        }, 2000)
      } else {
        this.showNotification(result.message || "Erro ao criar conta", "error")
      }
    } catch (error) {
      console.error("Register error:", error)
      this.showNotification("Erro interno. Tente novamente.", "error")
    } finally {
      this.setLoading(false)
    }
  }

  async handleForgotPassword(event) {
    event.preventDefault()

    if (this.isLoading) return

    const email = document.getElementById("forgotEmail").value

    if (!this.validationRules.email.test(email)) {
      this.showNotification("Digite um email válido", "error")
      return
    }

    this.setLoading(true)

    try {
      const result = await this.sendPasswordReset(email)

      if (result.success) {
        this.showNotification("Instruções enviadas para seu email!", "success")
        setTimeout(() => {
          this.switchToLogin()
        }, 3000)
      } else {
        this.showNotification(result.message || "Erro ao enviar email", "error")
      }
    } catch (error) {
      console.error("Forgot password error:", error)
      this.showNotification("Erro interno. Tente novamente.", "error")
    } finally {
      this.setLoading(false)
    }
  }

  // ===== FORM VALIDATION =====
  validateLoginForm(email, password) {
    let isValid = true

    if (!email || !this.validationRules.email.test(email)) {
      this.showNotification("Digite um email válido", "error")
      isValid = false
    }

    if (!password || password.length < 6) {
      this.showNotification("Digite uma senha válida", "error")
      isValid = false
    }

    return isValid
  }

  validateRegisterForm(userData) {
    let isValid = true
    const errors = []

    // Name validation
    if (!userData.firstName || !this.validationRules.name.test(userData.firstName)) {
      errors.push("Nome inválido")
      isValid = false
    }

    if (!userData.lastName || !this.validationRules.name.test(userData.lastName)) {
      errors.push("Sobrenome inválido")
      isValid = false
    }

    // Email validation
    if (!userData.email || !this.validationRules.email.test(userData.email)) {
      errors.push("Email inválido")
      isValid = false
    }

    // Password validation
    if (!userData.password || !this.validationRules.password.test(userData.password)) {
      errors.push("Senha deve ter 8+ caracteres, maiúscula, minúscula, número e símbolo")
      isValid = false
    }

    // Password confirmation
    if (userData.password !== userData.confirmPassword) {
      errors.push("Senhas não coincidem")
      isValid = false
    }

    // User type validation
    if (!userData.userType || !["user", "developer"].includes(userData.userType)) {
      errors.push("Selecione o tipo de conta")
      isValid = false
    }

    // Terms agreement
    if (!userData.agreeTerms) {
      errors.push("Você deve concordar com os termos")
      isValid = false
    }

    if (!isValid) {
      this.showNotification(errors[0], "error")
    }

    return isValid
  }

  // ===== AUTHENTICATION LOGIC =====
  async authenticateUser(email, password) {
    // Simulate API call
    await this.delay(1500)

    // Check stored users
    const storedUsers = JSON.parse(localStorage.getItem("saashub_users") || "[]")
    const user = storedUsers.find((u) => u.email === email)

    if (!user) {
      return { success: false, message: "Usuário não encontrado" }
    }

    // Simple password check (in real app, use proper hashing)
    if (user.password !== password) {
      return { success: false, message: "Senha incorreta" }
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user
    return {
      success: true,
      user: {
        ...userWithoutPassword,
        lastLogin: new Date().toISOString(),
      },
    }
  }

  async createUser(userData) {
    // Simulate API call
    await this.delay(2000)

    // Check if user already exists
    const storedUsers = JSON.parse(localStorage.getItem("saashub_users") || "[]")
    const existingUser = storedUsers.find((u) => u.email === userData.email)

    if (existingUser) {
      return { success: false, message: "Email já cadastrado" }
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      password: userData.password, // In real app, hash this
      type: userData.userType,
      avatar: this.generateAvatar(userData.firstName, userData.lastName),
      createdAt: new Date().toISOString(),
      isActive: true,
    }

    // Store user
    storedUsers.push(newUser)
    localStorage.setItem("saashub_users", JSON.stringify(storedUsers))

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser
    return { success: true, user: userWithoutPassword }
  }

  async sendPasswordReset(email) {
    // Simulate API call
    await this.delay(1000)

    // Check if user exists
    const storedUsers = JSON.parse(localStorage.getItem("saashub_users") || "[]")
    const user = storedUsers.find((u) => u.email === email)

    if (!user) {
      return { success: false, message: "Email não encontrado" }
    }

    // In real app, send actual email
    console.log(`Password reset email sent to: ${email}`)

    return { success: true, message: "Email enviado com sucesso" }
  }

  // ===== SOCIAL LOGIN =====
  async loginWithGoogle() {
    this.showNotification("Login com Google em desenvolvimento", "info")

    // Simulate Google OAuth
    setTimeout(() => {
      const mockUser = {
        id: Date.now(),
        name: "Usuário Google",
        email: "user@gmail.com",
        type: "user",
        avatar: "/placeholder.svg?height=40&width=40",
        provider: "google",
      }

      this.currentUser = mockUser
      this.storeUserSession(mockUser, false)
      this.showSuccess("Login com Google realizado!")

      setTimeout(() => {
        this.redirectToDashboard(mockUser.type)
      }, 2000)
    }, 1500)
  }

  async registerWithGoogle() {
    this.loginWithGoogle() // Same flow for demo
  }

  async loginWithGitHub() {
    this.showNotification("Login com GitHub em desenvolvimento", "info")

    // Simulate GitHub OAuth
    setTimeout(() => {
      const mockUser = {
        id: Date.now(),
        name: "Desenvolvedor GitHub",
        email: "dev@github.com",
        type: "developer",
        avatar: "/placeholder.svg?height=40&width=40",
        provider: "github",
      }

      this.currentUser = mockUser
      this.storeUserSession(mockUser, false)
      this.showSuccess("Login com GitHub realizado!")

      setTimeout(() => {
        this.redirectToDashboard(mockUser.type)
      }, 2000)
    }, 1500)
  }

  async registerWithGitHub() {
    this.loginWithGitHub() // Same flow for demo
  }

  // ===== UTILITY METHODS =====
  generateAvatar(firstName, lastName) {
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    return `/placeholder.svg?height=40&width=40&text=${initials}`
  }

  storeUserSession(user, remember) {
    const sessionData = {
      user,
      timestamp: Date.now(),
      remember,
    }

    if (remember) {
      localStorage.setItem("saashub_user", JSON.stringify(sessionData))
    } else {
      sessionStorage.setItem("saashub_user", JSON.stringify(sessionData))
    }
  }

  redirectToDashboard(userType) {
    const dashboardUrl = userType === "developer" ? "dashboard-dev.html" : "dashboard-user.html"

    window.location.href = dashboardUrl
  }

  setLoading(loading) {
    this.isLoading = loading
    const submitButtons = document.querySelectorAll('button[type="submit"]')

    submitButtons.forEach((button) => {
      if (loading) {
        button.disabled = true
        button.style.opacity = "0.7"
        const originalText = button.querySelector("span").textContent
        button.querySelector("span").textContent = "Carregando..."
        button.dataset.originalText = originalText
      } else {
        button.disabled = false
        button.style.opacity = "1"
        if (button.dataset.originalText) {
          button.querySelector("span").textContent = button.dataset.originalText
        }
      }
    })
  }

  showSuccess(message) {
    const authCard = document.querySelector(".auth-card")
    const successMessage = document.getElementById("successMessage")

    if (authCard && successMessage) {
      authCard.style.display = "none"
      successMessage.classList.remove("hidden")
      successMessage.querySelector(".success-text").textContent = message

      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          successMessage,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" },
        )
      }
    }
  }

  showNotification(message, type = "info", duration = 5000) {
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

    // Add styles
    notification.style.cssText = `
      background: var(--glass-bg);
      backdrop-filter: var(--glass-blur);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      margin-bottom: var(--space-md);
      box-shadow: var(--shadow-medium);
      transform: translateX(100%);
      transition: all var(--transition-normal);
      border-left: 4px solid ${type === "success" ? "#10B981" : type === "error" ? "#EF4444" : "#00D4FF"};
    `

    container.appendChild(notification)

    // Trigger entrance animation
    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    // Auto remove
    setTimeout(() => {
      notification.style.transform = "translateX(100%)"
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove()
        }
      }, 300)
    }, duration)
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

// ===== UTILITY FUNCTIONS =====
function togglePassword(inputId) {
  const input = document.getElementById(inputId)
  const toggle = input.parentNode.querySelector(".password-toggle .toggle-icon")

  if (input.type === "password") {
    input.type = "text"
    toggle.textContent = "🙈"
  } else {
    input.type = "password"
    toggle.textContent = "👁️"
  }
}

function switchToLogin() {
  if (window.authController) {
    window.authController.switchToLogin()
  }
}

function switchToRegister() {
  if (window.authController) {
    window.authController.switchToRegister()
  }
}

function showForgotPassword() {
  if (window.authController) {
    window.authController.showForgotPassword()
  }
}

function loginWithGoogle() {
  if (window.authController) {
    window.authController.loginWithGoogle()
  }
}

function loginWithGitHub() {
  if (window.authController) {
    window.authController.loginWithGitHub()
  }
}

function registerWithGoogle() {
  if (window.authController) {
    window.authController.registerWithGoogle()
  }
}

function registerWithGitHub() {
  if (window.authController) {
    window.authController.registerWithGitHub()
  }
}
