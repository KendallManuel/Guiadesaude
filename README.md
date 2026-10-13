# Guia de Saúde Bairro 🏥🇲🇿

Bem-vindo ao **Guia de Saúde Bairro**, uma aplicação web progressiva (PWA) desenhada para facilitar o acesso à saúde e à gestão de receitas médicas em Moçambique. O foco principal deste projeto é a **acessibilidade digital**, **baixa latência** e **inclusão linguística**.

---

## 🎯 O Que é Este Projeto?

O Guia de Saúde Bairro atua como um diretório inteligente e assistente virtual. Foi construído com uma filosofia *mobile-first*, focado em utilizadores com literacia digital variável. 

### Funcionalidades Principais:
1. **Diretório Georreferenciado**: Lista hospitais, clínicas e farmácias. Utiliza a API nativa de GPS (`navigator.geolocation`) para detetar a província do utilizador em tempo real e filtrar as instituições mais próximas.
2. **Gestão de Receitas (Simulação de Chat)**: Um fluxo interativo onde o utilizador tira uma foto à sua receita médica (usando a câmara do telemóvel), aguarda a leitura, e é conectado a um chat simulado com a farmácia mais próxima que esteja **aberta**, gerando um ticket digital de reserva.
3. **Assistente de Voz**: Integração direta com a `Web Speech API` para permitir pesquisas por voz, fundamental para utilizadores com dificuldades de escrita.
4. **Motor Multi-idioma (i18n)**: Suporte nativo para Português, Inglês e 7 línguas locais moçambicanas (Changana, Emakhuwa, Nyanja, Sena, Chwabo, Yao, Makonde) utilizando um sistema de dicionário reativo.
5. **Dark Mode Nativo Dinâmico**: Sistema de tema inteligente que respeita as preferências do sistema operativo (`matchMedia`) utilizando injeções avançadas no compilador do Tailwind v4 (`@variant dark`).

---

## 🛠 Tech Stack

Para garantir que a aplicação é extremamente rápida e funciona bem em redes 3G, não há dependência de backends pesados nesta versão MVP. Tudo corre no lado do cliente.

- **Framework Core**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animações**: [Framer Motion](https://www.framer.com/motion/) (utilizado para interações orgânicas como deslizar de tabs e abertura do assistente de voz)
- **Ícones**: [Lucide React](https://lucide.dev/)

---

## 📂 Arquitetura e Ficheiros Críticos

A maior parte da magia acontece dentro de `src/app/page.js`, que funciona como uma *Single Page Application* dentro do ecossistema do Next.js.

- `src/app/page.js`: Contém o estado global (Zustand não foi necessário devido à simplicidade da prop drilling neste escopo), a base de dados em memória (`mockInstitutions`), os dicionários de tradução, e a lógica completa de renderização condicional.
- `src/app/globals.css`: Gere o sistema de design "Soft Blue" e orquestra a inversão matemática de cores para o **Dark Mode**. Utilizamos `@variant dark (&:where(.dark, .dark *));` para garantir que o *toggle* manual sobrescreve sempre o comportamento nativo do OS.
- `next.config.mjs`: Configurado para ignorar o `devIndicators` (Remoção daquele "N" preto no canto inferior durante o dev).

---

## 🚀 Como Correr Localmente

Se clonaste este repositório, basta seguir os seguintes passos:

1. Instala as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

2. Arranca o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Abre `http://localhost:3000` no teu browser. (Dica: Usa o DevTools para simular um telemóvel, pois o UI foi altamente otimizado para `max-w-md`).

---

## 🌍 Estratégia de Deploy

Esta aplicação é uma app estática de Next.js (`client-side`). Pode ser alojada gratuitamente e de forma extremamente rápida na **Vercel**.

Para fazer deploy, basta correr:
```bash
npx vercel
```
A Vercel deteta automaticamente que é um projeto Next.js e configura as *build commands* corretas (`npm run build`).

---

## 💡 Notas para Futuros Desenvolvedores
- **Adicionar Novas Farmácias**: Basta anexar objetos à array `mockInstitutions` no ficheiro `page.js`. Garanta que a flag `isOpen: true/false` está configurada corretamente, pois o bot do chat de receitas só responde se houver pelo menos 1 farmácia `isOpen` na província do utilizador.
- **Backend (Next Steps)**: Se o projeto evoluir, recomendo extrair a simulação de chat e o OCR de fotos para uma *Server Action* do Next.js comunicando com uma API (como AWS Textract ou OpenAI Vision) e guardar os tickets num banco de dados via Prisma/Supabase.
