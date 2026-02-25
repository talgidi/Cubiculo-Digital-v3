import { Providers } from '@/providers';
import './globals.css'; // Asegúrate de que esto esté aquí

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Aseguramos que la app use el fondo correcto por defecto y en modo oscuro
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Este script se ejecuta ANTES de que React cargue, evitando el flash blanco */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="bg-white dark:bg-[#101622] transition-colors duration-300">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
