const { Client } = require("discord.js");
const settings = require("./settings.json");
const { Console } = require("console");
const { createCanvas } = require("canvas");

const logger = new Console({ stdout: process.stdout, stderr: process.stderr });
const client = new Client();

process.on("unhandledrejection", (promiseRejectionEvent) => { 
    logger.error("Unhandled Rejection", promiseRejectionEvent);
});

client.on("ready", () => {
    logger.log("Bot is ready");
});

client.on("guildMemberAdd", async (member) => {
    let dmsDisabled = false;
    for(let i = 0; i<3; i++) {
        const { buffer, res } = makeARandomImage();
        let channel = dmsDisabled ? member.guild.channels.get(settings.channel) : await member.createDM();
        await channel.send(`Are you a bot?\n\`\`Retries left: ${3-i}\`\``, { files: [buffer] })
            .catch(() => { 
                if(channel.type === "dm") {
                    dmsDisabled = true;
                    member.guild.channels.get(settings.channel).send(`Your DMs are disabled so I will send the captchas through here. Are you a bot?\n\`\`Retries left: ${3-i}\`\``, { files: [buffer] });
                }
            });
        const m = await channel.awaitMessages(m => !isNaN(m.content), { max: 1, time:30000, errors: ["time"] })
            .then(collected => collected.first())
            .catch(collected => collected.first());
        if(m == undefined) {
            await channel.send("Timeout! You took too much time in responding to an easy math question.");
        } else if(m.content == res) {
            await channel.send("Success! You got the answer right, you must have a very high IQ!");
            logger.log(`The user ${member.user.tag}(${member.user.id}) solved the captchas after ${i+1} tries`);
            return;
        } else {
            await channel.send("Failure... that answer isn't right.");
        }
        continue;
    }
    await member.send("You are going to be kicked out of the server because you failed solving the captchas. RIP");
    await member.kick("Failed to solve the captchas");
    logger.log(`Kicked the user ${member.user.tag}(${member.user.id})`);
});

function makeARandomImage() {
    const canvas = createCanvas(420,124);
    const ctx = canvas.getContext("2d");

    const firstNum = randomNumber(51), secondNum = randomNumber(51);
    const res = firstNum + secondNum;

    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.fillRect(0, 0, 420, 124);

    for(let i=0; i<randomNumber(10)+3; i++) {
        ctx.strokeStyle = `rgba(${randomNumber(256)},${randomNumber(256)},${randomNumber(256)},${randomNumber(1, false)})`;
        ctx.beginPath();
        ctx.moveTo(randomNumber(420), randomNumber(124));
        ctx.lineTo(randomNumber(420), randomNumber(124));
        ctx.arcTo(randomNumber(420), randomNumber(124), randomNumber(420), randomNumber(124), randomNumber(70));
        ctx.lineTo(randomNumber(420), randomNumber(124)); 
        ctx.stroke();
    }

    ctx.fillStyle = `rgb(${randomNumber(256)},${randomNumber(256)},${randomNumber(256)})`;
    ctx.font = "45px Unifont";
    ctx.beginPath();
    ctx.fillText(firstNum, 110, 84);
    ctx.fillStyle = `rgb(${randomNumber(256)},${randomNumber(256)},${randomNumber(256)})`;
    ctx.beginPath();
    ctx.fillText("+", 220, 74);
    ctx.fillStyle = `rgb(${randomNumber(256)},${randomNumber(256)},${randomNumber(256)})`;
    ctx.beginPath();
    ctx.fillText(secondNum, 320, 80);
    return { buffer: canvas.toBuffer(), res: res };
}

function randomNumber(max, floor = true) {
    const number = Math.random() * max;
    return floor ? Math.floor(number) : number;
}

client.login(settings.key);