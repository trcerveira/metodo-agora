# QA FIX REQUEST — Blueprint Falha no Telemóvel

**Data:** 2026-03-20
**Autor:** Quinn (QA Agent)
**Prioridade:** 🔴 CRÍTICA
**Destino:** @dev

---

## Contexto

O Blueprint (assessment + geração AI) funciona no desktop mas falha em telemóveis. A causa raiz é dupla: streaming incompatível com mobile browsers e header de chunked transfer removido.

---

## FIX #1 — Repor `Transfer-Encoding: chunked` (CRÍTICO)

**Ficheiro:** `src/app/api/generate-blueprint/route.ts`
**Linha:** ~90

### O que foi removido:

```diff
  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
+     'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
    },
  })
```

### Porquê:
Sem este header, browsers mobile e proxies intermédios podem buffar a resposta inteira antes de a entregar ao cliente. Resultado: o stream não inicia, o utilizador fica preso no ecrã de "processing".

### Acção:
Adicionar `'Transfer-Encoding': 'chunked'` de volta ao objecto `headers` da Response.

---

## FIX #2 — Fallback `res.text()` quando `res.body` é null (CRÍTICO)

**Ficheiro:** `src/app/blueprint/page.tsx`
**Função:** `finishAssessment` (~linha 492-531)

### Problema actual:

```typescript
const reader = res.body?.getReader()
if (!reader) throw new Error('Stream indisponível')
```

No iOS Safari < 16.4 e alguns Android browsers, `response.body` retorna `null`. Isto faz o código cair directamente no erro, sem gerar Blueprint.

### Fix recomendado:

```typescript
const reader = res.body?.getReader()

if (!reader) {
  // Fallback para browsers sem suporte a ReadableStream (mobile antigo)
  const fullText = await res.text()
  setBlueprint(fullText)
  setStreamComplete(true)
  localStorage.setItem('blueprint_data', JSON.stringify({
    name: zgName,
    blueprint: fullText,
    result: {
      zone: result.zone,
      zoneTitle: result.zoneTitle,
      archetype: result.archetype,
      consistency: result.consistency,
    },
    timestamp: new Date().toISOString(),
  }))
  return
}

// Stream normal para browsers modernos
const decoder = new TextDecoder()
let fullText = ''
setBlueprint('')
setZgStep('result')

try {
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    fullText += chunk
    setBlueprint(fullText)
  }
} finally {
  reader.releaseLock()
}
```

### Porquê:
Este fallback sacrifica o efeito visual de streaming (texto aparece todo de uma vez) mas garante que o Blueprint é gerado em **todos** os browsers. O utilizador mobile recebe o resultado na mesma — só não vê o texto a aparecer letra a letra.

---

## FIX #3 — Timeout no cliente (MÉDIO)

**Ficheiro:** `src/app/blueprint/page.tsx`
**Função:** `finishAssessment`

### Problema:
O `fetch()` não tem timeout no cliente. Em redes mobile lentas, pode pendurar indefinidamente.

### Fix recomendado:

```typescript
// Adicionar timeout de 90s no AbortController
const controller = new AbortController()
abortRef.current = controller
const timeoutId = setTimeout(() => controller.abort(), 90_000)

try {
  // ... fetch e stream ...
} finally {
  clearTimeout(timeoutId)
}
```

### No catch de erro, distinguir timeout:

```typescript
} catch (err) {
  if (err instanceof Error && err.name === 'AbortError') {
    // Verificar se foi timeout vs cancelamento manual
    if (!abortRef.current?.signal.aborted) return
    setZgStep('error')
    return
  }
  setZgStep('error')
}
```

---

## CHECKLIST DE VALIDAÇÃO (para QA após fix)

- [ ] Desktop Chrome — stream funciona, texto aparece progressivamente
- [ ] Desktop Firefox — mesmo comportamento
- [ ] iPhone Safari (iOS 16+) — stream ou fallback funciona
- [ ] iPhone Safari (iOS 15) — fallback `res.text()` activa, Blueprint gera
- [ ] Android Chrome — stream funciona
- [ ] Rede lenta (3G throttle no DevTools) — timeout activa após 90s com mensagem de erro
- [ ] Botão "TENTAR NOVAMENTE" funciona após erro
- [ ] Blueprint guardado no localStorage após sucesso
- [ ] Página `/resultado` mostra Blueprint guardado correctamente

---

## Notas

- Fix #1 e #2 são **bloqueadores** — sem eles, telemóveis não geram Blueprint
- Fix #3 é melhoria de UX — sem ele, funciona mas pode pendurar
- O fix não requer mudanças na API OpenAI nem no prompt — é puramente client/transport

---

*Gerado por Quinn (QA Agent) — 2026-03-20*
