import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = 3000;
const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "openai/gpt-oss-120b:free";

if (!API_KEY) {
  console.error("Erro: configure OPENROUTER_API_KEY no arquivo .env.");
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ── Health check ──────────────────────────────────────────────────────────
app.get("/api/status", (req, res) => {
  res.json({ status: "online", modelo: MODEL });
});

// ── Endpoint principal (com histórico de conversa) ────────────────────────
app.post("/api/concurso", async (req, res) => {
  const { materia, assunto, nivel, modo, historico = [] } = req.body;

  // Validações
  if (!materia || !assunto || !nivel || !modo) {
    return res.status(400).json({ erro: "Campos obrigatórios: materia, assunto, nivel, modo." });
  }

  const modosValidos = ["resumo", "questoes", "explicar"];
  if (!modosValidos.includes(modo)) {
    return res.status(400).json({ erro: `Modo inválido. Use: ${modosValidos.join(", ")}.` });
  }

  if (assunto.length > 300) {
    return res.status(400).json({ erro: "Assunto muito longo. Máximo: 300 caracteres." });
  }

  if (!Array.isArray(historico) || historico.length > 20) {
    return res.status(400).json({ erro: "Histórico inválido ou muito longo." });
  }

  const SYSTEM_PROMPT = `Você é um professor especializado em concursos públicos brasileiros.
Responda sempre em português, de forma clara, objetiva e didática.
Nunca invente leis, artigos ou jurisprudências. Quando não souber, diga que não sabe.
Use formatação limpa, sem markdown excessivo.
Contexto atual: matéria "${materia}", assunto "${assunto}", nível ${nivel}.`;

  const prompts = {
    resumo: `Faça um resumo direto sobre "${assunto}" em ${materia} para concursos públicos.
Nível: ${nivel}.
Estruture assim:
📌 CONCEITO PRINCIPAL
📋 PONTOS MAIS COBRADOS EM PROVA (liste os 4 principais)
💡 DICA DE PROVA`,

    questoes: `Gere 5 questões objetivas (alternativas A a E) sobre "${assunto}" em ${materia}.
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

---`,

    explicar: `Um aluno errou uma questão sobre "${assunto}" em ${materia} e pediu ajuda.
Explique este tema como se fosse a primeira vez que ele vê, usando:
- Linguagem simples
- Uma analogia ou exemplo do cotidiano
- O que cai com mais frequência em provas de nível ${nivel}
- Um macete ou dica de memorização`,
  };

  // Monta as mensagens: histórico anterior + nova pergunta
  const mensagens = [
    ...historico,
    { role: "user", content: prompts[modo] },
  ];

  try {
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
          ...mensagens,
        ],
        temperature: 0.7,
        max_completion_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const detalhe = await response.text();
      return res.status(502).json({
        erro: "Erro ao consultar o OpenRouter.",
        status: response.status,
        detalhe,
      });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      return res.status(502).json({ erro: "Resposta vazia ou inesperada da IA." });
    }

    // Devolve a resposta + histórico atualizado para o front-end guardar
    const historicoAtualizado = [
      ...mensagens,
      { role: "assistant", content: text },
    ];

    res.json({
      modelo: MODEL,
      modo,
      materia,
      assunto,
      nivel,
      resposta: text,
      historico: historicoAtualizado,
      uso: data.usage ?? null,
    });
  } catch (error) {
    res.status(500).json({ erro: "Erro interno no servidor.", detalhe: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🎓 Assistente de Estudos para Concursos`);
  console.log(`   Servidor: http://localhost:${PORT}`);
  console.log(`   Modelo  : ${MODEL}\n`);
});
