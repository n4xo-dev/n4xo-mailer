import nodemailer from 'nodemailer';
import Fastify from 'fastify';

const app = Fastify();

app.post('/api/contact', async (request, reply) => {
  const { name, email, message } = await request.body;

  const transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'postmaster@sandbox704ec31940494265a5a375c576b49843.mailgun.org',
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: 'postmaster@sandbox704ec31940494265a5a375c576b49843.mailgun.org',
    to: 'me@n4xo.com',
    subject: 'New message from your website!',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
});

app.listen({ port: 3000 });