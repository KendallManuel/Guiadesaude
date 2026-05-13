export default function manifest() {
  return {
    name: 'Guia de Saúde Bairro',
    short_name: 'Guia Saúde',
    description: 'Acesso rápido a hospitais, clínicas e farmácias',
    start_url: '/',
    display: 'standalone',
    background_color: '#F5F7FA',
    theme_color: '#2F6FED',
    icons: [
      {
        src: '/app-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any maskable'
      }
    ],
  }
}
