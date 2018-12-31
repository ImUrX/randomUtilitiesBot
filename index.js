const { Client } = require("klasa");
const settings = require("./settings.json");

const bot = new Client({
    clientOptions: {
        fetchAllMembers: settings.clientOptions.fetchAllMembers
    },
    prefix: settings.prefix,
    prefixCaseInsensitive: true,
    commandLogging: settings.commandLogging,
    commandEditing: settings.commandEditing,
    typing: settings.typing,
    pieceDefaults: {
        arguments: {
            enabled: true,
            aliases: []
        },
        commands: {
            aliases: [],
            autoAliases: true,
            bucket: 1,
            cooldown: 0,
            description: "",
            extendedHelp: language => language.get("COMMAND_HELP_NO_EXTENDED"),
            enabled: true,
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            promptLimit: 0,
            promptTime: 30000,
            requiredConfigs: [],
            requiredPermissions: 0,
            runIn: ["text", "dm"],
            subcommands: false,
            usage: "",
            quotedStringSupport: false,
            deletable: false
        },
        events: {
            enabled: true,
            once: false
        },
        extendables: {
            enabled: true,
            klasa: false,
            appliesTo: []
        },
        finalizers: { enabled: true },
        inhibitors: {
            enabled: true,
            spamProtection: false
        },
        languages: { enabled: true },
        monitors: {
            enabled: true,
            ignoreBots: true,
            ignoreSelf: true,
            ignoreOthers: true,
            ignoreWebhooks: true,
            ignoreEdits: true,
            ignoreBlacklistedUsers: true,
            ignoreBlacklistedGuilds: true
        },
        providers: { enabled: true },
        tasks: { enabled: true }
    }
});

for(const gateway of settings.gateways)
    for(const key of gateway.keys)
        if(!bot.gateways[gateway.name].schema.has(key.name))
            bot.gateways[gateway.name].schema.add(key.name, key.type, key);

bot.login(settings.token);
bot.console.log(settings.customStartingMsg[Math.floor(Math.random() * settings.customStartingMsg.length)]);
