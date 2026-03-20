// ============================================================
// Zona de Genialidade — Quiz Express (10 Perguntas)
// Alimenta: 7 frameworks numa única passada
// Alvo: 3 minutos, resultado imediato
// ============================================================

export type StrengthsDomain = 'executing' | 'influencing' | 'relationship' | 'strategic'
export type WealthProfile = 'creator' | 'mechanic' | 'star' | 'supporter' | 'dealmaker' | 'trader' | 'accumulator' | 'lord'

export interface QuizOption {
  label: string
  value: string
  scores: {
    strengths?: Partial<Record<StrengthsDomain, number>>
    wealth?: Partial<Record<WealthProfile, number>>
  }
}

export interface QuizQuestion {
  id: string
  question: string
  subtitle?: string
  options: QuizOption[]
}

export const questions: QuizQuestion[] = [
  // Q1 — Alimenta: Hendricks (zona genialidade), Sullivan (unique ability), Clifton (forças)
  {
    id: 'energize',
    question: 'Qual atividade te DÁ MAIS ENERGIA?',
    subtitle: 'Acabas com mais energia do que quando começaste.',
    options: [
      { label: 'Resolver problemas complexos', value: 'solve', scores: { strengths: { strategic: 2 }, wealth: { mechanic: 1 } } },
      { label: 'Ensinar e orientar pessoas', value: 'teach', scores: { strengths: { relationship: 2 }, wealth: { star: 1 } } },
      { label: 'Criar algo novo do zero', value: 'create', scores: { strengths: { strategic: 1, influencing: 1 }, wealth: { creator: 2 } } },
      { label: 'Liderar e inspirar equipas', value: 'lead', scores: { strengths: { influencing: 2 }, wealth: { supporter: 1 } } },
      { label: 'Conectar pessoas e construir redes', value: 'connect', scores: { strengths: { relationship: 2 }, wealth: { dealmaker: 1 } } },
      { label: 'Planear estratégias e visão de longo prazo', value: 'plan', scores: { strengths: { strategic: 2 }, wealth: { lord: 1 } } },
      { label: 'Executar e entregar resultados concretos', value: 'execute', scores: { strengths: { executing: 2 }, wealth: { mechanic: 1 } } },
      { label: 'Automatizar e otimizar processos', value: 'automate', scores: { strengths: { executing: 1, strategic: 1 }, wealth: { mechanic: 2 } } },
    ],
  },

  // Q2 — Alimenta: Hendricks (zona incompetência), Sullivan (unique ability inverso)
  {
    id: 'drain',
    question: 'Qual atividade te DRENA MAIS ENERGIA?',
    subtitle: 'Mesmo que sejas bom nisso, deixa-te exausto.',
    options: [
      { label: 'Tarefas administrativas e papelada', value: 'admin', scores: { strengths: { strategic: 1 }, wealth: { creator: 1 } } },
      { label: 'Reuniões longas sem objetivo claro', value: 'meetings', scores: { strengths: { executing: 1 }, wealth: { creator: 1 } } },
      { label: 'Trabalho repetitivo e operacional', value: 'repetitive', scores: { strengths: { influencing: 1 }, wealth: { creator: 1 } } },
      { label: 'Confronto direto e conflito', value: 'conflict', scores: { strengths: { relationship: 1 }, wealth: { accumulator: 1 } } },
      { label: 'Análise detalhada de números e dados', value: 'numbers', scores: { strengths: { influencing: 1 }, wealth: { star: 1 } } },
      { label: 'Atendimento ao cliente e suporte', value: 'support', scores: { strengths: { executing: 1 }, wealth: { lord: 1 } } },
      { label: 'Vendas e prospeção a frio', value: 'sales', scores: { strengths: { executing: 1 }, wealth: { mechanic: 1 } } },
      { label: 'Gerir pessoas e dar feedback', value: 'managing', scores: { strengths: { strategic: 1 }, wealth: { creator: 1 } } },
    ],
  },

  // Q3 — Alimenta: Hendricks (sinal MAIS FORTE de genialidade), Sullivan (flow), Kolbe
  {
    id: 'flow',
    question: 'Em que atividade PERDES A NOÇÃO DO TEMPO?',
    subtitle: 'Flow total — horas parecem minutos.',
    options: [
      { label: 'Escrever, criar conteúdo ou arte', value: 'writing', scores: { strengths: { strategic: 1 }, wealth: { creator: 2 } } },
      { label: 'Construir sistemas ou produtos', value: 'building', scores: { strengths: { executing: 1 }, wealth: { mechanic: 2 } } },
      { label: 'Ensinar, fazer coaching ou mentoria', value: 'teaching', scores: { strengths: { relationship: 2 }, wealth: { star: 1 } } },
      { label: 'Planear e desenhar estratégias', value: 'planning', scores: { strengths: { strategic: 2 }, wealth: { lord: 1 } } },
      { label: 'Pesquisar e aprender coisas novas', value: 'researching', scores: { strengths: { strategic: 2 }, wealth: { accumulator: 1 } } },
      { label: 'Liderar discussões e facilitar', value: 'leading', scores: { strengths: { influencing: 2 }, wealth: { supporter: 1 } } },
      { label: 'Negociar e persuadir', value: 'negotiating', scores: { strengths: { influencing: 1 }, wealth: { dealmaker: 2 } } },
      { label: 'Organizar e criar processos', value: 'organizing', scores: { strengths: { executing: 2 }, wealth: { mechanic: 1 } } },
    ],
  },

  // Q4 — Alimenta: Sullivan (unique ability), Hogshead (fascination), Clifton (top forças)
  {
    id: 'thanked',
    question: 'Quando te agradecem ou elogiam, é normalmente por...',
    subtitle: 'O que os outros valorizam consistentemente em ti.',
    options: [
      { label: 'Resolver um problema que mais ninguém conseguia', value: 'problemsolving', scores: { strengths: { strategic: 2 }, wealth: { mechanic: 1 } } },
      { label: 'Explicar algo complexo de forma simples', value: 'explaining', scores: { strengths: { relationship: 1, strategic: 1 }, wealth: { star: 1 } } },
      { label: 'Juntar as pessoas certas', value: 'connecting', scores: { strengths: { relationship: 2 }, wealth: { dealmaker: 1 } } },
      { label: 'Trazer energia e motivação ao grupo', value: 'energizing', scores: { strengths: { influencing: 2 }, wealth: { star: 1 } } },
      { label: 'Organizar o caos e criar ordem', value: 'ordering', scores: { strengths: { executing: 2 }, wealth: { lord: 1 } } },
      { label: 'Ter ideias criativas e inovadoras', value: 'ideas', scores: { strengths: { strategic: 1 }, wealth: { creator: 2 } } },
      { label: 'Entregar resultados rápidos e fiáveis', value: 'delivering', scores: { strengths: { executing: 2 }, wealth: { mechanic: 1 } } },
      { label: 'Ouvir com atenção e dar bons conselhos', value: 'advising', scores: { strengths: { relationship: 2 }, wealth: { supporter: 1 } } },
    ],
  },

  // Q5 — Alimenta: Hendricks (zona genialidade), Clifton (talento natural), Kolbe
  {
    id: 'natural',
    question: 'O que fazes com FACILIDADE que outros acham difícil?',
    subtitle: 'É tão natural que te esqueces que é um talento.',
    options: [
      { label: 'Falar em público e apresentar ideias', value: 'speaking', scores: { strengths: { influencing: 2 }, wealth: { star: 2 } } },
      { label: 'Escrever textos claros e persuasivos', value: 'writing', scores: { strengths: { strategic: 1, influencing: 1 }, wealth: { creator: 1 } } },
      { label: 'Organizar informação complexa em estruturas simples', value: 'structuring', scores: { strengths: { executing: 1, strategic: 1 }, wealth: { mechanic: 1 } } },
      { label: 'Aprender coisas novas rapidamente', value: 'learning', scores: { strengths: { strategic: 2 }, wealth: { accumulator: 1 } } },
      { label: 'Ler pessoas e perceber motivações', value: 'reading_people', scores: { strengths: { relationship: 2 }, wealth: { dealmaker: 1 } } },
      { label: 'Detetar tendências e oportunidades antes dos outros', value: 'trends', scores: { strengths: { strategic: 2 }, wealth: { trader: 1 } } },
      { label: 'Manter a calma sob pressão', value: 'calm', scores: { strengths: { executing: 2 }, wealth: { lord: 1 } } },
      { label: 'Transformar ideias abstratas em planos concretos', value: 'concretizing', scores: { strengths: { strategic: 1, executing: 1 }, wealth: { mechanic: 1 } } },
    ],
  },

  // Q6 — Alimenta: Clifton (domínio PRINCIPAL), Hamilton (quadrante), Sullivan (domínio)
  {
    id: 'teamrole',
    question: 'Numa equipa, assumes naturalmente o papel de...',
    subtitle: 'Não o que te mandam fazer — aquilo para que gravitas.',
    options: [
      { label: 'EXECUTOR — Faço as coisas acontecer e entrego resultados', value: 'executor', scores: { strengths: { executing: 3 }, wealth: {} } },
      { label: 'INFLUENCIADOR — Convenço, vendo e inspiro à ação', value: 'influencer', scores: { strengths: { influencing: 3 }, wealth: {} } },
      { label: 'CONSTRUTOR DE RELAÇÕES — Crio confiança e conecto pessoas', value: 'relationship', scores: { strengths: { relationship: 3 }, wealth: {} } },
      { label: 'PENSADOR ESTRATÉGICO — Trago visão e análise profunda', value: 'strategic', scores: { strengths: { strategic: 3 }, wealth: {} } },
    ],
  },

  // Q7 — Alimenta: Hogshead (vantagem principal), Clifton (perceção externa)
  {
    id: 'described',
    question: 'Como é que 5 pessoas próximas descreveriam a tua principal qualidade?',
    subtitle: 'Não o que TU achas — o que ELES diriam.',
    options: [
      { label: 'Fiável e consistente — entrega sempre o que promete', value: 'reliable', scores: { strengths: { executing: 2 }, wealth: { accumulator: 1 } } },
      { label: 'Criativo e visionário — tem sempre ideias incríveis', value: 'creative', scores: { strengths: { strategic: 1 }, wealth: { creator: 2 } } },
      { label: 'Carismático e inspirador — toda a gente quer estar perto', value: 'charismatic', scores: { strengths: { influencing: 2 }, wealth: { star: 1 } } },
      { label: 'Analítico e profundo — vê o que mais ninguém vê', value: 'analytical', scores: { strengths: { strategic: 2 }, wealth: { accumulator: 1 } } },
      { label: 'Prático e resolutivo — resolve qualquer problema', value: 'practical', scores: { strengths: { executing: 2 }, wealth: { mechanic: 1 } } },
      { label: 'Atencioso e cuidadoso — preocupa-se genuinamente com as pessoas', value: 'caring', scores: { strengths: { relationship: 2 }, wealth: { supporter: 1 } } },
      { label: 'Ousado e corajoso — não tem medo de arriscar', value: 'bold', scores: { strengths: { influencing: 2 }, wealth: { dealmaker: 1 } } },
    ],
  },

  // Q8 — Alimenta: Hamilton (criador vs mecânico), Sullivan (tipo unique ability), Kolbe
  {
    id: 'satisfaction',
    question: 'O que te dá MAIS satisfação?',
    subtitle: 'Pensa no que te faz sentir mais vivo.',
    options: [
      { label: 'Criar algo do ZERO que nunca existiu', value: 'from_zero', scores: { strengths: { strategic: 1 }, wealth: { creator: 3 } } },
      { label: 'Melhorar algo existente e torná-lo excelente', value: 'improve', scores: { strengths: { executing: 1 }, wealth: { mechanic: 3 } } },
      { label: 'Escalar algo que funciona para chegar a mais pessoas', value: 'scale', scores: { strengths: { influencing: 1 }, wealth: { star: 2, supporter: 1 } } },
      { label: 'Conectar coisas existentes de formas novas e inesperadas', value: 'connect_things', scores: { strengths: { relationship: 1 }, wealth: { dealmaker: 2, trader: 1 } } },
    ],
  },

  // Q9 — Alimenta: Hamilton (validação DIRETA do perfil principal)
  {
    id: 'wealthprofile',
    question: 'Qual descrição se parece MAIS contigo?',
    subtitle: 'Vai com o instinto — a primeira reação é a mais precisa.',
    options: [
      { label: 'CRIADOR — Tenho ideias infinitas e adoro começar coisas novas', value: 'creator', scores: { strengths: {}, wealth: { creator: 3 } } },
      { label: 'ESTRELA — Brilho no palco, inspiro pessoas, EU sou a marca', value: 'star', scores: { strengths: {}, wealth: { star: 3 } } },
      { label: 'APOIADOR — Sou o braço-direito perfeito, executo visão com excelência', value: 'supporter', scores: { strengths: {}, wealth: { supporter: 3 } } },
      { label: 'NEGOCIADOR — Conecto pessoas e oportunidades que outros não veem', value: 'dealmaker', scores: { strengths: {}, wealth: { dealmaker: 3 } } },
      { label: 'COMERCIANTE — Tenho ótimo timing, sei quando agir', value: 'trader', scores: { strengths: {}, wealth: { trader: 3 } } },
      { label: 'ACUMULADOR — Sou paciente e consistente, construo riqueza aos poucos', value: 'accumulator', scores: { strengths: {}, wealth: { accumulator: 3 } } },
      { label: 'SENHOR DOS SISTEMAS — Adoro automação, processos, máquinas que funcionam sozinhas', value: 'lord', scores: { strengths: {}, wealth: { lord: 3 } } },
      { label: 'MECÂNICO — Pego no que existe e torno 10x melhor', value: 'mechanic', scores: { strengths: {}, wealth: { mechanic: 3 } } },
    ],
  },

  // Q10 — Alimenta: Sullivan (unique ability core), Hendricks (evidência genialidade), Clifton
  {
    id: 'contribution',
    question: 'Se pudesses contribuir com UMA COISA para o mundo, seria...',
    subtitle: 'O teu legado — o que mais te importa.',
    options: [
      { label: 'Ensinar e capacitar pessoas a crescerem', value: 'empower', scores: { strengths: { relationship: 2 }, wealth: { star: 1 } } },
      { label: 'Criar produtos que resolvam problemas reais', value: 'products', scores: { strengths: { strategic: 1 }, wealth: { creator: 2 } } },
      { label: 'Inspirar e liderar movimentos de transformação', value: 'inspire', scores: { strengths: { influencing: 2 }, wealth: { star: 1 } } },
      { label: 'Construir sistemas eficientes que simplesmente funcionam', value: 'systems', scores: { strengths: { executing: 1 }, wealth: { mechanic: 1, lord: 1 } } },
      { label: 'Conectar pessoas e construir comunidades fortes', value: 'communities', scores: { strengths: { relationship: 2 }, wealth: { dealmaker: 1 } } },
      { label: 'Descobrir verdades e partilhar conhecimento profundo', value: 'knowledge', scores: { strengths: { strategic: 2 }, wealth: { accumulator: 1 } } },
      { label: 'Gerar riqueza e oportunidades para outros', value: 'wealth', scores: { strengths: { influencing: 1 }, wealth: { dealmaker: 1, trader: 1 } } },
    ],
  },
]
