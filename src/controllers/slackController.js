import request from 'request';
import { prepareRequestMessage } from '../helpers/slackResponse';
import { initMessage } from '../helpers/messages';

export const getSlashCommandInfo = (req, res) => {
  res.status(200).end(); // best practice to respond with 200 status
  const payload = req.body;
  const responseURL = payload.response_url;
  const postOptions = prepareRequestMessage(responseURL, initMessage);
  request(postOptions, (error, response, body) => {
    if (error) {
      console.log(error);
      // return;
    }
  });
};

export const initButtonConfirmation = (req, res) => {
  let message;
  res.status(200).end(); // best practice to respond with 200 status
  const responsePayload = JSON.parse(req.body.payload);
  console.log(responsePayload);
  if (responsePayload.actions.name === 'no') {
    message = {
      text: `Bye ${responsePayload.user.name}`,
      replace_original: false,
    };
  }
  message = {
    text: `${responsePayload.user.name} your conversation will be saved to Google Drive`,
    replace_original: false,
  };
  const postOptions = prepareRequestMessage(responsePayload.response_url, message);
  request(postOptions, (error, response, body) => {
    if (error) {
      console.log(error);
      // return;
    }

    // google drive auth function is called here
  });
};
