/**
 * SaaSHub - Advanced Animations Module
 * Handles complex animations, transitions, and visual effects
 */

// Import GSAP and ScrollTrigger
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// ===== ANIMATION CONTROLLER =====
class AnimationController {
  constructor() {
    this.isInitialized = false
    this.observers = new Map()
    this.timelines = new Map()
    this.init()
  }

  init() {
    if (typeof gsap === "undefined") {
      console.warn("GSAP not loaded, animations disabled")
      return
    }

    gsap.registerPlugin(ScrollTrigger)
    this.setupGlobalAnimations()
    this.setupScrollAnimations()
    this.setupHoverAnimations()
    this.setupLoadingAnimations()
    this.isInitialized = true

    console.log("🎨 Animation Controller initialized")
  }

  // ===== GLOBAL ANIMATIONS =====
  setupGlobalAnimations() {
    // Smooth page transitions
    this.setupPageTransitions()

    // Cursor effects
    this.setupCursorEffects()

    // Parallax effects
    this.setupParallaxEffects()
  }

  setupPageTransitions() {
    // Create page transition overlay
    const overlay = document.createElement("div")
    overlay.className = "page-transition-overlay"
    overlay.innerHTML = `
      <div class="transition-content">
        <div class="transition-logo">
          <div class="logo-cube">
            <div class="cube-face front"></div>
            <div class="cube-face back"></div>
            <div class="cube-face right"></div>
            <div class="cube-face left"></div>
            <div class="cube-face top"></div>
            <div class="cube-face bottom"></div>
          </div>
        </div>
        <div class="transition-text">Carregando...</div>
      </div>
    `
    document.body.appendChild(overlay)

    // Style the overlay
    const style = document.createElement("style")
    style.textContent = `
      .page-transition-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: var(--gradient-dark);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }
      
      .page-transition-overlay.active {
        opacity: 1;
        visibility: visible;
      }
      
      .transition-content {
        text-align: center;
      }
      
      .transition-logo {
        margin-bottom: 2rem;
      }
      
      .transition-text {
        color: var(--accent-white);
        font-size: 1.2rem;
        font-weight: 600;
      }
    `
    document.head.appendChild(style)
  }

  setupCursorEffects() {
    // Create custom cursor
    const cursor = document.createElement("div")
    cursor.className = "custom-cursor"
    document.body.appendChild(cursor)

    const cursorFollower = document.createElement("div")
    cursorFollower.className = "cursor-follower"
    document.body.appendChild(cursorFollower)

    // Style cursors
    const style = document.createElement("style")
    style.textContent = `
      .custom-cursor {
        position: fixed;
        width: 10px;
        height: 10px;
        background: var(--accent-cyan);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
      }
      
      .cursor-follower {
        position: fixed;
        width: 40px;
        height: 40px;
        border: 2px solid var(--accent-cyan);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        opacity: 0.5;
        transition: all 0.3s ease;
      }
      
      .custom-cursor.hover {
        transform: scale(2);
      }
      
      .cursor-follower.hover {
        transform: scale(1.5);
        opacity: 1;
      }
      
      @media (max-width: 768px) {
        .custom-cursor,
        .cursor-follower {
          display: none;
        }
      }
    `
    document.head.appendChild(style)

    // Cursor movement
    let mouseX = 0,
      mouseY = 0
    let followerX = 0,
      followerY = 0

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      cursor.style.left = mouseX + "px"
      cursor.style.top = mouseY + "px"
    })

    // Smooth follower animation
    function animateFollower() {
      followerX += (mouseX - followerX) * 0.1
      followerY += (mouseY - followerY) * 0.1

      cursorFollower.style.left = followerX - 20 + "px"
      cursorFollower.style.top = followerY - 20 + "px"

      requestAnimationFrame(animateFollower)
    }
    animateFollower()

    // Hover effects
    const hoverElements = document.querySelectorAll("button, a, .saas-card, .feature-card")
    hoverElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        cursor.classList.add("hover")
        cursorFollower.classList.add("hover")
      })

      element.addEventListener("mouseleave", () => {
        cursor.classList.remove("hover")
        cursorFollower.classList.remove("hover")
      })
    })
  }

  setupParallaxEffects() {
    // Parallax background elements
    const parallaxElements = document.querySelectorAll(".floating-particles, .hero-visual")

    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset
      const rate = scrolled * -0.5

      parallaxElements.forEach((element) => {
        element.style.transform = `translateY(${rate}px)`
      })
    })
  }

  // ===== SCROLL ANIMATIONS =====
  setupScrollAnimations() {
    // Fade in animations
    gsap.utils.toArray(".feature-card").forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 60,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
          },
        },
      )
    })

    // SaaS cards stagger animation
    ScrollTrigger.batch(".saas-card", {
      onEnter: (elements) => {
        gsap.fromTo(
          elements,
          {
            opacity: 0,
            y: 50,
            rotationX: 45,
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          },
        )
      },
      onLeave: (elements) => {
        gsap.to(elements, {
          opacity: 0.3,
          duration: 0.3,
        })
      },
      onEnterBack: (elements) => {
        gsap.to(elements, {
          opacity: 1,
          duration: 0.3,
        })
      },
    })

    // Section titles animation
    gsap.utils.toArray(".section-title").forEach((title) => {
      const chars = title.textContent.split("")
      title.innerHTML = chars.map((char) => (char === " " ? " " : `<span class="char">${char}</span>`)).join("")

      gsap.fromTo(
        title.querySelectorAll(".char"),
        {
          opacity: 0,
          y: 50,
          rotationX: -90,
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          stagger: 0.03,
          ease: "power3.out",
          scrollTrigger: {
            trigger: title,
            start: "top 80%",
          },
        },
      )
    })

    // Progress indicators
    this.setupScrollProgress()
  }

  setupScrollProgress() {
    // Create scroll progress indicator
    const progressBar = document.createElement("div")
    progressBar.className = "scroll-progress"
    progressBar.innerHTML = '<div class="progress-fill"></div>'
    document.body.appendChild(progressBar)

    // Style progress bar
    const style = document.createElement("style")
    style.textContent = `
      .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: rgba(248, 250, 252, 0.1);
        z-index: 9999;
      }
      
      .progress-fill {
        height: 100%;
        background: var(--gradient-accent);
        width: 0%;
        transition: width 0.1s ease;
      }
    `
    document.head.appendChild(style)

    // Update progress on scroll
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrolled / maxScroll) * 100

      progressBar.querySelector(".progress-fill").style.width = progress + "%"
    })
  }

  // ===== HOVER ANIMATIONS =====
  setupHoverAnimations() {
    // Button hover effects
    gsap.utils.toArray(".btn").forEach((button) => {
      const glow = button.querySelector(".btn-glow")

      button.addEventListener("mouseenter", () => {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        })

        if (glow) {
          gsap.to(glow, {
            opacity: 1,
            duration: 0.3,
          })
        }
      })

      button.addEventListener("mouseleave", () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        })

        if (glow) {
          gsap.to(glow, {
            opacity: 0,
            duration: 0.3,
          })
        }
      })
    })

    // Card hover effects
    gsap.utils.toArray(".saas-card, .feature-card").forEach((card) => {
      const glow = card.querySelector(".feature-glow")

      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          y: -10,
          rotationY: 5,
          duration: 0.4,
          ease: "power2.out",
        })

        if (glow) {
          gsap.to(glow, {
            opacity: 0.3,
            duration: 0.4,
          })
        }
      })

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          y: 0,
          rotationY: 0,
          duration: 0.4,
          ease: "power2.out",
        })

        if (glow) {
          gsap.to(glow, {
            opacity: 0,
            duration: 0.4,
          })
        }
      })
    })

    // Navigation link effects
    gsap.utils.toArray(".nav-link").forEach((link) => {
      const indicator = link.querySelector(".nav-indicator")

      link.addEventListener("mouseenter", () => {
        if (!link.classList.contains("active")) {
          gsap.to(indicator, {
            scaleX: 1,
            opacity: 0.5,
            duration: 0.3,
            ease: "power2.out",
          })
        }
      })

      link.addEventListener("mouseleave", () => {
        if (!link.classList.contains("active")) {
          gsap.to(indicator, {
            scaleX: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
          })
        }
      })
    })
  }

  // ===== LOADING ANIMATIONS =====
  setupLoadingAnimations() {
    // Animate loading screen elements
    const tl = gsap.timeline()

    tl.fromTo(".neural-node", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.2 })
      .fromTo(
        ".neural-connection",
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 0.6, duration: 0.8, stagger: 0.3 },
        "-=0.3",
      )
      .fromTo(".loading-letter", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 }, "-=0.5")
  }

  // ===== UTILITY METHODS =====
  animatePageTransition(callback) {
    const overlay = document.querySelector(".page-transition-overlay")
    if (!overlay) return

    overlay.classList.add("active")

    setTimeout(() => {
      if (callback) callback()

      setTimeout(() => {
        overlay.classList.remove("active")
      }, 500)
    }, 300)
  }

  morphElement(element, newContent, duration = 0.5) {
    if (!element) return

    gsap.to(element, {
      scale: 0.8,
      opacity: 0,
      duration: duration / 2,
      ease: "power2.in",
      onComplete: () => {
        element.innerHTML = newContent
        gsap.to(element, {
          scale: 1,
          opacity: 1,
          duration: duration / 2,
          ease: "power2.out",
        })
      },
    })
  }

  pulseElement(element, intensity = 1.1, duration = 0.3) {
    if (!element) return

    gsap.to(element, {
      scale: intensity,
      duration: duration,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    })
  }

  shakeElement(element, intensity = 10, duration = 0.5) {
    if (!element) return

    gsap.to(element, {
      x: intensity,
      duration: 0.1,
      yoyo: true,
      repeat: 5,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set(element, { x: 0 })
      },
    })
  }

  // ===== CLEANUP =====
  destroy() {
    this.observers.forEach((observer) => observer.disconnect())
    this.timelines.forEach((timeline) => timeline.kill())
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())

    // Remove custom elements
    const customCursor = document.querySelector(".custom-cursor")
    const cursorFollower = document.querySelector(".cursor-follower")
    const progressBar = document.querySelector(".scroll-progress")
    const overlay = document.querySelector(".page-transition-overlay")
    ;[customCursor, cursorFollower, progressBar, overlay].forEach((element) => {
      if (element) element.remove()
    })

    console.log("🎨 Animation Controller destroyed")
  }
}

// ===== PARTICLE SYSTEM =====
class ParticleSystem {
  constructor(container, options = {}) {
    this.container = container
    this.options = {
      count: options.count || 50,
      speed: options.speed || 1,
      size: options.size || 2,
      color: options.color || "#00D4FF",
      ...options,
    }

    this.particles = []
    this.init()
  }

  init() {
    this.createParticles()
    this.animate()
  }

  createParticles() {
    for (let i = 0; i < this.options.count; i++) {
      const particle = document.createElement("div")
      particle.className = "particle"
      particle.style.cssText = `
        position: absolute;
        width: ${this.options.size}px;
        height: ${this.options.size}px;
        background: ${this.options.color};
        border-radius: 50%;
        pointer-events: none;
        opacity: ${Math.random() * 0.5 + 0.3};
      `

      this.container.appendChild(particle)

      this.particles.push({
        element: particle,
        x: Math.random() * this.container.offsetWidth,
        y: Math.random() * this.container.offsetHeight,
        vx: (Math.random() - 0.5) * this.options.speed,
        vy: (Math.random() - 0.5) * this.options.speed,
      })
    }
  }

  animate() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx
      particle.y += particle.vy

      // Bounce off edges
      if (particle.x <= 0 || particle.x >= this.container.offsetWidth) {
        particle.vx *= -1
      }
      if (particle.y <= 0 || particle.y >= this.container.offsetHeight) {
        particle.vy *= -1
      }

      particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`
    })

    requestAnimationFrame(() => this.animate())
  }

  destroy() {
    this.particles.forEach((particle) => {
      if (particle.element.parentNode) {
        particle.element.parentNode.removeChild(particle.element)
      }
    })
    this.particles = []
  }
}

// ===== NEURAL NETWORK ANIMATION =====
class NeuralNetworkAnimation {
  constructor(container) {
    this.container = container
    this.nodes = []
    this.connections = []
    this.init()
  }

  init() {
    this.createNodes()
    this.createConnections()
    this.animate()
  }

  createNodes() {
    const nodeCount = 8
    for (let i = 0; i < nodeCount; i++) {
      const node = document.createElement("div")
      node.className = "neural-node"
      node.style.cssText = `
        position: absolute;
        width: 12px;
        height: 12px;
        background: var(--gradient-accent);
        border-radius: 50%;
        box-shadow: 0 0 20px var(--accent-cyan);
      `

      const angle = (i / nodeCount) * Math.PI * 2
      const radius = 80
      const x = Math.cos(angle) * radius + 100
      const y = Math.sin(angle) * radius + 100

      node.style.left = x + "px"
      node.style.top = y + "px"

      this.container.appendChild(node)
      this.nodes.push({ element: node, x, y, pulse: Math.random() * Math.PI * 2 })
    }
  }

  createConnections() {
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        if (Math.random() > 0.6) {
          // 40% chance of connection
          const connection = document.createElement("div")
          connection.className = "neural-connection"

          const node1 = this.nodes[i]
          const node2 = this.nodes[j]

          const dx = node2.x - node1.x
          const dy = node2.y - node1.y
          const length = Math.sqrt(dx * dx + dy * dy)
          const angle = Math.atan2(dy, dx)

          connection.style.cssText = `
            position: absolute;
            width: ${length}px;
            height: 2px;
            background: var(--gradient-accent);
            opacity: 0.3;
            transform-origin: 0 50%;
            transform: rotate(${angle}rad);
            left: ${node1.x + 6}px;
            top: ${node1.y + 6}px;
          `

          this.container.appendChild(connection)
          this.connections.push({ element: connection, opacity: 0.3 })
        }
      }
    }
  }

  animate() {
    const time = Date.now() * 0.001

    this.nodes.forEach((node, index) => {
      const pulse = Math.sin(time + node.pulse) * 0.5 + 0.5
      const scale = 0.8 + pulse * 0.4
      node.element.style.transform = `scale(${scale})`
      node.element.style.opacity = 0.6 + pulse * 0.4
    })

    this.connections.forEach((connection, index) => {
      const pulse = Math.sin(time * 2 + index) * 0.5 + 0.5
      connection.element.style.opacity = 0.2 + pulse * 0.3
    })

    requestAnimationFrame(() => this.animate())
  }

  destroy() {
    ;[...this.nodes, ...this.connections].forEach((item) => {
      if (item.element.parentNode) {
        item.element.parentNode.removeChild(item.element)
      }
    })
    this.nodes = []
    this.connections = []
  }
}

// ===== INITIALIZE ANIMATIONS =====
let animationController
let particleSystem
let neuralNetwork

document.addEventListener("DOMContentLoaded", () => {
  // Initialize animation controller
  animationController = new AnimationController()

  // Initialize particle system for hero section
  const heroBackground = document.querySelector(".hero-background")
  if (heroBackground) {
    particleSystem = new ParticleSystem(heroBackground, {
      count: 30,
      speed: 0.5,
      size: 3,
      color: "#00D4FF",
    })
  }

  // Initialize neural network for loading screen
  const neuralContainer = document.querySelector(".neural-network")
  if (neuralContainer) {
    neuralNetwork = new NeuralNetworkAnimation(neuralContainer)
  }
})

// ===== EXPORT FOR GLOBAL ACCESS =====
window.SaaSHubAnimations = {
  AnimationController,
  ParticleSystem,
  NeuralNetworkAnimation,
  animationController,
  particleSystem,
  neuralNetwork,
}

console.log("🎭 SaaSHub Animations Module Loaded")
