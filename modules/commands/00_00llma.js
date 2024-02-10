const axios = require('axios');

module.exports.config = {
 name: 'llma',
 version: '1.0',
 hasPermission: 0,
 credits: 'Aliester Crowley',
 description: 'Generate text responses using LLaMA 2 70B',
 usePrefix: false,
 commandCategory: 'Text generation',
 usages: 'llama {prompt}',
 cooldowns: 0,
};

module.exports.run = async function ({ api, event, args }) {
 try {
	const { messageID, messageReply } = event;
	let prompt = args.join(' ');

	if (messageReply) {
	 const repliedMessage = messageReply.body;
	 prompt = `${repliedMessage} ${prompt}`;
	}

	if (!prompt) {
	 return api.sendMessage('Please provide a prompt to generate a text response.\n\nllama {prompt}\nExample: llama What is kardashev scale?\n', event.threadID, event.messageID);
	}

	const llama_api = `https://llama.aliestercrowley.com/api?prompt=${encodeURIComponent(prompt)}`;

	const response = await axios.get(llama_api);

	if (response.data && response.data.response) {
	 const generatedText = response.data.response;
	 api.sendMessage({ body: generatedText, attachment: null }, event.threadID, messageID);
	} else {
	 console.error('API response did not contain expected data:', response.data);
	 api.sendMessage('❌ An error occurred while generating the text response. Please try again later.', event.threadID, messageID);
	}
 } catch (error) {
	console.error('Error:', error);
	api.sendMessage('❌ An error occurred while generating the text response. Please try again later.', event.threadID, messageID);
 }
};