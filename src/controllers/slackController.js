/* eslint-disable array-callback-return */
/* eslint-disable max-len */
import request from 'request';
import fs from 'fs';
import os from 'os';
import { prepareRequestMessage } from '../helpers/slackRequest';
import { BOT_TOKEN, CONVERSATION_PATH } from '../config/config';
import { authorize, uploadConversation } from './googleController';

async function getConversationsHistory(channelId, authentication) {
  const options = {
    uri: `https://priapus.slack.com/api/conversations.history?token=${BOT_TOKEN}&channel=${channelId}`,
    method: 'GET',
  };
  fs.readFile(CONVERSATION_PATH, (errors, data) => {
    if (errors) console.error(errors);
    console.log('initial', data);
  });
  request(options, async (error, response, body) => {
    const payload = JSON.parse(body);
    let conversation = '';
    payload.messages.map((msg, index) => {
      const { user, ts, text } = msg;
      conversation += `${index + 1},'${user}',${ts},'${text}${os.EOL}'`;
      return conversation;
    });
    fs.appendFile(CONVERSATION_PATH, String(conversation), { flag: 'a+' }, async (err) => {
      if (err) return console.error(err);
    });
    fs.readFile(CONVERSATION_PATH, (errors, data) => {
      if (errors) console.error(errors);
      console.log('final', data);
    });
    const upload = await uploadConversation(authentication);
    return upload;
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
    // upload to drive
    const upload = await getConversationsHistory(payload.channel_id, authentication);
    // const upload = await uploadConversation(authentication);
    initMessage = {
      // text: `Your conversation has been saved to your Google drive \n\n View it here https://drive.google.com/file/d/${upload.data.id}/view`,
      text: 'Your conversation has been saved to your Google drive \n\n Check the file conversation.csv',
    };
    const postOptions = prepareRequestMessage('POST', responseURL, initMessage);
    request(postOptions, (error, response, body) => {
      if (error) {
        console.log(error);
        return;
      }
    });
  }
};
