import request from 'request';
import {
  BOT_TOKEN, CLIENT_ID, CLIENT_SECRET,
} from '../config/config';
import { prepareRequestMessage } from '../helpers/slackResponse';
import { forbiddenMessage } from '../helpers/messages';

export const authenticateApp = (req, res) => {
  res.sendFile(`${__dirname}/add_to_slack.html`);
};

export const authenticateAppRedirect = (req, res) => {
  const options = {
    uri: `https://slack.com/api/oauth.access?code=${req.query.code}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    method: 'GET',
  };
  request(options, (error, response, body) => {
    const JSONresponse = JSON.parse(body);
    if (!JSONresponse.ok) {
      res.send(`Error encountered: \n${JSON.stringify(JSONresponse)}`).status(200).end();
    }
    res.redirect('https://priapus.slack.com/apps/ANFETCSN5-priapus-saver');
  });
};

export const checkAuth = (req, res, next) => {
  const payload = req.body;
  res.status(200).end();
  if (payload.token !== BOT_TOKEN) {
    res.status(403).end('Access forbidden');
    return;
  }
  const responseURL = payload.response_url;
  const postOptions = prepareRequestMessage(responseURL, forbiddenMessage);
  request(postOptions, (error, response, body) => {
    if (error) {
      console.log(error);
    }
  });
  next();
};
