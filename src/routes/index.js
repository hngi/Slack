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
    title: 'Welcome to Priapus SlackBot',
    description: 'A slack bot that can be used to save conversation in Google drive',
    slackAppLink: 'https://priapus.slack.com/services/BNFNQH27K',
    instruction: 'To get started, goto the slackAppLink and install the app in your workspace',
  }));
  app.get('/auth', authenticateApp);
  app.get('/auth/redirect', authenticateAppRedirect);
  app.post('/export-command', checkAuth, getSlashCommandInfo);
  app.post('/slack/actions', checkAuth, initButtonConfirmation);
  // invalid url
  app.all('*', (req, res) => warningResponse(res, 404, 'Resource not found'));
};

export default routes;
