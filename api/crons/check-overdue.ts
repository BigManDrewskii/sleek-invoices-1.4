import { detectAndMarkOverdueInvoices } from '../../server/jobs/detectOverdueInvoices';

export default async function handler(req, res) {
  // Verify Vercel cron secret
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await detectAndMarkOverdueInvoices();
    res.status(200).json({ success: true, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
