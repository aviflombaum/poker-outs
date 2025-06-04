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
};

// Initialize app
const init = () => {
    // Set up theme
    initTheme();
    
    // Add event listeners
    document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('players').addEventListener('change', updateDisplay);
    document.getElementById('outs').addEventListener('input', updateDisplay);
    
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
