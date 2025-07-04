import { createContext, useContext, useEffect, useState } from 'react';

// Theme modes
const MODES = {
    SYSTEM: 'system',
    DARK: 'dark',
    LIGHT: 'light'
};

// Color schemes
const COLOR_SCHEMES = {
    DEFAULT: 'default',       // Ocean Breeze (light) / Midnight Ocean (dark)
    SUNSET: 'sunset',         // Sunset Glow (light) / Amber Sunset (dark)
    NEOMINT: 'neomint',       // Neo Mint (light) / Emerald Night (dark)
    AMETHYST: 'amethyst',     // Amethyst Dream (light) / Mystic Amethyst (dark)
    ROSE: 'rose',             // Rose Gold (light) / Crimson Night (dark)
    MIDNIGHT: 'midnight',     // Ocean Breeze + Cosmic Indigo theme (dark)
    EMERALD: 'emerald',       // Neo Mint + Emerald Night theme (dark)
    SLATE: 'slate',           // Ocean Breeze + Dark Slate theme (dark)
    TEAL: 'teal'              // Teal Breeze (light) / Twilight Teal (dark)
};

// Legacy theme format for backward compatibility
const THEMES = {
    LIGHT: 'light',
    LIGHT_SUNSET: 'light-sunset',
    LIGHT_NEOMINT: 'light-neomint',
    LIGHT_AMETHYST: 'light-amethyst',
    LIGHT_ROSE: 'light-rose',
    LIGHT_TEAL: 'light-teal',
    DARK: 'dark',
    DARK_MIDNIGHT: 'dark-midnight',
    DARK_EMERALD: 'dark-emerald',
    DARK_AMETHYST: 'dark-amethyst',
    DARK_ROSE: 'dark-rose',
    DARK_SUNSET: 'dark-sunset',
    DARK_SLATE: 'dark-slate',
    DARK_TEAL: 'dark-teal',
    SYSTEM: 'system'
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // Get saved preferences or use defaults
    const [mode, setMode] = useState(() => {
        if (typeof window !== 'undefined') {
            // Try to get the mode from localStorage
            const savedMode = localStorage.getItem('themeMode');
            // For backward compatibility
            const savedTheme = localStorage.getItem('theme');
            if (savedMode) return savedMode;
            if (savedTheme === THEMES.SYSTEM) return MODES.SYSTEM;
            if (savedTheme?.startsWith('dark')) return MODES.DARK;
            if (savedTheme?.startsWith('light')) return MODES.LIGHT;
        }
        return MODES.SYSTEM;
    });

    const [colorScheme, setColorScheme] = useState(() => {
        if (typeof window !== 'undefined') {
            // Try to get the color scheme from localStorage
            const savedColorScheme = localStorage.getItem('themeColorScheme');
            // For backward compatibility
            const savedTheme = localStorage.getItem('theme');
            if (savedColorScheme) return savedColorScheme;
            if (savedTheme?.includes('sunset')) return COLOR_SCHEMES.SUNSET;
            if (savedTheme?.includes('neomint')) return COLOR_SCHEMES.NEOMINT;
            if (savedTheme?.includes('amethyst')) return COLOR_SCHEMES.AMETHYST;
            if (savedTheme?.includes('rose')) return COLOR_SCHEMES.ROSE;
            if (savedTheme?.includes('midnight')) return COLOR_SCHEMES.MIDNIGHT;
            if (savedTheme?.includes('emerald')) return COLOR_SCHEMES.EMERALD;
            if (savedTheme?.includes('slate')) return COLOR_SCHEMES.SLATE;
            if (savedTheme?.includes('teal')) return COLOR_SCHEMES.TEAL;
            // Legacy mapping
            if (savedTheme?.includes('blue')) return COLOR_SCHEMES.DEFAULT;
            if (savedTheme?.includes('green')) return COLOR_SCHEMES.NEOMINT;
            if (savedTheme?.includes('purple')) return COLOR_SCHEMES.AMETHYST;
        }
        return COLOR_SCHEMES.DEFAULT;
    });

    // For backward compatibility
    const [theme, setTheme] = useState(THEMES.SYSTEM);

    const [systemTheme, setSystemTheme] = useState(() => {
        // Check system preference
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    });

    // Determine the effective dark/light mode
    const effectiveMode = mode === MODES.SYSTEM ? systemTheme : mode;

    // Set the effective theme based on mode and color scheme
    const getEffectiveTheme = () => {
        const baseMode = effectiveMode === 'dark' ? 'dark' : 'light';
        if (colorScheme === COLOR_SCHEMES.DEFAULT) return baseMode;
        return `${baseMode}-${colorScheme}`;
    };

    const currentTheme = getEffectiveTheme();

    // Update theme settings in localStorage when they change
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('themeMode', mode);
            localStorage.setItem('themeColorScheme', colorScheme);

            // For backward compatibility
            const legacyTheme = mode === MODES.SYSTEM 
                ? THEMES.SYSTEM 
                : currentTheme;
            localStorage.setItem('theme', legacyTheme);
        }
    }, [mode, colorScheme, currentTheme]);

    // Listen for system theme changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            const handleChange = (e) => {
                setSystemTheme(e.matches ? 'dark' : 'light');
            };

            mediaQuery.addEventListener('change', handleChange);

            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, []);

    // Apply theme to document
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const root = window.document.documentElement;

            // Determine if dark mode should be active
            const isDarkMode = effectiveMode === 'dark';

            // First remove all possible theme classes
            Object.values(MODES).forEach(modeName => {
                if (modeName !== MODES.SYSTEM) {
                    root.classList.remove(modeName);
                }
            });

            Object.values(COLOR_SCHEMES).forEach(scheme => {
                root.classList.remove(`light-${scheme}`);
                root.classList.remove(`dark-${scheme}`);
            });

            // Also remove legacy theme classes
            Object.values(THEMES).forEach(themeName => {
                if (themeName !== THEMES.SYSTEM) {
                    root.classList.remove(themeName);
                }
            });

            // Add appropriate theme class
            root.classList.add(currentTheme);

            // Toggle dark mode class for Tailwind
            if (isDarkMode) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }

            // Set data attributes for debugging
            root.setAttribute('data-theme-mode', mode);
            root.setAttribute('data-theme-color', colorScheme);
            root.setAttribute('data-theme', currentTheme);
            root.setAttribute('data-dark-mode', isDarkMode ? 'true' : 'false');
        }
    }, [mode, colorScheme, systemTheme, currentTheme, effectiveMode]);

    // For backward compatibility - map new state to old setTheme function
    useEffect(() => {
        const newTheme = mode === MODES.SYSTEM ? THEMES.SYSTEM : currentTheme;
        setTheme(newTheme);
    }, [mode, currentTheme]);

    const value = {
        // New API
        mode,
        setMode,
        colorScheme,
        setColorScheme,
        effectiveMode,
        MODES,
        COLOR_SCHEMES,

        // Backward compatibility
        theme,
        setTheme,
        availableThemes: THEMES,
        currentTheme,
        systemTheme
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

export { THEMES, MODES, COLOR_SCHEMES };
