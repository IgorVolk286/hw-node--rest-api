const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const { UKR_NET_PASSWORD, UKR_NET_EMAIL } = process.env;

const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
};

// };const email = {
//   from: UKR_NET_EMAIL,
//   to: "mivij19539@gyxmz.com",
//   subject: "Test nodeMailer",
//   html: "<p>TEST EMAIL</p>",

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendmail = (data) => {
  const email = { ...data, from: UKR_NET_EMAIL };
  return transporter.sendMail(email);
};

module.exports = sendmail;
