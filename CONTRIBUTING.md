# Contributing to CursorKitt3n

Thanks for offering to help! A few quick guidelines to make collaboration smooth:

- Use Node.js 20.x and npm 9.x
- Run `npm run lint && npm run typecheck && npm test` before pushing
- Follow conventional commits where possible (feat, fix, chore, docs)
- Keep PRs focused; describe motivation and testing steps

## Setup

1. `npm install`
2. `cp .env.example .env` and fill required values
3. Dev server: `npm run dev`

## Tests

- Unit tests: Jest with ts-jest (ESM)
- Coverage thresholds are relaxed for now; please include tests for new code

## Code Style

- ESLint + Prettier enforced via CI and pre-commit hooks
- TypeScript strict mode is enabled

## Security

- Do not commit secrets. Use `.env`
- Report vulnerabilities to security@mkworldwide.dev

## License

Contributions are licensed under the repository’s license (see `License.md`).

