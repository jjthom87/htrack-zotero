const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {google} = require('googleapis');

const constants = require("./../config/constants.js");

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://spreadsheets.google.com/feeds',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/spreadsheets.readonly'
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = `${path.join(__dirname, './../resources/token.json')}`;

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
exports.authorize = async function(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

exports.appendToGoogleSheet = async function(auth, valuesToBeAdded, spreadsheetId, spreadsheetRangeToAddTo, spreadsheetRangeToGet, callback){
  await getSheetValues(auth, spreadsheetId, spreadsheetRangeToGet, function(allSheetValues){

    const formattedInputValues = formatSpreadsheetValues(valuesToBeAdded, spreadsheetRangeToGet);

    const newValues = checkForDuplicateValues(formattedInputValues, allSheetValues, valuesToBeAdded);

    const sheets = google.sheets('v4');
    const request = {
      spreadsheetId: spreadsheetId,
      range: spreadsheetRangeToAddTo,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: newValues
      },
      auth: auth
    };

    try {
      const response = (sheets.spreadsheets.values.append(request)).data;
      callback({statusCode: 200, response: JSON.stringify(response, null, 2), recordsAdded: newValues.length});
    } catch (err) {
      callback({statusCode: 422, response: err});
    }

  });
}

exports.getAllSpreadsheetValues = async function(auth, spreadsheetId, spreadsheetRange, callback){
  getSheetValues(auth, spreadsheetId, spreadsheetRange, function(res){
    callback(res)
  })
}

async function getSheetValues(auth, spreadsheetId, spreadsheetRange, callback){
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: spreadsheetRange,
    });

    callback(formatSpreadsheetValues(res.data.values, spreadsheetRange));
  } catch (err){
    callback(err)
  }
}

async function getSheetTotalPopulatedRows(auth){
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: spreadsheetRange,
  }).execute().getValues().size();

  return res;
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */

function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log(authUrl)
  console.log('Authorize this app by visiting this url:' + authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token' + err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to' + TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function formatSpreadsheetValues(spreadsheetValues, spreadsheetType){
  const sheetColumns = spreadsheetType.includes("Main") ? constants.mainColumns : constants.creatorColumns;

  const formattedValues = [];
  for(var i = 0; i < spreadsheetValues.length; i++){
    let row = spreadsheetValues[i];
    let rowObject = {};
    for(var j = 0; j < row.length; j++){
      rowObject[sheetColumns[j]] = row[j];
      if(j == (row.length - 1)){
        formattedValues.push(rowObject)
      }
    }
  }
  return formattedValues;
}

function checkForDuplicateValues(formattedValuesToBeAdded, currentValues, valuesToBeAdded){
  const currentKeys = currentValues.map((value) => value.key);
  const newValues = [];
  for(var i = 0; i < formattedValuesToBeAdded.length; i++){
    if(!currentKeys.includes(formattedValuesToBeAdded[i].key)){
      newValues.push(valuesToBeAdded[i])
    }
  }

  return newValues;
}
