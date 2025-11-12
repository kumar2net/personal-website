## Carbon Footprint Calculator (MVP)

### Objective
Deliver a lightweight MVP that helps users estimate their monthly household carbon footprint by combining energy, water, waste, and travel usage with the Climatiq API using metric units throughout.

### Primary Goals
1. Capture the key inputs listed in `docs/carbonFP.md` and translate them into compatible Climatiq emissions queries.
2. Return a single, easy-to-read monthly emissions total with contextual breakdowns (e.g., energy vs. travel).
3. Keep interactions minimal: no account setup, no long-term storage, just on-demand calculations.

### Inputs (from user)
| Category | Details |
| --- | --- |
| Energy | Energy consumption per month (kWh). |
| Water | Monthly water usage with type (RO/raw) to map to correct factor. |
| LPG | Number of cylinders per month and size (10 kg or 15 kg). |
| Waste | Approximate wet and dry waste generated per month (kilograms). |
| Travel | Kilometers per mode: car, flight, train, bus. |
| Bonus | Any other emission category supported by Climatiq (e.g., electricity split by provider). |

### Climatiq Integration
- Use Climatiq's API reference to determine emission factors for each category.
- For each input, send a single `POST /v1/estimate` with the relevant `emission_factor` key.
- Aggregate results locally into a monthly total and break down by category for the response.
- Handle API failures gracefully with a contextual error message and guidance to retry.

### MVP Scope & UX
- Single-page flow or modal form that collects the inputs in order; keep fields optional when data is not available.
- After submission, show a concise summary: total tons CO₂e per month plus a short narrative about largest contributors.
- Include helper text explaining what each input means (e.g., how to estimate waste, what “raw water” implies).
- No persistence, user accounts, or historical tracking in MVP.

### Success Criteria
1. Users can fill required fields and see an emission estimate in under 30 seconds.
2. Each data category maps cleanly to at least one Climatiq emission factor.
3. Error handling informs users when the API or inputs fail (validation or network).

### Open Questions
1. Adopt metric units (liters/kilograms/kilometers) and assume user entries use those units to keep the MVP focused.
2. Offer default average values when inputs are missing so the tool can always return a quick estimate.
