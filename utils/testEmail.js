const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const pug = require('pug');
const htmlToText = require('html-to-text');

const send = async (user, template, subject) => {
  let transport;
  if (process.env.NODE_ENV === 'production') {
    transport = nodemailer.createTransport(
      nodemailerSendgrid({
        apiKey: process.env.SENDGRID_APIKEY,
      }),
    );
  } else {
    transport = nodemailer.createTransport({
      // service: 'Gmail',
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },

      // Activate "less secure app" option in Gmail
    });
  }
  // 1) Render the HTML based on the given pug template
  const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
    firstName: user.name.split(' ')[0],
    url: 'www.google.com',
    subject,
  });

  // 2) Define the mail options
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject,
    html,
    text: htmlToText.convert(html),
  };

  // 3) Create a transport and send the email
  await transport.sendMail(mailOptions);
};

exports.sendWelcome = async (user) => {
  await send(user, 'welcome', 'Welcome to the Natours Family!');
};
exports.sendPasswordReset = async (user) => {
  await send(
    user,
    'passwordReset',
    'Your password reset token (Only valid for 10 minutes)',
  );
};
