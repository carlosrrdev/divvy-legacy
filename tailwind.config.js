import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./partials/**/*.html", "./app.js", "./src/**/*.js"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [{
      divvyLight: {
        "primary": "#074efd",
        "secondary": "#09101c",
        "accent": "#3e434d",
        "neutral": "#6f7881",
        "base-100": "#f8fbff",
        "info": "#d0e1f4",
        "success": "#a7e4b5",
        "warning": "#ff8800",
        "error": "#f34160",
      },
      divvyDark: {
        "primary": "#9a96d7",
        "secondary": "#8a93cb",
        "accent": "#a5a5be",
        "neutral": "#81819a",
        "base-100": "#121219",
        "info": "#363855",
        "success": "#68c586",
        "warning": "#dfb65f",
        "error": "#ea6886",
      }
    },],
    darkTheme: "divvyDark"
  },
  plugins: [daisyui],
}

