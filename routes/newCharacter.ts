import express from "express";
import validator from "validator";
import generatePassword from "generate-password";
import { CharacterAccount } from "../models/characterAccount.model";
import { NetConnection } from "../helpers/netConnection";
import { registerNewCharacter } from "../helpers/mailer";

const generateCreationQuery = (ca: CharacterAccount): string | null => {
  if (!ca) return;
  let query = "create:";
  query += `${ca.general.name},`;
  query += `${ca.general.password},`;
  query += `${ca.general.email},`;
  query += `${ca.ethnicity},`;
  query += `${ca.general.gender},`;
  query += `${ca.culture},`;
  query += `${ca.location},`;
  query += `${ca.attributes.strength},`;
  query += `${ca.attributes.constitution},`;
  query += `${ca.attributes.size},`;
  query += `${ca.attributes.dexterity},`;
  query += `${ca.attributes.speed},`;
  query += `${ca.attributes.empathy},`;
  query += `${ca.attributes.intelligence},`;
  query += `${ca.attributes.willpower}`;

  return query;
};

const maskPassword = (pwd: string): string => {
  let splitPwd = pwd.split("");
  let maskedPwd = "";

  for (let i = 0; i < splitPwd.length; i++) {
    if (i > 0 && i < splitPwd.length - 1) {
      maskedPwd += "*";
    } else maskedPwd += splitPwd[i];
  }
  return maskedPwd;
};

const router = express.Router();
router.post("/", (_request, _response, _next) => {
  let newHero: CharacterAccount = _request.body;

  if (newHero.general && newHero.general.email) {
    if (!validator.isEmail(newHero.general.email)) {
      _response
        .status(400)
        .json({ status: "error", message: "Email non valida" });
      return;
    }
  } else
    _response
      .status(400)
      .json({ status: "error", message: "Parametri mancanti" });

  const newPassword = generatePassword.generate({
    length: 10,
    numbers: false,
    lowercase: true,
  });

  newHero.general.password = newPassword;
  const characterQuery = generateCreationQuery(newHero);

  if (!characterQuery) {
    throw new Error("Dati incompleti");
  }

  let headers = _request.headers;
  const netConnection = new NetConnection();
  registerNewCharacter(newHero);

  const tgconn = netConnection
    .connect(headers)
    .then((data) => {
      registerNewCharacter(newHero);
      _response.status(200).send("OK");
    })
    .catch((e) => {
      console.log("error");
      _response.status(400).send({
        status: "Error",
        message: "Impossibile terminare la procedura",
      });
    });

  // netConnection.setInitHandShake(clientAddress, _request.headers);
  // netConnection.tgconn.once("data", (data) => {
  //   console.log(data.toString());
  //   //   const itime = new Date().getTime().toString(16);
  //   //   // if (data.toString().indexOf("Vuoi i codici ANSI") !== -1) {
  //   //   //   netConnection.tgconn.write("WEBCLIENT(0.0.0.0,171c654e58e+e8a0accef4f14e7bdaef233878298b28, 0)\n");
  //   //   // }
  //   //   // })
  // });

  // netConnection.on("connect", () => {
  //   console.log('connected');
  //   // netConnection.write(timeStamp.toString(16));
  // })

  // let splitPwd = password.split('');
  // let maskedPwd = '';
  // for(let i = 0; i < splitPwd.length; i++) {
  //   if(i > 0  && i < splitPwd.length - 1) {
  //     maskedPwd += '*';
  //   } else maskedPwd += splitPwd[i];
  // }
  // registerNewCharacter({email, name, gender, race, ethnicity, culture, location, maskedPwd})
});

export default router;
