class NeonObfuscatorUI {
    constructor() {
        this.obfuscator = new IronBrew2ModObfuscator();
        this.initElements();
        this.setupEventListeners();
        this.loadExample();
    }

    initElements() {
        this.inputCode = document.getElementById('inputCode');
        this.outputCode = document.getElementById('outputCode');
        this.obfuscateBtn = document.getElementById('obfuscateBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.exampleBtn = document.getElementById('exampleBtn');
        
        // Settings
        this.vmLevel = document.getElementById('vmLevel');
        this.stringEncryption = document.getElementById('stringEncryption');
        this.controlFlow = document.getElementById('controlFlow');
        this.antiTamper = document.getElementById('antiTamper');
        
        // Stats
        this.originalSize = document.getElementById('originalSize');
        this.obfuscatedSize = document.getElementById('obfuscatedSize');
        this.protectionLevel = document.getElementById('protectionLevel');
        this.processingTime = document.getElementById('processingTime');
        
        // Loading
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.loadingText = document.getElementById('loadingText');
    }

    setupEventListeners() {
        this.obfuscateBtn.addEventListener('click', () => this.obfuscate());
        this.copyBtn.addEventListener('click', () => this.copyOutput());
        this.downloadBtn.addEventListener('click', () => this.downloadOutput());
        this.clearBtn.addEventListener('click', () => this.clearInput());
        this.exampleBtn.addEventListener('click', () => this.loadExample());
        
        // Update stats on input
        this.inputCode.addEventListener('input', () => {
            this.originalSize.textContent = this.inputCode.value.length;
        });
    }

    async obfuscate() {
        const code = this.inputCode.value.trim();
        if (!code) {
            this.showNotification('Please enter some code first!', 'error');
            return;
        }

        this.showLoading(true);
        
        const settings = {
            vmLevel: this.vmLevel.value,
            stringEncryption: this.stringEncryption.value,
            controlFlow: this.controlFlow.value,
            antiTamper: this.antiTamper.value
        };

        try {
            // Simulate processing for better UX
            await this.simulateProgress();
            
            const result = this.obfuscator.obfuscate(code, settings);
            
            this.outputCode.value = result.code;
            
            // Update stats
            this.updateStats(result.stats);
            
            this.showNotification('Code obfuscated successfully!', 'success');
        } catch (error) {
            console.error('Obfuscation error:', error);
            this.showNotification('Error during obfuscation', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    simulateProgress() {
        return new Promise(resolve => {
            const steps = [
                'Parsing code structure...',
                'Encrypting strings...',
                'Applying VM protection...',
                'Obfuscating control flow...',
                'Adding anti-tamper...',
                'Finalizing...'
            ];
            
            let step = 0;
            const interval = setInterval(() => {
                if (step < steps.length) {
                    this.loadingText.textContent = steps[step];
                    step++;
                } else {
                    clearInterval(interval);
                    resolve();
                }
            }, 500);
        });
    }

    updateStats(stats) {
        this.originalSize.textContent = stats.originalSize;
        this.obfuscatedSize.textContent = stats.obfuscatedSize;
        this.protectionLevel.textContent = stats.protectionLevel + '%';
        this.processingTime.textContent = stats.time + 's';
    }

    copyOutput() {
        if (!this.outputCode.value.trim()) {
            this.showNotification('No output to copy!', 'error');
            return;
        }
        
        this.outputCode.select();
        navigator.clipboard.writeText(this.outputCode.value)
            .then(() => this.showNotification('Copied to clipboard!', 'success'))
            .catch(err => this.showNotification('Failed to copy: ' + err, 'error'));
    }

    downloadOutput() {
        const code = this.outputCode.value.trim();
        if (!code) {
            this.showNotification('No output to download!', 'error');
            return;
        }
        
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'obfuscated.lua';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Download started!', 'success');
    }

    clearInput() {
        this.inputCode.value = '';
        this.outputCode.value = '';
        this.originalSize.textContent = '0';
        this.obfuscatedSize.textContent = '0';
        this.showNotification('Cleared!', 'info');
    }

    loadExample() {
        const example = `-- Simple Lua example
local function greet(name)
    print("Hello, " .. name)
end

local players = {"Alice", "Bob", "Charlie"}
local scores = {100, 200, 150}

for i, player in ipairs(players) do
    greet(player)
    print("Score: " .. scores[i])
end

local total = 0
for _, score in pairs(scores) do
    total = total + score
end
print("Total score: " .. total)`;
        
        this.inputCode.value = example;
        this.originalSize.textContent = example.length;
        this.showNotification('Example loaded!', 'info');
    }

    showLoading(show) {
        this.loadingOverlay.style.display = show ? 'flex' : 'none';
    }

    showNotification(message, type) {
        // Simple notification system
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            color: white;
            font-weight: bold;
            z-index: 1001;
            animation: slideIn 0.3s ease;
            background: ${type === 'error' ? '#ff4444' : type === 'success' ? '#44ff44' : '#4444ff'};
            border-left: 5px solid ${type === 'error' ? '#ff0000' : type === 'success' ? '#00ff00' : '#0000ff'};
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.ui = new NeonObfuscatorUI();
});
