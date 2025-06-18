const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Route για το POST αίτημα από το contact form
app.post('/contact', async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Μήνυμα από ${firstName} ${lastName}`,
      text: `
        Ονοματεπώνυμο: ${firstName} ${lastName}
        Email: ${email}
        Τηλέφωνο: ${phone}
        Μήνυμα: ${message}
      `
    });

    res.status(200).json({ message: 'Το μήνυμα εστάλη επιτυχώς!' });
  } catch (error) {
    console.error('Σφάλμα κατά την αποστολή email:', error);
    res.status(500).json({ message: 'Αποτυχία αποστολής email' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});