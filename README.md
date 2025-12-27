# Personal Finance Web

Frontend Angular para a API de Gestão Financeira Pessoal.

## 🚀 Tecnologias

- **Angular 18** - Framework frontend
- **TypeScript** - Linguagem tipada
- **RxJS** - Programação reativa
- **Stylus** - Pré-processador CSS
- **Chart.js** - Gráficos e visualizações

## 📁 Estrutura do Projeto (Clean Architecture)

```
src/app/
├── core/               # Módulo central (singleton)
│   ├── guards/         # Route guards
│   ├── interceptors/   # HTTP interceptors
│   └── services/       # Serviços globais (Auth, Storage)
│
├── data/               # Camada de dados
│   └── datasources/    # Serviços de API
│
├── domain/             # Camada de domínio
│   ├── enums/          # Enumerações
│   └── models/         # Interfaces/modelos
│
├── shared/             # Módulo compartilhado
│   ├── components/     # Componentes reutilizáveis
│   └── pipes/          # Pipes customizados
│
├── features/           # Módulos de funcionalidades
│   ├── auth/           # Login e registro
│   ├── dashboard/      # Dashboard principal
│   ├── transacoes/     # CRUD de transações
│   ├── analises/       # Análise de despesas
│   ├── cambio/         # Conversor de câmbio
│   └── relatorios/     # Download de relatórios
│
└── layout/             # Componente de layout
```

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start

# Build para produção
npm run build
```

## 🔧 Configuração

1. Configure a URL da API em `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

2. Certifique-se que a API está rodando na porta 8080.

## 📋 Funcionalidades

- ✅ Autenticação JWT (login/registro)
- ✅ Dashboard com métricas financeiras
- ✅ CRUD de transações
- ✅ Filtros por data/categoria
- ✅ Análise de despesas por categoria
- ✅ Conversor de câmbio em tempo real
- ✅ Download de relatórios PDF/Excel
- ✅ Design responsivo

## 🎨 Design

Inspirado no FluxCRM com:
- Paleta de cores moderna (Indigo/Emerald/Red)
- Tipografia Inter
- Cards com shadows suaves
- Animações sutis
- Dark sidebar

## 📱 Responsividade

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🧪 Testes

```bash
# Executar testes unitários
npm test

# Executar lint
npm run lint
```

## 📄 Licença

MIT License
