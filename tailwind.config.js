/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        'inter': "'Inter', serif",
        'plus-jakara': "'Plus Jakarta Sans', sans-serif",
      },
      spacing:{
        '0.2em': '0.2em',
        '0hem': '0.5em',
        '1em': '1em',
        '1hem': '1.5em',
        '2em': '2em',
        '2hem': '2.5em',
        '3em': '3em',
        '3hem': '3.5em',
        '4em': '4em',
        '4hem': '4.5em',
        '5em': '5em',
        '5hem': '5.5em',
        '6em': '6em',
        '6hem': '6.5em',
        '7em': '7em',
        '8em': '8em',
        '9em': '9em',
        '10em': '10em',
      },
      screens: {
        'xs': '340px',
        // => @media (min-width: 340px) { ... }
        
        'xsm': '500px',
        // => @media (min-width: 340px) { ... }
        'sm': '640px',
        // => @media (min-width: 640px) { ... }
  
        'smTablet': '768px',
        // => @media (min-width: 768px) { ... }
        'mdTablet': '830px',
  
        'lg': '1030px',
        // => @media (min-width: 1024px) { ... }
  
        'xl': '1279px',
        // => @media (min-width: 1280px) { ... }
  
        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
        // 'tall': { 'raw': '(min-height: 747px)' },

      },
    },
  },
  plugins: [],
}

