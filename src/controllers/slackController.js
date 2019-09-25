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
      return;
    }
    return;
  });
};

export const initButtonConfirmation = (req, res) => {
  let message;
  res.sendStatus(200).end(); // best practice to respond with 200 status
  const responsePayload = JSON.parse(req.body.payload);
  console.log(responsePayload);
  if (responsePayload.actions[0].name === 'no') {
    message = {
      response_type: 'ephemeral',
      text: `Bye ${responsePayload.user.name}`,
    };
    res.send(message);
    return;
  }
  message = {
    response_type: 'ephemeral',
    text: `${responsePayload.user.name} your conversation will be saved to Google Drive`,
  };
  res.send(message);
  // get slack channel history
  // google drive auth function is called here
  return;

  // const postOptions = prepareRequestMessage(responsePayload.response_url, message);
  // request(postOptions, (error, response, body) => {
  //   if (error) {
  //     console.log(error);
  //   }
  //   return;
  //   // get slack channel history
  //   // google drive auth function is called here
  // });
};
