import net, { NetConnectOpts } from "net";
import express from "express";
import validator from "validator";
import { config } from "../core/config";
import { registerNewCharacter } from "../helpers/mailer";


const router = express.Router();
 
router.post("/", (_request, _response, _next) => {
  const {
    race,
    ethnicity,
    culture,
    location,
    attributes: {
      strength,
      constitution,
      size,
      dexterity,
      speed,
      empathy,
      intelligence,
      willpower
    },
    general: {
      gender,
      name,
      email,
      password
    }
  } = _request.body;

  // const {
  //   strength,
  // } = attributes;

  if (!validator.isEmail(email)) {
    _response.status(400).json({ status: "error", message: "Email non valida" });
    return;
  }

  let query = "";
  query += `create:${name},${password},${email},,${ethnicity},${gender},${culture},${location},`;
  query += `${strength},${constitution},${size},${dexterity},${speed},${empathy},${intelligence},${willpower}`;

  if(!query) {
    throw new Error("Dati incompleti")
  }


  // const netConnection = net.connect(<any>config.game_port);
  // const netConnection = net.connect(<NetConnectOpts>{
  //   host: <any>config.game_host,
  //   port: <any>config.game_port,
  // });

  // netConnection.on("close", (err: any) => {
  //   netConnection.destroy();
  // });

  // netConnection.once('data', (data) => {
  //   console.log(data.toString());
  //   const timeStamp = new Date().getTime();
  //   if (data.toString().indexOf("Vuoi i codici ANSI") !== -1) {
  //     netConnection.write("WEBCLIENT(0.0.0.0,171c654e58e+e8a0accef4f14e7bdaef233878298b28, 0)\n");
      
  //   }
  // })

  // netConnection.on('close', err => console.log(err))
  // netConnection.on('error', err => console.log(err))
  // netConnection.on("connect", () => {
  //   console.log('connected');
  //   // netConnection.write(timeStamp.toString(16));
  // })

  let splitPwd = password.split('');
  let maskedPwd = '';
  for(let i = 0; i < splitPwd.length; i++) {
    if(i > 0  && i < splitPwd.length - 1) {
      maskedPwd += '*';
    } else maskedPwd += splitPwd[i];
  }
  registerNewCharacter({email, name, gender, race, ethnicity, culture, location, maskedPwd})
  

  _response.status(200).send('OK');
});

export default router;
