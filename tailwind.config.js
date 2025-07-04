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
        },

        extend: {
            screens: {
                xs3: '100px',
                xs2: '200px',
                xs: '300px',
            },
            fontFamily: {
                sans: ['Noto Sans', 'sans-serif', ...defaultTheme.fontFamily.sans],
            },
            animation: {
                'pop-in': 'pop-in .5s ease-in-out 1',
                'pop-in-lg': 'pop-in-lg .3s ease-in-out 1',
                'pop-out-lg': 'pop-out-lg .3s ease-in-out 1',
                'tilt': 'tilt 2s ease-in-out infinite',
            },
            keyframes: {
                'tilt': {
                    '0%': { rotate: ('-4deg') },
                    '50%': { rotate: '4deg' },
                    '100%': { rotate: '-4deg' },
                },
                'pop-in': {
                    '0%': { scale: '30%', opacity: '0%' },
                    '80%': { scale: '120%', opacity: '100%' },
                    '90%': { scale: '93%', opacity: '90%' },
                    '95%': { scale: '101%', opacity: '100%' },
                    '100%': { scale: '100%', opacity: '100%' },
                },

                'pop-in-lg': {
                    '0%': { scale: '70%', opacity: '0%' },
                    '20%': { scale: '98%', opacity: '90%' },
                    '80%': { scale: '105%', opacity: '80%' },
                    '95%': { scale: '98%', opacity: '95%' },
                    '100%': { scale: '100%', opacity: '100%' },
                },

                'pop-out-lg': {
                    '0%': { scale: '100%', opacity: '100%' },
                    '20%': { scale: '98%', opacity: '95%' },
                    '80%': { scale: '105%', opacity: '80%' },
                    '95%': { scale: '98%', opacity: '90%' },
                    '100%': { scale: '70%', opacity: '0%' },
                },

            },

            transitionTimingFunction: {
                'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
                'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
            },
        },
    },

    plugins: [
        // require( '@tailwindcss/forms' ),
        require('@tailwindcss/container-queries'),
    ],
}
