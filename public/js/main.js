(function() {
    'use strict';

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            const isOpen = mainNav.classList.toggle('open');
            this.setAttribute('aria-expanded', isOpen);
            this.textContent = isOpen ? '✕' : '☰';
        });

        document.addEventListener('click', function(e) {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                mainNav.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.textContent = '☰';
            }
        });

        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mainNav.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.textContent = '☰';
            });
        });
    }

    // Season Switcher - FIXED for proper loading
    function initSeasonSwitcher() {
        const seasonBtns = document.querySelectorAll('.season-btn');
        const playerWrapper = document.getElementById('playerWrapper');
        
        // Get all episode card links
        const allCards = document.querySelectorAll('.episode-card-link');
        
        if (seasonBtns.length === 0 || allCards.length === 0) {
            console.log('No season buttons or episodes found');
            return;
        }

        // Function to filter episodes by season
        function filterEpisodes(seasonNumber) {
            allCards.forEach(card => {
                const cardSeason = card.dataset.season;
                if (cardSeason === seasonNumber) {
                    card.style.display = 'block';
                    card.style.visibility = 'visible';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.style.visibility = 'hidden';
                    card.style.opacity = '0';
                }
            });
        }

        // Get the active season from URL or default to 1
        function getActiveSeason() {
            // Check URL for season parameter
            const urlParams = new URLSearchParams(window.location.search);
            const seasonParam = urlParams.get('season');
            if (seasonParam) {
                return seasonParam;
            }
            
            // Check for active button
            const activeBtn = document.querySelector('.season-btn.active-season');
            if (activeBtn) {
                return activeBtn.dataset.season;
            }
            
            return '1'; // Default to season 1
        }

        // Set initial state - show only active season
        const initialSeason = getActiveSeason();
        
        // Update button states
        seasonBtns.forEach(btn => {
            btn.classList.remove('active-season');
            if (btn.dataset.season === initialSeason) {
                btn.classList.add('active-season');
            }
        });
        
        // Filter episodes to show only active season
        filterEpisodes(initialSeason);

        // Update trailer for initial season
        const initialBtn = document.querySelector(`.season-btn[data-season="${initialSeason}"]`);
        if (initialBtn && playerWrapper) {
            const trailerUrl = initialBtn.dataset.trailer;
            if (trailerUrl) {
                let url = trailerUrl;
                if (url.includes('youtube.com/embed/')) {
                    const separator = url.includes('?') ? '&' : '?';
                    url += separator + 'autoplay=0';
                }
                playerWrapper.innerHTML = `
                    <iframe src="${url}" 
                            allow="autoplay; encrypted-media" 
                            allowfullscreen 
                            loading="lazy"
                            title="Season ${initialSeason} trailer">
                    </iframe>
                `;
            }
        }

        // Add click handlers to season buttons
        seasonBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                const season = this.dataset.season;
                const trailerUrl = this.dataset.trailer;

                // Update active state
                seasonBtns.forEach(b => b.classList.remove('active-season'));
                this.classList.add('active-season');

                // Filter episodes to show only selected season
                filterEpisodes(season);

                // Update URL with season parameter (optional)
                if (history.pushState) {
                    const url = new URL(window.location);
                    url.searchParams.set('season', season);
                    history.pushState({}, '', url);
                }

                // Update trailer
                if (playerWrapper && trailerUrl) {
                    let url = trailerUrl;
                    if (url.includes('youtube.com/embed/')) {
                        const separator = url.includes('?') ? '&' : '?';
                        url += separator + 'autoplay=0';
                    }
                    playerWrapper.innerHTML = `
                        <iframe src="${url}" 
                                allow="autoplay; encrypted-media" 
                                allowfullscreen 
                                loading="lazy"
                                title="Season ${season} trailer">
                        </iframe>
                    `;
                }
            });
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSeasonSwitcher);
    } else {
        initSeasonSwitcher();
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    console.log('🎬 Eternal Legacy - Drama Hub loaded successfully!');
})();