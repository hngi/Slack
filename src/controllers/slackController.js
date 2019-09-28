/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable max-len */
import request from 'request';
import fs from 'fs';
import os from 'os';
import { prepareRequestMessage } from '../helpers/slackRequest';
import { CONVERSATION_PATH } from '../config/config';
import { authorize, uploadConversation } from './googleController';
import { ACCESS_TOKEN } from '../../token';

async function getConversationsHistory(payloadParam, authentication) {
  const { channel_id, channel_name, response_url } = payloadParam;
  const options = {
    uri: `https://priapus.slack.com/api/conversations.history?token=${ACCESS_TOKEN[payloadParam.team_id]}&channel=${channel_id}`,
    method: 'GET',
  };
  let upload;
  request(options, async (error, response, body) => {
    const payload = JSON.parse(body);
    let conversation = `CHANNEL: ${channel_name.toUpperCase()}${os.EOL}`;
    conversation += `ID,NAME,TIME,MESSAGE${os.EOL}`;
    payload.messages.map((msg, index) => {
      const { user, ts, text } = msg;
      const formatedText = text.replace(/(\r\n|\n|\r)/gm, '. ');
      const msgTime = new Date(ts * 1000).toUTCString();
      conversation += `${index + 1},'${user}','${msgTime}','${formatedText}'${os.EOL}`;
      return conversation;
    });
    fs.writeFileSync(CONVERSATION_PATH, String(conversation), async (err) => {
      if (err) return console.error(err);
    });
    upload = await uploadConversation(authentication);
    const initMessage = {
      text: 'Conversation has been saved to your Google drive as `conversation.csv`',
      attachments: [
        {
          fallback: 'preview_here',
          actions: [
            {
              type: 'button',
              text: 'Preview',
              url: `https://drive.google.com/file/d/${upload.data.id}/view`,
            },
          ],
        },
      ],
    };
    const postOptions = prepareRequestMessage('POST', response_url, initMessage);
    request(postOptions, (err, resp, resBody) => {
      if (err) {
        console.log(err);
        return;
      }
    });
  });
}

export const getSlashCommandInfo = async (req, res) => {
  res.status(200).end(); // best practice to respond with 200 status
  const payload = req.body;
  const responseURL = payload.response_url;
  let initMessage;
  const authentication = await authorize();
  if (typeof authentication === 'string') {
    initMessage = {
      text: '*One time authorization! Click the button below to allow Priapus Saver upload conversation to your Google Drive*',
      attachments: [
        {
          fallback: 'remember_to',
          actions: [
            {
              type: 'button',
              text: 'Authorize Priapus',
              url: authentication,
            },
          ],
          text: 'Remember to launch this command again after authorization',
        },
      ],
    };
    const postOptions = prepareRequestMessage('POST', responseURL, initMessage);
    request(postOptions, (error, response, body) => {
      if (error) {
        console.log(error);
        return;
      }
    });
  } else {
    // Get conversation and upload to drive
    getConversationsHistory(payload, authentication);
  }
};
