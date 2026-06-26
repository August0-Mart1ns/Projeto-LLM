import { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import ChatHistory from "./components/ChatHistory.jsx";
import styles from "./App.module.css";

const LOADING_LABELS = {
  resumo:   "Gerando resumo…",
  questoes: "Gerando questões…",
  explicar: "Elaborando explicação…",
};

export default function App() {
  const [form, setForm]       = useState({ materia: "", assunto: "", nivel: "médio" });
  const [modo, setModo]       = useState("resumo");
  const [loading, setLoading] = useState(false);
  const [items, setItems]     = useState([]);       // itens do chat
  const [historico, setHistorico] = useState([]);   // histórico para a API

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleClear() {
    setItems([]);
    setHistorico([]);
  }

  async function handleSubmit() {
    const { materia, assunto, nivel } = form;

    if (!materia.trim() || !assunto.trim()) {
      addItem({ type: "error", text: "Preencha a matéria e o assunto antes de consultar." });
      return;
    }

    // Indicador de contexto acumulado
    if (historico.length > 0) {
      const count = historico.length / 2;
      addItem({
        type: "divider",
        text: `↩ continuando conversa (${count} consulta${count > 1 ? "s" : ""} anterior${count > 1 ? "es" : ""})`,
      });
    }

    // Loading temporário
    const loadingId = addItem({ type: "loading", text: LOADING_LABELS[modo] });
    setLoading(true);

    try {
      const response = await fetch("/api/concurso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materia, assunto, nivel, modo, historico }),
      });

      const data = await response.json();

      removeItem(loadingId);

      if (!response.ok) {
        addItem({ type: "error", text: data.erro || "Erro desconhecido." });
        return;
      }

      setHistorico(data.historico);

      addItem({
        type:    "result",
        modo:    data.modo,
        materia: data.materia,
        assunto: data.assunto,
        resposta: data.resposta,
        tokens:  data.uso?.total_tokens ?? null,
      });
    } catch {
      removeItem(loadingId);
      addItem({ type: "error", text: "Erro ao conectar com o servidor. Verifique se ele está rodando." });
    } finally {
      setLoading(false);
    }
  }

  // ── Helpers de estado ──────────────────────────────────────────────────
  function addItem(item) {
    const id = crypto.randomUUID();
    setItems((prev) => [...prev, { ...item, id }]);
    return id;
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.logoIcon}>🎓</div>
        <h1 className={styles.title}>Assistente de Concursos</h1>
        <span className={styles.modelBadge}>openai/gpt-oss-120b:free</span>
      </header>

      <main className={styles.main}>
        <Sidebar
          form={form}
          modo={modo}
          loading={loading}
          onChange={handleChange}
          onModo={setModo}
          onSubmit={handleSubmit}
          onClear={handleClear}
        />
        <div className={styles.outputPanel}>
          <ChatHistory items={items} />
        </div>
      </main>
    </div>
  );
}
