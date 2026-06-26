import styles from "./ResultCard.module.css";

const MODO_LABEL = { resumo: "Resumo", questoes: "Questões", explicar: "Explicação" };

export default function ResultCard({ item }) {
  if (item.type === "loading") {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <span className={styles.loadingText}>{item.text}</span>
      </div>
    );
  }

  if (item.type === "error") {
    return <div className={styles.error}>⚠️ {item.text}</div>;
  }

  if (item.type === "divider") {
    return <div className={styles.divider}>{item.text}</div>;
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={`${styles.badge} ${styles[`badge_${item.modo}`]}`}>
          {MODO_LABEL[item.modo]}
        </span>
        <span className={styles.subject}>
          {item.materia} · {item.assunto}
        </span>
        {item.tokens && (
          <span className={styles.meta}>{item.tokens} tokens</span>
        )}
      </div>
      <pre className={styles.body}>{item.resposta}</pre>
    </div>
  );
}
