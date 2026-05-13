import "./globals.css";

export const metadata = {
  title: "Guia de Saúde Bairro",
  description: "Modern healthcare directory and prescription service.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Guia Saúde"
  },
  formatDetection: {
    telephone: false
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2F6FED"
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body className="bg-gray-100 text-gray-900 min-h-screen font-sans antialiased overflow-x-hidden">
        <main className="w-full max-w-md mx-auto relative bg-[#F5F7FA] min-h-[100dvh] shadow-[0_0_40px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
           {children}
        </main>
      </body>
    </html>
  );
}
