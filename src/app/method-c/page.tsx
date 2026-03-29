import type { Metadata } from "next";

const STRIPE_LINK = "https://buy.stripe.com/cNifZj9SvfEY3KIaTMa3u01";

export const metadata: Metadata = {
  title: "Method C — Pára de Treinar Sem Direcção",
  description:
    "Avaliação completa, programa personalizado e acompanhamento diário. 10 vagas de sócio fundador a 29€/mês.",
};

export default function MethodCLanding() {
  return (
    <main className="min-h-screen bg-[#0A0E1A] text-[#E8E4DC]">
      {/* Urgency Bar */}
      <div className="w-full bg-[#1E2310]/80 border-b border-[#7A8A32]/30 py-3 px-4 text-center">
        <span className="text-sm text-[#BFD64B] font-medium">
          Campanha válida até 29/03 — 23h59
        </span>
      </div>

      {/* Hero */}
      <section className="px-6 pt-12 pb-12 max-w-3xl mx-auto text-center">
        <div className="inline-block bg-[#1E2310] border border-[#7A8A32]/40 rounded-full px-4 py-1.5 text-sm text-[#BFD64B] font-medium mb-8">
          10 vagas de sócio fundador — 7 restantes
        </div>

        <h1 className="text-4xl md:text-6xl font-black leading-[1.1] mb-6">
          Treinas no ginásio
          <br />
          <span className="text-[#BFD64B]">sem plano?</span>
        </h1>

        <p className="text-lg md:text-xl text-[#E8E4DC]/60 max-w-2xl mx-auto mb-8">
          Avaliação completa, programa personalizado e acompanhamento diário.{" "}
          <strong className="text-[#E8E4DC]">
            Sabes exactamente o que fazer
          </strong>{" "}
          cada vez que entras no ginásio.
        </p>

        <a
          href={STRIPE_LINK}
          className="inline-block bg-[#BFD64B] hover:bg-[#7A8A32] text-[#0A0E1A] font-bold text-lg px-10 py-4 rounded-lg transition-colors"
        >
          Quero a minha vaga — 29€/mês
        </a>
        <p className="text-sm text-[#E8E4DC]/40 mt-3">
          Preço de fundador. Fica para sempre, mesmo quando subir.
        </p>
      </section>

      {/* Problem */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          Identificas-te com isto?
        </h2>
        <div className="space-y-4">
          {[
            "Vais ao ginásio mas não sabes se estás a progredir",
            "Mudas de programa a cada duas semanas porque não vês resultados",
            "Treinas sem objectivo — só para «manter»",
            "Queres um desafio a sério mas não sabes por onde começar",
            "Vês pessoal a evoluir e pensas «eu não consigo isso»",
          ].map((pain, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-[#111628] rounded-lg p-4 border border-[#1a1e2e]"
            >
              <span className="text-red-400 text-xl mt-0.5">✗</span>
              <p className="text-[#E8E4DC]/70">{pain}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solution */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
          O Method C dá-te{" "}
          <span className="text-[#BFD64B]">direcção</span>.
        </h2>
        <p className="text-center text-[#E8E4DC]/50 mb-12 max-w-xl mx-auto">
          Um método com 3 níveis progressivos. Começas pela base, avanças ao
          teu ritmo. Um PT que te acompanha em cada passo.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              zone: "Nível 1 — Base",
              desc: "Mobilidade, estabilidade e padrões de movimento. A fundação que a maioria salta.",
              icon: "🧱",
            },
            {
              zone: "Nível 2 — Força",
              desc: "Squat, Deadlift, Press — força real com técnica e progressão.",
              icon: "🏋️",
            },
            {
              zone: "Nível 3 — Completo",
              desc: "Força + Resistência + Condicionamento. Treino híbrido com objectivo.",
              icon: "🔥",
            },
          ].map((z, i) => (
            <div
              key={i}
              className="bg-[#111628] border border-[#1a1e2e] rounded-lg p-6 text-center"
            >
              <div className="text-4xl mb-3">{z.icon}</div>
              <h3 className="font-bold text-lg mb-2 text-[#BFD64B]">
                {z.zone}
              </h3>
              <p className="text-[#E8E4DC]/50 text-sm">{z.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Value Stack */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
          O que recebes
        </h2>

        <div className="space-y-4">
          {[
            {
              item: "Avaliação completa com score",
              desc: "Articular, força, resistência, flexibilidade — sabes exactamente onde estás",
              value: "40€",
            },
            {
              item: "Programa personalizado de 4 semanas",
              desc: "Baseado nos teus resultados, não genérico",
              value: "35€",
            },
            {
              item: "Suporte diário por WhatsApp",
              desc: "Dúvidas, ajustes, motivação — respostas no próprio dia",
              value: "30€",
            },
            {
              item: "Grupo exclusivo de alunos Method C",
              desc: "Comunidade de pessoas no mesmo caminho que tu",
              value: "10€",
            },
            {
              item: "Reavaliação aos 30 dias + novo plano",
              desc: "Vês a evolução em números e recebes o próximo nível",
              value: "35€",
            },
          ].map((v, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-[#111628] border border-[#1a1e2e] rounded-lg p-5"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[#BFD64B]">✓</span>
                  <h3 className="font-bold">{v.item}</h3>
                </div>
                <p className="text-[#E8E4DC]/40 text-sm mt-1 ml-6">{v.desc}</p>
              </div>
              <div className="text-[#E8E4DC]/30 line-through text-sm ml-4 whitespace-nowrap">
                {v.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-[#E8E4DC]/40 text-lg">
            Valor total:{" "}
            <span className="line-through">150€/mês</span>
          </p>
          <p className="text-4xl md:text-5xl font-black mt-2">
            Sócio fundador:{" "}
            <span className="text-[#BFD64B]">29€/mês</span>
          </p>
          <p className="text-sm text-[#E8E4DC]/40 mt-2">
            Este preço fica para sempre. Quando as 10 vagas fecharem, sobe.
          </p>
        </div>

        <div className="mt-8 text-center">
          <a
            href={STRIPE_LINK}
            className="inline-block bg-[#BFD64B] hover:bg-[#7A8A32] text-[#0A0E1A] font-bold text-lg px-10 py-4 rounded-lg transition-colors"
          >
            Garantir a minha vaga — 29€/mês
          </a>
        </div>
      </section>

      {/* Why Method C */}
      <section className="px-6 py-16 max-w-3xl mx-auto border-t border-[#1a1e2e]">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          Porquê o <span className="text-[#BFD64B]">Method C</span>?
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: "Não é um PDF genérico",
              desc: "O teu programa é baseado na TUA avaliação. Ninguém recebe o mesmo.",
            },
            {
              title: "Não estás sozinho",
              desc: "Grupo de alunos + suporte diário. Quando quiseres desistir, estamos cá.",
            },
            {
              title: "Vês os números a mudar",
              desc: "Reavaliação aos 30 dias. Progresso medido, não adivinhado.",
            },
            {
              title: "PT que treina contigo",
              desc: "Não sou um influencer. Sou PT e faço os mesmos treinos que tu.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#111628] border border-[#1a1e2e] rounded-lg p-5"
            >
              <h3 className="font-bold mb-2 text-[#BFD64B]">{item.title}</h3>
              <p className="text-[#E8E4DC]/50 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Coach */}
      <section className="px-6 py-16 max-w-3xl mx-auto border-t border-[#1a1e2e]">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          Quem te acompanha
        </h2>
        <div className="bg-[#111628] border border-[#1a1e2e] rounded-lg p-8 text-center">
          <div className="w-20 h-20 bg-[#1E2310] rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-[#BFD64B]">
            TC
          </div>
          <h3 className="text-xl font-bold mb-2">Telmo Cerveira</h3>
          <p className="text-[#BFD64B] text-sm font-medium mb-4">
            Personal Trainer há mais de 7 anos
          </p>
          <p className="text-[#E8E4DC]/50 max-w-md mx-auto">
            Especialista em treino de força e funcional.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 max-w-3xl mx-auto border-t border-[#1a1e2e]">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          Perguntas frequentes
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "Sou iniciante. Consigo fazer isto?",
              a: "Sim. O Method C começa pela base — mobilidade, estabilidade, padrões de movimento. Avanças ao teu ritmo.",
            },
            {
              q: "Preciso de material específico?",
              a: "Não. O programa adapta-se ao que tens disponível — com ou sem material. Tu escolhes.",
            },
            {
              q: "O acompanhamento é presencial ou online?",
              a: "Online. Recebes avaliação com score, programa personalizado e suporte diário por WhatsApp.",
            },
            {
              q: "Porquê só 10 vagas?",
              a: "Porque o acompanhamento é a sério. Não é um curso gravado com 1.000 alunos. São 10 pessoas com atenção individual.",
            },
            {
              q: "Posso cancelar quando quiser?",
              a: "Sim. Sem fidelização. Ficas enquanto fizer sentido para ti.",
            },
            {
              q: "Porquê 29€ e não mais?",
              a: "Este é o preço de sócio fundador. És dos primeiros. Quando as vagas fecharem, o preço sobe — mas o teu fica igual para sempre.",
            },
          ].map((faq, i) => (
            <div
              key={i}
              className="bg-[#111628] border border-[#1a1e2e] rounded-lg p-5"
            >
              <h3 className="font-bold mb-2">{faq.q}</h3>
              <p className="text-[#E8E4DC]/50 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 max-w-3xl mx-auto text-center border-t border-[#1a1e2e]">
        <h2 className="text-3xl md:text-4xl font-black mb-4">
          Pára de treinar sem{" "}
          <span className="text-[#BFD64B]">direcção</span>.
        </h2>
        <p className="text-[#E8E4DC]/50 mb-8 max-w-lg mx-auto">
          Junta-te aos primeiros 10 sócios fundadores do Method C. Avaliação
          completa, programa personalizado, acompanhamento diário. 29€/mês.
        </p>
        <a
          href={STRIPE_LINK}
          className="inline-block bg-[#BFD64B] hover:bg-[#7A8A32] text-[#0A0E1A] font-bold text-xl px-12 py-5 rounded-lg transition-colors"
        >
          Quero começar — 29€/mês
        </a>
        <p className="text-sm text-[#E8E4DC]/30 mt-4">
          10 vagas. Quando fecharem, o preço sobe.
        </p>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center border-t border-[#1a1e2e]">
        <p className="text-[#E8E4DC]/20 text-sm">
          Method C — Força. Resistência. Direcção.
        </p>
      </footer>
    </main>
  );
}
