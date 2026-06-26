import { useEffect, useRef } from "react";
import ResultCard from "./ResultCard.jsx";
import styles from "./ChatHistory.module.css";

export default function ChatHistory({ items }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [items]);

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📚</div>
        <p>
          Preencha a matéria e o assunto,<br />
          escolha um modo e clique em <strong>Consultar IA</strong>.<br />
          <br />
          O assistente lembra do contexto<br />
          da conversa enquanto a página estiver aberta.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.history}>
      {items.map((item) => (
        <ResultCard key={item.id} item={item} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
