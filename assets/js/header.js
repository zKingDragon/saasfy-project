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
            // Atualiza o header para mostrar usuário logado
            if (window.SaaSFY && typeof window.SaaSFY.updateAuthUI === 'function') {
                window.SaaSFY.updateAuthUI();
            }
            // Reaplica listeners do dropdown do usuário logado
            initializeUserDropdown();
// Inicializa o dropdown do usuário logado
function initializeUserDropdown() {
    const userDropdown = document.getElementById('userDropdown');
    const dropdownContent = document.getElementById('dropdownContent');
    if (userDropdown && dropdownContent) {
        userDropdown.addEventListener('click', function (e) {
            e.stopPropagation();
            dropdownContent.classList.toggle('active');
        });
        // Fecha dropdown ao clicar fora
        document.addEventListener('click', function () {
            dropdownContent.classList.remove('active');
        });
    }
}
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

document.addEventListener('DOMContentLoaded', loadHeader);
