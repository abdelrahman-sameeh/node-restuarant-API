var nodemailer = require('nodemailer');
exports.sendEmail = (email, code, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD_EMAIL,
    },
  });

  var mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Sending Email using Node.js",
    html: `<h1>Welcome</h1><p>your code is =>  ${code}</p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.status(400).json({
        msg: 'Something went wrong, please try again'
      })
    } else {
      res.status(200).json({
        msg: "Email sent successfully, please verify your code before 10 minutes",
      });
    }
  });
};
