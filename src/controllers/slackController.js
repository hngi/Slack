import request from 'request';
import { prepareRequestMessage } from '../helpers/slackRequest';
import { initMessage } from '../helpers/messages';
import { BOT_TOKEN } from '../config/config';

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
    uri: `https://priapus.slack.com/api/conversations.history?token=${BOT_TOKEN}&channel=${req.channel.id}`,
    method: 'GET',
  };

  request(options, (error, response, body) => {
    console.log(body);
  });
  // google drive auth function is called here
};
