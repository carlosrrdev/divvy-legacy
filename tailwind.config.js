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
        "primary": "#7bbbff",
        "secondary": "#0a0f15",
        "accent": "#53514c",
        "neutral": "#dddacd",
        "base-100": "#f4f3f1",
        "info": "#b3dffa",
        "success": "#95f7c6",
        "warning": "#e49f59",
        "error": "#fd6f95",
      },
      divvyDark: {
        "primary": "#9a96d7",
        "secondary": "#8a93cb",
        "accent": "#86869e",
        "neutral": "#81819a",
        "base-100": "#121219",
        "info": "#363855",
        "success": "#3bcf8d",
        "warning": "#dfb65f",
        "error": "#ea6886",
      }
    },],
    darkTheme: "divvyDark"
  },
  plugins: [daisyui],
}

