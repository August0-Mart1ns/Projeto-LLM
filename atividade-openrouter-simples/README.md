# 🎓 Assistente de Concursos — Modo Simples (Terminal)

Valida a chave e demonstra a chamada de API. Roda uma vez e imprime a resposta no terminal.

## Como instalar e executar

```bash
# 1. Instale as dependências
npm install

# 2. Crie o arquivo .env
cp .env.example .env
# Abra o .env e substitua "sua_chave_aqui" pela sua chave real do OpenRouter

# 3. Execute
npm start
```

## Como configurar o teste

Edite as linhas 10–13 do `index.js`:

```js
const MATERIA = "Direito Constitucional";
const ASSUNTO = "Princípios Fundamentais da República";
const NIVEL   = "médio";    // "fácil" | "médio" | "difícil"
const MODO    = "questoes"; // "resumo" | "questoes" | "explicar"
```

## Resultado esperado

O terminal imprime a resposta da IA e o programa encerra.

## Erros comuns

| Erro | Causa |
|------|-------|
| `Chave não encontrada` | Arquivo `.env` ausente ou nome da variável errado |
| `401` | Chave inválida |
| `429` | Limite de requisições do plano gratuito atingido |
| `Resposta vazia` | Falha temporária; tente novamente |
