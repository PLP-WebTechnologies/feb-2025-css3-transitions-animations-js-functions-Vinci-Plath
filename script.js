document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const planet = document.getElementById('animated-planet');
    const spinBtn = document.getElementById('spin-planet');
    const pulseBtn = document.getElementById('pulse-planet');
    const orbitBtn = document.getElementById('orbit-planet');
    const animateDataBtn = document.getElementById('animate-data');
    const dataBars = [
        document.getElementById('data-bar-1'),
        document.getElementById('data-bar-2'),
        document.getElementById('data-bar-3')
    ];
    const starfield = document.getElementById('starfield');
    const toggleStarsBtn = document.getElementById('toggle-stars');
    const savePrefsBtn = document.getElementById('save-prefs');
    const usernameInput = document.getElementById('username');
    const colorPrefInput = document.getElementById('color-pref');
    const themeBtns = document.querySelectorAll('.theme-btn');
    
    // State variables
    let isSpinning = false;
    let isPulsing = false;
    let isOrbiting = false;
    let isDataAnimating = false;
    let isStarsActive = false;
    let shootingStarsInterval;
    
    // Initialize from localStorage
    loadPreferences();
    createStarfield();
    
    // Theme switcher
    themeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.dataset.theme;
            document.documentElement.setAttribute('data-theme', theme);
            saveToLocalStorage('cosmicTheme', theme);
            
            // Update planet background based on theme
            updatePlanetBackground(theme);
        });
    });
    
    // Planet controls
    spinBtn.addEventListener('click', toggleSpin);
    pulseBtn.addEventListener('click', togglePulse);
    orbitBtn.addEventListener('click', toggleOrbit);
    
    // Data animation
    animateDataBtn.addEventListener('click', toggleDataAnimation);
    
    // Starfield controls
    toggleStarsBtn.addEventListener('click', toggleShootingStars);
    
    // Save preferences
    savePrefsBtn.addEventListener('click', savePreferences);
    
    // Functions
    function toggleSpin() {
        isSpinning = !isSpinning;
        planet.classList.toggle('spin', isSpinning);
        spinBtn.textContent = isSpinning ? 'Stop Spin' : 'Toggle Spin';
        saveToLocalStorage('planetSpin', isSpinning);
    }
    
    function togglePulse() {
        isPulsing = !isPulsing;
        planet.classList.toggle('pulse-effect', isPulsing);
        pulseBtn.textContent = isPulsing ? 'Stop Pulse' : 'Pulse Effect';
        saveToLocalStorage('planetPulse', isPulsing);
    }
    
    function toggleOrbit() {
        isOrbiting = !isOrbiting;
        planet.classList.toggle('orbit', isOrbiting);
        orbitBtn.textContent = isOrbiting ? 'Stop Orbit' : 'Start Orbit';
        saveToLocalStorage('planetOrbit', isOrbiting);
    }
    
    function toggleDataAnimation() {
        isDataAnimating = !isDataAnimating;
        
        dataBars.forEach(bar => {
            bar.classList.toggle('animate-bars', isDataAnimating);
            
            if (isDataAnimating) {
                // Random height when animation starts
                bar.style.height = `${Math.random() * 80 + 20}%`;
            } else {
                bar.style.height = '30%';
            }
        });
        
        animateDataBtn.textContent = isDataAnimating ? 'Stop Animation' : 'Animate Data';
        saveToLocalStorage('dataAnimation', isDataAnimating);
    }
    
    function createStarfield() {
        // Clear existing stars
        starfield.innerHTML = '';
        
        // Create 100 stars
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            // Random position and size
            const size = Math.random() * 3;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            
            // Random animation delay
            star.style.animationDelay = `${Math.random() * 4}s`;
            
            starfield.appendChild(star);
        }
    }
    
    function createShootingStars() {
        // Clear existing shooting stars
        const existingShootingStars = document.querySelectorAll('.shooting-star');
        existingShootingStars.forEach(star => star.remove());
        
        // Create 3 shooting stars with random delays
        for (let i = 0; i < 3; i++) {
            const shootingStar = document.createElement('div');
            shootingStar.classList.add('shooting-star');
            
            // Random position
            shootingStar.style.left = `${Math.random() * 20}%`;
            shootingStar.style.top = `${Math.random() * 50}%`;
            
            // Random animation delay
            shootingStar.style.animationDelay = `${Math.random() * 5}s`;
            
            starfield.appendChild(shootingStar);
        }
    }
    
    function toggleShootingStars() {
        isStarsActive = !isStarsActive;
        
        if (isStarsActive) {
            createShootingStars();
            // Refresh shooting stars every 6 seconds
            shootingStarsInterval = setInterval(createShootingStars, 6000);
            toggleStarsBtn.textContent = 'Stop Shooting Stars';
        } else {
            clearInterval(shootingStarsInterval);
            const shootingStars = document.querySelectorAll('.shooting-star');
            shootingStars.forEach(star => star.remove());
            toggleStarsBtn.textContent = 'Toggle Shooting Stars';
        }
        
        saveToLocalStorage('shootingStars', isStarsActive);
    }
    
    function savePreferences() {
        const preferences = {
            username: usernameInput.value,
            colorPref: colorPrefInput.value,
            timestamp: new Date().toISOString()
        };
        
        saveToLocalStorage('userPreferences', preferences);
        
        // Visual feedback
        const feedback = document.createElement('div');
        feedback.textContent = 'Preferences saved to cosmic memory!';
        feedback.style.position = 'fixed';
        feedback.style.bottom = '20px';
        feedback.style.right = '20px';
        feedback.style.backgroundColor = 'var(--accent)';
        feedback.style.color = 'white';
        feedback.style.padding = '10px 20px';
        feedback.style.borderRadius = '5px';
        feedback.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        feedback.style.zIndex = '1000';
        feedback.style.animation = 'fadeIn 0.5s, fadeOut 0.5s 2.5s forwards';
        
        document.body.appendChild(feedback);
        
        // Remove after animation
        setTimeout(() => {
            feedback.remove();
        }, 3000);
    }
    
    function loadPreferences() {
        // Load theme
        const savedTheme = getFromLocalStorage('cosmicTheme') || 'nebula';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Update planet background based on saved theme
        updatePlanetBackground(savedTheme);
        
        // Load planet states
        isSpinning = getFromLocalStorage('planetSpin') || false;
        isPulsing = getFromLocalStorage('planetPulse') || false;
        isOrbiting = getFromLocalStorage('planetOrbit') || false;
        
        if (isSpinning) planet.classList.add('spin');
        if (isPulsing) planet.classList.add('pulse-effect');
        if (isOrbiting) planet.classList.add('orbit');
        
        spinBtn.textContent = isSpinning ? 'Stop Spin' : 'Toggle Spin';
        pulseBtn.textContent = isPulsing ? 'Stop Pulse' : 'Pulse Effect';
        orbitBtn.textContent = isOrbiting ? 'Stop Orbit' : 'Start Orbit';
        
        // Load data animation state
        isDataAnimating = getFromLocalStorage('dataAnimation') || false;
        if (isDataAnimating) {
            dataBars.forEach(bar => {
                bar.classList.add('animate-bars');
                bar.style.height = `${Math.random() * 80 + 20}%`;
            });
            animateDataBtn.textContent = 'Stop Animation';
        }
        
        // Load shooting stars state
        isStarsActive = getFromLocalStorage('shootingStars') || false;
        if (isStarsActive) {
            toggleShootingStars();
        }
        
        // Load user preferences
        const savedPrefs = getFromLocalStorage('userPreferences');
        if (savedPrefs) {
            usernameInput.value = savedPrefs.username || '';
            colorPrefInput.value = savedPrefs.colorPref || '#4d79ff';
            
            // Apply color preference to planet if it exists
            if (savedPrefs.colorPref) {
                planet.style.background = savedPrefs.colorPref;
            }
        }
    }
    
    function updatePlanetBackground(theme) {
        switch(theme) {
            case 'nebula':
                planet.style.background = 'var(--nebula)';
                break;
            case 'supernova':
                planet.style.background = 'var(--supernova)';
                break;
            case 'dark-matter':
                planet.style.background = 'var(--dark-matter)';
                break;
        }
    }
    
    // Helper functions for localStorage
    function saveToLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Could not save to localStorage', e);
        }
    }
    
    function getFromLocalStorage(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Could not retrieve from localStorage', e);
            return null;
        }
    }
    
    // Add CSS for feedback animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(style);
});