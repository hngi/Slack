/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable max-len */
import request from 'request';
import fs from 'fs';
import os from 'os';
import { prepareRequestMessage } from '../helpers/slackRequest';
import { BOT_TOKEN, CONVERSATION_PATH } from '../config/config';
import { authorize, uploadConversation } from './googleController';

async function getConversationsHistory(payloadParam, authentication) {
  const { channel_id, channel_name, response_url } = payloadParam;
  const options = {
    uri: `https://priapus.slack.com/api/conversations.history?token=${BOT_TOKEN}&channel=${channel_id}`,
    method: 'GET',
  };
  let upload;
  request(options, async (error, response, body) => {
    const payload = JSON.parse(body);
    let conversation = `CHANNEL: ${channel_name.toUpperCase()}${os.EOL}`;
    conversation += `ID,NAME,TIME,MESSAGE${os.EOL}`;
    payload.messages.map((msg, index) => {
      const { user, ts, text } = msg;
      const msgTime = new Date(ts);
      conversation += `${index + 1},'${user}',${msgTime},'${text}'${os.EOL}`;
      return conversation;
    });
    fs.writeFileSync(CONVERSATION_PATH, String(conversation), async (err) => {
      if (err) return console.error(err);
    });
    upload = await uploadConversation(authentication);
    const initMessage = {
      text: `Your conversation has been saved to your Google drive \n\n View it here https://drive.google.com/file/d/${upload.data.id}/view`,
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
      text: `*One time access! Follow link below to allow Priapus Bot upload conversation to your drive*  \n\n ${authentication}. \n\nRemember to launch this command again`,
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
