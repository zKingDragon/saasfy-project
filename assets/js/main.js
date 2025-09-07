// Main JavaScript file for SaaSFY
// Contains global functions and utilities

// Global variables
let currentUser = null
let allSaas = []

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

// Initialize application
function initializeApp() {
  // Check if user is logged in
  currentUser = getCurrentUser()

  // Initialize sample data if not exists
  initializeSampleData()

  // Run lightweight migrations (ex: atualizar imagens reais do Canva)
  runMigrations()

  // Update UI based on authentication status
  updateAuthUI()

  // Initialize mobile menu
  initializeMobileMenu()

  // Initialize dropdowns
  initializeDropdowns()
}

// Authentication functions
function getCurrentUser() {
  const userData = localStorage.getItem("currentUser")
  return userData ? JSON.parse(userData) : null
}

function setCurrentUser(user) {
  currentUser = user
  localStorage.setItem("currentUser", JSON.stringify(user))
  updateAuthUI()
}

function logout() {
  localStorage.removeItem("currentUser")
  currentUser = null
  window.location.href = "index.html"
}

function updateAuthUI() {
  const authButtons = document.getElementById("authButtons")
  const userMenu = document.getElementById("userMenu")
  const userName = document.getElementById("userName")
  const dashboardLink = document.getElementById("dashboardLink")
  const userGreeting = document.getElementById("userGreeting")
  const userAvatar = document.getElementById("userAvatar")

  if (currentUser) {
    if (authButtons) authButtons.style.display = "none"
    if (userMenu) userMenu.style.display = "block"
    if (userName) userName.textContent = currentUser.name

    // Saudação personalizada
    if (userGreeting) {
      let greet = "Olá, "
      if (currentUser.type === "developer") greet = "Dev "
      userGreeting.textContent = greet
      userGreeting.style.display = "inline"
    }

    // Avatar
    if (userAvatar) {
      if (currentUser.avatar) {
        userAvatar.innerHTML = `<img src="${currentUser.avatar}" alt="avatar" style="width:28px;height:28px;border-radius:50%;margin-right:0.5em;vertical-align:middle;">`
        userAvatar.style.display = "inline"
      } else {
        userAvatar.innerHTML = ""
        userAvatar.style.display = "none"
      }
    }

    // Set dashboard link based on user type
    if (dashboardLink) {
      if (currentUser.type === "developer") {
        dashboardLink.href = "dashboard-dev.html"
      } else {
        dashboardLink.href = "dashboard-usuario.html"
      }
    }
  } else {
    if (authButtons) authButtons.style.display = "flex"
    if (userMenu) userMenu.style.display = "none"
    if (userGreeting) userGreeting.style.display = "none"
    if (userAvatar) userAvatar.style.display = "none"
  }
}

// Initialize sample data with static SaaS
function initializeSampleData() {
  if (!localStorage.getItem("saasData")) {
    const sampleSaas = [
      {
        id: 1,
        name: "Notion",
        shortDescription: "Workspace tudo-em-um para anotações, tarefas e colaboração",
        description:
          "O Notion é uma ferramenta de produtividade que combina anotações, gerenciamento de tarefas, wikis e bancos de dados em um único workspace. Perfeito para equipes que precisam organizar informações e colaborar de forma eficiente.",
        url: "https://notion.so",
        category: "productivity",
        plan: "free",
        // Logo real do Figma
        logo: "assets/img/notion.png",
        // Screenshots reais disponíveis (figma1 a figma3)
        images: [
          "assets/img/figma1.png",
          "assets/img/figma2.png",
            "assets/img/figma3.png",
        ],
        features: [
          {
            icon: "fas fa-edit",
            title: "Editor Rico",
            description: "Editor de texto avançado com blocos personalizáveis",
          },
          {
            icon: "fas fa-database",
            title: "Bancos de Dados",
            description: "Crie e gerencie bancos de dados relacionais",
          },
          {
            icon: "fas fa-users",
            title: "Colaboração",
            description: "Trabalhe em equipe em tempo real",
          },
          {
            icon: "fas fa-mobile-alt",
            title: "Multi-plataforma",
            description: "Acesse de qualquer dispositivo",
          },
        ],
        rating: 4.8,
        views: 1250,
        ratings: [
          { user: "user1", rating: 5, comment: "Ferramenta incrível para organização!", createdAt: "2024-01-15" },
          {
            user: "user2",
            rating: 4,
            comment: "Muito útil, mas tem uma curva de aprendizado.",
            createdAt: "2024-01-10",
          },
        ],
        createdAt: "2024-01-01",
      },
      {
        id: 2,
        name: "Figma",
        shortDescription: "Ferramenta de design colaborativo para interfaces",
        description:
          "Figma é uma ferramenta de design baseada na web que permite criar interfaces, protótipos e sistemas de design de forma colaborativa. Ideal para designers e equipes de produto.",
        url: "https://figma.com",
        category: "design",
        plan: "free",
        logo: "/placeholder.svg?height=80&width=80",
        images: [
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
        ],
        features: [
          {
            icon: "fas fa-vector-square",
            title: "Design Vetorial",
            description: "Ferramentas avançadas de design vetorial",
          },
          {
            icon: "fas fa-play",
            title: "Prototipagem",
            description: "Crie protótipos interativos facilmente",
          },
          {
            icon: "fas fa-comments",
            title: "Comentários",
            description: "Sistema de feedback integrado",
          },
          {
            icon: "fas fa-cloud",
            title: "Na Nuvem",
            description: "Acesso de qualquer lugar, sem instalação",
          },
        ],
        rating: 4.9,
        views: 980,
        ratings: [
          { user: "user1", rating: 5, comment: "Melhor ferramenta de design!", createdAt: "2024-01-12" },
          { user: "user3", rating: 5, comment: "Colaboração em tempo real é fantástica.", createdAt: "2024-01-08" },
        ],
        createdAt: "2024-01-02",
      },
      {
        id: 3,
        name: "Slack",
        shortDescription: "Plataforma de comunicação para equipes",
        description:
          "Slack é uma plataforma de comunicação empresarial que organiza conversas em canais, facilitando a colaboração entre equipes e a integração com outras ferramentas de trabalho.",
        url: "https://slack.com",
        category: "communication",
        plan: "free",
        logo: "assets/img/slack.png",
        images: [
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
        ],
        features: [
          {
            icon: "fas fa-hashtag",
            title: "Canais",
            description: "Organize conversas por tópicos",
          },
          {
            icon: "fas fa-puzzle-piece",
            title: "Integrações",
            description: "Conecte com suas ferramentas favoritas",
          },
          {
            icon: "fas fa-video",
            title: "Chamadas",
            description: "Videochamadas e compartilhamento de tela",
          },
          {
            icon: "fas fa-search",
            title: "Busca Avançada",
            description: "Encontre qualquer mensagem rapidamente",
          },
        ],
        rating: 4.6,
        views: 1100,
        ratings: [
          { user: "user2", rating: 5, comment: "Essencial para nossa equipe!", createdAt: "2024-01-14" },
          { user: "user4", rating: 4, comment: "Boa ferramenta, mas pode ser distrativa.", createdAt: "2024-01-09" },
        ],
        createdAt: "2024-01-03",
      },
      {
        id: 4,
        name: "Canva",
        shortDescription: "Plataforma de design gráfico simplificada",
        description:
          "Canva é uma ferramenta de design gráfico online que permite criar designs profissionais facilmente, com milhares de templates e elementos visuais prontos para usar.",
        url: "https://canva.com",
        category: "design",
        plan: "free",
        // Logo real do Canva armazenada em assets/img
        logo: "assets/img/canva.png",
        // Screenshots reais (atualmente disponíveis: canva1, canva3, canva4, canva5)
        // Se adicionar canva2.png depois, basta incluir aqui mantendo a ordem desejada
        images: [
          "assets/img/canva1.png",
          // "assets/img/canva2.png", // (arquivo ausente no diretório no momento)
          "assets/img/canva3.png",
          "assets/img/canva4.png",
          "assets/img/canva5.png",
        ],
        features: [
          {
            icon: "fas fa-images",
            title: "Templates",
            description: "Milhares de templates profissionais",
          },
          {
            icon: "fas fa-magic",
            title: "Editor Simples",
            description: "Interface intuitiva de arrastar e soltar",
          },
          {
            icon: "fas fa-palette",
            title: "Brand Kit",
            description: "Mantenha consistência visual da marca",
          },
          {
            icon: "fas fa-share-alt",
            title: "Compartilhamento",
            description: "Compartilhe e colabore facilmente",
          },
        ],
        rating: 4.7,
        views: 890,
        ratings: [
          { user: "user1", rating: 5, comment: "Perfeito para quem não é designer!", createdAt: "2024-01-11" },
          { user: "user5", rating: 4, comment: "Muitas opções, às vezes confuso.", createdAt: "2024-01-07" },
        ],
        createdAt: "2024-01-04",
      },
      {
        id: 5,
        name: "Trello",
        shortDescription: "Gerenciamento de projetos com quadros Kanban",
        description:
          "Trello é uma ferramenta de gerenciamento de projetos baseada em quadros Kanban, que ajuda equipes a organizar tarefas e acompanhar o progresso de forma visual e intuitiva.",
        url: "https://trello.com",
        category: "productivity",
        plan: "free",
        logo: "/placeholder.svg?height=80&width=80",
        images: [
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
        ],
        features: [
          {
            icon: "fas fa-columns",
            title: "Quadros Kanban",
            description: "Visualize o fluxo de trabalho",
          },
          {
            icon: "fas fa-tags",
            title: "Cartões",
            description: "Organize tarefas em cartões detalhados",
          },
          {
            icon: "fas fa-calendar",
            title: "Calendário",
            description: "Visualização em calendário dos prazos",
          },
          {
            icon: "fas fa-robot",
            title: "Automação",
            description: "Butler para automatizar tarefas repetitivas",
          },
        ],
        rating: 4.5,
        views: 750,
        ratings: [
          { user: "user2", rating: 4, comment: "Simples e eficaz para projetos pequenos.", createdAt: "2024-01-13" },
          { user: "user6", rating: 5, comment: "Interface muito intuitiva!", createdAt: "2024-01-06" },
        ],
        createdAt: "2024-01-05",
      },
      {
        id: 6,
        name: "HubSpot CRM",
        shortDescription: "CRM gratuito para gerenciamento de vendas",
        description:
          "HubSpot CRM é uma plataforma completa de gerenciamento de relacionamento com clientes, oferecendo ferramentas para vendas, marketing e atendimento ao cliente.",
        url: "https://hubspot.com",
        category: "marketing",
        plan: "free",
        logo: "/placeholder.svg?height=80&width=80",
        images: [
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
        ],
        features: [
          {
            icon: "fas fa-users",
            title: "Gestão de Contatos",
            description: "Organize todos os seus contatos",
          },
          {
            icon: "fas fa-handshake",
            title: "Pipeline de Vendas",
            description: "Acompanhe negócios em andamento",
          },
          {
            icon: "fas fa-chart-bar",
            title: "Relatórios",
            description: "Analytics detalhados de vendas",
          },
          {
            icon: "fas fa-envelope",
            title: "Email Marketing",
            description: "Campanhas de email integradas",
          },
        ],
        rating: 4.4,
        views: 650,
        ratings: [
          { user: "user3", rating: 4, comment: "Bom CRM gratuito para começar.", createdAt: "2024-01-10" },
          { user: "user7", rating: 5, comment: "Funcionalidades incríveis!", createdAt: "2024-01-05" },
        ],
        createdAt: "2024-01-06",
      },
      {
        id: 7,
        name: "GitHub",
        shortDescription: "Plataforma de desenvolvimento colaborativo",
        description:
          "GitHub é a maior plataforma de hospedagem de código do mundo, oferecendo controle de versão Git, colaboração em equipe e ferramentas de DevOps integradas.",
        url: "https://github.com",
        category: "development",
        plan: "free",
        logo: "assets/img/github.png",
        images: [
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
        ],
        
        features: [
          {
            icon: "fas fa-code-branch",
            title: "Controle de Versão",
            description: "Git integrado para versionamento",
          },
          {
            icon: "fas fa-users",
            title: "Colaboração",
            description: "Trabalhe em equipe no mesmo código",
          },
          {
            icon: "fas fa-bug",
            title: "Issues",
            description: "Rastreamento de bugs e tarefas",
          },
          {
            icon: "fas fa-cogs",
            title: "Actions",
            description: "CI/CD automatizado",
          },
        ],
        rating: 4.8,
        views: 1350,
        ratings: [
          { user: "user4", rating: 5, comment: "Essencial para qualquer desenvolvedor!", createdAt: "2024-01-12" },
          { user: "user8", rating: 5, comment: "Plataforma incrível para open source.", createdAt: "2024-01-04" },
        ],
        createdAt: "2024-01-07",
      },
      {
        id: 8,
        name: "Zoom",
        shortDescription: "Plataforma de videoconferência e comunicação",
        description:
          "Zoom é uma plataforma de comunicação por vídeo que oferece videoconferências, webinars, chat e telefone em uma solução unificada para empresas de todos os tamanhos.",
        url: "https://zoom.us",
        category: "communication",
        plan: "free",
        logo: "assets/img/zoom.png",
        images: [
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
        ],
        features: [
          {
            icon: "fas fa-video",
            title: "Videoconferência",
            description: "Reuniões em HD com até 100 participantes",
          },
          {
            icon: "fas fa-desktop",
            title: "Compartilhamento",
            description: "Compartilhe tela e aplicativos",
          },
          {
            icon: "fas fa-record-vinyl",
            title: "Gravação",
            description: "Grave reuniões na nuvem ou localmente",
          },
          {
            icon: "fas fa-mobile-alt",
            title: "Mobile",
            description: "Apps nativos para iOS e Android",
          },
        ],
        rating: 4.3,
        views: 920,
        ratings: [
          { user: "user5", rating: 4, comment: "Boa qualidade de vídeo e áudio.", createdAt: "2024-01-09" },
          { user: "user9", rating: 4, comment: "Funciona bem, mas consome bateria.", createdAt: "2024-01-03" },
        ],
        createdAt: "2024-01-08",
      },
      {
        id: 9,
        name: "Mailchimp",
        shortDescription: "Plataforma de email marketing e automação",
        description:
          "Mailchimp é uma plataforma de marketing que ajuda empresas a criar, enviar e analisar campanhas de email, além de oferecer ferramentas de automação de marketing.",
        url: "https://mailchimp.com",
        category: "marketing",
        plan: "free",
        logo: "/placeholder.svg?height=80&width=80",
        images: [
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
        ],
        logo: "assets/img/adobe-CC.png",
        features: [
          {
            icon: "fas fa-envelope",
            title: "Email Campaigns",
            description: "Crie campanhas de email profissionais",
          },
          {
            icon: "fas fa-robot",
            title: "Automação",
            description: "Fluxos de email automatizados",
          },
          {
            icon: "fas fa-chart-line",
            title: "Analytics",
            description: "Relatórios detalhados de performance",
          },
          {
            icon: "fas fa-users",
            title: "Segmentação",
            description: "Segmente sua audiência eficientemente",
          },
        ],
        rating: 4.2,
        views: 580,
        ratings: [
          { user: "user6", rating: 4, comment: "Bom para começar com email marketing.", createdAt: "2024-01-08" },
          { user: "user10", rating: 4, comment: "Interface amigável e templates bonitos.", createdAt: "2024-01-02" },
        ],
        createdAt: "2024-01-09",
      },
      {
        id: 10,
        name: "QuickBooks Online",
        shortDescription: "Software de contabilidade para pequenas empresas",
        description:
          "QuickBooks Online é uma solução de contabilidade baseada na nuvem que ajuda pequenas empresas a gerenciar finanças, faturas, despesas e relatórios fiscais.",
        url: "https://quickbooks.intuit.com",
        category: "finance",
        plan: "pro",
        logo: "/placeholder.svg?height=80&width=80",
        images: [
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
        ],
        features: [
          {
            icon: "fas fa-file-invoice",
            title: "Faturamento",
            description: "Crie e envie faturas profissionais",
          },
          {
            icon: "fas fa-receipt",
            title: "Despesas",
            description: "Rastreie e categorize despesas",
          },
          {
            icon: "fas fa-chart-pie",
            title: "Relatórios",
            description: "Relatórios financeiros detalhados",
          },
          {
            icon: "fas fa-university",
            title: "Integração Bancária",
            description: "Conecte suas contas bancárias",
          },
        ],
        rating: 4.1,
        views: 420,
        ratings: [
          { user: "user7", rating: 4, comment: "Completo para pequenas empresas.", createdAt: "2024-01-07" },
          { user: "user11", rating: 4, comment: "Um pouco caro, mas vale a pena.", createdAt: "2024-01-01" },
        ],
        createdAt: "2024-01-10",
      },
      {
        id: 11,
        name: "Adobe Creative Cloud",
        shortDescription: "Suite completa de ferramentas criativas",
        description:
          "Adobe Creative Cloud é uma coleção de aplicativos de software para design gráfico, edição de vídeo, desenvolvimento web e fotografia, incluindo Photoshop, Illustrator, Premiere Pro e mais.",
        url: "https://adobe.com/creativecloud",
        category: "design",
        plan: "pro",
        logo: "assets/img/adobe-CC.png",
        images: [
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
        ],
        features: [
          {
            icon: "fas fa-image",
            title: "Photoshop",
            description: "Edição avançada de imagens",
          },
          {
            icon: "fas fa-vector-square",
            title: "Illustrator",
            description: "Design vetorial profissional",
          },
          {
            icon: "fas fa-film",
            title: "Premiere Pro",
            description: "Edição de vídeo profissional",
          },
          {
            icon: "fas fa-cloud",
            title: "Cloud Storage",
            description: "Armazenamento e sincronização",
          },
        ],
        rating: 4.6,
        views: 1150,
        ratings: [
          { user: "user8", rating: 5, comment: "Padrão da indústria para design!", createdAt: "2024-01-06" },
          { user: "user12", rating: 4, comment: "Caro, mas ferramentas incríveis.", createdAt: "2024-01-01" },
        ],
        createdAt: "2024-01-11",
      },
      {
        id: 12,
        name: "Salesforce",
        shortDescription: "Plataforma CRM líder mundial",
        description:
          "Salesforce é a plataforma de CRM número 1 do mundo, oferecendo soluções completas para vendas, atendimento ao cliente, marketing e análise de dados empresariais.",
        url: "https://salesforce.com",
        category: "marketing",
        plan: "pro",
        logo: "/placeholder.svg?height=80&width=80",
        images: [
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
        ],
        features: [
          {
            icon: "fas fa-handshake",
            title: "Sales Cloud",
            description: "Automação completa de vendas",
          },
          {
            icon: "fas fa-headset",
            title: "Service Cloud",
            description: "Atendimento ao cliente 360°",
          },
          {
            icon: "fas fa-bullhorn",
            title: "Marketing Cloud",
            description: "Automação de marketing avançada",
          },
          {
            icon: "fas fa-chart-bar",
            title: "Analytics",
            description: "Business intelligence integrado",
          },
        ],
        rating: 4.3,
        views: 780,
        ratings: [
          { user: "user9", rating: 4, comment: "Poderoso, mas complexo de configurar.", createdAt: "2024-01-05" },
          { user: "user13", rating: 5, comment: "Melhor CRM para empresas grandes.", createdAt: "2024-01-01" },
        ],
        createdAt: "2024-01-12",
      },
    ]

    localStorage.setItem("saasData", JSON.stringify(sampleSaas))
  }

  // Load SaaS data
  allSaas = JSON.parse(localStorage.getItem("saasData")) || []
}

// SaaS data functions
function getAllSaas() {
  return JSON.parse(localStorage.getItem("saasData")) || []
}

function getSaasById(id) {
  const saasData = getAllSaas()
  return saasData.find((saas) => saas.id === Number.parseInt(id))
}

function getPopularSaas(limit = 6) {
  const saasData = getAllSaas()
  return saasData.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, limit)
}

function getSaasByCategory(category, limit = null) {
  const saasData = getAllSaas()
  const filtered = saasData.filter((saas) => saas.category === category)
  return limit ? filtered.slice(0, limit) : filtered
}

function getRandomSaas() {
  const saasData = getAllSaas()
  const randomIndex = Math.floor(Math.random() * saasData.length)
  return saasData[randomIndex]
}

function saveSaas(saasData) {
  localStorage.setItem("saasData", JSON.stringify(saasData))
  allSaas = saasData
}

// Substitua inicialização antiga por esta versão assíncrona
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

async function initializeApp() {
  // Check if user is logged in
  currentUser = getCurrentUser()

  // Initialize sample data if not exists
  initializeSampleData()

  // Run lightweight, universal migrations (aguarda probe de imagens)
  await runMigrations()

  // Update UI based on authentication status
  updateAuthUI()

  // Initialize mobile menu
  initializeMobileMenu()

  // Initialize dropdowns
  initializeDropdowns()

  // Controle de acesso e menu de dashboard
  redirectIfNotDeveloper()
  setupDashboardMenu()
}
// ...existing code...

// Substitua a função runMigrations() antiga por esta versão universal/assíncrona
async function runMigrations() {
  try {
    const saasData = getAllSaas()
    let changed = false

    const checkImage = (url) =>
      new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve(true)
        img.onerror = () => resolve(false)
        img.src = url + "?_=" + Date.now()
      })

    const slugify = (name) =>
      String(name || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

    const tryLogoCandidates = async (name) => {
      const slug = slugify(name)
      const candidates = []
      const exts = ["png", "jpg", "jpeg", "svg", "webp"]

      exts.forEach((ext) => {
        candidates.push(`assets/img/${slug}.${ext}`)
        candidates.push(`assets/img/${slug}-logo.${ext}`)
        candidates.push(`assets/img/${slug}_logo.${ext}`)
        candidates.push(`assets/img/${slug.toLowerCase()}.${ext}`)
      })

      const plain = name.replace(/\s+/g, "-")
      exts.forEach((ext) => {
        candidates.push(`assets/img/${plain}.${ext}`)
        candidates.push(`assets/img/${plain.toLowerCase()}.${ext}`)
      })

      for (const c of candidates) {
        // eslint-disable-next-line no-await-in-loop
        if (await checkImage(c)) return c
      }
      return null
    }

    const tryImagesCandidates = async (name, max = 4) => {
      const slug = slugify(name)
      const exts = ["png", "jpg", "jpeg", "webp"]
      const found = []

      for (let i = 1; i <= 8 && found.length < max; i++) {
        const patterns = [`${slug}${i}`, `${slug}-${i}`, `${slug}_${i}`, `${slug}0${i}`]
        for (const p of patterns) {
          for (const ext of exts) {
            const url = `assets/img/${p}.${ext}`
            // eslint-disable-next-line no-await-in-loop
            if (await checkImage(url)) {
              found.push(url)
              if (found.length >= max) break
            }
          }
          if (found.length >= max) break
        }
      }

      if (found.length === 0) {
        for (let i = 1; i <= max; i++) {
          for (const ext of exts) {
            const url = `assets/img/${slug}-${i}.${ext}`
            // eslint-disable-next-line no-await-in-loop
            if (await checkImage(url)) {
              found.push(url)
              break
            }
          }
        }
      }

      return found
    }

    for (const s of saasData) {
      const logoMissing =
        !s.logo ||
        s.logo.length === 0 ||
        s.logo.startsWith("/placeholder.svg") ||
        s.logo.includes("placeholder")

      if (logoMissing) {
        // eslint-disable-next-line no-await-in-loop
        const candidate = await tryLogoCandidates(s.name)
        if (candidate) {
          s.logo = candidate
          changed = true
        }
      } else {
        // validate existing logo path
        // eslint-disable-next-line no-await-in-loop
        if (!(await checkImage(s.logo))) {
          // eslint-disable-next-line no-await-in-loop
          const candidate = await tryLogoCandidates(s.name)
          if (candidate) {
            s.logo = candidate
            changed = true
          }
        }
      }

      const imagesMissing =
        !Array.isArray(s.images) ||
        s.images.length === 0 ||
        s.images.every((img) => !img || img.startsWith("/placeholder.svg") || img.includes("placeholder"))

      if (imagesMissing) {
        // eslint-disable-next-line no-await-in-loop
        const imgs = await tryImagesCandidates(s.name, 4)
        if (imgs.length > 0) {
          s.images = imgs
          changed = true
        }
      } else {
        const validated = []
        for (const img of s.images) {
          // eslint-disable-next-line no-await-in-loop
          if (img && !(await checkImage(img))) {
            // eslint-disable-next-line no-await-in-loop
            const imgs = await tryImagesCandidates(s.name, 4)
            if (imgs.length > 0) {
              validated.push(...imgs)
              break
            }
            // skip broken image
          } else if (img) {
            validated.push(img)
          }
        }
        if (validated.length && JSON.stringify(validated) !== JSON.stringify(s.images)) {
          s.images = validated
          changed = true
        }
      }
    }

    if (changed) {
      saveSaas(saasData)
    }
  } catch (e) {
    console.warn("Migration error", e)
  }
}

// Lightweight data migrations
function runMigrations() {
  try {
    const saasData = getAllSaas()
    let changed = false
    saasData.forEach((s) => {
      if (s.name === "Canva") {
        // Se ainda estiver usando placeholder, substitui por imagens reais disponíveis
        const isPlaceholderLogo = s.logo && s.logo.startsWith("/placeholder.svg")
        if (isPlaceholderLogo) {
          s.logo = "assets/img/canva.png"
          changed = true
        }
        // Atualiza screenshots se forem placeholders
        if (Array.isArray(s.images) && s.images.length && s.images.every((img) => img.startsWith("/placeholder.svg"))) {
          s.images = [
            "assets/img/canva1.png",
            // "assets/img/canva2.png", // poderá ser adicionado quando o arquivo existir
            "assets/img/canva3.png",
            "assets/img/canva4.png",
            "assets/img/canva5.png",
          ]
          changed = true
        }
      }
      if (s.name === "Figma") {
        const isPlaceholderLogo = s.logo && s.logo.startsWith("/placeholder.svg")
        if (isPlaceholderLogo) {
          s.logo = "assets/img/figma.png"
          changed = true
        }
        if (Array.isArray(s.images) && s.images.length && s.images.every((img) => img.startsWith("/placeholder.svg"))) {
          s.images = [
            "assets/img/figma1.png",
            "assets/img/figma2.png",
            "assets/img/figma3.png",
          ]
          changed = true
        }
      }
    })
    if (changed) {
      saveSaas(saasData)
      // Não exibe notificação para não poluir UI; poderia logar silenciosamente
    }
  } catch (e) {
    console.warn("Migration error", e)
  }
}
// Create a new SaaS entry
function addSaas(data) {
  const saasData = getAllSaas()
  const nextId = saasData.length > 0 ? Math.max(...saasData.map((s) => s.id)) + 1 : 1

  const newSaas = {
    id: nextId,
    name: data.name,
    shortDescription: data.shortDescription || "",
    description: data.description,
    url: data.url,
    category: data.category,
    plan: data.plan || "free",
    integration: data.integration || "redirect",
    logo: data.logo || "/placeholder.svg?height=80&width=80",
    icon: data.icon || null,
    images: Array.isArray(data.images) ? data.images : [],
    features: Array.isArray(data.features) ? data.features : [],
    developer: data.developer,
    rating: 0,
    ratings: [],
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  saasData.push(newSaas)
  saveSaas(saasData)
  return newSaas
}

// Update an existing SaaS entry by id
function updateSaas(id, data) {
  const saasData = getAllSaas()
  const index = saasData.findIndex((s) => s.id === Number.parseInt(id))
  if (index === -1) return null

  const current = saasData[index]
  const updated = {
    ...current,
    name: data.name ?? current.name,
    shortDescription: data.shortDescription ?? current.shortDescription ?? "",
    description: data.description ?? current.description,
    url: data.url ?? current.url,
    category: data.category ?? current.category,
    plan: data.plan ?? current.plan,
    integration: data.integration ?? current.integration,
    logo: data.logo ?? current.logo,
    icon: data.icon ?? current.icon,
    images: Array.isArray(data.images) ? data.images : current.images || [],
    features: Array.isArray(data.features) ? data.features : current.features || [],
    developer: current.developer, // keep original developer
    updatedAt: new Date().toISOString(),
  }

  saasData[index] = updated
  saveSaas(saasData)
  return updated
}

// Delete a SaaS by id
function deleteSaas(id) {
  const saasData = getAllSaas()
  const filtered = saasData.filter((s) => s.id !== Number.parseInt(id))
  saveSaas(filtered)
}

// User data functions
function getUserFavorites(userId) {
  const favorites = localStorage.getItem(`favorites_${userId}`)
  return favorites ? JSON.parse(favorites) : []
}

function addToFavorites(userId, saasId) {
  const favorites = getUserFavorites(userId)
  if (!favorites.includes(saasId)) {
    favorites.push(saasId)
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites))
  }
}

function removeFromFavorites(userId, saasId) {
  const favorites = getUserFavorites(userId)
  const updatedFavorites = favorites.filter((id) => id !== saasId)
  localStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites))
}

function getUserViewed(userId) {
  const viewed = localStorage.getItem(`viewed_${userId}`)
  return viewed ? JSON.parse(viewed) : []
}

function addToViewed(userId, saasId) {
  const viewed = getUserViewed(userId)
  const saasIdNum = Number.parseInt(saasId)

  // Remove if already exists to move to front
  const filtered = viewed.filter((item) => item.id !== saasIdNum)

  // Add to front with timestamp
  filtered.unshift({
    id: saasIdNum,
    viewedAt: new Date().toISOString(),
  })

  // Keep only last 20 viewed items
  const limited = filtered.slice(0, 20)

  localStorage.setItem(`viewed_${userId}`, JSON.stringify(limited))
}

function getUserRatings(userId) {
  const ratings = localStorage.getItem(`ratings_${userId}`)
  return ratings ? JSON.parse(ratings) : []
}

function addUserRating(userId, saasId, rating, comment = "") {
  // Add to user's ratings
  const userRatings = getUserRatings(userId)
  const existingIndex = userRatings.findIndex((r) => r.saasId === saasId)

  const ratingData = {
    saasId: saasId,
    rating: rating,
    comment: comment,
    createdAt: new Date().toISOString(),
  }

  if (existingIndex !== -1) {
    userRatings[existingIndex] = ratingData
  } else {
    userRatings.push(ratingData)
  }

  localStorage.setItem(`ratings_${userId}`, JSON.stringify(userRatings))

  // Update SaaS rating
  const saasData = getAllSaas()
  const saasIndex = saasData.findIndex((s) => s.id === Number.parseInt(saasId))

  if (saasIndex !== -1) {
    const saas = saasData[saasIndex]

    // Remove existing rating from this user
    saas.ratings = saas.ratings.filter((r) => r.user !== userId)

    // Add new rating
    saas.ratings.push({
      user: userId,
      rating: rating,
      comment: comment,
      createdAt: new Date().toISOString(),
    })

    // Calculate average rating
    const totalRating = saas.ratings.reduce((sum, r) => sum + r.rating, 0)
    saas.rating = saas.ratings.length > 0 ? totalRating / saas.ratings.length : 0

    saveSaas(saasData)
  }
}

// Plan functions
function getUserPlan(userId) {
  const plan = localStorage.getItem(`plan_${userId}`)
  return plan || "free"
}

function setUserPlan(userId, plan) {
  localStorage.setItem(`plan_${userId}`, plan)
}

function canAccessSaas(saas, userPlan) {
  if (saas.plan === "free") return true
  if (saas.plan === "pro" && userPlan === "pro") return true
  return false
}

// Search and filter functions
function filterSaas(saasArray, searchTerm, category, plan, sortBy) {
  const filtered = saasArray.filter((saas) => {
    const matchesSearch =
      !searchTerm ||
      saas.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      saas.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      saas.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = category === "all" || saas.category === category
    const matchesPlan = plan === "all" || saas.plan === plan

    return matchesSearch && matchesCategory && matchesPlan
  })

  // Sort results
  switch (sortBy) {
    case "name":
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case "rating":
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      break
    case "popular":
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0))
      break
    case "newest":
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
    default:
      break
  }

  return filtered
}

// Utility functions
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR")
}

function formatRating(rating) {
  return Number.parseFloat(rating).toFixed(1)
}

function generateStars(rating, interactive = false) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  let starsHtml = ""

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      starsHtml += `<i class="fas fa-star${interactive ? '" data-rating="' + i : ""}"></i>`
    } else if (i === fullStars + 1 && hasHalfStar) {
      starsHtml += `<i class="fas fa-star-half-alt${interactive ? '" data-rating="' + i : ""}"></i>`
    } else {
      starsHtml += `<i class="far fa-star${interactive ? '" data-rating="' + i : ""}"></i>`
    }
  }

  return starsHtml
}

function getCategoryIcon(category) {
  const icons = {
    productivity: "fas fa-tasks",
    marketing: "fas fa-bullhorn",
    finance: "fas fa-chart-line",
    design: "fas fa-palette",
    development: "fas fa-code",
    communication: "fas fa-comments",
  }
  return icons[category] || "fas fa-cube"
}

function getCategoryName(category) {
  const names = {
    productivity: "Produtividade",
    marketing: "Marketing",
    finance: "Finanças",
    design: "Design",
    development: "Desenvolvimento",
    communication: "Comunicação",
  }
  return names[category] || category
}

// Navigation functions
function goToRandomSaas() {
  const randomSaas = getRandomSaas()
  if (randomSaas) {
    window.location.href = `saas-detail.html?id=${randomSaas.id}`
  }
}

// Mobile menu functions
function initializeMobileMenu() {
  const mobileToggle = document.getElementById("mobileToggle")
  const navLinks = document.getElementById("navLinks")

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active")
    })
  }
}

// Dropdown functions
function initializeDropdowns() {
  const dropdowns = document.querySelectorAll(".dropdown")

  dropdowns.forEach((dropdown) => {
    const btn = dropdown.querySelector(".dropdown-btn")
    const content = dropdown.querySelector(".dropdown-content")

    if (btn && content) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation()

        // Close other dropdowns
        dropdowns.forEach((other) => {
          if (other !== dropdown) {
            other.classList.remove("active")
          }
        })

        // Toggle current dropdown
        dropdown.classList.toggle("active")
      })
    }
  })

  // Close dropdowns when clicking outside
  document.addEventListener("click", () => {
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove("active")
    })
  })
}

// Notification functions
function showNotification(message, type = "success") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `

  // Add to page
  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove()
    }
  }, 5000)
}

// Add notification styles
const notificationStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--background);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 1rem;
    box-shadow: var(--shadow-lg);
    z-index: 1001;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 300px;
    animation: slideInRight 0.3s ease-out;
}

.notification-success {
    border-left: 4px solid var(--accent-color);
}

.notification-error {
    border-left: 4px solid var(--danger-color);
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.notification-success .notification-content i {
    color: var(--accent-color);
}

.notification-error .notification-content i {
    color: var(--danger-color);
}

.notification-close {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-light);
    padding: 0.25rem;
}

.notification-close:hover {
    color: var(--text-primary);
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
`

// Add notification styles to head
const styleSheet = document.createElement("style")
styleSheet.textContent = notificationStyles
document.head.appendChild(styleSheet)

// Export functions for global use
window.SaaSFY = {
  getCurrentUser,
  setCurrentUser,
  logout,
  getAllSaas,
  getSaasById,
  getPopularSaas,
  getSaasByCategory,
  getRandomSaas,
  addSaas,
  updateSaas,
  deleteSaas,
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  getUserViewed,
  addToViewed,
  getUserRatings,
  addUserRating,
  getUserPlan,
  setUserPlan,
  canAccessSaas,
  filterSaas,
  formatDate,
  formatRating,
  generateStars,
  getCategoryIcon,
  getCategoryName,
  goToRandomSaas,
  showNotification,
}
// ...existing code...

// Controle de acesso ao painel de desenvolvedor
function redirectIfNotDeveloper() {
  const user = window.SaaSFY.getCurrentUser();
  const isDashboardDev = window.location.pathname.endsWith("dashboard-dev.html");
  if (isDashboardDev && (!user || user.type !== "developer")) {
    window.location.href = "dashboard-usuario.html";
  }
}

// Exibe o menu correto para cada tipo de usuário
function setupDashboardMenu() {
  const dashboardLink = document.getElementById("dashboardLink");
  if (!dashboardLink) return;
  const currentUser = window.SaaSFY.getCurrentUser();
  if (currentUser && currentUser.type === "developer") {
    dashboardLink.href = "dashboard-dev.html";
    dashboardLink.textContent = "Painel Desenvolvedor";
    dashboardLink.style.display = "inline";
  } else if (currentUser && currentUser.type === "user") {
    dashboardLink.href = "dashboard-usuario.html";
    dashboardLink.textContent = "Painel Usuário";
    dashboardLink.style.display = "inline";
  } else {
    dashboardLink.style.display = "none";
  }
}

// Inicialização global
document.addEventListener("DOMContentLoaded", () => {
  redirectIfNotDeveloper();
  setupDashboardMenu();
});

// ...existing code...
