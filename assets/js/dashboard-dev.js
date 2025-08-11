// Developer Dashboard JavaScript
let editingSaasId = null
let deletingSaasId = null

const SaaSFY = window.SaaSFY // Use global SaaSFY exported by main.js

document.addEventListener("DOMContentLoaded", () => {
  initializeDeveloperDashboard()
})

function initializeDeveloperDashboard() {
  // Check if user is logged in as developer
  const currentUser = SaaSFY.getCurrentUser()
  if (!currentUser || currentUser.type !== "developer") {
    window.location.href = "login.html"
    return
  }

  // Update user info
  updateUserInfo()

  // Load dashboard data
  loadDashboardStats()
  loadMySaas()

  // Initialize search
  initializeSearch()
}

function updateUserInfo() {
  const currentUser = SaaSFY.getCurrentUser()
  const userName = document.getElementById("userName")

  if (userName) {
    userName.textContent = currentUser.name
  }
}

function loadDashboardStats() {
  const currentUser = SaaSFY.getCurrentUser()
  const allSaas = SaaSFY.getAllSaas()
  const mySaas = allSaas.filter((saas) => saas.developer === currentUser.email)

  // Calculate stats
  const totalSaas = mySaas.length
  const totalViews = mySaas.reduce((sum, saas) => sum + (saas.views || 0), 0)
  const totalRatings = mySaas.reduce((sum, saas) => sum + saas.ratings.length, 0)
  const averageRating =
    totalRatings > 0 ? mySaas.reduce((sum, saas) => sum + saas.rating * saas.ratings.length, 0) / totalRatings : 0

  // Update UI
  const totalSaasEl = document.getElementById("totalSaas")
  const totalViewsEl = document.getElementById("totalViews")
  const averageRatingEl = document.getElementById("averageRating")

  if (totalSaasEl) totalSaasEl.textContent = totalSaas
  if (totalViewsEl) totalViewsEl.textContent = totalViews
  if (averageRatingEl) averageRatingEl.textContent = SaaSFY.formatRating(averageRating)
}

function loadMySaas() {
  const currentUser = SaaSFY.getCurrentUser()
  const allSaas = SaaSFY.getAllSaas()
  const mySaas = allSaas.filter((saas) => saas.developer === currentUser.email)

  const mySaasTable = document.getElementById("mySaasTable")
  const emptySaas = document.getElementById("emptySaas")

  if (mySaas.length === 0) {
    mySaasTable.innerHTML = ""
    emptySaas.style.display = "block"
    return
  }

  renderSaasTable(mySaas)
  emptySaas.style.display = "none"
}

function renderSaasTable(saasArray) {
  const mySaasTable = document.getElementById("mySaasTable")

  mySaasTable.innerHTML = `
        <div class="table-header">
            <div>SaaS</div>
            <div>Categoria</div>
            <div>Plano</div>
            <div>Avaliação</div>
            <div>Ações</div>
        </div>
        ${saasArray
          .map(
            (saas) => `
            <div class="table-row">
                <div class="saas-info">
                    <div class="saas-icon">
                        <i class="${saas.icon || SaaSFY.getCategoryIcon(saas.category)}"></i>
                    </div>
                    <div>
                        <div class="saas-name">${saas.name}</div>
                        <div class="saas-url">${saas.url}</div>
                    </div>
                </div>
                <div>
                    <span class="category-badge">${SaaSFY.getCategoryName(saas.category)}</span>
                </div>
                <div>
                    <span class="status-badge ${saas.plan === "pro" ? "status-active" : "status-inactive"}">
                        ${saas.plan === "pro" ? "Pro" : "Grátis"}
                    </span>
                </div>
                <div>
                    <div class="stars">
                        ${SaaSFY.generateStars(saas.rating)}
                    </div>
                    <small>${SaaSFY.formatRating(saas.rating)} (${saas.ratings.length})</small>
                </div>
                <div class="table-actions">
                    <button class="action-btn" onclick="editSaas(${saas.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="openDeleteModal(${saas.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                    <a href="saas.html?id=${saas.id}" class="action-btn" title="Visualizar">
                        <i class="fas fa-eye"></i>
                    </a>
                </div>
            </div>
        `,
          )
          .join("")}
    `
}

function initializeSearch() {
  const searchInput = document.getElementById("searchMySaas")

  if (searchInput) {
    searchInput.addEventListener(
      "input",
      debounce(() => {
        const searchTerm = searchInput.value
        const currentUser = SaaSFY.getCurrentUser()
        const allSaas = SaaSFY.getAllSaas()
        const mySaas = allSaas.filter((saas) => saas.developer === currentUser.email)
        const filteredSaas = SaaSFY.filterSaas(mySaas, searchTerm, "all")

        renderSaasTable(filteredSaas)
      }, 300),
    )
  }
}

function openAddSaasModal() {
  editingSaasId = null
  const modal = document.getElementById("saasModal")
  const modalTitle = document.getElementById("modalTitle")
  const form = document.getElementById("saasForm")

  modalTitle.textContent = "Adicionar Novo SaaS"
  form.reset()

  modal.classList.add("active")

  // Initialize form handler
  form.onsubmit = handleSaasSubmit
}

function editSaas(saasId) {
  editingSaasId = saasId
  const saas = SaaSFY.getSaasById(saasId)

  if (!saas) return

  const modal = document.getElementById("saasModal")
  const modalTitle = document.getElementById("modalTitle")
  const form = document.getElementById("saasForm")

  modalTitle.textContent = "Editar SaaS"

  // Fill form with existing data
  document.getElementById("saasName").value = saas.name
  document.getElementById("saasCategory").value = saas.category
  document.getElementById("saasUrl").value = saas.url
  document.getElementById("saasDescription").value = saas.description
  document.getElementById("saasShortDescription").value = saas.shortDescription || ""
  document.getElementById("saasIntegration").value = saas.integration
  document.getElementById("saasPlan").value = saas.plan
  document.getElementById("saasLogo").value = saas.logo || ""
  document.getElementById("saasIcon").value = saas.icon || ""
  document.getElementById("saasImages").value = (saas.images || []).join("\n")

  modal.classList.add("active")

  // Initialize form handler
  form.onsubmit = handleSaasSubmit
}

function closeSaasModal() {
  const modal = document.getElementById("saasModal")
  modal.classList.remove("active")
  editingSaasId = null
}

function handleSaasSubmit(e) {
  e.preventDefault()

  const currentUser = SaaSFY.getCurrentUser()
  const formData = {
    name: document.getElementById("saasName").value,
    category: document.getElementById("saasCategory").value,
    url: document.getElementById("saasUrl").value,
    description: document.getElementById("saasDescription").value,
    shortDescription: document.getElementById("saasShortDescription").value || "",
    integration: document.getElementById("saasIntegration").value,
    plan: document.getElementById("saasPlan").value,
    logo: document.getElementById("saasLogo").value || null,
    icon: document.getElementById("saasIcon").value || null,
    images: (document.getElementById("saasImages").value || "")
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(Boolean),
    developer: currentUser.email,
  }

  if (editingSaasId) {
    // Update existing SaaS
    SaaSFY.updateSaas(editingSaasId, formData)
    SaaSFY.showNotification("SaaS atualizado com sucesso!")
  } else {
    // Add new SaaS
    SaaSFY.addSaas(formData)
    SaaSFY.showNotification("SaaS adicionado com sucesso!")
  }

  // Close modal and refresh data
  closeSaasModal()
  loadDashboardStats()
  loadMySaas()
}

function openDeleteModal(saasId) {
  deletingSaasId = saasId
  const modal = document.getElementById("deleteModal")
  modal.classList.add("active")
}

function closeDeleteModal() {
  const modal = document.getElementById("deleteModal")
  modal.classList.remove("active")
  deletingSaasId = null
}

function confirmDelete() {
  if (deletingSaasId) {
    SaaSFY.deleteSaas(deletingSaasId)
    SaaSFY.showNotification("SaaS excluído com sucesso!")

    closeDeleteModal()
    loadDashboardStats()
    loadMySaas()
  }
}

// Utility function for debouncing search
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
