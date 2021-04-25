const { google } = require('googleapis');
const credentials = require('../credentials.json');
const scopes = [
    'https://www.googleapis.com/auth/drive.metadata.readonly'
  ];

const auth = new google.auth.JWT(
    credentials.client_email, null,
    credentials.private_key, scopes
  );
  
const drive = google.drive({ version: "v3", auth });


async function getFiles(){
    try{
      const filterBy = {
        q: "mimeType = 'application/vnd.google-apps.document' and not name contains '[wip]' and not name contains '[info]'",
        pageSize: 800, //default may be 100 so we may need to increase if its not grabbing more than 100
        fields: 'nextPageToken, files(id, name, webViewLink, description)',  
      }
      const res = await drive.files.list(filterBy)
      const files = res.data.files;

      return files
    }catch(err){
      console.log(err)
    }
}


  module.exports = {
    getFiles
  };