<div align="center">

# 💰 Personal Finance Web

**Gestão financeira inteligente, colaborativa e baseada em dados.**

[![Angular](https://img.shields.io/badge/Angular-18.0.0-dd0031.svg?style=flat-square&logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178c6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](./LICENSE)
[![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow.svg?style=flat-square)]()

</div>

---

## 📋 Sobre o Projeto

O **Personal Finance Web** é um sistema completo para controle de finanças pessoais desenvolvido com foco na experiência do usuário e na escalabilidade técnica. Mais do que um simples "lançador de despesas", ele oferece ferramentas avançadas como **gestão compartilhada em família**, **análise de dados com gráficos interativos**, **conversão de moedas em tempo real** e agora, um **Chatbot Inteligente** para assistência imediata.

O projeto foi arquitetado seguindo os princípios da **Clean Architecture**, garantindo um código modular, testável e fácil de manter.

---

## ✨ Funcionalidades

### 🛡️ Core & Segurança
- **Autenticação JWT Robusta**: Login e registro seguros com controle de sessão.
- **Gestão de Perfil**: Usuários podem gerenciar suas próprias informações.

### 📊 Gestão Financeira
- **Dashboard Interativo**: Visão geral de receitas, despesas e saldo em tempo real.
- **CRUD de Transações**: Interface intuitiva para adicionar, editar e remover movimentações.
- **Filtros Avançados**: Pesquisa por data, categoria e tipo de transação.
- **Análises Gráficas**: Gráficos (Chart.js) para visualização de gastos por categoria e evolução mensal.
- **Conversor de Câmbio**: Integração com API externa para cotações em tempo real.
- **Relatórios Exportáveis**: Download de extratos em PDF e Excel.

### 🤝 Colaboração (Família)
- **Grupos Familiares**: Criação de grupos para gestão conjunta de finanças.
- **Gestão de Membros**: Convite e gerenciamento de permissões de acesso para membros da família.

### 🤖 Inovação
- **AI Chatbot Assistant**: Assistente virtual integrado para tirar dúvidas, sugerir economias e navegar pelo sistema via linguagem natural.

### ⚙️ Administração
- **Painel Administrativo**: Área restrita para gestão de usuários do sistema (para usuários Master).

---

## 🎨 Galeria

> *Adicione aqui screenshots do seu sistema para demonstrar a UI/UX.*

| Dashboard | Transações |
|:---:|:---:|
| ![Dashboard Placeholder](https://via.placeholder.com/600x400?text=Screenshot+Dashboard) | ![Transações Placeholder](https://via.placeholder.com/600x400?text=Screenshot+Transacoes) |

| Análises | Mobile View |
|:---:|:---:|
| ![Analises Placeholder](https://via.placeholder.com/600x400?text=Screenshot+Analises) | ![Mobile Placeholder](https://via.placeholder.com/300x500?text=Screenshot+Mobile) |

---

## 🏗️ Arquitetura e Design

Este projeto adota **Clean Architecture** no Frontend para desacoplar a lógica de negócios da interface do usuário e de bibliotecas externas.

### Estrutura de Pastas
```
src/app/
├── core/               # Singleton services, Guards, Interceptors (carregado uma vez)
├── data/               # Implementação dos repositórios e Data Sources (API calls)
├── domain/             # Regras de negócio, Entidades e Interfaces de Repositório (puro)
├── shared/             # Componentes, Pipes e Diretivas reutilizáveis
└── features/           # Módulos funcionais (Lazy Loaded)
    ├── auth/           # Autenticação
    ├── dashboard/      # Visão geral
    ├── transacoes/     # Gestão financeira
    ├── familias/       # Gestão de grupos
    ├── admin/          # Administração do sistema
    └── ...
```

---

## 🚀 Tecnologias Utilizadas

- **Core**: [Angular 18](https://angular.io/), [TypeScript](https://www.typescriptlang.org/)
- **State/Async**: [RxJS](https://rxjs.dev/) (Programação Reativa)
- **Estilização**: [Stylus](https://stylus-lang.com/) (CSS Pre-processor), Design Responsivo
- **Visualização de Dados**: [Chart.js](https://www.chartjs.org/) + [ng2-charts](https://valor-software.com/ng2-charts/)
- **Qualidade de Código**: [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [Karma/Jasmine](https://karma-runner.github.io/)

---

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js (v18+)
- npm ou yarn

### Passo a passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/personal-finance-web.git
   cd personal-finance-web
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o ambiente**
   Verifique o arquivo `src/environments/environment.ts` e ajuste a URL da API se necessário.

4. **Execute o projeto**
   ```bash
   npm start
   ```
   Acesse `http://localhost:4200` no seu navegador.

---

## 🧪 Comandos Úteis

| Comando | Descrição |
|:--- |:--- |
| `npm start` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção na pasta `dist/` |
| `npm test` | Executa os testes unitários |
| `npm run lint` | Verifica problemas de linting no código |

---

## 📄 Licença

Este projeto está sob a licença [MIT](./LICENSE).
