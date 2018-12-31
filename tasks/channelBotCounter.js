const { Task } = require("klasa");

module.exports = class extends Task {

    async run() {
        this.client.emit("log", "Changing the numbers of the bot counter for each guild...");
        for(const guild of this.client.guilds) {
            const channelForBots = guild.settings.get("channelForBots");
            if(!channelForBots || !guild.me.hasPermission("MANAGE_CHANNELS")) continue;
            guild.channels.get(channelForBots).setName(`Bot Count: ${guild.members.filter(member => member.user.bot).size}`);
        }
        this.client.emit("log", "Changed the numbers of bot counters for all guilds!");
    }
};