export const initMessage = {
  attachments: [
    {
      text: 'Do you want to save conversations to drive?',
      fallback: "Shame... buttons aren't supported in this land",
      callback_id: 'button_tutorial',
      color: '#3AA3E3',
      attachment_type: 'default',
      actions: [
        {
          name: 'yes',
          text: 'yes',
          type: 'button',
          value: 'yes',
        },
        {
          name: 'no',
          text: 'no',
          type: 'button',
          value: 'no',
        },
      ],
    },
  ],
};

export const helpMessage = {
  response_type: 'ephemeral', // private message
  text: ':Priapus: How to use `/httpstatus` command:',
  attachments: [
    {
      text: 'Type the command, _e.g._ `/export-conversation` and follow instruction',
    },
  ],
};

export const forbiddenMessage = {
  response_type: 'ephemeral', // private message
  text: ':Priapus: You don\'t have access',
};
