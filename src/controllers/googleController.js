/* eslint-disable consistent-return */
import { google } from 'googleapis';
import fs from 'mz/fs';
import path from 'path';
import { googleConfig, CONVERSATION_PATH, TOKEN_PATH } from '../config/config';


const SCOPES = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/drive',
];

const OAuth2Client = google.auth.OAuth2;

/**
 * Uploads the conversation
 */
export const uploadConversation = async (auth) => {
  const drive = google.drive({ version: 'v3', auth });
  let toUpload;
  const fileMetadata = {
    name: CONVERSATION_PATH,
  };
  const media = {
    mimeType: 'text/csv',
    body: fs.createReadStream(CONVERSATION_PATH),
  };
  const uploadedFile = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: 'id',
  }).then((file) => {
    toUpload = { ...file };
    return toUpload;
  }).catch(err => console.error(err));
  return uploadedFile;
};

function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  return authUrl;
}

export const authorize = async () => {
  const { clientId, clientSecret, redirect } = googleConfig;
  const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirect);

  // Check if we have previously stored a token.
  try {
    const token = await fs.readFile(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  } catch (err) {
    return getAccessToken(oAuth2Client);
  }
};

export const getGoogleAccountFromCode = (req, res) => {
  const { code } = req.query;
  const { clientId, clientSecret, redirect } = googleConfig;
  const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirect);
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error retrieving access token', err);
    oAuth2Client.setCredentials(token);
    // Store the token to disk for later program executions
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (error) => {
      if (error) return console.error(error);
    });
  });
  res.sendFile(path.join(__dirname, '../../public/redirect.html'));
};
