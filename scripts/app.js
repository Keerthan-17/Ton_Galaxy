// Initialize Telegram WebApp
const telegram = window.Telegram.WebApp;

class MiningGame {
    constructor() {
        this.coins = 0;
        this.level = 1;
        this.miningPower = 1;
        this.pickaxeCost = 10;
        
        // DOM elements
        this.coinDisplay = document.getElementById('coinCount');
        this.levelDisplay = document.getElementById('levelCount');
        this.miningWheel = document.getElementById('miningWheel');
        this.mineButton = document.getElementById('mineButton');
        this.upgradePickaxe = document.getElementById('upgradePickaxe');
        this.pickaxeCostDisplay = document.getElementById('pickaxeCost');
        
        // Initialize Telegram WebApp
        this.initializeTelegram();
        this.initializeEventListeners();
        this.loadGameState();
    }

    initializeTelegram() {
        // Expand the WebApp to full height
        telegram.expand();
        
        // Set Telegram theme variables
        document.documentElement.style.setProperty('--tg-theme-bg-color', telegram.backgroundColor);
        document.documentElement.style.setProperty('--tg-theme-text-color', telegram.textColor);
        document.documentElement.style.setProperty('--tg-theme-button-color', telegram.buttonColor);
        document.documentElement.style.setProperty('--tg-theme-button-text-color', telegram.buttonTextColor);
    }

    initializeEventListeners() {
        this.mineButton.addEventListener('click', () => this.mine());
        this.upgradePickaxe.addEventListener('click', () => this.upgrade());
        
        // Handle back button
        telegram.BackButton.onClick(() => this.saveGameState());
    }

    loadGameState() {
        // Load game state from Telegram CloudStorage if available
        const gameData = telegram.CloudStorage.getItem('miningGameState');
        if (gameData) {
            const state = JSON.parse(gameData);
            this.coins = state.coins || 0;
            this.level = state.level || 1;
            this.miningPower = state.miningPower || 1;
            this.pickaxeCost = state.pickaxeCost || 10;
            this.updateDisplay();
        }
    }

    saveGameState() {
        // Save game state to Telegram CloudStorage
        const gameState = {
            coins: this.coins,
            level: this.level,
            miningPower: this.miningPower,
            pickaxeCost: this.pickaxeCost
        };
        telegram.CloudStorage.setItem('miningGameState', JSON.stringify(gameState));
    }

    mine() {
        // Add haptic feedback
        telegram.HapticFeedback.impactOccurred('medium');
        
        // Add spinning animation
        this.miningWheel.classList.add('spinning');
        
        // Disable button during mining
        this.mineButton.disabled = true;
        
        // Mining delay for animation
        setTimeout(() => {
            this.coins += this.miningPower;
            this.updateDisplay();
            this.saveGameState();
            
            // Remove spinning animation
            this.miningWheel.classList.remove('spinning');
            this.mineButton.disabled = false;
        }, 1000);
    }

    upgrade() {
        if (this.coins >= this.pickaxeCost) {
            // Add haptic feedback
            telegram.HapticFeedback.impactOccurred('heavy');
            
            this.coins -= this.pickaxeCost;
            this.miningPower++;
            this.pickaxeCost = Math.floor(this.pickaxeCost * 1.5);
            this.level++;
            this.updateDisplay();
            this.saveGameState();
        }
    }

    updateDisplay() {
        this.coinDisplay.textContent = this.coins;
        this.levelDisplay.textContent = this.level;
        this.pickaxeCostDisplay.textContent = this.pickaxeCost;
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    const game = new MiningGame();
}); 