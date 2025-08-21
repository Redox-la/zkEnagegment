# zkEngagement — System Flow (Mock v1)

Goal: Prove “engagement ≥ N in epoch E” without exposing raw activity.

Actors:
- User: generates or requests a proof about their engagement.
- Client: React app to submit proof and view result.
- Server: forwards proofs to zkVerify Relayer; returns normalized result.
- zkVerify Relayer: verifies ZK proofs; returns validity + receipt.

Happy path:
1) Client constructs `{ proof, publicSignals, verifierConfig }` (mock for now).
2) POST /api/proofs/verify → Server
3) Server forwards payload → zkVerify Relayer
4) Relayer responds → Server normalizes → Client displays:
   - status: verified / not verified
   - receipt / tx hash (if available)
   - epoch & threshold matched

Anti-spam constraint (planned):
- Integrate a group-membership + nullifier model (Semaphore concept) so each user can only “signal” once per epoch.

Attestations (planned):
- If verified, store minimal receipt and render a “Private Badge” view (Sismo-style).
