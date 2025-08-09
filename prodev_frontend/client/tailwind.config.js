// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx}",
		"./src/components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter", "sans-serif"],
			},
			colors: {
				primary: "var(--color-primary)",
				secondary: "var(--color-secondary)",
				accent: "var(--color-accent)",
				bg: "var(--color-bg)",
				foreground: "var(--color-foreground)",
			},
			spacing: {
				128: "32rem",
				144: "36rem",
			},
			borderRadius: {
				xl: "1rem",
			},
		},
	},
	plugins: [],
};
