
import path from 'path';
import ejs from 'ejs-promise';

export default async ({template, params}: any) => {

   // Get the EJS file that will be used to generate the HTML
   const file = path.join(__dirname, `../views/mails/${template}.ejs`);

   // Throw an error if the file path can't be found
   if (!file) {
      throw new Error(`Could not find the ${template} in path ${file}`);
   }

   return await ejs.renderFile(file, params, {}, (error, result) => {
      if (error) {
         return error;
      }
      return result
         .then(function (data) {
            return data;
         }).catch((error) => {
            throw error;
         });
   });
}