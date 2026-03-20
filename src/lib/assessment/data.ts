// ============================================================
// Zona de Genialidade — Assessment Completo (43 Perguntas)
// 7 Frameworks: Hendricks, Clifton, Sullivan, Hamilton, Hormozi, Kolbe, Hogshead
// 5 Secções · ~15-20 minutos
// ============================================================

// --- Types ---

export type StrengthsDomain = 'executing' | 'influencing' | 'relationship' | 'strategic'
export type WealthProfile = 'creator' | 'mechanic' | 'star' | 'supporter' | 'dealmaker' | 'trader' | 'accumulator' | 'lord'
export type KolbeMode = 'factFinder' | 'followThru' | 'quickStart' | 'implementor'

export type QuestionType = 'single' | 'multi' | 'open'

export interface ScoreMap {
  strengths?: Partial<Record<StrengthsDomain, number>>
  wealth?: Partial<Record<WealthProfile, number>>
  kolbe?: Partial<Record<KolbeMode, number>>
}

export interface AssessmentOption {
  label: string
  value: string
  scores: ScoreMap
}

export interface AssessmentQuestion {
  id: string
  question: string
  subtitle?: string
  hint?: string
  type: QuestionType
  options?: AssessmentOption[]
  maxLength?: number
}

export interface AssessmentSection {
  id: string
  title: string
  description: string
  duration: string
  questions: AssessmentQuestion[]
}

// --- Secções ---

export const sections: AssessmentSection[] = [
  // ============================================================
  // SECÇÃO 1: Contexto Pessoal (8 perguntas)
  // ============================================================
  {
    id: 'contexto',
    title: 'Contexto Pessoal',
    description: 'Dados básicos para contextualizar a tua análise.',
    duration: '5 min',
    questions: [
      {
        id: 'ctx_area',
        question: 'Qual é a tua área de atuação principal?',
        type: 'single',
        options: [
          { label: 'Tecnologia / Desenvolvimento', value: 'tech', scores: { wealth: { mechanic: 1, lord: 1 } } },
          { label: 'Marketing / Vendas', value: 'marketing', scores: { wealth: { star: 1, dealmaker: 1 } } },
          { label: 'Design / Criação', value: 'design', scores: { wealth: { creator: 1 } } },
          { label: 'Gestão / Liderança', value: 'management', scores: { wealth: { supporter: 1 } } },
          { label: 'Educação / Formação', value: 'education', scores: { wealth: { star: 1 } } },
          { label: 'Saúde / Bem-estar', value: 'health', scores: { strengths: { relationship: 1 } } },
          { label: 'Finanças / Investimentos', value: 'finance', scores: { wealth: { accumulator: 1, trader: 1 } } },
          { label: 'Consultoria / Serviços Profissionais', value: 'consulting', scores: { wealth: { dealmaker: 1 } } },
          { label: 'Outro', value: 'other', scores: {} },
        ],
      },
      {
        id: 'ctx_experiencia',
        question: 'Há quanto tempo trabalhas na tua área principal?',
        type: 'single',
        options: [
          { label: 'Menos de 1 ano', value: 'lt1', scores: {} },
          { label: '1 a 3 anos', value: '1to3', scores: {} },
          { label: '3 a 5 anos', value: '3to5', scores: {} },
          { label: '5 a 10 anos', value: '5to10', scores: {} },
          { label: 'Mais de 10 anos', value: 'gt10', scores: {} },
        ],
      },
      {
        id: 'ctx_oque_faz',
        question: 'Descreve em 2-3 frases: o que fazes no teu dia a dia profissional?',
        subtitle: 'Quanto mais detalhes, melhor a tua análise.',
        hint: 'Exemplo: "Sou gestor de projetos numa startup de tecnologia. Coordeno equipas de desenvolvimento e faço ponte entre produto e engenharia."',
        type: 'open',
        maxLength: 500,
      },
      {
        id: 'ctx_sem_dinheiro',
        question: 'Se dinheiro NÃO fosse problema, o que farias da vida?',
        subtitle: 'Não existe resposta errada. Pode ser algo totalmente diferente do que fazes hoje.',
        type: 'open',
        maxLength: 500,
      },
      {
        id: 'ctx_intro_extro',
        question: 'Consideras-te mais...',
        type: 'single',
        options: [
          { label: 'Introvertido — prefiro trabalhar sozinho, recarrego energia em silêncio', value: 'intro', scores: { kolbe: { factFinder: 1 }, wealth: { accumulator: 1 } } },
          { label: 'Mais introvertido que extrovertido', value: 'intro_leaning', scores: { kolbe: { factFinder: 1 } } },
          { label: 'Equilibrado — depende da situação', value: 'balanced', scores: {} },
          { label: 'Mais extrovertido que introvertido', value: 'extro_leaning', scores: { kolbe: { quickStart: 1 } } },
          { label: 'Extrovertido — recarrego energia com pessoas, penso em voz alta', value: 'extro', scores: { kolbe: { quickStart: 1 }, wealth: { star: 1, dealmaker: 1 } } },
        ],
      },
      {
        id: 'ctx_analitico_intuitivo',
        question: 'Na hora de tomar decisões, és mais...',
        type: 'single',
        options: [
          { label: 'Analítico — preciso de dados e pesquisa antes de decidir', value: 'analytical', scores: { kolbe: { factFinder: 2 }, strengths: { strategic: 1 } } },
          { label: 'Mais analítico que intuitivo', value: 'analytical_leaning', scores: { kolbe: { factFinder: 1 } } },
          { label: 'Equilibrado — uso dados E intuição', value: 'balanced', scores: {} },
          { label: 'Mais intuitivo que analítico', value: 'intuitive_leaning', scores: { kolbe: { quickStart: 1 } } },
          { label: 'Intuitivo — decido rápido pelo instinto', value: 'intuitive', scores: { kolbe: { quickStart: 2 }, strengths: { influencing: 1 } } },
        ],
      },
      {
        id: 'ctx_estrutura_flex',
        question: 'Preferes...',
        type: 'single',
        options: [
          { label: 'Estrutura total — cronogramas, checklists, processos definidos', value: 'structure', scores: { kolbe: { followThru: 2 }, strengths: { executing: 1 } } },
          { label: 'Mais estrutura — flexibilidade dentro de um framework', value: 'structure_leaning', scores: { kolbe: { followThru: 1 } } },
          { label: 'Depende do projeto', value: 'balanced', scores: {} },
          { label: 'Mais flexibilidade — estrutura demais sufoca-me', value: 'flex_leaning', scores: { kolbe: { quickStart: 1 } } },
          { label: 'Flexibilidade total — improviso, adapto, mudo conforme necessário', value: 'flex', scores: { kolbe: { quickStart: 2 }, wealth: { creator: 1 } } },
        ],
      },
    ],
  },

  // ============================================================
  // SECÇÃO 2: Atividades e Energia (12 perguntas)
  // ============================================================
  {
    id: 'energia',
    title: 'Atividades e Energia',
    description: 'Vamos mapear o que te dá e o que te tira energia.',
    duration: '8 min',
    questions: [
      {
        id: 'energy_drena',
        question: 'Quais atividades DRENAM a tua energia, mesmo que saibas fazê-las?',
        subtitle: 'Podes escolher várias.',
        type: 'multi',
        options: [
          { label: 'Tarefas administrativas e burocráticas', value: 'admin', scores: { strengths: { strategic: 1 }, wealth: { creator: 1 } } },
          { label: 'Reuniões longas sem pauta definida', value: 'meetings', scores: { strengths: { executing: 1 } } },
          { label: 'Trabalho repetitivo e operacional', value: 'repetitive', scores: { strengths: { influencing: 1 }, wealth: { creator: 1 } } },
          { label: 'Negociação e confronto direto', value: 'conflict', scores: { strengths: { relationship: 1 } } },
          { label: 'Análise detalhada de números e dados', value: 'numbers', scores: { strengths: { influencing: 1 }, wealth: { star: 1 } } },
          { label: 'Atendimento ao cliente / suporte', value: 'support', scores: { strengths: { strategic: 1 }, wealth: { lord: 1 } } },
          { label: 'Vendas e prospeção a frio', value: 'sales', scores: { strengths: { executing: 1 }, wealth: { mechanic: 1 } } },
          { label: 'Gerir pessoas e dar feedback', value: 'managing', scores: { strengths: { strategic: 1 } } },
          { label: 'Escrever textos longos e documentação', value: 'writing_docs', scores: { strengths: { influencing: 1 } } },
          { label: 'Programar / trabalho técnico detalhado', value: 'coding', scores: { strengths: { influencing: 1 }, wealth: { star: 1 } } },
        ],
      },
      {
        id: 'energy_carrega',
        question: 'Quais atividades te ENERGIZAM — acabas com mais energia do que quando começaste?',
        subtitle: 'Podes escolher várias.',
        type: 'multi',
        options: [
          { label: 'Resolver problemas complexos', value: 'solve', scores: { strengths: { strategic: 2 }, wealth: { mechanic: 1 } } },
          { label: 'Ensinar e orientar pessoas', value: 'teach', scores: { strengths: { relationship: 2 }, wealth: { star: 1 } } },
          { label: 'Criar coisas novas (produtos, conteúdo, arte)', value: 'create', scores: { strengths: { strategic: 1, influencing: 1 }, wealth: { creator: 2 } } },
          { label: 'Liderar e inspirar equipas', value: 'lead', scores: { strengths: { influencing: 2 }, wealth: { supporter: 1 } } },
          { label: 'Analisar dados e encontrar padrões', value: 'analyze', scores: { strengths: { strategic: 2 }, wealth: { accumulator: 1 } } },
          { label: 'Conectar pessoas e fazer networking', value: 'connect', scores: { strengths: { relationship: 2 }, wealth: { dealmaker: 1 } } },
          { label: 'Planear estratégias e visão de longo prazo', value: 'plan', scores: { strengths: { strategic: 2 }, wealth: { lord: 1 } } },
          { label: 'Executar e entregar resultados concretos', value: 'execute', scores: { strengths: { executing: 2 }, wealth: { mechanic: 1 } } },
          { label: 'Negociar e fechar acordos', value: 'negotiate', scores: { strengths: { influencing: 1 }, wealth: { dealmaker: 2 } } },
          { label: 'Automatizar e otimizar processos', value: 'automate', scores: { strengths: { executing: 1, strategic: 1 }, wealth: { mechanic: 2 } } },
        ],
      },
      {
        id: 'energy_agradecem',
        question: 'Quando te agradecem ou elogiam, é normalmente por...',
        subtitle: 'O que os outros valorizam consistentemente em ti.',
        type: 'single',
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
      {
        id: 'energy_flow',
        question: 'Em que atividade PERDES A NOÇÃO DO TEMPO?',
        subtitle: 'Flow total — horas parecem minutos.',
        type: 'single',
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
      {
        id: 'energy_inicio',
        question: 'Quando começas um projeto novo, a tua primeira reação natural é...',
        type: 'single',
        options: [
          { label: 'Pesquisar bastante antes de dar o primeiro passo', value: 'research', scores: { kolbe: { factFinder: 3 } } },
          { label: 'Fazer um plano detalhado com etapas claras', value: 'plan', scores: { kolbe: { followThru: 3 } } },
          { label: 'Começar a executar logo e ajustar no caminho', value: 'execute', scores: { kolbe: { quickStart: 3 } } },
          { label: 'Conversar com outras pessoas para ouvir opiniões', value: 'consult', scores: { kolbe: { implementor: 1 }, strengths: { relationship: 1 } } },
        ],
      },
      {
        id: 'energy_problemas',
        question: 'Quando surge um problema inesperado no trabalho, tendes a...',
        type: 'single',
        options: [
          { label: 'Parar e analisar todas as opções antes de agir', value: 'analyze', scores: { kolbe: { factFinder: 2 }, strengths: { strategic: 1 } } },
          { label: 'Agir rápido com a melhor opção disponível', value: 'act_fast', scores: { kolbe: { quickStart: 2 }, strengths: { executing: 1 } } },
          { label: 'Consultar alguém de confiança antes de decidir', value: 'consult', scores: { strengths: { relationship: 1 } } },
          { label: 'Criar um sistema para que o problema não se repita', value: 'systematize', scores: { kolbe: { followThru: 2 }, wealth: { lord: 1 } } },
        ],
      },
      {
        id: 'energy_manual_conceitual',
        question: 'Preferes trabalhar com...',
        type: 'single',
        options: [
          { label: 'Coisas tangíveis — protótipos, ferramentas, construir fisicamente', value: 'tangible', scores: { kolbe: { implementor: 3 }, wealth: { mechanic: 1 } } },
          { label: 'Mais tangível — gosto de ver resultados concretos', value: 'tangible_leaning', scores: { kolbe: { implementor: 2 } } },
          { label: 'Tanto faz — depende do projeto', value: 'balanced', scores: {} },
          { label: 'Mais abstrato — prefiro conceitos, estratégias, ideias', value: 'abstract_leaning', scores: { kolbe: { factFinder: 1 } } },
          { label: 'Coisas abstratas — modelos mentais, frameworks, teorias', value: 'abstract', scores: { kolbe: { factFinder: 2 }, wealth: { creator: 1 } } },
        ],
      },
      {
        id: 'energy_detalhe',
        question: 'Quando precisas de entregar um trabalho, tu...',
        type: 'single',
        options: [
          { label: 'És extremamente detalhista — revisas várias vezes, precisa estar perfeito', value: 'perfectionist', scores: { kolbe: { factFinder: 2, followThru: 1 } } },
          { label: 'Cuidas dos detalhes importantes mas não te perdes nos pequenos', value: 'balanced', scores: { kolbe: { factFinder: 1 } } },
          { label: 'Focas no resultado geral — detalhes ajustam-se depois', value: 'big_picture', scores: { kolbe: { quickStart: 1 } } },
          { label: 'Entregas rápido e iteras — perfeição é inimiga do progresso', value: 'fast_iterate', scores: { kolbe: { quickStart: 2 } } },
        ],
      },
      {
        id: 'energy_delegacao',
        question: 'Sobre delegar tarefas, tu...',
        type: 'single',
        options: [
          { label: 'Tens muita dificuldade — preferes fazer tu mesmo', value: 'no_delegate', scores: { kolbe: { implementor: 1 } } },
          { label: 'Delegas mas ficas a monitorar de perto', value: 'delegate_monitor', scores: { kolbe: { followThru: 1 } } },
          { label: 'Delegas com instruções claras e confias no resultado', value: 'delegate_trust', scores: { kolbe: { followThru: 1 }, strengths: { influencing: 1 } } },
          { label: 'Adoras delegar — preferes focar no que só tu sabes fazer', value: 'love_delegate', scores: { strengths: { strategic: 1 }, wealth: { lord: 1 } } },
        ],
      },
      {
        id: 'energy_ritmo',
        question: 'O teu ritmo natural de trabalho é...',
        type: 'single',
        options: [
          { label: 'Explosões intensas seguidas de descanso (sprint/recovery)', value: 'sprint', scores: { kolbe: { quickStart: 2 }, wealth: { creator: 1 } } },
          { label: 'Ritmo constante e previsível ao longo do dia', value: 'steady', scores: { kolbe: { followThru: 2 }, wealth: { accumulator: 1 } } },
          { label: 'Começo devagar e vou acelerando até ao deadline', value: 'ramp_up', scores: { kolbe: { factFinder: 1 } } },
          { label: 'Alta energia de manhã, desacelero à tarde', value: 'morning', scores: {} },
        ],
      },
      {
        id: 'energy_inovacao',
        question: 'O que te dá mais satisfação?',
        type: 'single',
        options: [
          { label: 'Criar algo do ZERO que nunca existiu', value: 'from_zero', scores: { strengths: { strategic: 1 }, wealth: { creator: 3 } } },
          { label: 'Melhorar algo existente e torná-lo excelente', value: 'improve', scores: { strengths: { executing: 1 }, wealth: { mechanic: 3 } } },
          { label: 'Escalar algo que funciona para chegar a mais pessoas', value: 'scale', scores: { strengths: { influencing: 1 }, wealth: { star: 2, supporter: 1 } } },
          { label: 'Conectar coisas existentes de formas novas e inesperadas', value: 'connect_things', scores: { strengths: { relationship: 1 }, wealth: { dealmaker: 2, trader: 1 } } },
        ],
      },
      {
        id: 'energy_multitask',
        question: 'Funcionas melhor...',
        type: 'single',
        options: [
          { label: 'Fazendo uma coisa só com foco total por longos períodos', value: 'deep_focus', scores: { kolbe: { factFinder: 1, followThru: 1 } } },
          { label: 'Alternando entre 2-3 projetos no mesmo dia', value: 'few_projects', scores: { kolbe: { quickStart: 1 } } },
          { label: 'Gerindo muitas coisas ao mesmo tempo', value: 'multitask', scores: { kolbe: { quickStart: 2 }, wealth: { dealmaker: 1 } } },
          { label: 'Depende — foco profundo para criar, multitask para executar', value: 'depends', scores: {} },
        ],
      },
    ],
  },

  // ============================================================
  // SECÇÃO 3: Talentos e Padrões (10 perguntas)
  // ============================================================
  {
    id: 'talentos',
    title: 'Talentos e Padrões',
    description: 'Vamos identificar os teus talentos naturais e padrões de comportamento.',
    duration: '7 min',
    questions: [
      {
        id: 'talent_padrao',
        question: 'Pensa nos teus 3 maiores sucessos profissionais. O que têm em COMUM?',
        type: 'single',
        options: [
          { label: 'Em todos estava a liderar e influenciar pessoas', value: 'leading', scores: { strengths: { influencing: 2 }, wealth: { supporter: 1 } } },
          { label: 'Em todos estava a criar algo novo e inovador', value: 'creating', scores: { strengths: { strategic: 1 }, wealth: { creator: 2 } } },
          { label: 'Em todos estava a organizar e executar com disciplina', value: 'organizing', scores: { strengths: { executing: 2 }, wealth: { mechanic: 1 } } },
          { label: 'Em todos estava a analisar e resolver problemas complexos', value: 'analyzing', scores: { strengths: { strategic: 2 }, wealth: { mechanic: 1 } } },
          { label: 'Em todos estava a ensinar e desenvolver outros', value: 'teaching', scores: { strengths: { relationship: 2 }, wealth: { star: 1 } } },
          { label: 'Em todos estava a conectar pessoas e construir relações', value: 'connecting', scores: { strengths: { relationship: 2 }, wealth: { dealmaker: 1 } } },
          { label: 'Em todos estava a vender e convencer stakeholders', value: 'selling', scores: { strengths: { influencing: 2 }, wealth: { dealmaker: 1 } } },
          { label: 'Em todos estava a planear estratégia de longo prazo', value: 'strategizing', scores: { strengths: { strategic: 2 }, wealth: { lord: 1 } } },
        ],
      },
      {
        id: 'talent_descricao',
        question: 'Se perguntasse a 5 pessoas próximas "qual a principal qualidade desta pessoa?", a maioria diria...',
        type: 'single',
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
      {
        id: 'talent_natural',
        question: 'O que fazes com FACILIDADE que outros acham difícil?',
        subtitle: 'É tão natural que te esqueces que é um talento.',
        type: 'single',
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
      {
        id: 'talent_dominio',
        question: 'Numa equipa, assumes naturalmente o papel de...',
        subtitle: 'Não o que te mandam fazer — aquilo para que gravitas.',
        type: 'single',
        options: [
          { label: 'EXECUTOR — Faço as coisas acontecer e entrego resultados', value: 'executor', scores: { strengths: { executing: 3 } } },
          { label: 'INFLUENCIADOR — Convenço, vendo e inspiro à ação', value: 'influencer', scores: { strengths: { influencing: 3 } } },
          { label: 'CONSTRUTOR DE RELAÇÕES — Crio confiança e conecto pessoas', value: 'relationship', scores: { strengths: { relationship: 3 } } },
          { label: 'PENSADOR ESTRATÉGICO — Trago visão e análise profunda', value: 'strategic', scores: { strengths: { strategic: 3 } } },
        ],
      },
      {
        id: 'talent_frustracao',
        question: 'O que te FRUSTRA repetidamente no trabalho?',
        type: 'single',
        options: [
          { label: 'Pessoas que não cumprem prazos e compromissos', value: 'deadlines', scores: { strengths: { executing: 1 } } },
          { label: 'Falta de visão estratégica nas decisões', value: 'no_vision', scores: { strengths: { strategic: 1 } } },
          { label: 'Processos lentos e burocráticos', value: 'slow_process', scores: { kolbe: { quickStart: 1 }, wealth: { creator: 1 } } },
          { label: 'Falta de criatividade e inovação na equipa', value: 'no_creativity', scores: { wealth: { creator: 1 } } },
          { label: 'Pessoas que não se desenvolvem e ficam estagnadas', value: 'stagnation', scores: { strengths: { relationship: 1 } } },
          { label: 'Conflitos interpessoais mal resolvidos', value: 'conflicts', scores: { strengths: { relationship: 1 } } },
          { label: 'Falta de dados e métricas para decisões', value: 'no_data', scores: { kolbe: { factFinder: 1 }, strengths: { strategic: 1 } } },
          { label: 'Microgestão e falta de autonomia', value: 'micromanagement', scores: { kolbe: { quickStart: 1 }, wealth: { creator: 1 } } },
        ],
      },
      {
        id: 'talent_comunicacao',
        question: 'O teu estilo natural de comunicação é...',
        type: 'single',
        options: [
          { label: 'Direto e objetivo — vou ao ponto sem rodeios', value: 'direct', scores: { strengths: { influencing: 1, executing: 1 } } },
          { label: 'Detalhado e preciso — apresento todos os dados e evidências', value: 'detailed', scores: { kolbe: { factFinder: 2 }, strengths: { strategic: 1 } } },
          { label: 'Inspirador e entusiasta — uso histórias e emoção', value: 'inspiring', scores: { strengths: { influencing: 2 }, wealth: { star: 1 } } },
          { label: 'Diplomático e cuidadoso — considero todos os lados', value: 'diplomatic', scores: { strengths: { relationship: 2 } } },
        ],
      },
      {
        id: 'talent_aprendizado',
        question: 'Quando queres aprender algo novo, tu...',
        type: 'single',
        options: [
          { label: 'Lês tudo sobre o assunto antes de começar (livros, artigos, cursos)', value: 'read_first', scores: { kolbe: { factFinder: 2 } } },
          { label: 'Procuras um mentor ou especialista para aprender direto', value: 'mentor', scores: { strengths: { relationship: 1 } } },
          { label: 'Começas a praticar e aprendes fazendo, errando e ajustando', value: 'learn_by_doing', scores: { kolbe: { quickStart: 2, implementor: 1 } } },
          { label: 'Assistes vídeos e tutoriais, depois tentas replicar', value: 'watch_replicate', scores: { kolbe: { implementor: 1 } } },
        ],
      },
      {
        id: 'talent_feedback',
        question: 'Quando recebes um feedback crítico (negativo), tu...',
        type: 'single',
        options: [
          { label: 'Analisas friamente e extrais o que é útil', value: 'analyze', scores: { strengths: { strategic: 1 } } },
          { label: 'Ficas incomodado mas usas como combustível para melhorar', value: 'fuel', scores: { strengths: { executing: 1 } } },
          { label: 'Precisas de tempo para processar antes de reagir', value: 'process', scores: { strengths: { relationship: 1 } } },
          { label: 'Questionas e desafias se o feedback faz sentido', value: 'challenge', scores: { strengths: { influencing: 1 }, kolbe: { quickStart: 1 } } },
        ],
      },
      {
        id: 'talent_contribuicao',
        question: 'Se pudesses contribuir com UMA COISA para o mundo, seria...',
        subtitle: 'O teu legado — o que mais te importa.',
        type: 'single',
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
      {
        id: 'talent_competencia_genialidade',
        question: 'Tens algo que fazes BEM (outros até elogiam) mas que na verdade NÃO gostas de fazer?',
        subtitle: 'Isto é CRÍTICO — separa a tua Zona de Excelência da Zona de Genialidade.',
        hint: 'Exemplo: "Sou bom em gestão de projetos mas na verdade detesto. Preferia estar a criar."',
        type: 'open',
        maxLength: 500,
      },
    ],
  },

  // ============================================================
  // SECÇÃO 4: Estilo de Negócios (8 perguntas)
  // ============================================================
  {
    id: 'negocios',
    title: 'Estilo de Negócios',
    description: 'Vamos mapear o teu perfil empreendedor e estilo de negócio.',
    duration: '5 min',
    questions: [
      {
        id: 'biz_como_ganha',
        question: 'Qual modelo de trabalho/negócio te atrai MAIS?',
        type: 'single',
        options: [
          { label: 'Criar produtos digitais (cursos, apps, ferramentas) e vender em escala', value: 'digital_products', scores: { wealth: { creator: 2, lord: 1 } } },
          { label: 'Prestar serviços de alto valor (consultoria, mentoria, done-for-you)', value: 'high_value_services', scores: { wealth: { star: 2 } } },
          { label: 'Construir e gerir equipas que entregam resultados', value: 'build_teams', scores: { wealth: { supporter: 2 } } },
          { label: 'Fazer parcerias e conectar oportunidades (deals, joint ventures)', value: 'partnerships', scores: { wealth: { dealmaker: 2 } } },
          { label: 'Investir e multiplicar recursos existentes', value: 'invest', scores: { wealth: { accumulator: 2, trader: 1 } } },
          { label: 'Automatizar sistemas que geram receita recorrente', value: 'automate_revenue', scores: { wealth: { lord: 2, mechanic: 1 } } },
        ],
      },
      {
        id: 'biz_risco',
        question: 'Sobre risco financeiro, tu...',
        type: 'single',
        options: [
          { label: 'Evitas ao máximo — precisas de previsibilidade e segurança', value: 'avoid', scores: { wealth: { accumulator: 2 } } },
          { label: 'Aceitas riscos calculados com rede de proteção', value: 'calculated', scores: { wealth: { mechanic: 1 } } },
          { label: 'Tomas riscos moderados se o retorno justifica', value: 'moderate', scores: { wealth: { trader: 1 } } },
          { label: 'Adoras risco — alto risco, alto retorno', value: 'love_risk', scores: { wealth: { creator: 1, dealmaker: 1 } } },
        ],
      },
      {
        id: 'biz_solo_time',
        question: 'Funcionas melhor...',
        type: 'single',
        options: [
          { label: 'Totalmente sozinho — sou mais produtivo sem ninguém por perto', value: 'solo', scores: { wealth: { creator: 1, accumulator: 1 } } },
          { label: 'Sozinho com suporte — um assistente para o operacional', value: 'solo_support', scores: { wealth: { creator: 1 } } },
          { label: 'Em dupla — eu e um sócio complementar', value: 'duo', scores: { wealth: { dealmaker: 1 } } },
          { label: 'A liderar uma equipa pequena (3-5 pessoas)', value: 'small_team', scores: { wealth: { supporter: 1 } } },
          { label: 'A liderar uma organização maior (10+ pessoas)', value: 'big_team', scores: { wealth: { supporter: 2, lord: 1 } } },
        ],
      },
      {
        id: 'biz_timing',
        question: 'Preferes...',
        type: 'single',
        options: [
          { label: 'Ser o PRIMEIRO em algo novo (inovar, criar mercado)', value: 'first', scores: { wealth: { creator: 2 } } },
          { label: 'Entrar cedo mas com algo já validado (fast follower)', value: 'early', scores: { wealth: { star: 1, mechanic: 1 } } },
          { label: 'Entrar quando o mercado já é grande e otimizar', value: 'optimize', scores: { wealth: { mechanic: 2 } } },
          { label: 'Entrar no final e consolidar (comprar, escalar o que existe)', value: 'consolidate', scores: { wealth: { accumulator: 1, lord: 1 } } },
        ],
      },
      {
        id: 'biz_receita',
        question: 'Se pudesses escolher UMA fonte principal de receita, seria...',
        type: 'single',
        options: [
          { label: 'Vender conhecimento (cursos, livros, palestras, mentoria)', value: 'knowledge', scores: { wealth: { star: 2 } } },
          { label: 'Vender serviços especializados (consultoria, agência, freelance)', value: 'services', scores: { wealth: { mechanic: 1 } } },
          { label: 'Vender produtos (SaaS, apps, e-commerce)', value: 'products', scores: { wealth: { creator: 2 } } },
          { label: 'Vender oportunidades (intermediação, afiliados, parcerias)', value: 'opportunities', scores: { wealth: { dealmaker: 2, trader: 1 } } },
        ],
      },
      {
        id: 'biz_preco',
        question: 'Qual é a tua relação com cobrar caro pelo teu trabalho?',
        type: 'single',
        options: [
          { label: 'Tenho dificuldade — acho sempre que deveria cobrar menos', value: 'undercharge', scores: {} },
          { label: 'Cobro um preço justo mas sei que poderia cobrar mais', value: 'fair', scores: {} },
          { label: 'Cobro bem e sinto-me confortável com o meu preço', value: 'comfortable', scores: {} },
          { label: 'Cobro premium — o meu trabalho vale caro e eu sei disso', value: 'premium', scores: { wealth: { star: 1 } } },
        ],
      },
      {
        id: 'biz_escala',
        question: 'O que te atrai mais?',
        type: 'single',
        options: [
          { label: 'Atender POUCOS clientes com MUITA profundidade (high-touch)', value: 'high_touch', scores: { wealth: { star: 1 } } },
          { label: 'Atender um NÚMERO MÉDIO com boa qualidade (grupos, turmas)', value: 'medium', scores: { wealth: { supporter: 1, star: 1 } } },
          { label: 'Atender MUITAS pessoas com um produto escalável (cursos, SaaS)', value: 'scalable', scores: { wealth: { creator: 2, lord: 1 } } },
          { label: 'Não atender ninguém diretamente — criar sistemas que funcionam sem mim', value: 'no_direct', scores: { wealth: { lord: 2 } } },
        ],
      },
      {
        id: 'biz_wealth_dynamics',
        question: 'Qual descrição se parece MAIS contigo?',
        subtitle: 'Vai com o instinto — a primeira reação é a mais precisa.',
        type: 'single',
        options: [
          { label: 'CRIADOR — Tenho ideias infinitas e adoro começar coisas novas', value: 'creator', scores: { wealth: { creator: 3 } } },
          { label: 'ESTRELA — Brilho no palco, inspiro pessoas, EU sou a marca', value: 'star', scores: { wealth: { star: 3 } } },
          { label: 'APOIADOR — Sou o braço-direito perfeito, executo visão com excelência', value: 'supporter', scores: { wealth: { supporter: 3 } } },
          { label: 'NEGOCIADOR — Conecto pessoas e oportunidades que outros não veem', value: 'dealmaker', scores: { wealth: { dealmaker: 3 } } },
          { label: 'COMERCIANTE — Tenho ótimo timing, sei quando agir', value: 'trader', scores: { wealth: { trader: 3 } } },
          { label: 'ACUMULADOR — Sou paciente e consistente, construo riqueza aos poucos', value: 'accumulator', scores: { wealth: { accumulator: 3 } } },
          { label: 'SENHOR DOS SISTEMAS — Adoro automação, processos, máquinas que funcionam sozinhas', value: 'lord', scores: { wealth: { lord: 3 } } },
          { label: 'MECÂNICO — Pego no que existe e torno 10x melhor', value: 'mechanic', scores: { wealth: { mechanic: 3 } } },
        ],
      },
    ],
  },

  // ============================================================
  // SECÇÃO 5: Visão e Ambição (5 perguntas)
  // ============================================================
  {
    id: 'visao',
    title: 'Visão e Ambição',
    description: 'Última secção — vamos definir para onde queres ir.',
    duration: '5 min',
    questions: [
      {
        id: 'vision_90dias',
        question: 'Qual RESULTADO CONCRETO queres ter alcançado daqui a 90 dias?',
        subtitle: 'Sê específico.',
        hint: 'Não "ganhar mais dinheiro" mas "ter 5 clientes a pagar €500/mês por consultoria". Não "crescer no Instagram" mas "ter 5k seguidores engajados e um funil de vendas a funcionar".',
        type: 'open',
        maxLength: 500,
      },
      {
        id: 'vision_receita',
        question: 'Qual é a tua meta de receita MENSAL nos próximos 6 meses?',
        type: 'single',
        options: [
          { label: 'Até €1.000/mês (estou a começar)', value: 'lt1k', scores: {} },
          { label: '€1.000 a €3.000/mês (quero uma renda sólida)', value: '1kto3k', scores: {} },
          { label: '€3.000 a €10.000/mês (quero escalar)', value: '3kto10k', scores: {} },
          { label: '€10.000 a €25.000/mês (crescimento agressivo)', value: '10kto25k', scores: {} },
          { label: 'Mais de €25.000/mês (estou a pensar em grande)', value: 'gt25k', scores: {} },
        ],
      },
      {
        id: 'vision_bloqueio',
        question: 'O que te está a TRAVAR agora? Qual é o maior obstáculo?',
        subtitle: 'Pode ser algo interno (medo, insegurança, falta de clareza) ou externo (falta de dinheiro, de conhecimento, de tempo).',
        type: 'open',
        maxLength: 500,
      },
      {
        id: 'vision_tempo',
        question: 'Quanto tempo por SEMANA podes dedicar ao teu projeto/negócio?',
        type: 'single',
        options: [
          { label: 'Menos de 5 horas/semana', value: 'lt5', scores: {} },
          { label: '5 a 10 horas/semana', value: '5to10', scores: {} },
          { label: '10 a 20 horas/semana', value: '10to20', scores: {} },
          { label: '20 a 40 horas/semana', value: '20to40', scores: {} },
          { label: '40+ horas/semana (dedicação total)', value: 'gt40', scores: {} },
        ],
      },
      {
        id: 'vision_ai',
        question: 'Qual é o teu nível de experiência com Inteligência Artificial e automação?',
        type: 'single',
        options: [
          { label: 'Zero — nunca usei ChatGPT ou ferramentas similares', value: 'zero', scores: {} },
          { label: 'Básico — uso ChatGPT para perguntas e textos simples', value: 'basic', scores: {} },
          { label: 'Intermédio — uso AI no dia a dia para vários fluxos', value: 'intermediate', scores: {} },
          { label: 'Avançado — crio automações, uso APIs, construo com AI', value: 'advanced', scores: {} },
          { label: 'Expert — desenvolvo soluções de AI para mim e/ou clientes', value: 'expert', scores: {} },
        ],
      },
    ],
  },
]

// --- Helpers ---

export function getAllQuestions(): AssessmentQuestion[] {
  return sections.flatMap((s) => s.questions)
}

export function getTotalQuestions(): number {
  return sections.reduce((acc, s) => acc + s.questions.length, 0)
}

export function getSectionForQuestion(questionIndex: number): { section: AssessmentSection; indexInSection: number; sectionIndex: number } {
  let count = 0
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    if (questionIndex < count + section.questions.length) {
      return { section, indexInSection: questionIndex - count, sectionIndex: i }
    }
    count += section.questions.length
  }
  return { section: sections[sections.length - 1], indexInSection: 0, sectionIndex: sections.length - 1 }
}
