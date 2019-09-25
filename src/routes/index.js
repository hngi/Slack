/* eslint-disable max-len */
import { successResponse, warningResponse } from '../helpers/responseHelper';
import { authenticateApp, authenticateAppRedirect, checkAuth } from '../controllers/authController';
import { getSlashCommandInfo, initButtonConfirmation } from '../controllers/slackController';

/**
 * @fileOverview This file manages all routes in the application
 * @requires ../helpers/responseHelper
 * @requires ../controllers/slackController
 * @param {object} app
 * @exports routes.js
 */

const routes = (app) => {
  app.get('/', (req, res) => successResponse(res, 200, {
    title: 'Welcome to Priapus SlackBot\n',
    description: 'A slack bot that can be used to save conversation in Google drive \n',
    slackAppLink: 'https://priapus.slack.com/services/BNFNQH27K',
    slackWorkspace: 'https://join.slack.com/t/priapus/shared_invite/enQtNzcwNTA1MTg3NTg4LThmODNkNjQ4MTdiMGEzMGM1MmZjNGJhYWE0Y2UwMjA1NDQyYTg3MWVhYTVkNjk0MzEzNGU0ZGIwODgxZWM3ZDk',
    instruction: 'To get started, goto the Slack workspace and register as a user. Use /export-conversation to export conversation histroy of any channel there',
  }));
  app.get('/auth', authenticateApp);
  app.get('/auth/redirect', authenticateAppRedirect);
  app.post('/export-command', checkAuth, getSlashCommandInfo);
  app.post('/slack/actions', initButtonConfirmation);
  // invalid url
  app.all('*', (req, res) => warningResponse(res, 404, 'Resource not found'));
};

export default routes;
