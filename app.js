// Theme management
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', theme);
};

const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
};

// Poker probability calculations
const calculateProbabilities = (players, outs) => {
    // Calculate cards remaining based on player count
    // 52 total cards - 3 flop cards - 2 your cards - (players-1)*2 opponent cards
    const cardsAfterFlop = 52 - 3 - 2 - ((players - 1) * 2);
    const cardsAfterTurn = cardsAfterFlop - 1;
    
    // Before Turn (2 cards to come) - probability of hitting at least once
    const missFirstCard = (cardsAfterFlop - outs) / cardsAfterFlop;
    const missSecondCard = (cardsAfterFlop - 1 - outs) / (cardsAfterFlop - 1);
    const beforeTurnProb = 1 - (missFirstCard * missSecondCard);
    
    // Before River (1 card to come)
    const beforeRiverProb = outs / cardsAfterTurn;
    
    return {
        turn: beforeTurnProb * 100,
        river: beforeRiverProb * 100,
        cardsAfterFlop: cardsAfterFlop,
        cardsAfterTurn: cardsAfterTurn
    };
};

// Update display
const updateDisplay = () => {
    const playersSelect = document.getElementById('players');
    const outsInput = document.getElementById('outs');
    const turnElement = document.getElementById('turnPercentage');
    const riverElement = document.getElementById('riverPercentage');
    const cardsLeftElements = document.querySelectorAll('.cards-left');
    
    const players = parseInt(playersSelect.value);
    const outs = parseFloat(outsInput.value);
    
    // Always show cards left
    const cardsInfo = calculateProbabilities(players, 1);
    cardsLeftElements[0].textContent = `${cardsInfo.cardsAfterFlop} cards after flop`;
    cardsLeftElements[1].textContent = `${cardsInfo.cardsAfterTurn} after turn`;

    
    if (!outs || outs < 0) {
        turnElement.textContent = '—';
        riverElement.textContent = '—';
        return;
    }
    
    const probabilities = calculateProbabilities(players, outs);
    
    turnElement.textContent = probabilities.turn.toFixed(1) + '%';
    riverElement.textContent = probabilities.river.toFixed(1) + '%';
    
    // Recalculate pot odds when percentages change
    calculatePotOdds();
};

// Pot odds calculation
const calculatePotOdds = () => {
    const potSizeInput = document.getElementById('potSize');
    const betSizeInput = document.getElementById('betSize');
    const potOddsRatioElement = document.getElementById('potOddsRatio');
    const potOddsPercentElement = document.getElementById('potOddsPercent');
    const decisionElement = document.getElementById('decision');
    
    const potSize = parseFloat(potSizeInput.value);
    const betSize = parseFloat(betSizeInput.value);
    
    if (!potSize || !betSize || potSize < 0 || betSize < 0) {
        potOddsRatioElement.textContent = '—';
        potOddsPercentElement.textContent = '—';
        decisionElement.textContent = 'Enter pot and bet amounts';
        decisionElement.className = 'pot-odds-results__value pot-odds-results__decision';
        return;
    }
    
    // Calculate pot odds
    const totalPot = potSize + betSize;
    const potOddsRatio = totalPot / betSize;
    const potOddsPercent = (betSize / (totalPot + betSize)) * 100;
    
    // Display pot odds
    potOddsRatioElement.textContent = `${potOddsRatio.toFixed(1)}:1`;
    potOddsPercentElement.textContent = `${potOddsPercent.toFixed(1)}%`;
    
    // Get current winning percentage based on selected street
    const selectedStreet = document.querySelector('input[name="street"]:checked').value;
    const turnPercent = document.getElementById('turnPercentage').textContent;
    const riverPercent = document.getElementById('riverPercentage').textContent;
    
    let winningPercent = null;
    if (selectedStreet === 'turn' && turnPercent !== '—') {
        winningPercent = parseFloat(turnPercent);
    } else if (selectedStreet === 'river' && riverPercent !== '—') {
        winningPercent = parseFloat(riverPercent);
    }
    
    // Make decision
    if (winningPercent !== null) {
        const difference = winningPercent - potOddsPercent;
        
        if (difference > 5) {
            decisionElement.textContent = `CALL! Your ${winningPercent.toFixed(1)}% > ${potOddsPercent.toFixed(1)}% needed`;
            decisionElement.className = 'pot-odds-results__value pot-odds-results__decision pot-odds-results__decision--call';
        } else if (difference < -5) {
            decisionElement.textContent = `FOLD. Your ${winningPercent.toFixed(1)}% < ${potOddsPercent.toFixed(1)}% needed`;
            decisionElement.className = 'pot-odds-results__value pot-odds-results__decision pot-odds-results__decision--fold';
        } else {
            decisionElement.textContent = `CLOSE CALL. Your ${winningPercent.toFixed(1)}% ≈ ${potOddsPercent.toFixed(1)}% needed`;
            decisionElement.className = 'pot-odds-results__value pot-odds-results__decision pot-odds-results__decision--close';
        }
    } else {
        decisionElement.textContent = 'Enter outs above to see decision';
        decisionElement.className = 'pot-odds-results__value pot-odds-results__decision';
    }
};

// PWA Install functionality
let deferredPrompt;
let installBanner;
let installButton;
let installBannerClose;

const initInstallBanner = () => {
    installBanner = document.getElementById('installBanner');
    installButton = document.getElementById('installButton');
    installBannerClose = document.getElementById('installBannerClose');
    
    // Check if we should show the install banner
    checkInstallPrompt();
    
    // Set up event listeners
    installButton.addEventListener('click', handleInstallClick);
    installBannerClose.addEventListener('click', hideInstallBanner);
    
    // Listen for beforeinstallprompt event (Android Chrome)
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallBanner();
    });
    
    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
        hideInstallBanner();
        deferredPrompt = null;
    });
};

const checkInstallPrompt = () => {
    // Don't show if user has dismissed it
    if (localStorage.getItem('installBannerDismissed') === 'true') {
        return;
    }
    
    // Check if we're in a mobile browser that supports PWA installation
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppMode = window.navigator.standalone === true;
    
    // Don't show if already installed
    if (isInStandaloneMode || isInWebAppMode) {
        return;
    }
    
    // Show on mobile devices
    if (isIOS || isAndroid) {
        showInstallBanner();
    }
};

const showInstallBanner = () => {
    if (installBanner) {
        installBanner.classList.add('install-banner--visible');
        
        // Update button text based on device
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIOS) {
            installButton.innerHTML = `
                <svg class="install-banner__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="9" cy="9" r="2"></circle>
                    <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                </svg>
                Share
            `;
        }
    }
};

const hideInstallBanner = () => {
    if (installBanner) {
        installBanner.classList.remove('install-banner--visible');
        localStorage.setItem('installBannerDismissed', 'true');
    }
};

const handleInstallClick = async () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
        // For iOS, show instructions
        showIOSInstructions();
    } else if (deferredPrompt) {
        // For Android with native prompt
        const result = await deferredPrompt.prompt();
        const outcome = await result.userChoice;
        
        if (outcome === 'accepted') {
            hideInstallBanner();
        }
        
        deferredPrompt = null;
    } else {
        // Fallback: try to trigger share menu
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Poker Outs Calculator',
                    text: 'Calculate poker hand probabilities',
                    url: window.location.href
                });
            } catch (err) {
                // User cancelled or share failed
                console.log('Share cancelled');
            }
        }
    }
};

const showIOSInstructions = () => {
    // Create a simple modal with iOS install instructions
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 20px;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 24px;
        max-width: 320px;
        text-align: center;
        color: #333;
    `;
    
    content.innerHTML = `
        <h3 style="margin: 0 0 16px 0; font-size: 18px;">Add to Home Screen</h3>
        <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.4;">
            1. Tap the Share button <svg style="display: inline; margin: 0 2px;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16,6 12,2 8,6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg><br>
            2. Scroll down and tap "Add to Home Screen"<br>
            3. Tap "Add" to confirm
        </p>
        <button onclick="this.parentElement.parentElement.remove()" style="
            background: #007AFF;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 24px;
            font-size: 16px;
            cursor: pointer;
        ">Got it</button>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Remove modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
};

// Initialize app
const init = () => {
    // Set up theme
    initTheme();
    
    // Set up install banner
    initInstallBanner();
    
    // Add event listeners
    document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('players').addEventListener('change', updateDisplay);
    document.getElementById('outs').addEventListener('input', updateDisplay);
    
    // Pot odds calculator listeners
    document.getElementById('potSize').addEventListener('input', calculatePotOdds);
    document.getElementById('betSize').addEventListener('input', calculatePotOdds);
    document.querySelectorAll('input[name="street"]').forEach(radio => {
        radio.addEventListener('change', calculatePotOdds);
    });
    
    // Initial display update
    updateDisplay();
    
    // Service worker registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('service-worker.js')
                .then(registration => console.log('ServiceWorker registered'))
                .catch(err => console.log('ServiceWorker registration failed'));
        });
    }
};

// Start the app
init();
