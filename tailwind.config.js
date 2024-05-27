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
        "neutral": "#2e3236",
        "base-100": "#f8fbff",
        "info": "#45cbf3",
        "success": "#57c971",
        "warning": "#de7a06",
        "error": "#f34160",
      },
      divvyDark: {
        "primary": "#9a96d7",
        "secondary": "#938de5",
        "accent": "#a5a5be",
        "neutral": "#25252d",
        "base-100": "#121219",
        "info": "#675eec",
        "success": "#34c462",
        "warning": "#dfb65f",
        "error": "#ea4269",
      }
    },],
    darkTheme: "divvyDark"
  },
  plugins: [daisyui],
}

