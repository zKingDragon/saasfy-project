// Função para carregar o header em todas as páginas
async function loadHeader() {
    try {
        const response = await fetch('header.html');
        const headerHTML = await response.text();
        
        const headerContainer = document.getElementById('header');
        if (headerContainer) {
            headerContainer.innerHTML = headerHTML;
            
            // Inicializar funcionalidades do header após carregamento
            initializeHeader();
        }
    } catch (error) {
        console.error('Erro ao carregar header:', error);
    }
}

// Função para inicializar funcionalidades do header
function initializeHeader() {
    // Configurar menu mobile
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // Outras funcionalidades do header podem ser adicionadas aqui
}

// Carregar header quando a página carregar
document.addEventListener('DOMContentLoaded', loadHeader);