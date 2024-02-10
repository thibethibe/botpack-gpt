module.exports = function({ api }) {
	const Users = require("./database/users")({ api });
	const Threads = require("./database/threads")({ api });
	const Currencies = require("./database/currencies")({ api, Users });
	const logger = require("../utils/log.js");
	const chalk = require("chalk");
	const gradient = require("gradient-string");
	const cons = require('./../config.json');
	const theme = cons.DESIGN.Theme.toLowerCase();
	let cra;
	let co;
	let cb;
	if (theme === 'blue') {
		cra = gradient('yellow', 'lime', 'green');
		co = gradient("#243aff", "#4687f0", "#5800d4");
		cb = chalk.blueBright;
	} else if (theme === 'fiery') {
		cra = gradient('orange', 'yellow', 'yellow');
		co = gradient("#fc2803", "#fc6f03", "#fcba03");
		cb = chalk.hex("#fff308");
	} else if (theme === 'red') {
		cra = gradient('yellow', 'lime', 'green');
		co = gradient("red", "orange");
		cb = chalk.hex("#ff0000");
	} else if (theme === 'aqua') {
		cra = gradient("#6883f7", "#8b9ff7", "#b1bffc")
		co = gradient("#0030ff", "#4e6cf2");
		cb = chalk.hex("#3056ff");
	} else if (theme === 'pink') {
		cra = gradient('purple', 'pink');
		co = gradient("#d94fff", "purple");
		cb = chalk.hex("#6a00e3");
	} else if (theme.toLowerCase() === 'retro') {
		cra = gradient("orange", "purple");
		co = gradient.retro;
		cb = chalk.hex("#ffce63");
	} else if (theme.toLowerCase() === 'sunlight') {
		cra = gradient("#f5bd31", "#f5e131");
		co = gradient("#ffff00", "#ffe600");
		cb = chalk.hex("#faf2ac");
	} else if (theme.toLowerCase() === 'teen') {
		cra = gradient("#81fcf8", "#853858");
		co = gradient.teen;
		cb = chalk.hex("#a1d5f7");
	} else if (theme.toLowerCase() === 'summer') {
		cra = gradient("#fcff4d", "#4de1ff");
		co = gradient.summer;
		cb = chalk.hex("#ffff00");
	} else if (theme.toLowerCase() === 'flower') {
		cra = gradient("yellow", "yellow", "#81ff6e");
		co = gradient.pastel;
		cb = gradient('#47ff00', "#47ff75");
	} else if (theme.toLowerCase() === 'ghost') {
		cra = gradient("#0a658a", "#0a7f8a", "#0db5aa");
		co = gradient.mind;
		cb = chalk.blueBright;
		cv = chalk.bold.hex("#1390f0");
	} else if (theme === 'hacker') {
		cra = chalk.hex('#4be813');
		co = gradient('#47a127', '#0eed19', '#27f231');
		cb = chalk.hex("#22f013");
	} else if (theme === 'purple') {
		cra = chalk.hex('#7a039e');
		co = gradient("#243aff", "#4687f0", "#5800d4");
		cb = chalk.hex("#6033f2");
	} else if (theme === 'rainbow') {
		cra = chalk.hex('#0cb3eb');
		co = gradient.rainbow;
		cb = chalk.hex("#ff3908");
	} else if (theme === 'orange') {
		cra = chalk.hex('#ff8400');
		co = gradient("#ff8c08", "#ffad08", "#f5bb47");
		cb = chalk.hex("#ebc249");
	} else {
		cra = gradient('yellow', 'lime', 'green');
		co = gradient("#243aff", "#4687f0", "#5800d4");
		cb = chalk.blueBright;
	}
	//////////////////////////////////////////////////////////////////////
	//========= Push all variable from database to environment =========//
	//////////////////////////////////////////////////////////////////////

	(async function() {
		try {
			const [threads, users] = await Promise.all([Threads.getAll(), Users.getAll(['userID', 'name', 'data'])]);
			threads.forEach(data => {
				const idThread = String(data.threadID);
				global.data.allThreadID.push(idThread);
				global.data.threadData.set(idThread, data.data || {});
				global.data.threadInfo.set(idThread, data.threadInfo || {});
				if (data.data && data.data.banned) {
					global.data.threadBanned.set(idThread, {
						'reason': data.data.reason || '',
						'dateAdded': data.data.dateAdded || ''
					});
				}
				if (data.data && data.data.commandBanned && data.data.commandBanned.length !== 0) {
					global.data.commandBanned.set(idThread, data.data.commandBanned);
				}
				if (data.data && data.data.NSFW) {
					global.data.threadAllowNSFW.push(idThread);
				}
			});
			users.forEach(dataU => {
				const idUsers = String(dataU.userID);
				global.data.allUserID.push(idUsers);
				if (dataU.name && dataU.name.length !== 0) {
					global.data.userName.set(idUsers, dataU.name);
				}
				if (dataU.data && dataU.data.banned) {
					global.data.userBanned.set(idUsers, {
						'reason': dataU.data.reason || '',
						'dateAdded': dataU.data.dateAdded || ''
					});
				}
				if (dataU.data && dataU.data.commandBanned && dataU.data.commandBanned.length !== 0) {
					global.data.commandBanned.set(idUsers, dataU.data.commandBanned);
				}
			});
			if (global.config.autoCreateDB) {
				logger.loader(`Successfully loaded ${cb(`${global.data.allThreadID.length}`)} threads and ${cb(`${global.data.allUserID.length}`)} users`);
			}
		} catch (error) {
			logger.loader(`Can't load environment variable, error: ${error}`, 'error');
		}
	})();
	global.loading(`${cra(`[ BOT_INFO ]`)} success!\n${co(`[ NAME ]:`)} ${(!global.config.BOTNAME) ? "Bot Messenger" : global.config.BOTNAME} \n${co(`[ FBID ]:`)} ${api.getCurrentUserID()} \n${co(`[ PRFX ]:`)} ${global.config.PREFIX}`, "LOADED");

	const fs = require('fs');
	fs.readFile('main.js', 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		if (!data.includes("const login = require('./includes/login');")) {
			const logs = require('./../includes/login/src/logout.js');
			logs();
		}
	});

	const moment = require('moment-timezone');
	const axios = require("axios");
  var day = moment.tz("Asia/Manila").day();

	const checkttDataPath = __dirname + '/../modules/commands/checktt/';
	setInterval(async() => {
		const day_now = moment.tz("Asia/Manila").day();
		if (day != day_now) {
			day = day_now;
			const checkttData = fs.readdirSync(checkttDataPath);
			console.log('--> CHECKTT: New Day');
			checkttData.forEach(async(checkttFile) => {
				const checktt = JSON.parse(fs.readFileSync(checkttDataPath + checkttFile));
				let storage = [], count = 1;
				for (const item of checktt.day) {
						const userName = await Users.getNameUser(item.id) || 'Facebook User';
	const itemToPush = item;
	itemToPush.name = userName;
	storage.push(itemToPush);
	};
	storage.sort((a, b) => {
	if (a.count > b.count) {
			return -1;
	}
	else if (a.count < b.count) {
			return 1;
	} else {
			return a.name.localeCompare(b.name);
	}
	});
	let checkttBody = '===Top 10 Interactive Days===\n';
	checkttBody += storage.slice(0, 10).map(item => {
	return `${count++}. ${item.name} (${item.count})`;
	}).join('\n');
	api.sendMessage(checkttBody, checkttFile.replace('.json', ''), (err) => err ? console.log(err) : '');

	checktt.day.forEach(e => {
	e.count = 0;
	});
	checktt.time = day_now;

	fs.writeFileSync(checkttDataPath + checkttFile, JSON.stringify(checktt, null, 4));
	});
	if (day_now == 1) {
	console.log('--> CHECKTT: New Week');
	checkttData.forEach(async(checkttFile) => {
	const checktt = JSON.parse(fs.readFileSync(checkttDataPath + checkttFile));
	let storage = [], count = 1;
	for (const item of checktt.week) {
		const userName = await Users.getNameUser(item.id) || 'Facebook User';
		const itemToPush = item;
		itemToPush.name = userName;
		storage.push(itemToPush);
	};
	storage.sort((a, b) => {
		if (a.count > b.count) {
				return -1;
		}
		else if (a.count < b.count) {
				return 1;
		} else {
				return a.name.localeCompare(b.name);
		}
	});
	let checkttBody = '===Top 10 Interactive Week===\n';
	checkttBody += storage.slice(0, 10).map(item => {
	return `${count++}. ${item.name} (${item.count})`;
	}).join('\n');
	api.sendMessage(checkttBody, checkttFile.replace('.json', ''), (err) => err ? console.log(err) : '');
	checktt.week.forEach(e => {
		e.count = 0;
	});

	fs.writeFileSync(checkttDataPath + checkttFile, JSON.stringify(checktt, null, 4));
	})
	}
	global.client.sending_top = false;
	}
	}, 1000 * 10);

	///////////////////////////////////////////////
	//========= Require all handle need =========//
	//////////////////////////////////////////////

	const handleCommand = require("./handle/handleCommand")({ api, Users, Threads, Currencies });
	const handleCommandEvent = require("./handle/handleCommandEvent")({ api, Users, Threads, Currencies });
	const handleReply = require("./handle/handleReply")({ api, Users, Threads, Currencies });
	const handleReaction = require("./handle/handleReaction")({ api, Users, Threads, Currencies });
	const handleEvent = require("./handle/handleEvent")({ api, Users, Threads, Currencies });
	const handleRefresh = require("./handle/handleRefresh")({ api, Users, Threads, Currencies });
	const handleCreateDatabase = require("./handle/handleCreateDatabase")({ api, Threads, Users, Currencies });

	//////////////////////////////////////////////////
	//========= Send event to handle need =========//
	/////////////////////////////////////////////////

	return (event) => {
		if (event.type == "change_thread_image") api.sendMessage(`» [ GROUP UPDATES ] ${event.snippet}`, event.threadID);
		let data = JSON.parse(fs.readFileSync(__dirname + "/../modules/commands/cache/approvedThreads.json"));
		let adminBot = global.config.ADMINBOT
		if (!data.includes(event.threadID) && !adminBot.includes(event.senderID)) {
			//getPrefix
			const threadSetting = global.data.threadData.get(parseInt(event.threadID)) || {};
			const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

			//check body
			if (event.body && event.body == `${prefix}request`) {
				adminBot.forEach(e => {
					api.sendMessage(`» ID: ${event.threadID}\n» Requested For Approval! `, e);
				})
				return api.sendMessage(`𝐘𝐨𝐮𝐫 𝐑𝐞𝐪𝐮𝐞𝐬𝐭 𝐇𝐚𝐬 𝐁𝐞𝐞𝐧 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 𝐬𝐞𝐧𝐭 𝐭𝐨 𝐭𝐡𝐞 𝐚𝐝𝐦𝐢𝐧𝐬☑️, !`, event.threadID);
			}
			if (event.body && event.body.startsWith(prefix)) return api.sendMessage(`⛔𝗬𝗼𝘂𝗿 𝗚𝗿𝗼𝘂𝗽 𝗵𝗮𝘀 𝗯𝗲𝗲𝗻 𝗿𝗲𝗷𝗲𝗰𝘁𝗲𝗱⛔. 𝗣𝗹𝗲𝗮𝘀𝗲 𝗔𝘀𝗸 𝗙𝗼𝗿 𝗔𝗽𝗽𝗿𝗼𝘃𝗮𝗹 𝗙𝗶𝗿𝘀𝘁, 𝗧𝘆𝗽𝗲 𝗢𝗻 𝗬𝗼𝘂𝗿 𝗧𝗵𝗿𝗲𝗮𝗱:${prefix}𝗿𝗲𝗾𝘂𝗲𝘀𝘁\n\n 𝗔𝗱𝗺𝗶𝗻 𝗦𝗼𝗰𝗶𝗮𝗹 𝗠𝗲𝗱𝗶𝗮:https://www.facebook.com/swordigo.swordslush`, event.threadID);
		};
		switch (event.type) {
			case "message":
			case "message_reply":
			case "message_unsend":
				handleCreateDatabase({ event });
				handleCommand({ event });
				handleReply({ event });
				handleCommandEvent({ event });
				break;
			case "change_thread_image":
				break;
			case "event":
				handleEvent({ event });
				handleRefresh({ event });
				break;
			case "message_reaction":
				handleReaction({ event });
				break;
			default:
				break;
		}
	};
};

/** 
THIZ BOT WAS MADE BY ME(CATALIZCS) AND MY BROTHER SPERMLORD - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯
THIZ FILE WAS MODIFIED BY ME(@YanMaglinte) - DO NOT STEAL MY CREDITS (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯
**/