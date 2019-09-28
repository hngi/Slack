import dotenv from 'dotenv';

dotenv.config();

/**
 * This is a configuration file that determinces which database configuration should
 * be used base on the environment we are running the app
 * @requires - dotenv
 * @exports - Config
 */

export const {
  CLIENT_ID, CLIENT_SECRET, REDIRECT_URI,
} = process.env;

export const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID, // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // e.g. _ASDFA%DFASDFASDFASD#FAD-
  redirect: process.env.GOOGLE_REDIRECT_URL, // this must match your google api settings
};

export const CONVERSATION_PATH = 'conversation.csv';
export const TOKEN_PATH = 'token.json';
