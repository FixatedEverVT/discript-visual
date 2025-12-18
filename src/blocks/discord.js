/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';

// Create a custom block called 'add_text' that adds
// text to the output div on the sample app.
// This is just an example and you should replace this with your
// own custom blocks.
const addText = {
  type: 'add_text',
  message0: 'Add text %1',
  args0: [
    {
      type: 'input_value',
      name: 'TEXT',
      check: 'String',
    },
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 160,
  tooltip: '',
  helpUrl: '',
};
const isBot = {
  type: 'is_discord_bot',
  message0: 'Is event from bot',
  args0: [],
  output: "Boolean",
  colour: 160,
  tooltip: '',
  helpUrl: '',
};
const sendMessage = {
	type: 'discord_send_message',
	message0: 'Send msg %1 in channel %2',
  args0: [
    {
      type: 'input_value',
      name: 'MESSAGE',
      check: 'String',
    },
    {
      type: 'input_value',
      name: 'CHANNEL',
      check: 'String',
    },
  ],
  inputsInline: true,
  previousStatement: null,
  nextStatement: null,
  colour: 160,
  tooltip: '',
  helpUrl: '',
};
const addRole = {
	type: 'discord_add_role',
	message0: '%1 role %2 to/from user %3 in server %4',
  args0: [
  
	{
		type: "field_dropdown",
		name:"METHOD",
		options:[
			["Add","PUT"],
			["Take","DELETE"],
		]
	},
    {
      type: 'input_value',
      name: 'ROLE',
      check: 'String',
    },
    {
      type: 'input_value',
      name: 'USER',
      check: 'String',
    },
    {
      type: 'input_value',
      name: 'GUILD',
      check: 'String',
    },
  ],
  inputsInline: true,
  previousStatement: null,
  nextStatement: null,
  colour: 160,
  tooltip: '',
  helpUrl: '',
};
const discordSnowflake = {
	type: 'discord_snowflake',
	message0: '%1 ID of %2 event',
	args0:[
		{
			type: "field_dropdown",
			name:"SNOWFLAKE",
			options:[
				["server","guild"],
				["channel","channel"],
				["emoji","emoji"],
				["message","message"],
				["message author","message_author"],
				["user","user"],
			]
		},
		{
			type: "field_dropdown",
			name:"EVENTTYPE",
			options:[
				["message","message"],
				["reaction","reaction"]
			]
		}
	],
	output: "String",
  colour: 160,
  tooltip: '',
  helpUrl: '',
	
}
const onServerMessage = {
	type: 'on_discord_server_message',
	message0: "When message is %1 in server \ndo %2",
	args0: [
	
		{
			type: "field_dropdown",
			name:"TYPES",
			options:[
				["sent","MESSAGE_CREATE"],
				["edited","MESSAGE_UPDATE"],
				["deleted","MESSAGE_DELETE"]
			],
		},
		{
			type: "input_statement",
			name: "STATEMENTS",
			check: null
		},
	],
  hat:true,
  previousStatement: null,
  nextStatement: null,
	
}
const onBotReady = {
	type: 'on_discord_bot_ready',
	message0: "When bot is %1 \ndo %2",
	args0: [
	
		{
			type: "field_dropdown",
			name:"TYPES",
			options:[
				["Logged In","READY"]
			],
		},
		{
			type: "input_statement",
			name: "STATEMENTS",
			check: null
		},
	],
  hat:true,
  previousStatement: null,
  nextStatement: null,
	
}

const onServerReact = {
	type: 'on_discord_server_react',
	message0: "When reaction is %1 message in server \ndo %2",
	args0: [
	
		{
			type: "field_dropdown",
			name:"TYPES",
			options:[
				["added to","MESSAGE_REACTION_ADD"],
				["removed from","MESSAGE_REACTION_REMOVE"]
			],
		},
		{
			type: "input_statement",
			name: "STATEMENTS",
			check: null
		},
	],
  hat:true,
  previousStatement: null,
  nextStatement: null,
	
}
const onBotCreate = {
	type: 'on_discord_bot_create',
	message0: "When discord bot is created with token %1 \nand intents %2 \ndo %3",
	args0: [
	
		{
			type: "input_value",
			name:"TOKEN",
			check: "String"
		},
		{
			type: "input_value",
			name:"INTENTS",
			check: "Number"
		},
		{
			type: "input_statement",
			name: "STATEMENTS",
			check: null
		},
	],
  hat:true
	
}
const whiteSpace = {
  type: 'whitespace',
  message0: 'Whitespace character %1',
  args0: [
		{
			type: "field_dropdown",
			name:"CHARACTER",
			options:[
				["New line","\n"],
			],
		},
  ],
  colour: 160,
	output: "String",
  tooltip: '',
  helpUrl: '',
};
// Create the block definitions for the JSON-only blocks.
// This does not register their definitions with Blockly.
// This file has no side effects!
export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  addText, sendMessage, discordSnowflake, onServerMessage, whiteSpace, onServerReact, onBotCreate, onBotReady, isBot, addRole
]);
