'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

//Google authentication
const { google } = require('googleapis');

var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
var jwtClient = new google.auth.JWT(
	"dialogflowfulfillment@project-id-198761437740572.iam.gserviceaccount.com",
	null,
	"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDWC4iKy6qJoddm\n7PJ/8oJPUtJX26jBhG5F/Wjx88whRqsL7kn+/MK6edDyKtc8idP2wrfeeHUPf168\nIljCfChHnSi2WGsApiDoVZcxfbjB/0oOL+ZFmM3lcCpn1m40GO1Ee5pWEWhnipe1\niu+pr/MaismxmdOocXDZ3Yo6h/61OPtV93JlSNx8nZxV5E/BpPNFClwgx/NRbZOP\nGWYTUBdnznPQcy9YSK26YWLnIOSf2K6ysXBQIdFdHu/cv4nRVojckdc00c1rPXp3\nWtuozopL3ajXGxJ8Th2ndiYI5ozJvwT28qEPbVwcMEVrVDX6uzBaVYYA\nmC4UJzeRAgMBAAECggEAHjMlDLriUOZDcgOJziuf3yPxsZu4b7VeVFmww5KBAUuV\n4+phs6xjUn7QJZrjIL4sPetd7fGo8orSCaapTaNypL9lP5pjfD\nr/rDgkhd/g/K0UTDZ4+XuzEO7f/0+hiDTItv4Hg1kQKBgQDryZ6cPMyXa81GZkPY\nCZolPIhG5eMNLtyyrVToS05/7LSDTecuDZRW0oJ8JKS9g1O2CewAKuidS0p2nBZS\nJWlRd8f0cPKWBhvShCK7kkH491gKJQ5HLpTrr1EVZaZGEtT/XBRzPlS/loAQFOci\nhKy9qThYl6qHkrp+NtoaHDbvuwKBgQDoZMWTmTAoAeuZZ76di\nbcQfrmO1wSg6uoLwncJKmqDHbUiQ8C8ELwZkKpmTYVlAqMvv1ZwafUKarHgeUf8A\nO1/7Tu+4SIycvnu7MD8aRKbESW5Gn1UXjB7lPr9sqPiwLbxleU8O0vTvds7enhwU\nrcJ1iQvDIwKBgQDUL6e10B0JczDS1rrdEp8OPXAh5UUzmuVvQf6z4Pkus/QqaZPO\nZNgGXgCg+VTrWuCdZEZmTDbzPksve/22RQaHEvT1bCNSkQK+qrya8d6+ztACqSA1\nPJ01j5q3V7ePPelCODoLD5+ynhx23Gi4Lo9JSpxzVWFYCdocNP6HGrbxewKBgQDD\nyrsW+rfl/Zp0S+7/2MGb0a6PjvvqA9ZjQBV/l55cMBujtyXAcTmTP0l8G5+KtUD3\nZmMdGyL+n4LhzhTbwH1fd+8Yf3xIF08fM+b+xReEjGMjX/zAzboseHCEaVVmXLEF\nQMF65O3EL2wuiqnyWEz6MVO5OMC7oDwKVAbEnazyPwKBgAGUFI+75HsTydphwyLs\nZcrliJkxinWKigc+5nWzExExbP4eq+yQAwnmN1zcY7FHnzYR4+0VW6Kg33LUMYC/\n7mPSb+Qb3GEaouSVGQELUwDQf/mGSKHmBg7xx+19lFGcGD3pxO5hIZAO6Xl21xyO\nO2v9fX5zTwz1VIHDXHQ/vac0\n-----END PRIVATE KEY-----\n",
	SCOPES, // an array of auth scopes
	null);
var sheets = google.sheets('v4');
const spreadsheetId = '106OXGLOynfgq24AxAr6oPuMU6oBBGDSUbw';
//End
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
    function takeDataHandler(agent) {
        //agent.add("Query :"+request.body.queryResult.queryText);
        return new Promise((resolve,reject)=>{
        
        // Spreadsheet data pull
        sheets.spreadsheets.values.get({
            auth: jwtClient,
            spreadsheetId: spreadsheetId,
            range: 'Sheet2!A:Z',
        }, (err, {data}) => {
            if (err) return console.log('The API returned an error: ' + err);
            const rows = data.values;
            if (rows.length) {
                let message='';
                let count = 0;
                agent.add('Data from spreadsheet - '+rows[0][0]);
                resolve();
              } else {
                console.log('No data found.');
              }
            });
       })
    
   }
   
   function dataSaveHandler(agent){
       appendData(request.body.queryResult.queryText);
       agent.add('Data saved. Thanks');
   }
   
  let intentMap = new Map();
  intentMap.set('Data save intenet', dataSaveHandler);
  intentMap.set('Data get intenet', takeDataHandler);
    
  agent.handleRequest(intentMap);
});

function appendData(_queryText) {
  sheets.spreadsheets.values.append({
    auth: jwtClient,
    spreadsheetId: spreadsheetId,
    range: 'Sheet1!A1:B', //Change Sheet1 if your worksheet's name is something else
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [ [ _queryText] ]
    }
  }, (err, response) => {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    } else {
        console.log("Appended");
    }
  });
}

function getData(){
    
}