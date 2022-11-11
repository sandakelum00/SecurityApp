const nodemailer = require("nodemailer");

const generateOtp = () => {
  let OTP = "";
  for (let i = 0; i < 5; i++) {
    const randomValue = Math.round(Math.random() * 9);
    OTP += randomValue;
  }
  return OTP;
};

const mailTransport = () =>
  nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,

    /**
     * if user gmail credentials uncomment this following comments and
     * comment is other host and port
     * **/

    // host: "smtp.gmail.com",
    // port: 465,
    // secure: true,

    auth: {
      user: process.env.MAILTRAP_USER_NAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

module.exports = { generateOtp, mailTransport };
