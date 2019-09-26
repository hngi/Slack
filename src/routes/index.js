import { authenticateApp, authenticateAppRedirect, checkAuth } from '../controllers/authController';
import { getSlashCommandInfo } from '../controllers/slackController';
import { getGoogleAccountFromCode } from '../controllers/googleController';

/**
 * @fileOverview This file manages all routes in the application
 * @requires ../helpers/responseHelper
 * @requires ../controllers/slackController
 * @param {object} app
 * @exports routes.js
 */

const routes = (app) => {
  app.get('/auth', authenticateApp);
  app.get('/auth/redirect', authenticateAppRedirect);
  app.post('/export-command', checkAuth, getSlashCommandInfo);
  app.get('/google/redirect', getGoogleAccountFromCode);
};

export default routes;
