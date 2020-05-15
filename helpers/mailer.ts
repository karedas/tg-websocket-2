import nodemailer from "nodemailer";
import EmailTemplates from "email-templates";
import { config } from "../core/config";
import path from "path";
import { newCharacterHtml } from "../views/mails/mail_newcharacter";

const templatesDir = path.resolve(__dirname, "..", "views/mails");
const EmailAddressRequiredError = new Error("email address required");
const EmailSubjectRequiredError = new Error("email subject required");

export const transportMailer = nodemailer.createTransport({
  host: config.mailserver.host,
  port: config.mailserver.port,
  auth: {
    user: config.mailserver.auth.user,
    pass: config.mailserver.auth.pass,
  },
  debug: process.env.NODE_ENV === "development" ? true : false,
  logger: true,
});

export const registerNewCharacter = async (data: any) => {
  const Email = new EmailTemplates({
    transport: transportMailer,
    send: true,
    preview: false,
    message: {
      from: `The Gate Mud" ${config.mailserver.from}`,
      subject: `Benvenuto su The Gate: ${data.general.name} è pronto a vivere su Ikhari!`,
    },
  });

  return Email.send({
    template: "new-character",
    message: {
      html: newCharacterHtml(data).html,
      to: data.general.email,
    },
  })
    .then((res) => {
      console.log("res.originalMessage", res.originalMessage);
    })
    .catch(console.error);
};
