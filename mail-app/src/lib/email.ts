import nodemailer from 'nodemailer';

export async function sendEmails(receivers: string[]): Promise<void> {
  if (receivers.length <= 1) {
    return; // No need to send if only the default email is present
  }
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });
  
  const mailOptions = {
    from: 'thisisnotkush@gmail.com',
    to: receivers,
    subject: 'Sending Email using Next.js',
    text: 'That was easy!'
  };
  
  await transporter.sendMail(mailOptions);
}