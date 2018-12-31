const { Command } = require("klasa");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            enabled: true,
            description: "Provides some information about this bot.",
            usage: "",
        });
    }

    async run(msg) {
        msg.send("This bot is made with the Klasa framework <https://klasa.js.org> which is very fun, it uses the discord wrapper Discord.js <https://discord.js.org> and you can find the source of my code in <https://github.com/ImUrX/randomUtilitiesBot>\n Have fun!");
    }

};
