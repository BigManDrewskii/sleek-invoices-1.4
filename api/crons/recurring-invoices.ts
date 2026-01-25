import { generateRecurringInvoices } from "../../server/jobs/generateRecurringInvoices";

interface VercelRequest {
  headers: {
    authorization?: string;
  };
}

interface VercelResponse {
  status(code: number): VercelResponse;
  json(data: unknown): VercelResponse;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify Vercel cron secret
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await generateRecurringInvoices();
    res
      .status(200)
      .json({ success: true, timestamp: new Date().toISOString() });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
}
