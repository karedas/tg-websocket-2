import nodemailer from "nodemailer";
import { config } from "../core/config";

export const reisterNewCharacter = (email: string, hero: any) => {
  var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "1a2b3c4d5e6f7g",
      pass: "1a2b3c4d5e6f7g",
    },
    debug: true,
    logger: true
  });

  const mailOptions = {
    from: '"The Gate Mud" <staff@thegatemud.it>',
    to: email,
    subject: `Il tuo personaggio ${hero.general.name} è stato creto!`,
    text: "testo ----> ---> ",
    html:
      '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br /><img src="cid:uniq-mailtrap.png" alt="mailtrap" />',
    // attachments: [
    //   {
    //     filename: "mailtrap.png",
    //     path: __dirname + "/mailtrap.png",
    //     cid: "uniq-mailtrap.png",
    //   },
    // ],
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
};
