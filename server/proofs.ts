import type { Request, Response } from 'express';
import fetch from 'node-fetch';

const RELAYER_URL = process.env.ZKVERIFY_RELAYER_URL!; // e.g. https://relayer.zkverify.io/api/verify

export async function verifyProof(req: Request, res: Response) {
  try {
    // Expect shape: { proof, publicSignals, verifierConfig }
    const payload = req.body;

    const r = await fetch(RELAYER_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const relayerResp = await r.json();
    // Normalize response for client consumption
    return res.json({
      verified: Boolean(relayerResp?.result?.valid ?? relayerResp?.verified),
      relayerResponse: relayerResp,
    });
  } catch (e) {
    return res.status(500).json({ verified: false, error: (e as Error).message });
  }
      }
