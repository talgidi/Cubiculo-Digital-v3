import { Providers } from '@/providers';
import './globals.css'; // Asegúrate de que esto esté aquí

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Aseguramos que la app use el fondo correcto por defecto y en modo oscuro
    <html lang="es" suppressHydrationWarning>
      <body className="bg-white dark:bg-[#101622] transition-colors duration-300">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
