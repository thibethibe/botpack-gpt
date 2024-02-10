module.exports.config = {
		name: 'ping',
		version: '69.69',
		credits: "cliff",
		hasPermission: 0,
		usePrefix: false,
		commandCategory: 'System',
		description: "Displays the current ping of the bot's system.",
		usages: 'Use {p}ping to check the current ping of the bot\'s system.',
		cooldown: 5
};

module.exports.run = async function ({ api, event, args }) {
	  let time = process.uptime();
  let years = Math.floor(time / (60 * 60 * 24 * 365));
  let months = Math.floor((time % (60 * 60 * 24 * 365)) / (60 * 60 * 24 * 30));
  let days = Math.floor((time % (60 * 60 * 24 * 30)) / (60 * 60 * 24));
  let weeks = Math.floor(days / 7);
  let hours = Math.floor((time % (60 * 60 * 24)) / (60 * 60));
  let minutes = Math.floor((time % (60 * 60)) / 60);
  let seconds = Math.floor(time % 60);
  const timeStart = Date.now();
  
  return api.sendMessage('Currently checking the connection. Please wait', event.threadID, (err, info) => {
    setTimeout(() => {
      const yearsString = years === 1 ? "year" : "years";
      const monthsString = months === 1 ? "month" : "months";
      const daysString = days === 1 ? "day" : "days";
      const weeksString = weeks === 1 ? "week" : "weeks";
      const hoursString = hours === 1 ? "hour" : "hours";
      const minutesString = minutes === 1 ? "minute" : "minutes";
      const secondsString = seconds === 1 ? "second" : "seconds";

      const uptimeString = `${years > 0 ? `${years} ${yearsString} ` : ''}${months > 0 ? `${months} ${monthsString} ` : ''}${weeks > 0 ? `${weeks} ${weeksString} ` : ''}${days % 7 > 0 ? `${days % 7} ${daysString} ` : ''}${hours > 0 ? `${hours} ${hoursString} ` : ''}${minutes > 0 ? `${minutes} ${minutesString} ` : ''}${seconds} ${secondsString}`;
			
		const timeStart = Date.now();
		await api.sendMessage("Checking Bot's ping", event.threadID);
		const ping = Date.now() - timeStart;
		api.sendMessage(`✱:｡✧YAZKYBOT 𝗦𝗬𝗦𝗧𝗘𝗠✧ |\n 𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗣𝗶𝗻𝗴: ${(Date.now() - timeStart)}𝗆𝗌\n━━━━━━━━━━━━━━━━━━━\n𝗧 𝗢 𝗝 𝗜  𝗐𝖺𝗌 𝖻𝖾𝖾𝗇 𝖼𝗎𝗋𝗋𝖾𝗇𝗍𝗅𝗒 𝖺𝖼𝗍𝗂𝗏𝖺𝗍𝖾𝖽 𝖿𝗈𝗋 ${uptimeString}\n━━━━━━━━━━━━━━━━━━━\n\nStarting ping is ${ping}ms.`, event.threadID);
};
