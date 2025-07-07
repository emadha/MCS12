const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    darkMode: 'class',

    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                sans: ["Fira Sans", "sans-serif"],
                display: ["Poppins", "sans-serif"],
                mono: ["JetBrains Mono", "Fira Code", "monospace"],
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            keyframes: {
                "accordion-down": {
                    from: {height: 0},
                    to: {height: "var(--radix-accordion-content-height)"},
                },
                "accordion-up": {
                    from: {height: "var(--radix-accordion-content-height)"},
                    to: {height: 0},
                },
                "fade": {
                    "0%": {
                        opacity: "0",
                        transform: "translateY(24px) scale(0.96)",
                    },
                    "100%": {
                        opacity: "1",
                        transform: "translateY(0) scale(1)",
                    },
                },
                "slide-gentle": {
                    "0%": {
                        opacity: "0",
                        transform: "translateX(-24px)",
                    },
                    "100%": {
                        opacity: "1",
                        transform: "translateX(0)",
                    },
                },
                "bounce": {
                    "0%, 100%": {
                        transform: "translateY(0)",
                        animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
                    },
                    "50%": {
                        transform: "translateY(-8px)",
                        animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
                    },
                },
                "wiggle": {
                    "0%, 100%": {transform: "rotate(-0.5deg)"},
                    "50%": {transform: "rotate(0.5deg)"},
                },
                shimmer: {
                    "0%": {transform: "translateX(-100%)"},
                    "100%": {transform: "translateX(100%)"},
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade": "fade 1s cubic-bezier(0.19, 1, 0.22, 1)",
                "slide-gentle": "slide-gentle 0.8s cubic-bezier(0.19, 1, 0.22, 1)",
                "bounce": "bounce 3s infinite",
                "wiggle": "wiggle 4s ease-in-out infinite",
                shimmer: "shimmer 2s infinite",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "gradient": "linear-gradient(120deg, var(--tw-gradient-stops))",
            },
            spacing: {
                18: "4.5rem",
                88: "22rem",
                128: "32rem",
            },
        },
    },

    plugins: [
        // require( '@tailwindcss/forms' ),
        require('@tailwindcss/container-queries'),
        require("tailwindcss-animate")
    ],
}
