const { Task } = require("klasa");

module.exports = class extends Task {

    async run() {
        this.client.emit("log", "Changing the numbers of the member counter for each guild...");
        for(const guild of this.client.guilds) {
            const channelForMembers = guild.settings.get("channelForMembers");
            if(!channelForMembers || !guild.me.hasPermission("MANAGE_CHANNELS")) continue;
            guild.channels.get(channelForMembers).setName(`Member Count: ${guild.memberCount}`);
        }
        this.client.emit("log", "Changed the numbers of member counters for all guilds!");
    }
};