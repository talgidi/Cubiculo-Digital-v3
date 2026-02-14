import { ApolloWrapper } from '@/providers/apollo-provider';
import { ThemeProvider } from '@/providers/ThemeProvider'; // Importar ThemeProvider
import './globals.css'; // Asegúrate de que esto esté aquí

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Aseguramos que la app use el fondo correcto por defecto y en modo oscuro
    <html lang="es">
      <body>
        <ThemeProvider>
          <ApolloWrapper>{children}</ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
