import "dotenv/config";

const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "openai/gpt-oss-120b:free";

if (!API_KEY) {
  console.error("Erro: crie o arquivo .env com OPENROUTER_API_KEY.");
  process.exit(1);
}

// ── Configure o teste aqui ─────────────────────────────────────────────────
const MATERIA = "Direito Constitucional";
const ASSUNTO = "Princípios Fundamentais da República";
const NIVEL   = "médio";   // "fácil" | "médio" | "difícil"
const MODO    = "questoes"; // "resumo" | "questoes" | "explicar"
// ──────────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Você é um professor especializado em concursos públicos brasileiros.
Responda sempre em português, de forma clara, objetiva e didática.
Nunca invente leis, artigos ou jurisprudências. Quando não souber, diga que não sabe.`;

function buildPrompt(modo, materia, assunto, nivel) {
  if (modo === "resumo") {
    return `Faça um resumo direto sobre "${assunto}" em ${materia} para concursos públicos.
Nível: ${nivel}.
Estruture assim:
📌 CONCEITO PRINCIPAL
📋 PONTOS MAIS COBRADOS EM PROVA (liste os 4 principais)
💡 DICA DE PROVA`;
  }

  if (modo === "questoes") {
    return `Gere 5 questões objetivas (alternativas A a E) sobre "${assunto}" em ${materia}.
Nível de dificuldade: ${nivel}.
Para cada questão siga exatamente este formato:

QUESTÃO [número]
[enunciado]
A) ...
B) ...
C) ...
D) ...
E) ...
✅ GABARITO: [letra]
📝 COMENTÁRIO: [explique a resposta correta e por que as demais estão erradas]

---`;
  }

  return `Um aluno errou uma questão sobre "${assunto}" em ${materia} e pediu ajuda.
Explique este tema como se fosse a primeira vez que ele vê, usando:
- Linguagem simples
- Uma analogia ou exemplo do cotidiano
- O que cai com mais frequência em provas de nível ${nivel}
- Um macete ou dica de memorização`;
}

async function chamarLLM() {
  console.log(`\n🎓 Assistente de Estudos para Concursos`);
  console.log(`   Matéria : ${MATERIA}`);
  console.log(`   Assunto : ${ASSUNTO}`);
  console.log(`   Nível   : ${NIVEL}`);
  console.log(`   Modo    : ${MODO}`);
  console.log(`\nConsultando IA...\n`);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-OpenRouter-Title": "Assistente Concursos FIA ADS",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: buildPrompt(MODO, MATERIA, ASSUNTO, NIVEL) },
      ],
      temperature: 0.7,
      max_completion_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const detalhe = await response.text();
    throw new Error(`Erro na API: ${response.status} - ${detalhe}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("A API respondeu, mas não retornou texto.");
  }

  console.log("─".repeat(60));
  console.log(text);
  console.log("─".repeat(60));

  if (data.usage) {
    console.log(`\n📊 Tokens usados: ${data.usage.total_tokens}`);
  }
}

chamarLLM().catch((error) => {
  console.error("\nFalha ao chamar o OpenRouter:");
  console.error(error.message);
});
