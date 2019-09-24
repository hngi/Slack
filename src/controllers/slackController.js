/* eslint-disable no-unused-vars */
import request from 'request';
import { BOT_TOKEN } from '../config/config';
import { prepareRequestMessage } from '../helpers/slackResponse';
import { initMessage } from '../helpers/messages';

export const getSlashCommandInfo = (req, res) => {
  const payload = req.body;
  res.status(200).end();
  if (payload.token !== BOT_TOKEN) {
    res.status(403).end('Access forbidden');
  }
  const responseURL = payload.response_url;
  const postOptions = prepareRequestMessage(responseURL, initMessage);
  request(postOptions, (error, response, body) => {
    if (error) {
      console.log(error);
    }
  });
};

export const initButtonConfirmation = (req, res) => {
  res.status(200).end(); // best practice to respond with 200 status
  const actionJSONPayload = JSON.parse(req.body.payload); // parse URL-encoded payload JSON string
  const message = {
    text: `${actionJSONPayload.user.name} clicked: ${actionJSONPayload.actions[0].name}`,
    replace_original: false,
  };
  const postOptions = prepareRequestMessage(actionJSONPayload.response_url, message);
  request(postOptions, (error, response, body) => {
    if (error) {
      console.log(error);
    }
    // google drive auth function is called here
  });
};
