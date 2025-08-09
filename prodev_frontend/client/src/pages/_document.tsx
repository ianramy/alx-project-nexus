// src/pages/_document.tsx

import { Html, Head, Main, NextScript } from "next/document";

const setInitialTheme = `
(function() {
    try {
        var stored = localStorage.getItem('theme');      // 'light' | 'dark' | null
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var theme = stored ? stored : (prefersDark ? 'dark' : 'light');
        if (theme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    } catch (e) {}
})();
`;

export default function Document() {
    return (
        <Html lang="en">
            <Head />
            <body>
                {/* Run BEFORE Tailwind applies styles */}
                <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
