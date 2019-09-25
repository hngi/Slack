import request from 'request';
import { prepareRequestMessage } from '../helpers/slackRequest';
import { initMessage } from '../helpers/messages';

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');


export const getSlashCommandInfo = (req, res) => {
  res.status(200).end(); // best practice to respond with 200 status
  const payload = req.body;
  const responseURL = payload.response_url;
  const postOptions = prepareRequestMessage('POST', responseURL, initMessage);
  request(postOptions, (error, response, body) => {
    if (error) {
      console.log(error);
      return;
    }
    return;
  });
};

export const initButtonConfirmation = (req, res, next) => {
  let message;
  res.sendStatus(200).end(); // best practice to respond with 200 status
  const responsePayload = JSON.parse(req.body.payload);
  console.log(responsePayload);
  if (responsePayload.actions[0].name === 'no') {
    message = {
      text: `Bye ${responsePayload.user.name}`,
    };
  } else {
    message = {
      text: `${responsePayload.user.name} your conversation will be saved to Google Drive`,
    };
  }
  const postOptions = prepareRequestMessage('POST', responsePayload.response_url, message);
  request(postOptions, (error, response, body) => {
    if (error) {
      console.log(error);
    }
    return;
  });
  req.channel = responsePayload.channel;
  // get slack channel history
  next();
};

export const getConversationsHistory = (req, res) => {
  const options = {
    uri: 'https://slack.com/api/conversations.history',
    method: 'GET',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
    },
    json: req.channel.id,
  };
  request(options, (error, response, body) => {
    const JSONresponse = JSON.parse(body);
    if (!JSONresponse.ok) {
      res.send(`Error encountered: \n${JSON.stringify(JSONresponse)}`).status(200).end();
    }
    console.log(response.body);
    console.log(JSONresponse);
  });
  // google drive auth function is called here
  const SCOPES = ['https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content), uploadFile);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);//list files and upload file
        //callback(oAuth2Client, '0B79LZPgLDaqESF9HV2V3YzYySkE');//get file

    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}



function uploadFile(auth) {
    const drive = google.drive({ version: 'v3', auth });
    var fileMetadata = {
        'name': 'Bottest.jpg'
    };
    var media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream('../helpers/test.jpg')
    };
    drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    }, function (err, res) {
        if (err) {
            // Handle error
            console.log(err);
        } else {
            console.log('File Id: ', res.data.id);
        }
    });
}

};
