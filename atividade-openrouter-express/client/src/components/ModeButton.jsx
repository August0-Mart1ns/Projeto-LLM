import styles from "./ModeButton.module.css";

export default function ModeButton({ icon, label, desc, active, onClick }) {
  return (
    <button
      className={`${styles.btn} ${active ? styles.active : ""}`}
      onClick={onClick}
    >
      <span className={styles.icon}>{icon}</span>
      <div>
        <div className={styles.label}>{label}</div>
        <div className={styles.desc}>{desc}</div>
      </div>
    </button>
  );
}
