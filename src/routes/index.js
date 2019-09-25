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
  app.get('/auth', authenticateApp);
  app.get('/auth/redirect', authenticateAppRedirect);
  app.post('/export-command', checkAuth, getSlashCommandInfo);
  app.post('/slack/actions', initButtonConfirmation);
  // invalid url
  app.all('*', (req, res) => warningResponse(res, 404, 'Resource not found'));
};

export default routes;
