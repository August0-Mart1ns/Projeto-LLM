# 🎓 Assistente de Estudos para Concursos Públicos — React + Express

Interface construída em **React + Vite** no front-end e **Express** no back-end.

| Modo | O que faz |
|------|-----------|
| 📋 Resumo | Conceito principal, pontos mais cobrados e dica de prova |
| ✅ Questões | 5 questões objetivas com gabarito comentado |
| 💡 Explicar erro | Explicação didática com analogia e macete |

Mantém **histórico de conversa** durante a sessão.

---

## Como rodar

### 1. Back-end (Express)

```bash
# Na raiz do projeto
npm install
cp .env.example .env
# Cole sua chave do OpenRouter no .env

npm start
# Servidor rodando em http://localhost:3000
```

### 2. Front-end (React + Vite)

Abra **outro terminal** na pasta `client`:

```bash
cd client
npm install
npm run dev
# Interface em http://localhost:5173
```

> O Vite redireciona `/api` automaticamente para `http://localhost:3000`.

---

## Estrutura

```
atividade-openrouter-express/
├── server.js              # API Express
├── package.json           # dependências do back-end
├── .env                   # chave da API (não publicar)
├── .env.example
├── .gitignore
└── client/                # app React
    ├── index.html
    ├── vite.config.js
    ├── package.json       # dependências do front-end
    └── src/
        ├── main.jsx
        ├── index.css
        ├── App.jsx        # estado global
        ├── App.module.css
        └── components/
            ├── Sidebar.jsx / .module.css
            ├── ModeButton.jsx / .module.css
            ├── ChatHistory.jsx / .module.css
            └── ResultCard.jsx / .module.css
```

---

## Erros comuns

| Erro | Causa |
|------|-------|
| `401` | Chave inválida no `.env` |
| `429` | Limite do plano gratuito atingido |
| `Erro ao conectar com o servidor` | `npm start` não foi executado na raiz |
| Página em branco | `npm run dev` não foi executado dentro de `client/` |
