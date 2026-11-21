# Selah

> *Selah* (סֶלָה): a pause to reflect, found throughout the Psalms.

**Selah** is an open-source Bible study and discipleship platform built on the [Stellar](https://stellar.org) network. It connects learners with teachers and mentors, gives small groups a transparent shared fund, and offers a study assistant that answers **only from Scripture, with citations**. Payments are made in USDC or XLM through Soroban smart contracts.

> **Status:** early stage. This README describes the planned scope and architecture. Items under [Roadmap](#roadmap) are not built yet, and contributions are welcome.

---

## Table of contents

- [The problem](#the-problem)
- [What Selah does](#what-selah-does)
- [What makes it different](#what-makes-it-different)
- [Architecture](#architecture)
- [Smart contracts](#smart-contracts)
- [Tech stack](#tech-stack)
- [Repository structure](#repository-structure)
- [Getting started](#getting-started)
- [Roadmap](#roadmap)
- [Starter issues](#starter-issues)
- [Content and AI principles](#content-and-ai-principles)
- [Contributing](#contributing)
- [License](#license)

---

## The problem

- People who want structured Bible study, a mentor or a discipleship group often cannot find one that fits, and online options are scattered.
- AI answers about Scripture can be wrong, or quietly present one denomination's view as the only one.
- Teachers and mentors have no simple way to be paid across borders, and small groups that pool money have little transparency about how it is spent.

## What Selah does

1. **Courses and mentorship.** Students pay a teacher in USDC or XLM for a course or a one-to-one session. A Soroban contract splits each payment between the teacher and, optionally, a church or ministry.
2. **Cited study assistant.** The assistant answers only from the selected Bible text, shows the verse references, states when a question is disputed between traditions, and routes doctrinal questions to a human teacher for review.
3. **Study groups with a shared fund.** A group follows a shared reading plan and can pool contributions into a group fund. Spending needs approval from several leaders.
4. **Paid community review.** Reviewers check study material in local languages and are paid from an escrow that releases when the work is approved.
5. **Completion certificates.** Finishing a course records a verifiable certificate on-chain.

## What makes it different

| Area | Approach |
|---|---|
| **Denomination-neutral** | Users choose a canon (Protestant, Catholic or Orthodox) and a translation. The assistant and reading plans follow the choice. |
| **Public-domain texts first** | The project ships with public-domain translations such as KJV, WEB and ASV. Copyrighted translations are used only with a licence. |
| **Transparent group giving** | Group funds use multi-leader approval and a public, anonymized ledger. |
| **Paid local-language review** | Escrow-backed review of study material in languages such as Hausa, Yoruba, Igbo and Nigerian Pidgin, where the source text may legally be used. |
| **Honest AI** | Citations are required. If the assistant cannot cite a passage, it says so instead of answering. |

## Architecture

```
                 +----------------------+
                 |   Web app (Next.js)  |
                 |  Freighter wallet    |
                 +----------+-----------+
                            |
            +---------------+----------------+
            |                                |
   +--------v---------+             +--------v---------+
   |  Backend API     |             |  Study assistant |
   |  auth, courses,  |             |  citations only, |
   |  groups, payments|             |  review routing  |
   +--------+---------+             +--------+---------+
            |                                |
   +--------v---------+             +--------v---------+
   |  PostgreSQL      |             |  Scripture index |
   |  + event indexer |             |  (public-domain) |
   +--------+---------+             +------------------+
            |
   +--------v---------------------------+
   |  Soroban contracts on Stellar      |
   |  payment-split | group-fund |      |
   |  reviewer-escrow | certificates    |
   +------------------------------------+
```

## Smart contracts

| Contract | Purpose |
|---|---|
| `payment-split` | Splits a course or session payment between teacher and optional church or ministry, by configured percentages. |
| `group-fund` | Holds a study group's pooled funds. Spending requires approval from a threshold of group leaders. |
| `reviewer-escrow` | Locks payment for review work and releases it when the requester approves. Supports a dispute window. |
| `certificate-registry` | Records course completion so anyone can verify it. |

Contracts are written in Rust for Soroban. Each one should ship with unit tests and a documented testnet deployment.

## Tech stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS, Freighter wallet
- **Backend:** Node.js with TypeScript, PostgreSQL, SEP-10 authentication
- **Study assistant:** Python service with retrieval over the Scripture index, with mandatory citations
- **Blockchain:** Stellar, Soroban smart contracts (Rust), USDC and XLM payments

## Repository structure

Planned monorepo layout:

```
selah/
├── apps/
│   ├── web/            # Next.js frontend
│   ├── api/            # backend API and event indexer
│   └── assistant/      # citations-only study assistant
├── contracts/
│   ├── payment-split/
│   ├── group-fund/
│   ├── reviewer-escrow/
│   └── certificate-registry/
├── packages/
│   └── sdk/            # TypeScript client for the contracts
├── docs/
└── README.md
```

## Getting started

The project scaffolding is still being set up. Once it exists, the setup is expected to look like this:

```bash
git clone https://github.com/<your-org>/selah.git
cd selah

# contracts
cd contracts/payment-split
cargo test

# web app
cd ../../apps/web
npm install
npm run dev
```

Prerequisites: Node.js 20+, Rust with the `wasm32v1-none` target, the [Stellar CLI](https://developers.stellar.org/docs/tools/cli), and the [Freighter](https://www.freighter.app/) wallet. Use **Stellar Testnet** during development.

## Roadmap

**Phase 1: foundations**
- [ ] Monorepo scaffolding and CI
- [ ] `payment-split` contract with tests
- [ ] Wallet login (SEP-10) and basic user profiles

**Phase 2: learning**
- [ ] Course and mentor listings
- [ ] USDC checkout using `payment-split`
- [ ] Scripture index with KJV and WEB
- [ ] Citations-only study assistant (first version)

**Phase 3: groups and review**
- [ ] `group-fund` contract and group dashboard
- [ ] Reading plans for groups
- [ ] `reviewer-escrow` contract and review workflow

**Phase 4: trust and reach**
- [ ] `certificate-registry` and public verification page
- [ ] Pastor and teacher review queue for doctrinal questions
- [ ] Local-language support where licensing allows

## Starter issues

Good places to begin (labels in brackets):

- Write the `payment-split` contract with percentage validation `[contracts]` `[good first issue]`
- Add unit tests for rounding and zero-amount payments `[contracts]` `[good first issue]`
- Implement threshold approval in `group-fund` `[contracts]`
- Add a dispute window to `reviewer-escrow` `[contracts]`
- Build the SEP-10 wallet login endpoint `[backend]`
- Create the Soroban event indexer for payment events `[backend]`
- Import the public-domain KJV and WEB texts into the Scripture index `[assistant]` `[good first issue]`
- Add a verse-citation check that rejects uncited answers `[assistant]`
- Build the translation and canon selector component `[frontend]` `[good first issue]`
- Design the group dashboard showing the public fund ledger `[frontend]`
- Write the contributor guide and local setup docs `[docs]` `[good first issue]`
- Add GitHub Actions for `cargo test`, lint and type checks `[devops]`

## Content and AI principles

- **Citations are mandatory.** The assistant must show the passage it is answering from. No citation, no answer.
- **No false authority.** The assistant is a study aid, not a pastor. Disputed or doctrinal questions are marked as such and offered for human review.
- **Respect all traditions.** Canon and translation choices are the user's. Defaults must not favour one denomination.
- **Respect licences.** Only public-domain or properly licensed texts may be included in the repository or the index.
- **No financial promises.** Group funds and payments are tools for transparency, not investments.

## Contributing

1. Fork the repository and create a branch for your change.
2. Pick an issue, or open one to discuss your idea first.
3. Write tests for contract and backend changes.
4. Open a pull request that explains what you changed and why.

Please be respectful and keep discussions focused on the work. A `CODE_OF_CONDUCT.md` and `CONTRIBUTING.md` will be added with the first release.

## License

Released under the [MIT License](LICENSE).