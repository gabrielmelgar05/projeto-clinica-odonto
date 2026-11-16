# ÉTER — Guia de imagens

Este guia lista **todas as 29 fotografias** que a landing page espera. O layout, as máscaras e as animações já estão prontos: basta exportar cada imagem com o **nome exato** abaixo e colocá-la em `public/images/`.

- Enquanto um arquivo não existir, o espaço mostra um placeholder desenhado (com o nome do arquivo e a proporção) — sem imagens quebradas e sem requisições 404.
- Ao adicionar o arquivo, ele é carregado automaticamente via `next/image` (AVIF/WebP responsivo, lazy-loading).
- Em `npm run dev` a troca é imediata (recarregue a página). Em produção, rode `npm run build` novamente.
- Registro central: `src/config/images.ts`. Textos alternativos (alt) em EN/PT: chave `images` em `src/i18n/en.ts` e `src/i18n/pt-BR.ts`.

---

## Direção de arte geral

A ÉTER une dois universos, e as fotos devem reforçar essa alternância:

| Universo | Onde | Linguagem |
|---|---|---|
| **Cinematográfico escuro** | Hero, Tecnologia, Filosofia, Agendamento, alguns tratamentos | Fundo preto/grafite, luz lateral recortada (key light dura, quase sem fill), reflexos metálicos, luvas azul-escuras, lupas, radiografias retroiluminadas. Grão fino é bem-vindo. |
| **Editorial claro** | Sobre, Ateliê, Equipe, Jornada do paciente | Luz natural difusa, paredes claras, materiais (pedra, carvalho, linho, aço escovado), muito espaço negativo, sombras suaves. |

**Paleta de referência para tratamento de cor:** branco editorial `#F7F7F5`, preto `#101112`, cinza-metálico `#8C969D`, azul clínico `#7898AD`, azul profundo `#263D4C`. Puxe os tons frios (azul/ciano) nas sombras; evite amarelos e verdes saturados. Pele natural, sem retoque excessivo.

**Evite:** sorrisos "de banco de imagem", sangue explícito, dentes artificialmente brancos, textos/logos de fabricantes legíveis, telas com dados de pacientes reais.

**Formato de exportação:** `.webp`, qualidade 80–85, sRGB. Mantenha um respiro de ~8% em todas as bordas: muitos espaços têm parallax (a imagem é ampliada levemente e se desloca na rolagem).

---

## 01 · Hero

### `hero.webp`
- **Seção:** Hero (primeira dobra).
- **Conteúdo:** dentista com lupas de magnificação, concentrado em um procedimento, mãos com luvas próximas ao rosto do paciente (paciente fora de foco ou fora do quadro).
- **Proporção:** 16:10 no desktop · recortada em 4:5 no mobile.
- **Resolução recomendada:** 2560 × 1600 px.
- **Enquadramento:** sujeito centralizado, olhos/lupas no terço superior (o foco padrão é `50% 35%`). Deixe o canto inferior direito mais escuro e limpo: ali fica o cartão "Avaliação primeiro".
- **Iluminação:** luz dura lateral vinda do alto, recortando lupas e máscara; fundo caindo para preto.
- **Direção de arte:** cinematográfica, contemplativa, precisão. Profundidade de campo rasa.
- **Desktop / mobile:** no mobile o corte é vertical (4:5) a partir do centro — mantenha o rosto e as lupas dentro da faixa central de ~60% da largura.

---

## 02 · Sobre a clínica

### `about-reception.webp`
- **Conteúdo:** recepção da clínica — balcão em pedra ou madeira clara, uma cadeira de design, luz natural.
- **Proporção:** 4:5 · **Resolução:** 1600 × 2000 px.
- **Enquadramento:** vertical, linhas arquitetônicas retas, horizonte baixo, bastante parede livre no topo.
- **Iluminação:** luz natural difusa de janela lateral.
- **Direção de arte:** editorial, calma, minimalista. **Mobile:** mesmo arquivo, largura total.

### `about-detail.webp`
- **Conteúdo:** detalhe de material — textura de pedra, junta de marcenaria, maçaneta de aço escovado, tecido de linho.
- **Proporção:** 3:2 · **Resolução:** 1500 × 1000 px.
- **Enquadramento:** macro/close, composição gráfica. Fica sobreposta ao canto da foto da recepção.
- **Iluminação:** luz rasante que revele textura. **Mobile:** exibida menor, abaixo da recepção.

---

## 03 · Tratamentos

No desktop as seis imagens aparecem em um "palco" horizontal **5:4** com o texto sobreposto na parte inferior (há um gradiente escuro). No mobile cada uma aparece em **16:11** dentro do acordeão.

| Arquivo | Conteúdo sugerido | Tom |
|---|---|---|
| `treatment-general.webp` | Exame clínico com espelho e sonda, gesto calmo | escuro |
| `treatment-cosmetic.webp` | Close de um sorriso natural (lábios e dentes), pele real | claro |
| `treatment-orthodontics.webp` | Alinhador transparente segurado entre dedos com luva | escuro |
| `treatment-implants.webp` | Detalhe de trabalho restaurador / componente sobre fundo neutro | escuro |
| `treatment-whitening.webp` | Retrato suave de paciente sorrindo, luz de janela | claro |
| `treatment-preventive.webp` | Instrumentos de higiene organizados em bandeja de aço | claro |

- **Proporção:** 5:4 · **Resolução:** 2000 × 1600 px.
- **Enquadramento:** assunto principal no **terço superior** (o terço inferior recebe título, descrição e botão).
- **Iluminação:** coerente entre as seis — mesma temperatura de cor, contraste médio-alto.
- **Mobile:** recorte 16:11 central; evite elementos importantes nas bordas laterais.

---

## 04 · Tecnologia e precisão

Exibidas em uma moldura vertical **4:5**. No desktop a seção fica fixa e cada imagem é revelada por uma "linha de varredura" (como um scanner de radiografia). Em todas, mantenha o **canto inferior esquerdo** escuro: ali aparece a legenda "Fig. 04".

| Arquivo | Conteúdo |
|---|---|
| `tech-imaging.webp` | Radiografia odontológica (panorâmica ou periapical) retroiluminada, em mãos com luvas ou sobre negatoscópio |
| `tech-planning.webp` | Profissional analisando um plano em tela — dados ilegíveis/desfocados |
| `tech-instruments.webp` | Instrumentos metálicos polidos (espelho, sonda, cureta) sobre fundo preto ou azul-profundo |
| `tech-equipment.webp` | Cadeira e refletor odontológico em sala à meia-luz, silhueta do equipamento |
| `tech-procedures.webp` | Mãos com luvas azul-escuras segurando a caneta de alta rotação, névoa de spray em contraluz |

- **Proporção:** 4:5 · **Resolução:** 1600 × 2000 px.
- **Iluminação:** low-key, recorte lateral, reflexos especulares no metal, fundo quase preto.
- **Direção de arte:** técnica, precisa, cinematográfica (as referências escuras do moodboard).
- **Mobile:** mesmas imagens, em cartões verticais empilhados.

---

## 05 · Experiência do paciente

| Arquivo | Etapa | Conteúdo |
|---|---|---|
| `experience-consultation.webp` | 01 Consulta | Dentista e paciente conversando, sentados, sem procedimento |
| `experience-planning.webp` | 02 Planejamento | Plano sendo explicado — mãos apontando para tela/papel |
| `experience-treatment.webp` | 03 Tratamento | Sessão tranquila, sala com luz suave (tom mais escuro) |
| `experience-care.webp` | 04 Cuidado contínuo | Paciente relaxado saindo da clínica, ou momento de despedida |

- **Proporção:** 3:2 · **Resolução:** 1800 × 1200 px.
- **Enquadramento:** horizontal, cenas humanas, contato visual natural.
- **Iluminação:** natural, quente-neutra; a etapa 03 pode ser mais escura e clínica.
- **Desktop / mobile:** mesmo recorte; aparecem na coluna direita (desktop) ou em largura total (mobile).

---

## 06 · Equipe

| Arquivo | Profissional (fictício) |
|---|---|
| `dentist-01.webp` | Dra. Helena Vasconcelos |
| `dentist-02.webp` | Dr. Rafael Okamoto |
| `dentist-03.webp` | Dra. Marina Albuquerque |
| `dentist-04.webp` | Dr. Thiago Lemos |

- **Proporção:** 3:4 · **Resolução:** 1500 × 2000 px.
- **Enquadramento:** retrato da cintura para cima, rosto no terço superior (foco padrão `50% 20%`), mesma distância e altura de câmera para os quatro.
- **Iluminação:** estúdio suave, fundo claro e uniforme (cinza-claro `#E9EBED` ou branco quebrado). Mesmo setup em todos.
- **Direção de arte:** editorial, sóbria. As miniaturas são exibidas em preto e branco (filtro CSS) e coloridas no hover — fotos coloridas funcionam bem.
- **Mobile:** retrato em largura total; mantenha os ombros dentro do quadro.
- **Importante:** use pessoas reais apenas com autorização de uso de imagem. Os nomes e perfis são fictícios.

---

## 07 · Filosofia

### `philosophy.webp`
- **Conteúdo:** mãos de dentista em um feixe de luz, ou instrumento único em contraluz — imagem simbólica.
- **Proporção:** 1:1 (exibida dentro de um **círculo**, na órbita do símbolo da marca).
- **Resolução:** 1600 × 1600 px.
- **Enquadramento:** assunto exatamente no centro; as bordas serão cortadas pelo círculo.
- **Iluminação:** dramática, fundo preto.
- **Mobile:** círculo menor, acima do texto.

---

## 08 · O ateliê (galeria)

Colagem arquitetônica com proporções diferentes, cada uma revelada de uma direção.

| Arquivo | Legenda | Proporção | Resolução |
|---|---|---|---|
| `atelier-reception.webp` | A — Recepção | 16:10 | 2400 × 1500 |
| `atelier-architecture.webp` | B — Detalhe arquitetônico | 3:4 | 1500 × 2000 |
| `atelier-room.webp` | C — Sala de atendimento | 4:5 | 1600 × 2000 |
| `atelier-equipment.webp` | D — Equipamentos | 1:1 | 1600 × 1600 |
| `atelier-ambience.webp` | E — Atmosfera | 2:3 | 1400 × 2100 |

- **Iluminação:** luz natural, sombras arquitetônicas marcadas (luz e sombra recortando paredes), materiais naturais.
- **Direção de arte:** fotografia de arquitetura/interiores — linhas verticais corrigidas, composições simétricas ou de um ponto de fuga.
- **Mobile:** grade de duas colunas; a recepção ocupa a largura total.
- `atelier-equipment.webp` pode ser mais escura (o placeholder já usa tom escuro) para criar contraste na colagem.

---

## 09 · Agendamento

### `booking.webp`
- **Conteúdo:** instrumento odontológico ou caneta de alta rotação em composição escura e minimalista.
- **Proporção:** 3:4 · **Resolução:** 1200 × 1600 px.
- **Iluminação:** low-key, um único ponto de luz, reflexo azulado.
- **Desktop / mobile:** aparece apenas no desktop (coluna esquerda, abaixo dos contatos).

---

## Ajustes finos (opcional)

Para reposicionar o recorte de qualquer foto sem editá-la, altere o quarto argumento (`position`) em `src/config/images.ts`:

```ts
hero: img("hero.webp", "16:10 (desktop) · 4:5 (mobile)", "dark", "50% 30%"),
```

O valor segue a sintaxe CSS `object-position` (horizontal vertical).

## Checklist

- [ ] 29 arquivos `.webp` com os nomes exatos acima em `public/images/`
- [ ] Tratamento de cor consistente (sombras frias, sem saturação excessiva)
- [ ] Margem de segurança de ~8% nas bordas (parallax)
- [ ] Autorização de uso de imagem para todas as pessoas retratadas
- [ ] `npm run build` executado novamente após adicionar as imagens (produção)
