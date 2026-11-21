# Selah Smart Contracts

This workspace contains the Soroban contracts used by the Selah platform.

## Contracts

| Contract | Purpose |
|---|---|
| `payment-split` | Split course or session payments between a teacher and an optional church or ministry |
| `group-fund` | Hold pooled group funds and require a threshold of leader approvals for spending |
| `reviewer-escrow` | Lock review payments until approved, with a dispute window |
| `certificate-registry` | Record course completion for public verification |

Payments are denominated in USDC or XLM on Stellar Testnet during development.

## Requirements

- Rust stable
- `wasm32v1-none` target
- Stellar CLI

## Build and test

```bash
cd Contracts
rustup target add wasm32v1-none
cargo test --workspace
cargo build --release --target wasm32v1-none
```

## Security expectations

- Validate payment percentages and reject invalid totals
- Use checked arithmetic for rounding and zero-amount payments
- Require Soroban authorization for spend and approval actions
- Emit events for off-chain indexing
- Add unit tests and testnet deployment instructions for every contract
