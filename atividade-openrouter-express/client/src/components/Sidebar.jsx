import ModeButton from "./ModeButton.jsx";
import styles from "./Sidebar.module.css";

const MODES = [
  { id: "resumo",   icon: "📋", label: "Gerar resumo",    desc: "Conceito, pontos-chave e dicas de prova" },
  { id: "questoes", icon: "✅", label: "Gerar questões",  desc: "5 questões com gabarito comentado"        },
  { id: "explicar", icon: "💡", label: "Explicar o erro", desc: "Didático, com analogia e macete"          },
];

export default function Sidebar({ form, modo, loading, onChange, onModo, onSubmit, onClear }) {
  return (
    <aside className={styles.aside}>
      <div className={styles.field}>
        <label>Matéria</label>
        <input
          type="text"
          name="materia"
          value={form.materia}
          onChange={onChange}
          placeholder="Ex: Direito Constitucional"
          maxLength={100}
        />
      </div>

      <div className={styles.field}>
        <label>Assunto</label>
        <input
          type="text"
          name="assunto"
          value={form.assunto}
          onChange={onChange}
          placeholder="Ex: Princípios Fundamentais"
          maxLength={300}
        />
      </div>

      <div className={styles.field}>
        <label>Nível de dificuldade</label>
        <select name="nivel" value={form.nivel} onChange={onChange}>
          <option value="fácil">Fácil — concursos municipais</option>
          <option value="médio">Médio — concursos estaduais</option>
          <option value="difícil">Difícil — concursos federais</option>
        </select>
      </div>

      <div className={styles.field}>
        <label>O que você quer?</label>
        {MODES.map((m) => (
          <ModeButton
            key={m.id}
            icon={m.icon}
            label={m.label}
            desc={m.desc}
            active={modo === m.id}
            onClick={() => onModo(m.id)}
          />
        ))}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.runBtn}
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? "Consultando…" : "Consultar IA →"}
        </button>
        <button className={styles.clearBtn} onClick={onClear}>
          Limpar conversa
        </button>
      </div>
    </aside>
  );
}
