const nodemailer = require('nodemailer');
const { MailtrapTransport } = require("mailtrap");
require('dotenv').config();

const TOKEN=process.env.MAIL_API_TOKEN;

const transport = nodemailer.createTransport(
  MailtrapTransport({
    token: TOKEN,
  })
);



// Create a Nodemailer transporter using Mailtrap
// const transporter = nodemailer.createTransport({
//   host: process.env.MAIL_HOST,
//   port: process.env.MAIL_PORT,
//   auth: {
//     user: process.env.MAIL_USERNAME,
//     pass: process.env.MAIL_PASSWORD
//   },
//   secure: false,  // `false` ensures STARTTLS will be used (set to `true` only for SSL)
//   authMethod: 'PLAIN',  // Explicitly setting the authentication method to 'PLAIN'
//   //logger: true,                         //internal logging
//   //debug: true,                          //detail operation log
//   allowInternalNetworkInterfaces: false //for security reason
// });

// Send email function
exports.sendEmail = async (from, to, subject, htmlBody) => {
  try {
    let info = await transport.sendMail({
      from,           // Host website Sender address
      to,             // List of recipients
      subject,        // Subject line
      html: htmlBody        // HTML body
    });
    console.log(info.messageId);
    console.log(nodemailer.getTestMessageUrl(info));
    
    
  } catch (error) {
    console.error("Error sending email:", error);
  }
};