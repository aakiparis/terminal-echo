class ThemeManager {
    constructor() {
        this.themes = {
            amber: {
                name: 'Amber',
                primary: '#FFB000',
                bgDark: '#0f0b00',
                bgDarker: '#222',
                bgLight: '#ffcf661c',
                textShadow: '0 0 10px #ffb000'
            },
            green: {
                name: 'Green',
                primary: '#33FF00',
                bgDark: '#0a180a',
                bgDarker: '#222',
                bgLight: 'rgba(0, 255, 0, 0.1)',
                textShadow: '0 0 10px #33ff00'
            },
            white: {
                name: 'White',
                primary: '#FFFFFF',
                bgDark: '#1a1a1a',
                bgDarker: '#222',
                bgLight: 'rgba(255, 255, 255, 0.1)',
                textShadow: '0 0 10px #ffffff'
            }
        };
        this.currentTheme = 'amber';
        this.loadTheme();
    }

    loadTheme() {
        try {
            const savedTheme = localStorage.getItem('terminal-echo-theme');
            if (savedTheme && this.themes[savedTheme]) {
                this.currentTheme = savedTheme;
            }
        } catch (error) {
            console.warn('Could not load theme from localStorage:', error);
        }
        this.applyTheme(this.currentTheme);
    }

    applyTheme(themeName) {
        if (!this.themes[themeName]) {
            console.warn(`Theme "${themeName}" not found, using default`);
            themeName = 'amber';
        }

        const theme = this.themes[themeName];
        const root = document.documentElement;

        root.style.setProperty('--color-primary', theme.primary);
        root.style.setProperty('--color-bg-dark', theme.bgDark);
        root.style.setProperty('--color-bg-darker', theme.bgDarker);
        root.style.setProperty('--color-bg-light', theme.bgLight);
        root.style.setProperty('--color-border', theme.primary);
        root.style.setProperty('--color-text', theme.primary);
        root.style.setProperty('--text-shadow', theme.textShadow);

        // Convert hex color to RGB for scanning line gradient
        const rgb = this.hexToRgb(theme.primary);
        if (rgb) {
            root.style.setProperty('--scan-line-color', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
            root.style.setProperty('--scan-line-color-mid', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`);
            root.style.setProperty('--scan-line-color-end', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`);
        }

        // Update glow effects in terminal-frame
        const terminalFrame = document.querySelector('.terminal-frame');
        if (terminalFrame) {
            terminalFrame.style.boxShadow = `0 0 20px rgba(0, 0, 0, 0.5), inset 0 0 15px ${theme.primary}`;
        }

        this.currentTheme = themeName;

        try {
            localStorage.setItem('terminal-echo-theme', themeName);
        } catch (error) {
            console.warn('Could not save theme to localStorage:', error);
        }
    }

    hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Parse hex to RGB
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return { r, g, b };
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getThemeName(themeKey) {
        return this.themes[themeKey]?.name || themeKey;
    }

    getAllThemes() {
        return Object.keys(this.themes);
    }
}
