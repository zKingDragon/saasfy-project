// Authentication JavaScript
document.addEventListener("DOMContentLoaded", () => {
  initializeAuthPage()
})

function initializeAuthPage() {
  // Check URL parameters
  const urlParams = new URLSearchParams(window.location.search)
  const mode = urlParams.get("mode")
  const type = urlParams.get("type")

  // Switch to register if specified
  if (mode === "register") {
    switchToRegister()

    // Set user type if specified
    if (type === "developer") {
      const developerBtn = document.querySelector('[data-type="developer"]')
      if (developerBtn) {
        developerBtn.click()
      }
    }
  }

  // Initialize form handlers
  initializeLoginForm()
  initializeRegisterForm()
  initializeUserTypeSelector()
}

function initializeLoginForm() {
  const loginForm = document.getElementById("loginFormElement")

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      handleLogin()
    })
  }
}

function initializeRegisterForm() {
  const registerForm = document.getElementById("registerFormElement")

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault()
      handleRegister()
    })
  }
}

function initializeUserTypeSelector() {
  const typeButtons = document.querySelectorAll(".type-btn")
  const developerFields = document.querySelectorAll(".developer-only")

  typeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Update active state
      typeButtons.forEach((btn) => btn.classList.remove("active"))
      this.classList.add("active")

      // Show/hide developer fields
      const isDeveloper = this.dataset.type === "developer"
      developerFields.forEach((field) => {
        field.style.display = isDeveloper ? "block" : "none"
      })

      // Limpa o campo empresa se não for dev
      if (!isDeveloper) {
        developerFields.forEach((field) => {
          const input = field.querySelector('input')
          if (input) input.value = ''
        })
      }
    })
  })
}

function handleLogin() {
  const email = document.getElementById("loginEmail").value
  const password = document.getElementById("loginPassword").value

  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem("users")) || []

  // Find user
  const user = users.find((u) => u.email === email && u.password === password)

  if (user) {
    // Set current user
    window.SaaSFY.setCurrentUser(user)

    // Redirect to home page
    window.location.href = "index.html"
  } else {
    window.SaaSFY.showNotification("Email ou senha incorretos", "error")
  }
}

function handleRegister() {
  const name = document.getElementById("registerName").value
  const email = document.getElementById("registerEmail").value
  const password = document.getElementById("registerPassword").value
  const confirmPassword = document.getElementById("confirmPassword").value
  const userTypeBtn = document.querySelector(".type-btn.active")
  const userType = userTypeBtn ? userTypeBtn.dataset.type : "user"
  let company = null
  if (userType === "developer") {
    const companyInput = document.getElementById("company")
    company = companyInput ? companyInput.value : null
  }

  // Validation
  if (password !== confirmPassword) {
    window.SaaSFY.showNotification("As senhas não coincidem", "error")
    return
  }

  if (password.length < 6) {
    window.SaaSFY.showNotification("A senha deve ter pelo menos 6 caracteres", "error")
    return
  }

  // Check if user already exists
  const users = JSON.parse(localStorage.getItem("users")) || []
  const existingUser = users.find((u) => u.email === email)

  if (existingUser) {
    window.SaaSFY.showNotification("Este email já está cadastrado", "error")
    return
  }

  // Create new user
  const newUser = {
    id: Date.now(),
    name: name,
    email: email,
    password: password,
    type: userType,
    company: company || null,
    createdAt: new Date().toISOString(),
  }

  // Save user
  users.push(newUser)
  localStorage.setItem("users", JSON.stringify(users))

  // Set current user
  window.SaaSFY.setCurrentUser(newUser)

  // Show success message
  window.SaaSFY.showNotification("Conta criada com sucesso!")

  // Redirect to home page
  setTimeout(() => {
    window.location.href = "index.html"
  }, 1500)
}

function switchToLogin() {
  document.getElementById("loginForm").style.display = "block"
  document.getElementById("registerForm").style.display = "none"
}

function switchToRegister() {
  document.getElementById("loginForm").style.display = "none"
  document.getElementById("registerForm").style.display = "block"
}
