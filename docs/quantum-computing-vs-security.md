---
title: Quantum Computing vs Bitcoin & Banking Security — a Feynman‑style explainer
author: Kumar.A
date: October 30, 2025
tags: [quantum, bitcoin, cybersecurity, banking, pqc]
readingTime: 3 min
---

> *“If you can’t explain it simply, you don’t understand it well enough.”* — (spirit of) Feynman

Quantum computers are **not** magic lock‑picks. They’re exquisite instruments that use qubits and interference to speed up *some* kinds of math. That difference matters when people ask, “Will quantum break my bank or Bitcoin?”

## TL;DR
- **Mining & hashing (SHA‑256):** safe — quantum gives only a *quadratic* speed‑up (Grover).
- **Signatures & RSA/TLS:** future risk — **Shor’s algorithm** could break ECDSA/RSA *once* we have **large, fault‑tolerant** machines.
- **Today’s chips:** 10²–10³ *physical* qubits (noisy); we’d need **millions of error‑corrected qubits** to endanger mainstream crypto.
- **Mitigation:** migrate to **post‑quantum cryptography (PQC)** well before any realistic threat window.

![Qubit Evolution & Impact](quantum-qubit-evolution.svg)

## What’s actually used where?
| Function | Algorithm | Quantum effect | Practical risk |
|---|---|---|---|
| Digital signatures (Bitcoin addresses, wallet spends) | **ECDSA (secp256k1)** | **Shor** solves discrete log | **High — once very large QCs exist** |
| Banking/TLS certificates | **RSA‑2048** | **Shor** factors integers | **High — future** |
| Hashing / Proof‑of‑Work | **SHA‑256** | **Grover** = quadratic speed‑up only | **Low** |
| PQC replacements | **CRYSTALS‑Dilithium, Falcon, SPHINCS+** | Designed to resist known quantum attacks | **Adopting** |

![Security Matrix](security-matrix.svg)

## Why it isn’t a threat *now*
- Current devices (e.g., ~10²–10³ qubits) are **NISQ**: noisy and short‑lived. They cannot run long, error‑corrected programs.
- Breaking RSA/ECDSA at internet scale needs **millions of logical qubits** and **hours of stable operation** — an engineering moonshot still far away.
- Hash functions like **SHA‑256** retain enormous effective strength because Grover only halves the exponent (256 → ~128). That’s still **astronomical**.

## What quantum computers *will* shine at
Think like Feynman: use quantum to **simulate nature** and to **optimize hard problems**.
- **Chemistry & drug discovery** (molecular energy, protein binding)
- **Materials** (better batteries, catalysts, superconductors)
- **Optimization** (logistics, portfolio construction, scheduling)
- **Certain ML tasks** (quantum kernels, sampling)

## Bottom line
Your **banking apps and Bitcoin** are safe **today**. The real action for the next decade is **scientific discovery**. Meanwhile, standards bodies and ecosystems are already rolling out **PQC** so that—when quantum scales—we’ll simply *upgrade the math*.

---

*Publish note:* place the two SVGs alongside this file for Markdown preview/embed to work.
