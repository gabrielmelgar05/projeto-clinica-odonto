# ÉTER — Dental Atelier

Landing page conceitual e bilíngue (EN / PT-BR) para um consultório odontológico fictício, desenvolvida para o portfólio da **Aklio Studio**.

> *Dentistry, drawn with precision.* — *Odontologia, desenhada com precisão.*

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · GSAP 3 (ScrollTrigger, SplitText, ScrollToPlugin) · `@gsap/react` · Lucide React.

---

## Como rodar

Requisitos: **Node.js 20.9+** e npm.

```bash
npm install
npm run dev        # http://localhost:3000  → redireciona para /en
```

Produção:

```bash
npm run build
npm run start
```

Outros scripts: `npm run typecheck` (TypeScript sem emitir arquivos).

> As fontes (Instrument Sans, Instrument Serif, IBM Plex Mono) são baixadas pelo `next/font` **durante o build** e servidas pelo próprio site — o visitante não faz requisições ao Google. O primeiro `dev`/`build` precisa de internet.

### Variáveis de ambiente (opcionais)

Copie `.env.example` para `.env.local`:

| Variável | Uso |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública — usada em canonical, `hreflang`, Open Graph e sitemap. |
| `NEXT_PUBLIC_BOOKING_ENDPOINT` | Se vazia (padrão), o formulário funciona em **modo demonstração** e nada sai do navegador. Se preenchida, o formulário envia um `POST` JSON para essa URL. |

---

## Estrutura

```
src/
  app/
    [locale]/            layout raiz por idioma (html lang, fontes, metadados, hreflang)
      page.tsx           monta a landing page
      not-found.tsx      404 localizado
      [...rest]/         qualquer rota desconhecida → 404 localizado
    globals.css          tokens de design, tipografia, superfícies dos placeholders
    sitemap.ts · robots.ts
  proxy.ts               roteamento de idioma (Next 16 "proxy", antigo middleware)
  i18n/
    en.ts                textos em inglês (fonte da verdade do formato)
    pt-BR.ts             textos em português (tipado contra en.ts)
    config.ts · index.ts locales, cookie, getDictionary(), format()
  config/
    site.ts              contato demonstrativo, redes sociais, crédito, seções
    images.ts            registro central de imagens
  data/                  ids de tratamentos, equipe (nomes), mapeamento de imagens
  animations/
    gsap.ts              registro único dos plugins GSAP + media queries
    reveals.ts           primitivas: splitReveal, scrubWords, clipReveal, parallax, riseIn, drawStrokes
  components/
    brand/Logo.tsx       símbolo + wordmark em SVG (desenhados por traços)
    layout/              Preloader, Navbar, MobileMenu, Footer
    providers/           SiteProvider (idioma, dicionário, fase da intro, imagens)
    ui/                  Button, ImageSlot, LanguageSwitcher, Rich, SectionLabel, CornerMarks
  sections/              Hero, About, Treatments, Technology, Experience, Team,
                         Philosophy, Atelier, Faq, Booking
  hooks/ · lib/          useMediaQuery, scroll, booking (validação + integração), restore
public/
  images/                coloque aqui as fotografias (ver IMAGE_GUIDE.md)
  favicon.svg
```

---

## Trocar as imagens

1. Exporte as fotos com os nomes listados em **[IMAGE_GUIDE.md](./IMAGE_GUIDE.md)** (ex.: `hero.webp`, `dentist-01.webp`).
2. Coloque-as em `public/images/`.
3. Recarregue o `npm run dev` — ou rode `npm run build` de novo em produção.

Não é preciso alterar nenhum componente. O servidor verifica quais arquivos existem; os que faltam continuam exibindo o placeholder desenhado (sem 404).

- **Mudar o nome/caminho de um arquivo ou o enquadramento:** `src/config/images.ts` (o 4º argumento é o `object-position`).
- **Mudar o texto alternativo:** chave `images` nos arquivos de tradução.

---

## Editar os textos (EN / PT)

Todo o conteúdo está em `src/i18n/en.ts` e `src/i18n/pt-BR.ts`, organizado por seção (`hero`, `about`, `treatments`, `faq`, `booking`, `footer`, `a11y`, `meta`…).

Convenções dentro dos textos:

| Marcação | Resultado |
|---|---|
| `\n` | quebra de linha (cada linha anima separadamente nos títulos) |
| `*palavra*` | destaque editorial em itálico serifado |
| `{nome}` | valor inserido em tempo de execução |

`pt-BR.ts` é tipado como `Dictionary` (o formato de `en.ts`): se faltar uma chave ou houver um erro de digitação, o TypeScript acusa — não existe tradução parcial.

Para **adicionar um idioma**: inclua o código em `locales` e `localeMeta` (`src/i18n/config.ts`), crie o arquivo de dicionário e registre-o em `src/i18n/index.ts`.

### Como o idioma funciona

- Rotas localizadas: `/en` e `/pt-br` (estáticas, geradas no build). Inglês é o padrão.
- `/` redireciona para o idioma salvo no cookie `NEXT_LOCALE` ou para `/en`.
- O seletor `EN / PT` grava o cookie, navega para a outra rota e **reabre a página na mesma seção** em que o visitante estava.
- Cada idioma tem `<html lang>`, título, descrição, Open Graph, canonical e `hreflang` (`en`, `pt-BR`, `x-default`) próprios.

---

## Animações

Todas as animações usam GSAP com `useGSAP()` (que cria um `gsap.context()` por componente) e `gsap.matchMedia()` — tudo é revertido automaticamente ao desmontar, ao trocar de idioma ou ao mudar de breakpoint.

| Onde | O que acontece |
|---|---|
| **Preloader** | Linhas de construção cruzam a tela; símbolo desenhado traço a traço (órbita, horizonte, arco, ponto, acento); wordmark desenhada letra a letra; o acento gira 60° até o horizonte; a tela se abre ao meio, exatamente sobre essa linha, e a hero entra sincronizada. |
| **Hero** | Linhas do título surgem de máscaras; a foto abre a partir do horizonte (mesmo gesto do preloader); selo giratório; parallax e linhas do título se afastando com a rolagem. |
| **Sobre** | Texto que "entra em foco" palavra por palavra (scrub); fotos com clip-path e parallax em velocidades diferentes. |
| **Tratamentos** | Índice editorial que controla um palco: wipe da imagem, troca de texto, contador e indicador deslizante. No toque, acordeão com animação de altura. |
| **Tecnologia** | Seção fixa (pin) no desktop: uma linha de varredura revela cada imagem, enquanto contador, texto, índice e mostrador avançam juntos, com snap por capítulo. |
| **Experiência** | Numeral gigante fixo (sticky) que rola entre etapas, anel de progresso e linha desenhada pela rolagem. |
| **Equipe** | Carrossel com wipe direcional, nomes saindo de máscaras, arraste/swipe, setas do teclado e anúncio para leitores de tela. |
| **Filosofia** | Fundo passa de papel para tinta; manifesto acende palavra por palavra; símbolo gira e uma foto abre dentro da órbita. |
| **Ateliê** | Colagem com reveals de direções diferentes e profundidade por parallax; faixa de materiais em direções opostas. |
| **FAQ / Agendamento / Rodapé** | Acordeão com GSAP, estados animados do formulário, wordmark gigante desenhada pela rolagem. |

**Robustez:** o preloader espera as fontes no máximo 2,5 s, tem limite rígido de 9 s, um fallback em CSS caso o JavaScript não execute e uma versão curta em visitas repetidas na mesma sessão. Os reveals usam `once: true`, então nada desaparece ao voltar a uma seção. Com **prefers-reduced-motion**, pins e scrubs são desativados e o conteúdo aparece com transições mínimas.

Todos os plugins usados fazem parte do pacote público `gsap`, gratuito sob a *GSAP Standard License* (inclusive SplitText).

---

## Formulário de agendamento

- Validação em tempo real e no envio (nome, e-mail, telefone, tratamento, mensagem, consentimento), com mensagens nos dois idiomas, `aria-invalid`, `aria-describedby`, resumo de erros e foco no primeiro campo inválido.
- Escolher "Solicitar avaliação" em um tratamento preenche o campo automaticamente.
- **Modo demonstração (padrão):** nenhum dado é enviado ou armazenado, e a mensagem final deixa claro que nenhuma consulta foi marcada.
- **Integração futura:** defina `NEXT_PUBLIC_BOOKING_ENDPOINT` ou substitua o corpo de `submitBooking()` em `src/lib/booking.ts` (API própria, Server Action, CRM…). Os estados "enviado" e "erro" já estão implementados na interface.

---

## Conteúdo demonstrativo

A ÉTER é uma marca fictícia. Endereço, telefone, e-mail, equipe e redes sociais são demonstrativos e configuráveis em `src/config/site.ts` e nos dicionários. O site não apresenta preços, promessas de resultado, registros profissionais ou equipamentos específicos.

---

Design & desenvolvimento — **Aklio Studio**.
