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

// Initialize app
const init = () => {
    // Set up theme
    initTheme();
    
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
