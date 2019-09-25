import request from 'request';
import { prepareRequestMessage } from '../helpers/slackRequest';
import { initMessage } from '../helpers/messages';

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
  });
  // google drive auth function is called here
};
