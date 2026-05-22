const express = require('express');
const { z } = require('zod');
const submissions = require('../lib/submissions');

const router = express.Router();

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  email: z.string().email('Valid email required'),
  role: z.enum(['founder', 'engineer', 'designer', 'pm', 'other']),
  teamSize: z.coerce.number().int().min(1).max(100000),
  features: z.array(z.string()).min(1, 'Pick at least one feature'),
  rating: z.coerce.number().int().min(1).max(5),
  notes: z.string().max(2000).optional().default(''),
});

router.post('/submit', (req, res) => {
  const parsed = schema.safeParse(req.body || {});
  if (!parsed.success) {
    const fieldErrors = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join('.')] = issue.message;
    }
    return res.status(400).json({ error: 'validation_failed', fields: fieldErrors });
  }
  const row = submissions.add(parsed.data);
  res.json({ ok: true, id: row.id });
});

module.exports = router;
