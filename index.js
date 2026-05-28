const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Resend client — HTTP-based email API. Δουλεύει στο Render Free tier
// (σε αντίθεση με Gmail SMTP που μπλοκάρεται).
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://manioudakiscompany.gr'],
  })
);
app.use(express.json());

// POST endpoint για τη φόρμα επικοινωνίας
app.post('/contact', async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;
  console.log('New contact form submission from:', `${firstName} ${lastName} <${email}>`);

  try {
    const { data, error } = await resend.emails.send({
      from: 'Manios Contact Form <onboarding@resend.dev>',
      to: process.env.EMAIL_TO || 'evangelia.manioudaki@gmail.com',
      replyTo: email,
      subject: `Μήνυμα από ${firstName} ${lastName}`,
      text: `Ονοματεπώνυμο: ${firstName} ${lastName}
Email: ${email}
Τηλέφωνο: ${phone}

Μήνυμα:
${message}`,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ message: 'Αποτυχία αποστολής email' });
    }

    console.log('Email sent successfully, id:', data?.id);
    res.status(200).json({ message: 'Το μήνυμα εστάλη επιτυχώς!' });
  } catch (error) {
    console.error('Σφάλμα κατά την αποστολή email:', error);
    res.status(500).json({ message: 'Αποτυχία αποστολής email' });
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  res.status(200).json({ message: 'All good!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
