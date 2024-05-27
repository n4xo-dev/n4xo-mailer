import nodemailer from 'nodemailer';
import Fastify from 'fastify';
import cors from '@fastify/cors';

const app = Fastify({ logger: true });
await app.register(cors, {
  origin: ['http://localhost:4321', 'https://n4xo.com'],
});

app.post('/api/contact', async (request, reply) => {
  const { name, email, message } = await request.body;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: Number(process.SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.TARGET_MAIL,
    subject: 'New message from your website!',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    reply.send({ success: true });
  } catch (error) {
    console.error(error);
    reply.status(500).send({ success: false, error: error.message });
  }
});

app.listen({ port: 3000 });