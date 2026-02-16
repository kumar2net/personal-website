#!/usr/bin/env node
const errRate = Number(process.env.CANARY_ERROR_RATE || "0");
const p95 = Number(process.env.CANARY_P95_MS || "0");
const sampleRequests = Number(process.env.CANARY_REQUESTS || "0");
const maxErrRate = Number(process.env.CANARY_MAX_ERROR_RATE || "0.02");
const maxP95 = Number(process.env.CANARY_MAX_P95_MS || "800");
const minSampleRequests = Number(process.env.CANARY_MIN_REQUESTS || "100");

const hasErrRateInput = Number.isFinite(errRate) && errRate > 0;
const hasP95Input = Number.isFinite(p95) && p95 > 0;

if (sampleRequests > 0 && sampleRequests < minSampleRequests) {
  console.error(
    `[canary-health] Insufficient sample for canary signal: ${sampleRequests} < ${minSampleRequests}`,
  );
  process.exit(1);
}

if (hasErrRateInput && errRate > maxErrRate) {
  console.error(
    `[canary-health] Canary unhealthy: error rate ${errRate} > threshold ${maxErrRate}`,
  );
  process.exit(1);
}

if (hasP95Input && p95 > maxP95) {
  console.error(
    `[canary-health] Canary unhealthy: p95 ${p95}ms > threshold ${maxP95}ms`,
  );
  process.exit(1);
}

if (hasErrRateInput || hasP95Input) {
  console.log(
    `[canary-health] Canary healthy: errRate=${errRate || 0}, p95=${p95 || 0}, samples=${sampleRequests || 0}`,
  );
} else {
  console.log("[canary-health] No canary metrics provided; skipping gate.");
}
