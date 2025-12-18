/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Order} from 'blockly/javascript';

// Export all the code generators for our custom blocks,
// but don't register them with Blockly yet.
// This file has no side effects!
export const forBlock = Object.create(null);

forBlock['add_text'] = function (block, generator) {
  const text = generator.valueToCode(block, 'TEXT', Order.NONE) || "''";
  const addText = generator.provideFunction_(
    'addText',
    `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(text) {

  // Add text to the output area.
  const outputDiv = document.getElementById('output');
  const textEl = document.createElement('p');
  textEl.innerText = text;
  outputDiv.appendChild(textEl);
}`,
  );
  // Generate the function call for this block.
  const code = `${addText}(${text});\n`;
  return code;
};
forBlock['discord_send_message'] = function (block, generator) {
  const message = generator.valueToCode(block, 'MESSAGE', Order.NONE) || "''";
  const channel = generator.valueToCode(block, 'CHANNEL', Order.NONE) || "''";
  //const discord_send_message = generator.provideFunction_(
  //  'discord_send_message',
  //  `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(message, channel) {}`,
  //);
  // Generate the function call for this block.
  const code = `client.SendGuildMessage (${message}, ${channel});\n`;
  return code;
};
forBlock['discord_add_role'] = function (block, generator) {
  const role = generator.valueToCode(block, 'ROLE', Order.NONE) || "''";
  const user = generator.valueToCode(block, 'USER', Order.NONE) || "''";
  const guild = generator.valueToCode(block, 'GUILD', Order.NONE) || "''";
  const method = block.getFieldValue('METHOD');
  //const discord_send_message = generator.provideFunction_(
  //  'discord_send_message',
  //  `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(message, channel) {}`,
  //);
  // Generate the function call for this block.
  const code = `client.RoleForUser (${user}, ${guild}, ${role}, "${method}");\n`;
  return code;
};
forBlock['discord_snowflake'] = function(block, generator) {
	const SnowflakeTypeToCode = {
		"message": {
			"message": "event.id",
			"message_author": "event.author.id",
			"user": "event.author.id"
		},
		"reaction": {
			"message": "event.message_id",
			"message_author": "event.message_author_id",
			"user": "event.user_id",
			"emoji": "((event.emoji.id) ? `<:${event.emoji.name}:${event.emoji.id}>` : event.emoji.name)"
		},
		"default": {
			"channel": "event.channel_id",
			"guild": "event.guild_id"
		}
		
	};

  const snowflake = block.getFieldValue('SNOWFLAKE');
  const eventtype = block.getFieldValue('EVENTTYPE');
  let code = "";
  if (!SnowflakeTypeToCode["default"][snowflake]) code = SnowflakeTypeToCode[eventtype][snowflake];
	else code = SnowflakeTypeToCode["default"][snowflake];
  return [code, Order.ATOMIC];
};
forBlock['on_discord_server_message'] = function (block, generator) {
	console.log(block);
	const result = generator.statementToCode(block, 'STATEMENTS', Order.NONE);
	const type = block.getFieldValue('TYPES');
	return `client.EventHandler.${type} = function (event) {\n${result}\n}\n`;
}

forBlock['on_discord_server_react'] = function (block, generator) {
	console.log(block);
	const result = generator.statementToCode(block, 'STATEMENTS', Order.NONE);
	const type = block.getFieldValue('TYPES');
	return `client.EventHandler.${type} = function (event) {\n${result}\n}\n`;
}

forBlock['on_discord_bot_create'] = function (block, generator) {
	console.log(block);
  const token = generator.valueToCode(block, 'TOKEN', Order.NONE) || "''";
  const intents = generator.valueToCode(block, 'INTENTS', Order.NONE) || "''";
	const result = generator.statementToCode(block, 'STATEMENTS', Order.NONE);
	//const type = block.getFieldValue('TYPES');
	return `const client = new Bot(${token}, ${intents});\n${result}\nclient.Connect();`;
}
forBlock['on_discord_bot_ready'] = function (block, generator) {
	console.log(block);
	const result = generator.statementToCode(block, 'STATEMENTS', Order.NONE);
	const type = block.getFieldValue('TYPES');
	return `client.EventHandler.${type} = function (event) {\n${result}\n}\n`;
}
forBlock['is_discord_bot'] = function (block, generator) {
	return [`event.author.bot`, Order.ATOMIC];
}
forBlock['whitespace'] = function (block, generator) {
  let character = block.getFieldValue('CHARACTER');
  character = character.charCodeAt(0);
  // Generate the function call for this block.
  const code = `String.fromCharCode(${character})`;
  return [code, Order.ATOMIC];
};