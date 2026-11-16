import type { Dictionary } from "./en";

/**
 * Português (Brasil). Typed against the English dictionary, so a missing
 * or misspelled key is a TypeScript error — no partial translations.
 */
const ptBR: Dictionary = {
  meta: {
    title: "ÉTER — Dental Atelier · Odontologia precisa e personalizada",
    description:
      "A ÉTER é um ateliê odontológico que une odontologia contemporânea, planejamento cuidadoso e um atendimento pessoal, sem pressa. Solicite uma avaliação.",
    ogTitle: "ÉTER — Dental Atelier",
    ogDescription:
      "Odontologia desenhada com precisão. Um ateliê odontológico construído sobre planejamento cuidadoso e atenção individual.",
  },

  a11y: {
    skipToContent: "Pular para o conteúdo",
    homeLink: "ÉTER Dental Atelier — voltar ao topo",
    mainNav: "Navegação principal",
    mobileNav: "Navegação mobile",
    footerNav: "Navegação do rodapé",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    languageSwitcher: "Escolher idioma",
    switchTo: "Mudar para {language}",
    currentLanguage: "Idioma atual: {language}",
    scrollDown: "Rolar para a próxima seção",
    backToTop: "Voltar ao topo",
    newTab: "(abre em uma nova aba)",
    loading: "Carregando ÉTER Dental Atelier",
    imagePending: "Espaço reservado para imagem: {file}",
    carousel: "Carrossel da equipe",
    slide: "dentista",
    slideStatus: "Exibindo {name}, {index} de {total}",
    previous: "Dentista anterior",
    next: "Próximo dentista",
    showMember: "Exibir {name}",
    treatmentsList: "Tratamentos",
    techSteps: "Capítulos de tecnologia",
  },

  nav: {
    items: {
      about: "Sobre",
      treatments: "Tratamentos",
      technology: "Tecnologia",
      team: "Equipe",
      faq: "Dúvidas",
      contact: "Contato",
    },
    cta: "Agendar consulta",
    menu: "Menu",
    close: "Fechar",
    mobileFooter: "Com hora marcada · Seg — Sáb",
  },

  preloader: {
    status: "Calibrando",
    caption: "Dental Atelier",
    fig: "Fig. 00 — Construção",
  },

  hero: {
    index: "Dental Atelier",
    location: "São Paulo · Desde 2014",
    schedule: "Com hora marcada\nSegunda — Sábado",
    headline: "Odontologia,\ndesenhada com *precisão.*",
    subheadline:
      "Um ateliê odontológico onde cada tratamento começa como um desenho cuidadoso — pensado para uma pessoa, executado com rigor clínico e um cuidado que não tem pressa.",
    primaryCta: "Agendar consulta",
    secondaryCta: "Conhecer tratamentos",
    scroll: "Role",
    figure: "Fig. 01 — O olhar clínico",
    chipTitle: "Avaliação primeiro",
    chipText: "Todo plano começa pela escuta.",
    badge: "ÉTER · DENTAL ATELIER · PRECISÃO · CUIDADO · ",
    dimension: "1 pessoa · 1 plano",
  },

  about: {
    label: "Sobre a clínica",
    statement:
      "A ÉTER nasceu de uma convicção simples: a odontologia excepcional é uma questão de precisão — e a precisão só faz sentido quando está a serviço de uma pessoa.",
    support:
      "Aqui, cada plano é desenhado para um único paciente, em um ritmo que abre espaço para perguntas. Unimos a prática clínica contemporânea à atenção de uma equipe pequena e dedicada.",
    principlesTitle: "O que nos orienta",
    principles: [
      {
        title: "Precisão",
        text: "Diagnóstico cuidadoso, planejamento detalhado e mão firme em cada etapa do tratamento.",
      },
      {
        title: "Conforto",
        text: "Ambientes tranquilos, explicações claras e consultas que nunca são apressadas.",
      },
      {
        title: "Atenção",
        text: "Um paciente de cada vez. Sua história, suas prioridades e suas dúvidas definem o plano.",
      },
    ],
    quote: "Um ateliê, *não* uma linha de produção.",
    teamLink: "Conheça a equipe",
    methodLink: "Como trabalhamos",
    figureA: "Fig. 02 — Recepção",
    figureB: "Fig. 03 — Em detalhe",
  },

  treatments: {
    label: "Nossos tratamentos",
    title: "Seis especialidades,\n*um só* padrão de cuidado.",
    intro:
      "De consultas de rotina ao planejamento completo do sorriso, todo tratamento segue o mesmo método: ouvir, examinar, planejar — e só então tratar.",
    hintDesktop: "Passe o cursor ou selecione um tratamento",
    hintTouch: "Toque em um tratamento para expandir",
    cta: "Solicitar avaliação",
    note: "A indicação de qualquer tratamento é sempre confirmada em uma avaliação clínica.",
    items: {
      general: {
        title: "Clínica Geral",
        short: "Check-ups, restaurações e diagnóstico",
        description:
          "A base de uma boca saudável: check-ups minuciosos, restaurações cuidadosas e uma conversa honesta sobre o que seus dentes realmente precisam.",
        tags: ["Check-ups", "Restaurações", "Diagnóstico"],
      },
      cosmetic: {
        title: "Odontologia Estética",
        short: "Forma, cor e proporção",
        description:
          "Um trabalho estético que respeita seus traços — refinando forma, cor e proporção com leveza, naturalidade e uma abordagem conservadora.",
        tags: ["Design do sorriso", "Facetas", "Recontorno"],
      },
      orthodontics: {
        title: "Ortodontia",
        short: "Alinhamento pensado para sua mordida",
        description:
          "Alinhamento planejado a partir da sua mordida e da sua rotina, com opções que vão de aparelhos fixos a alinhadores transparentes, discutidas com clareza.",
        tags: ["Alinhadores", "Aparelho fixo", "Mordida"],
      },
      implants: {
        title: "Implantes Dentários",
        short: "Reposição dentária, etapa por etapa",
        description:
          "A reposição de dentes ausentes a partir de uma avaliação criteriosa e de um planejamento por etapas — do primeiro exame à restauração final.",
        tags: ["Avaliação", "Planejamento", "Reabilitação"],
      },
      whitening: {
        title: "Clareamento Dental",
        short: "Com acompanhamento profissional",
        description:
          "Clareamento com acompanhamento profissional, sempre precedido de uma avaliação que confirma se essa é a escolha certa para seus dentes e gengivas.",
        tags: ["Em consultório", "Caseiro", "Supervisionado"],
      },
      preventive: {
        title: "Prevenção",
        short: "Para que o pequeno continue pequeno",
        description:
          "Cuidados regulares que mantêm pequenos problemas pequenos: higiene profissional, orientação prática e um ritmo de acompanhamento pensado para você.",
        tags: ["Higiene", "Orientação", "Acompanhamento"],
      },
    },
  },

  technology: {
    label: "Tecnologia e precisão",
    title: "A precisão que\nquase não se vê. O *cuidado*\nque sempre se sente.",
    intro:
      "Na ÉTER, a tecnologia é um meio, nunca a mensagem. Cada recurso é escolhido para tornar o diagnóstico mais claro, o planejamento mais preciso e o tratamento mais confortável.",
    note: "Os recursos utilizados em cada caso são apresentados e discutidos durante a sua avaliação.",
    scrollHint: "Role para explorar",
    figure: "Fig. 04",
    items: [
      {
        key: "imaging",
        meta: "Diagnóstico",
        title: "Imagem e radiografia",
        text: "Exames radiográficos e de imagem digital, solicitados quando há indicação clínica, revelam o que o olho sozinho não alcança — para que toda decisão parta de evidências.",
      },
      {
        key: "planning",
        meta: "Método",
        title: "Planejamento do tratamento",
        text: "Os achados se transformam em um plano escrito, etapa por etapa, que você pode ler, questionar e aprovar antes de qualquer procedimento.",
      },
      {
        key: "instruments",
        meta: "Detalhe",
        title: "Instrumentos clínicos",
        text: "Instrumentos delicados, manuseados sob rotinas rigorosas de esterilização, permitem um trabalho fino e conservador.",
      },
      {
        key: "equipment",
        meta: "Ambiente",
        title: "Equipamentos clínicos",
        text: "Cadeiras, iluminação e magnificação contemporâneas, escolhidas pelo conforto, pela visibilidade e pela precisão.",
      },
      {
        key: "procedures",
        meta: "Prática",
        title: "Procedimentos",
        text: "Conservadores sempre que possível: preservamos a estrutura saudável e explicamos cada etapa enquanto ela acontece.",
      },
    ],
  },

  experience: {
    label: "A experiência do paciente",
    title: "Um caminho claro,\nda primeira consulta\nao *cuidado contínuo*.",
    intro:
      "Uma boa odontologia nunca deveria parecer um mistério. Sua jornada conosco segue quatro etapas claras — e cada uma é explicada antes de começar.",
    stage: "Etapa",
    expect: "O que esperar",
    steps: [
      {
        title: "Consulta",
        text: "Começamos ouvindo. Sua história, suas preocupações e suas expectativas vêm primeiro, seguidas de um exame clínico cuidadoso e completo.",
        points: ["Uma conversa sem pressa", "Exame clínico completo", "Exames de imagem, quando indicados"],
      },
      {
        title: "Planejamento Personalizado",
        text: "Os achados se tornam um plano escrito — opções, sequência e prazos — apresentado em linguagem simples para que você decida com segurança.",
        points: ["Opções explicadas com clareza", "Uma sequência etapa por etapa", "Tempo para tirar dúvidas"],
      },
      {
        title: "Tratamento",
        text: "O tratamento segue o plano combinado, em sessões tranquilas, nas quais seu conforto é acompanhado e cada passo é explicado.",
        points: ["Sessões focadas no conforto", "Evolução compartilhada", "Ajustes decididos em conjunto"],
      },
      {
        title: "Cuidado Contínuo",
        text: "O cuidado continua depois do tratamento. Consultas de acompanhamento e rotinas preventivas ajudam você a cuidar da saúde bucal ao longo do tempo.",
        points: ["Retornos programados", "Orientação preventiva", "Uma equipe que conhece sua história"],
      },
    ],
  },

  team: {
    label: "Conheça nossos dentistas",
    title: "As mãos\npor trás *do trabalho*.",
    intro:
      "Uma equipe pequena de dentistas com áreas de atuação complementares, trabalhando lado a lado em cada plano.",
    focus: "Áreas de atuação",
    hint: "Arraste, deslize ou use as setas",
    disclaimer:
      "Perfis ilustrativos de uma clínica fictícia. Nomes e informações não se referem a profissionais reais.",
    members: {
      helena: {
        role: "Diretora clínica · Odontologia restauradora",
        focus: ["Planejamento de implantes", "Odontologia restauradora"],
        bio: "Helena lidera o planejamento clínico da ÉTER, coordenando casos complexos com a equipe de forma serena e metódica.",
      },
      rafael: {
        role: "Ortodontia",
        focus: ["Alinhadores transparentes", "Alinhamento da mordida"],
        bio: "Rafael planeja cada tratamento ortodôntico a partir da mordida, da rotina e da estabilidade a longo prazo de cada paciente.",
      },
      marina: {
        role: "Odontologia estética",
        focus: ["Design do sorriso", "Clareamento"],
        bio: "Marina trata a estética com sobriedade, priorizando proporções naturais e técnicas conservadoras.",
      },
      thiago: {
        role: "Clínica geral e prevenção",
        focus: ["Check-ups", "Prevenção"],
        bio: "Thiago cuida dos fundamentos: prevenção, diagnóstico e uma relação de longo prazo com cada paciente.",
      },
    },
  },

  philosophy: {
    label: "Nossa filosofia",
    statement: "Mais que odontologia.\nUm outro padrão\nde *cuidado.*",
    body: "Acreditamos que o melhor cuidado odontológico é, ao mesmo tempo, exigente e humano — tecnicamente rigoroso e nunca apressado. Esse equilíbrio é o padrão que buscamos em cada consulta.",
    signature: "— Equipe ÉTER",
  },

  atelier: {
    label: "O ateliê",
    title: "Um espaço pensado\npara *desacelerar*.",
    intro:
      "Materiais naturais, luz suave e ambientes silenciosos. O ateliê foi projetado para que a experiência de cuidado comece muito antes de você se sentar na cadeira.",
    captions: {
      reception: "Recepção",
      room: "Sala de atendimento",
      equipment: "Equipamentos",
      architecture: "Detalhe arquitetônico",
      ambience: "Atmosfera",
    },
    materials: ["Luz", "Pedra", "Carvalho", "Linho", "Aço", "Silêncio"],
  },

  faq: {
    label: "Perguntas frequentes",
    title: "Dúvidas,\n*respondidas*.",
    intro:
      "Tudo o que você pode querer saber antes da primeira consulta. Se algo não estiver aqui, teremos prazer em responder pessoalmente.",
    contactTitle: "Ainda tem alguma dúvida?",
    contactText: "Escreva para nós ou deixe uma mensagem pelo formulário — nossa equipe retornará o contato.",
    contactCta: "Enviar uma mensagem",
    items: [
      {
        q: "Como faço para agendar uma consulta?",
        a: "Você pode solicitar um horário pelo formulário desta página, por telefone ou por e-mail. Nossa equipe retorna para confirmar a data e o horário mais convenientes e informa se algo deve ser levado à primeira consulta.",
      },
      {
        q: "O que acontece na primeira consulta?",
        a: "A primeira consulta é uma avaliação. Conversamos sobre sua história e suas preocupações, realizamos um exame clínico completo e, quando há indicação clínica, solicitamos exames de imagem. Você sai com uma visão clara da sua saúde bucal e dos próximos passos possíveis.",
      },
      {
        q: "Quais tratamentos estão disponíveis?",
        a: "Oferecemos clínica geral, odontologia estética, ortodontia, implantes dentários, clareamento dental e prevenção. A abordagem mais adequada para você é sempre definida depois de uma avaliação — nunca antes.",
      },
      {
        q: "Como funciona a avaliação?",
        a: "A avaliação combina conversa e exame. Observamos seus dentes, gengivas e mordida, analisamos exames anteriores que você trouxer e explicamos o que encontramos em linguagem simples antes de sugerir qualquer tratamento.",
      },
      {
        q: "Como o meu plano de tratamento é elaborado?",
        a: "Após a avaliação, a equipe transforma os achados em um plano escrito, com opções, sequência e prazos estimados. Revisamos tudo juntos, respondemos às suas dúvidas e só começamos quando você estiver confortável com cada etapa.",
      },
      {
        q: "Posso levar exames ou registros anteriores?",
        a: "Sim, e recomendamos. Radiografias, laudos e registros de tratamentos anteriores ajudam a compreender sua história e podem evitar a repetição desnecessária de exames.",
      },
      {
        q: "Como posso entrar em contato com a clínica?",
        a: "Você pode falar conosco por telefone ou e-mail durante o horário de funcionamento, ou pelo formulário desta página a qualquer momento. Mensagens recebidas fora do horário são respondidas no próximo dia útil.",
      },
    ],
  },

  booking: {
    label: "Agende sua consulta",
    title: "Comece com\numa *conversa*.",
    intro:
      "Conte um pouco sobre você e o que está buscando. Entraremos em contato para agendar uma avaliação no horário mais conveniente.",
    phone: "Telefone",
    email: "E-mail",
    hours: "Horário de atendimento",
    hoursValue: "Seg — Sex · 8h às 19h\nSábado · 8h às 13h",
    demoBadge: "Formulário demonstrativo",
    demoNote: "Esta é uma demonstração de portfólio: nenhum dado é enviado, armazenado ou compartilhado.",
    formTitle: "Solicitação de consulta",
    fields: {
      name: { label: "Nome completo", placeholder: "Seu nome" },
      email: { label: "E-mail", placeholder: "voce@email.com" },
      phone: { label: "Telefone", placeholder: "(11) 90000-0000" },
      treatment: { label: "Tratamento de interesse", placeholder: "Selecione um tratamento" },
      message: {
        label: "Mensagem",
        placeholder: "Conte o que você procura ou deixe alguma dúvida.",
      },
    },
    optional: "opcional",
    notSure: "Ainda não sei — gostaria de uma avaliação",
    consent: "Concordo em ser contatado(a) sobre esta solicitação.",
    counter: "{count} / {max}",
    submit: "Solicitar consulta",
    submitting: "Validando…",
    errors: {
      summary: "Revise os campos destacados.",
      nameRequired: "Informe seu nome.",
      nameShort: "Seu nome deve ter pelo menos 2 caracteres.",
      emailRequired: "Informe seu e-mail.",
      emailInvalid: "Informe um e-mail válido.",
      phoneRequired: "Informe um telefone.",
      phoneInvalid: "Informe um telefone válido (de 8 a 15 dígitos).",
      treatmentRequired: "Escolha um tratamento ou selecione “ainda não sei”.",
      messageTooLong: "Sua mensagem deve ter no máximo {max} caracteres.",
      consentRequired: "Confirme que podemos entrar em contato.",
    },
    success: {
      title: "Solicitação validada.",
      text: "Obrigado, {name}. Como esta é uma demonstração de portfólio, seus dados não foram enviados e nenhuma consulta foi agendada. Em uma versão real, a clínica entraria em contato para confirmar o horário.",
      reset: "Preencher novamente",
      sentTitle: "Solicitação enviada.",
      sentText: "Obrigado, {name}. A clínica recebeu sua solicitação e entrará em contato para confirmar o horário.",
    },
    failure: {
      title: "Algo deu errado.",
      text: "Não foi possível processar sua solicitação. Tente novamente ou fale com a clínica por telefone ou e-mail.",
      retry: "Tentar novamente",
    },
  },

  footer: {
    headline: "Cuidado,\ndesenhado com *precisão.*",
    cta: "Agendar consulta",
    navigate: "Navegação",
    visit: "Visite",
    contact: "Contato",
    follow: "Acompanhe",
    language: "Idioma",
    address: "Rua Exemplo, 000 — Jardins\nSão Paulo — SP, Brasil",
    demoNotice:
      "A ÉTER é uma clínica fictícia criada como projeto de portfólio. Endereço, telefone e e-mail são apenas demonstrativos.",
    rights: "© {year} ÉTER Dental Atelier — Projeto conceitual.",
    credit: "Design e desenvolvimento",
    backToTop: "Voltar ao topo",
  },

  images: {
    hero: "Dentista usando lupas de magnificação, concentrado em um procedimento sob luz dramática",
    aboutReception: "A recepção da ÉTER, com materiais naturais e luz suave",
    aboutDetail: "Detalhe dos materiais do interior da clínica",
    treatmentGeneral: "Dentista realizando um exame clínico com calma",
    treatmentCosmetic: "Detalhe de um sorriso natural e saudável",
    treatmentOrthodontics: "Alinhador transparente entre dedos com luvas",
    treatmentImplants: "Detalhe de um trabalho restaurador",
    treatmentWhitening: "Retrato com luz suave de um paciente sorrindo",
    treatmentPreventive: "Instrumentos de higiene dental organizados em uma bandeja",
    techImaging: "Radiografia odontológica sobre uma superfície iluminada",
    techPlanning: "Profissional analisando um plano de tratamento na tela",
    techInstruments: "Instrumentos odontológicos polidos sobre fundo escuro",
    techEquipment: "Cadeira odontológica e refletor em uma sala à meia-luz",
    techProcedures: "Mãos com luvas trabalhando com uma caneta odontológica",
    expConsultation: "Dentista conversando com um paciente",
    expPlanning: "Plano de tratamento sendo revisado em conjunto",
    expTreatment: "Sessão de tratamento em uma sala tranquila e com luz suave",
    expCare: "Paciente saindo da clínica, tranquilo",
    dentist01: "Retrato da Dra. Helena Vasconcelos",
    dentist02: "Retrato do Dr. Rafael Okamoto",
    dentist03: "Retrato da Dra. Marina Albuquerque",
    dentist04: "Retrato do Dr. Thiago Lemos",
    philosophy: "Mãos de dentista em um feixe de luz",
    atelierReception: "Área de recepção do ateliê",
    atelierRoom: "Sala de atendimento com uma única cadeira odontológica",
    atelierEquipment: "Detalhe de equipamentos clínicos",
    atelierArchitecture: "Detalhe arquitetônico com luz e sombra",
    atelierAmbience: "Sala de espera silenciosa com luz suave",
    booking: "Instrumento odontológico em uma composição escura e cinematográfica",
  },

  notFound: {
    code: "404",
    title: "Esta página ainda\nnão foi *desenhada*.",
    text: "O endereço acessado não existe. Vamos levar você de volta ao ateliê.",
    cta: "Voltar ao início",
  },
};

export default ptBR;
