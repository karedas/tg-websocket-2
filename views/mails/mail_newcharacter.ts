import mjml2Html from "mjml";
import { getLocation } from "../../models/registration_data/locations";
import { getEthnicity } from "../../models/registration_data/ethnicities";
import { CharacterAccount } from "~/models/characterAccount.model";

const gender = {
  m: "maschio",
  f: "femmina",
};

export const newCharacterHtml = (data?: CharacterAccount) => {
  const loc = getLocation(data.ethnicity, data.location);
  const ethnicity = getEthnicity(data.race, data.ethnicity);

  return mjml2Html(`
  <mjml>
  <mj-head>
    <mj-attributes>
      <mj-all padding="0px"></mj-all>
      <mj-text font-family="Ubuntu, Helvetica, Arial, sans-serif" padding="0 25px" font-size="13px"></mj-text>
      <mj-section background-color="#f0ece6"></mj-section>
      <mj-class name="preheader" color="#000000" font-size="11px"></mj-class>
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#1a1511">
    <mj-section>
      <mj-column width="600px">
        <mj-image src="https://i.ibb.co/5xZ99KZ/header-mail.jpg" alt="header image" padding="0px"></mj-image>
      </mj-column>
    </mj-section>
    <mj-section padding-bottom="20px" padding-top="10px">
      <mj-column>
        <mj-text align="center" padding="10px 25px" font-size="20px" color="#512d0b"><strong> ${
          data.general.name
        }, benvenuto nel mondo di Ikhari!</strong></mj-text>
        <mj-text align="center" font-size="18px" font-family="Arial">Il tuo personaggio è stato creato con successo ed ora puoi finalmente entrare a far parte del mondo di The Gate. <br /> <br /> </br /> Cosa aspetti? Effettua subito il login a <mj-button href="http://play.thegatmeud.it" style="text-decoration:underline; color: #ffbd02;">questo indirizzo</mj-button> con le credenziali che hai inserito e dai il via alla tua avventura!</mj-text>
        <mj-text align="center" color="#ffbd02" font-size="25px" font-family="Arial, sans-serif" font-weight="bold" line-height="35px" padding-top="20px">Il tuo personaggio:</mj-text>
        <mj-table padding-left="20px" padding-right="20px" table-layout="fixed" align="center" width="80%" font-size="16px">
          <tr>
            <td style="padding: 0 15px; text-align:right;"><b>Nome</b></td>
            <td style="padding: 0 0 0 15px;"><u>${data.general.name}<u></td>
          </tr>
          <tr>
            <td style="padding: 0 15px; text-align:right;"><b>Password</b></td>
            <td style="padding: 0 0 0 15px;">${data.general.password}</td>
          </tr>
          <tr>
            <td style="padding: 0 15px; text-align:right;"><b>Genere</b></td>
            <td style="padding: 0 0 0 15px;">${gender[data.general.gender]}</td>
          </tr>
          <tr>
            <td style="padding: 0 15px; text-align:right;"><b>Razza</b></td>
            <td style="padding: 0 0 0 15px;">${ethnicity.name}</td>
          </tr>
          <tr>
            <td style="padding: 0 15px; text-align:right;"><b>Cultura</b></td>
            <td style="padding: 0 0 0 15px;">${data.culture}</td>
          </tr>
          <tr>
            <td style="padding: 0 15px; text-align:right;"><b>Città di partenza</b></td>
            <td style="padding: 0 0 0 15px;">${loc.name}</td>
          </tr>
        </mj-table>
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
        <mj-button background-color="#ffbd02" color="#ffffff" font-family="Arial, sans-serif" padding="20px 0 0 0" font-weight="bold" font-size="16px" href="http://play.thegatemud.it">Accedi al gioco</mj-button>
        <mj-text align="center" color="#000000" font-size="14px" font-family="Arial, sans-serif" padding-top="40px">Grazie da tutti noi, <br />
          <span style="color:#ffbd02">Lo staff di The Gate Mud</span>
          <p></p>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
    `);
};
