# Building a Mini Centralized Exchange (CEX)

This repository is a  project to design and implement a mini centralized exchange (CEX) in incremental versions.

Goal: build v0 — a simple, in-memory CEX prototype that maintains balances and an orderbook in memory (no robust persistence). Later move to v1 with Redis pub/sub, WebSockets, and scalable system design backed by PostgreSQL and Prisma.


# version-0 demo watch

https://github.com/user-attachments/assets/426e615b-b7f5-46c3-8369-55a764817256

This project was created using `bun init`. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

Project roadmap

- v0 (✅):
        - In-memory balances and orderbook.
        - Basic REST endpoints (login/register, place order, cancel order, get orderbook, get balances).
        - Matching engine supporting limit and market orders.
        - No durable backup : state lost on restart (intended for learning).
        - Durable backup : Snapshot/Dump orderbook and balance to file in every 2 minute  - chance of loosing some data

- v1 (✅):
        - Decoupled the system
        - Horizontal scalable  - as orderbook, balances move to seperate engine
        - Add Redis for in-memory shared state - queue and pub/sub for order events.
        - Persist trades, users, and settled balances to PostgreSQL via Prisma.
        - Introduce scalable architecture patterns (workers, event sourcing ideas).

 -v2 (working)
        - For real time updated  - introducing web socket
        - For snapshot -  implement file based snapshot , redis (AOF mode)
        - A working project

Functional requirements (learning checklist)

1) What is a CEX
	- A Centralized Exchange (CEX) matches buy and sell orders submitted by users and manages custody of user balances.

2) Brokers vs Exchanges
	- Broker: executes trades on behalf of clients, often routing to exchanges or liquidity providers.
	- Exchange: operates the matching engine and orderbook, directly matches counterparties.

3) Order book
	- A sorted list of outstanding limit orders: bids (buy) sorted descending by price and asks (sell) sorted ascending by price.

4) Limit order and Market order
	- Limit order: user sets price and quantity; fills when matching counter-orders meet the price.
	- Market order: user accepts the best available prices until quantity is filled.

5) Partial fills and time-in-force
	- Partial fills: if a single order cannot be fully matched, the remaining portion stays on the book (or is canceled depending on policy).
	- Time-in-force examples: GTC (Good-Til-Cancel), IOC (Immediate-Or-Cancel), FOK (Fill-Or-Kill).

Tech stack

        - TypeScript
        - Bun (runtime)
        - Express (HTTP API)
        - Redis (in-memory store, pub/sub) — planned for v1
        - Prisma (ORM) — planned for v1
        - PostgreSQL — planned for v1
        - JWT Authentication
        - Zod Validation
        - Web Socket

Recommended v0 architecture

        - Single-process Node/Bun app.
        - In-memory data structures:
        - users: { id, username, hashedPassword, balances: { [asset]: number } }
        - orderbook: { [symbol]: { bids: PriorityQueue, asks: PriorityQueue } }
        - orders: mapping of orderId to order metadata/status.
        - Matching engine: immediate matching on order placement; produce trade events and update balances.
        - Persistence: none or optional periodic snapshot to disk (not required for v0).

APIs to implement (v0)

        - POST /auth/register — create user
        - POST /auth/login — return JWT
        - GET /balances — list user balances (auth)
        - POST /orders — place order (limit or market)
        - DELETE /orders/:id — cancel order
        - GET /orderbook/:symbol — view current orderbook
        - GET /trades/:symbol — recent trades (in-memory)

Testing and development tips

- Use unit tests for the matching engine (limit, market, partial fills, IOC behavior).
- Simulate concurrent order submissions to validate matching logic.

Roadmap and next steps

        1. Complete v0 implementation with robust tests for matching logic.
        2. Design Redis-backed shared orderbook and pub/sub events for v1.
        3. Add WebSocket broadcasting of orderbook and trade updates.
        4. Add PostgreSQL persistence and migrate critical state (users, settled balances, trade history).
        5. Introduce horizontal scaling with worker queues and idempotent event processing.

Contributing

This is a personal learning project — contributions are welcome. Open issues for design questions or proposed improvements.

