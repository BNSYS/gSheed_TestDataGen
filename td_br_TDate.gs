const charSetNum = '0123456789';
const charSetNumLet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const category = [`Academic / Research Facilities`,`Associations`,`Competitors`,`Corporate Parent`,`Distributors`,`Health Care Facilities`,`Others`,`Payers`,`Pharmacy`];
const type = [`Allied Health Professional`,`Business Management`,`Doctor`,`Nurse`,`Other`,`Pharmacist`];
const cot_Type = [`Type_1`,`Type_2`,`Type_3`,`Type_4`];
const cot_SubType = [`SubType_1`,`SubType_2`,`SubType_3`,`SubType_4`];
const source_System = [`Reltio`,`CNES`,`MDTR`,`HM`];

let ss = SpreadsheetApp.getActiveSpreadsheet();
let dataIn = ss.getActiveSheet();
let numberOfrecords = dataIn.getRange('InitInfo!C11').getValue();
let testDataMarker = dataIn.getRange('InitInfo!C12').getValue();
//const numberOfrecords = 10;


function onOpen() {
  let ui = SpreadsheetApp.getUi();
  ui.createMenu('ThinkData test data generator')
  .addItem('HCP data generation SFTP','getHCPdata')
  .addItem('HCO data generation SFTP','getHCOdata')
  .addItem('HCP data generation MDM','getHCPdataMDM')
  .addItem('HCO data generation MDM','getHCOdataMDM')
  .addToUi();
}

function getHCPdata() {
  let sheet = SpreadsheetApp.getActiveSheet();
  sheet.getRange(`A1:J1`).setValues([[`"Reltio_DCR_ID"`,`"Reltio_MDM_ID"`,`"Type"`,`"SubType"`,`"Full_Name"`,`"Tax_Identifier_Number"`,`"Birth_Date"`,`"Professional_ID_State"`,`"Professional_ID_Number"`,`"Source_System"`]]);
  for(let i=0; i < numberOfrecords; i++){
  const formData = {
    'acao': 'gerar_pessoa',
    'sexo': 'I',
    'pontuacao': 'S',
    'idade': '0',
    'cep_estado': '',
    'txt_qtde': '1',
    'cep_cidade': ''
  };
  const options = {
  'method' : 'post',
  'payload' : formData
};
    let response = UrlFetchApp.fetch('https://www.4devs.com.br/ferramentas_online.php', options);
//    Logger.log(response.getContentText());
    let postData = JSON.parse(response.getContentText());
    
    let range = `A`+(sheet.getLastRow() + 1)+`:J`+(sheet.getLastRow() + 1);
//    console.log(postData); 
    
    let birth_Date = postData.data_nasc;
    birth_Date = birth_Date.slice(0,5);
    let cpf = postData.cpf;
    cpf = cpf.replace(/[.-]/g,"");
//    console.log(birth_Date);
    sheet.getRange(range).setValues([[`"`+makeid(charSetNumLet,7)+`"`,`"`+makeid(charSetNumLet,8)+`"`,`"`+pickRandomItemFromList(type)+`"`,`"`+pickRandomItemFromList(cot_SubType)+`"`,
                                      `"`+postData.nome+`"`,`"`+cpf+`"`,`"`+birth_Date+`"`,`"`+postData.estado+`"`,`"`+makeid(charSetNum,7)+`"`,`"`+pickRandomItemFromList(source_System)+`"`]]);
}
}

function getHCOdata() {
  let sheet = SpreadsheetApp.getActiveSheet();
  sheet.getRange(`A1:G1`).setValues([[`"Reltio_DCR_ID"`,`"Reltio_MDM_ID"`,`"Category"`,`"COT_Type"`,`"COT_SubType"`,`"Tax_Identifier_Number"`,`"Source_System"`]]);
  for(let i=0; i < numberOfrecords; i++){
  const formData = {
    'acao': 'gerar_cnpj',
    'pontuacao': 'N'
  };
  const options = {
  'method' : 'post',
  'payload' : formData
};
    let response = UrlFetchApp.fetch('https://www.4devs.com.br/ferramentas_online.php', options);
//    Logger.log(response.getContentText());
    let postData = response.getContentText();
    let range = `A`+(sheet.getLastRow() + 1)+`:G`+(sheet.getLastRow() + 1);
//    console.log(range); 
    sheet.getRange(range).setValues([[`"`+makeid(charSetNumLet,7)+`"`, `"`+makeid(charSetNumLet,8)+`"`, `"`+pickRandomItemFromList(category)+`"`, `"`+pickRandomItemFromList(cot_Type)+`"`,
                                      `"`+pickRandomItemFromList(cot_SubType)+`"`, `"`+postData+`"`, `"`+pickRandomItemFromList(source_System)+`"`]]);
}
}

function getHCOdataMDM() {

console.log(dataIn);
  console.log(numberOfrecords);
  console.log(testDataMarker);
}

function getHCPdataMDM(){

}

function makeid(characters,length) {
   let result = '';
   let charactersLength = characters.length;
   for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function pickRandomItemFromList(itemArray){
itemArray = itemArray[Math.floor(Math.random() * itemArray.length)];
return itemArray;
}
