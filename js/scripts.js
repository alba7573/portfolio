document.addEventListener('DOMContentLoaded', () => {

    // --- PARTIE 1 : LIGHTBOX (Photos) ---
    const itemsToOpenModal = document.querySelectorAll('.photo-lightbox-trigger, .photo-scroll-item');
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-btn');

    if (modal && modalImg && closeBtn) {
        itemsToOpenModal.forEach(item => {
            item.addEventListener('click', function() {
                const imgSrc = this.getAttribute('data-full-img');
                // S'assurer que la source est définie avant d'ouvrir la modale
                if (imgSrc) {
                    modal.style.display = 'flex';
                    modalImg.src = imgSrc;
                }
            });
        });
        closeBtn.addEventListener('click', function() { modal.style.display = 'none'; });
        modal.addEventListener('click', function(event) { if (event.target === modal) modal.style.display = 'none'; });
        document.addEventListener('keydown', function(event) { if (event.key === 'Escape' && modal.style.display === 'flex') modal.style.display = 'none'; });
    }

    // --- PARTIE 2 : LECTEUR VIDEO ET TIMECODES ---
    
    // On cherche l'iframe existante (nécessite le chargement du SDK Dailymotion externe)
    const iframeElement = document.getElementById('dm-player');
    const timecodeLinks = document.querySelectorAll('.timecode-jump');

    if (iframeElement && timecodeLinks.length > 0 && typeof DM !== 'undefined') {
        
        // On initialise le lecteur Dailymotion sur l'iframe existante
        const player = DM.player(iframeElement, {
            params: {
                api: true // Important pour autoriser les commandes
            }
        });

        // Gestion des clics sur les boutons
        timecodeLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const time = parseInt(link.getAttribute('data-time'), 10);
                
                if (!isNaN(time) && player) {
                    player.play();
                    player.seek(time);
                }
            });
        });
    }


    // --- PARTIE 3 : MENU FLOTTANT ET DÉFILEMENT FLUIDE (Sticky Nav) ---
    
    const stickyNavContainer = document.getElementById('sidebar-nav-container'); 
    
    // On continue uniquement si on est sur la page Projet
    if (stickyNavContainer) {
        
        // --- Gestion de l'affichage sur Desktop ---
        const checkSidebarDisplay = () => {
            // Si l'écran est large (> 900px), on affiche le menu.
            // Sinon, il reste géré par la transition mobile (via la classe 'menu-ouvert').
            if (window.innerWidth > 900) {
                stickyNavContainer.style.display = 'block';
                document.body.classList.remove('menu-ouvert'); // Assurer la propreté si on resize depuis le mobile
            } else if (!document.body.classList.contains('menu-ouvert')) {
                // Sur mobile, si on n'est pas en mode 'ouvert', on le masque explicitement
                stickyNavContainer.style.display = 'none';
            }
        };

        checkSidebarDisplay();
        window.addEventListener('resize', checkSidebarDisplay);
        
        // --- Défilement fluide (Smooth Scrolling) ---
        const stickyNav = document.getElementById('sticky-nav'); 
        const allLinks = stickyNav.querySelectorAll('a');
        
        allLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault(); 
                
                const targetId = this.getAttribute('href'); 
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Décalage : hauteur du header principal (60px)
                    const headerHeight = 60; 
                    
                    window.scrollTo({
                        top: targetSection.offsetTop - headerHeight, 
                        behavior: 'smooth'
                    });

                    // Si on est en mode mobile, on ferme le menu après le clic
                    if (window.innerWidth <= 900) {
                        const body = document.body;
                        if (body.classList.contains('menu-ouvert')) {
                             body.classList.remove('menu-ouvert');
                            // Attendre la fin de la transition CSS pour masquer le panneau
                            setTimeout(() => {
                                stickyNavContainer.style.display = 'none';
                            }, 300); 
                        }
                    }
                }
            });
        });

        // --- PARTIE 4 : TOGGLE MENU MOBILE (Gestion du bouton Hamburger) ---
        const menuToggle = document.getElementById('menu-toggle');
        const body = document.body;

        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                const isOpen = body.classList.toggle('menu-ouvert');
                
                if (window.innerWidth <= 900) {
                    if (isOpen) {
                        stickyNavContainer.style.display = 'block';
                    } else {
                        // Délai pour laisser le temps à l'animation de fermeture de s'exécuter
                        setTimeout(() => {
                            stickyNavContainer.style.display = 'none';
                        }, 300);
                    }
                }
            });
        }
    }
});
