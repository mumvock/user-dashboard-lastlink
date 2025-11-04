# User Dashboard — Desafio Lastlink

 - Construído com Angular 20 — adotando boas práticas modernas do framework (Signals, interoperabilidade RxJS ↔ Signals).
 - UI com Angular Material
 - Testes E2E com Cypress
 - Substituto leve de store (cached reactive store) em `src/app/sdk/common/abstracts/store/` (veja `abstract-store.abstract.ts`)
 - Adoção parcial das [novas convenções de nomenclatura](https://blog.angular.dev/announcing-angular-v20-b5c9c06cf301) de classes e arquivos (algumas mudanças de nomes já aplicadas).

## O que há neste repositório

- `src/app/` — código da aplicação dividido em `core`, `features`, `sdk` e `shared`
- `cypress/` — testes end-to-end e fixtures
- `styles/` — estilos SCSS e temas
- `public/`, `environments/` — assets e configurações

## Requisitos

- Node.js (22.16+, recomendado LTS)

## Como rodar (Windows / cmd.exe)

1. Instale dependências

```cmd
npm install
```

2. Executar em modo de desenvolvimento

```cmd
npm start
```

Abra http://localhost:4200 no navegador. O servidor recarrega automaticamente.

3. Testes unitários (Karma + ChromeHeadless)

```cmd
npm run test
```

4. Testes E2E com Cypress

```cmd
npm run cypress:open   # abre a UI do Cypress
npm run cypress:run    # executa headless
```

## Scripts úteis (no package.json)

- `start` — ng serve
- `build` — ng build
- `test` — ng test (Karma)
- `cypress:open`, `cypress:run` — Cypress E2E

## Arquitetura e decisões importantes

- Organização modular: `core`, `features`, `sdk`, `shared` — facilita isolamento e testabilidade.
- Decisão sobre NgRx: optei por não usar NgRx por preferência pessoal — considero-o dispensável e implementei minha própria solução de store leve em `src/app/sdk/common/abstracts/store/abstract-store.abstract.ts`. Ela provê:
	- comportamento reativo via RxJS (observables)
	- cache com `DataCache`
	- política de limpeza automática (`AutoCacheCleaner`)
	- mecanismos de refresh/reconnect e gerenciamento de estado (initial | loading | success | error...)
	- é minimalista, com menos boilerplate e projetada para ser evoluída conforme necessário.

## Nota sobre `sdk/` e `core/` — recursos agnósticos

Grande parte do código em `src/app/sdk/` e boa parte de `src/app/core/` são bibliotecas/utilitários agnósticos — coleções de módulos, abstrações e serviços que desenvolvi ao longo de vários projetos. Eles foram projetados para serem reutilizados em diferentes aplicações (não dependem da lógica de negócios desta aplicação) e por isso foram incorporados parcialmente a este repositório para acelerar o desenvolvimento e manter consistência.

O que isso significa:
- `src/app/sdk/`: contém abstrações genéricas (stores, utilitários de cache, tipos e diretivas) pensadas para uso em múltiplos projetos.
- `src/app/core/`: contém principalmente componentes, interceptores e handlers que são amplamente reutilizáveis; há exceções específicas que são próprias desta app.

 ## Padrões adotados

 - Modular Architecture — Arquitetura modular por responsabilidades (`core`, `features`, `sdk`, `shared`).
 - Feature-first / Domain folders — Organização por feature (cada feature agrupa routes, components, repositories e stores).
 - Repository Pattern — Repositórios para acesso a dados (`src/app/features/*/repositories/`).
 - Reactive Store / Observer Pattern — Store reativa custom baseada em `BehaviorSubject`/`Observable` (veja `abstract-store.abstract.ts`).
 - Cache with Auto-eviction — `DataCache` + `AutoCacheCleaner` para cache, refresh e limpeza automática.
 - RxJS / Reactive Programming — Uso intensivo de RxJS (operators: `map`, `switchMap`, `distinctUntilChanged`, `shareReplay`, etc.).
 - Signals Interoperability — `toSignal` / `@angular/core/rxjs-interop` para conectar streams a sinais.
 - Interceptor / Middleware — Interceptadores HTTP (`api-url`, `http-error`) aplicados via `provideHttpClient` + `withInterceptors`.
 - Dependency Injection — Uso do DI do Angular para serviços independentes e injetáveis.
 - Structural Directive — `RepeatDirective` como diretiva estrutural reutilizável.
 - SCSS Theming & Mixins — Theming com partials, mixins e variáveis CSS (`styles/mixins/`, `styles/_colors.scss`).
 - Angular Material Design — Uso consistente de componentes Material (`mat-card`, `mat-icon`, `mat-table`, etc.).
 - Testing: Unit Tests & E2E — Unit (Karma/Jasmine) + E2E (Cypress) e uso de fixtures para testes.
 - Path Aliases / Tsconfig paths — Aliases para imports (`~core`, `@sdk`, etc.) para melhorar legibilidade.
 - DRY (Don't Repeat Yourself) — Reuso via `sdk/` e `core/` para evitar duplicação.
 - SRP (Single Responsibility Principle) — Separação clara de responsabilidades (services, repositories, components, stores).
 - Convention over Configuration — Convenções como `*-dependencies.ts` para centralizar módulos/providers e facilitar consistência.

 ## Onde olhar (arquivos-chave)

 - Store abstrata: `src/app/sdk/common/abstracts/store/abstract-store.abstract.ts`
 - Features de usuários: `src/app/features/users/` (routes, components, stores, pages)
 - Interceptadores: `src/app/core/interceptors/`
 - Componentes compartilhados (loader, skeleton, feedback): `src/app/core/components/` e `src/app/shared/components/`
 - Testes E2E exemplo: `cypress/e2e/users-list.cy.js`

