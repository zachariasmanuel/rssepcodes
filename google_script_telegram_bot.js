var zac_bot_token = "649312387:AAH7h__-8qAKYsjv0ETcqzAgsH0c";
var zac_url = "https://api.telegram.org/bot" + zac_bot_token;

//var ssep_bot_token = "561841784:AAH2B_BVNMq9QvbyDG-E";
//var ssep_url = "https://api.telegram.org/bot" + ssep_bot_token;

var webAppUrl = "https://script.google.com/a/zachariasmanuel.com/macros/s/AKfyp77YSEGgyn2cCdJBEXrYTJ68fRPT0mxjlgiytUahA/exec";

var ssID = '106OXGLOynfgq24AxRr6oPuMU6oBBGDSUbw';

function setWebhook() {
  var response = UrlFetchApp.fetch(zac_url + "/setWebhook?url=" + webAppUrl);
  Logger.log(response.getContentText()); 
}

function doGet (e){
  return HtmlService.createHtmlOutput("Hello " + JSON.stringify(e));
}

function doPost (e){
 
  var contents = JSON.parse(e.postData.contents);
  var text = contents.message.text;
  var id = contents.message.from.id;
  //var id = "-1001163726437";
  //var name = contents.message.from.first_name + " " + contents.message.from.last_name;
  //UrlFetchApp.fetch(ssep_url + "/sendMessage?chat_id=" + id + "&text="+text);
  
  if(text.split(' ')[0] === 'save'){
    var split = text.split(/ (.+)/)[1];
    addDataToSpreadsheet(split, id);
  }
  else if(text.split(' ')[0] === 'get'){
    getDataFromSpreadsheet(id)
    
  }
}

function getDataFromSpreadsheet(id){
  var sss = SpreadsheetApp.openById(ssID);
  var ss = sss.getSheetByName('TelegramData');
  var range = ss.getDataRange();
  var data = range.getValues();
  finalData = "Data from spreadsheet: %0A";
  for (var i = 0; i< data.length ; i++){
    finalData = finalData+data[i][0]+"%0A";
  }
 
  UrlFetchApp.fetch(zac_url + "/sendMessage?chat_id=" + id + "&text="+finalData);
  
}

function addDataToSpreadsheet(data, id){
  var ss = SpreadsheetApp.openById(ssID);
  ss.getSheetByName('TelegramData').appendRow([data]);
  UrlFetchApp.fetch(zac_url + "/sendMessage?chat_id=" + id + "&text=Data saved");
}
  
