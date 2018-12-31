const { Event } = require("klasa");
const { createCanvas } = require("canvas");

module.exports = class extends Event {

    constructor(...args) {
        super(...args);
    }

    async run(member) {
        const { dmOffChannel, roleToGive, roleToRemove } = member.guild.settings.toJSON();
        if(!member.guild.me.hasPermission(["KICK_MEMBERS", "MANAGE_ROLES"]) || !dmOffChannel || !roleToGive || !roleToRemove ) return;
        await member.roles.add(roleToRemove);
        let dmsDisabled = false;
        for(let i = 0; i<3; i++) {
            const canvas = createCanvas(420,124);
            const ctx = canvas.getContext("2d");

            const firstNum = randomNumber(15), secondNum = randomNumber(15);
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
            const buffer = canvas.toBuffer();
            let channel = dmsDisabled ? member.guild.channels.get(dmOffChannel) : await member.createDM();
            await channel.send((dmsDisabled ? `<@${member.id}> ` : "") + `Are you a bot?\n\`\`Retries left: ${3-i}\`\``, { files: [buffer] })
                .catch(() => { 
                    if(channel.type === "dm") {
                        dmsDisabled = true;
                        channel = member.guild.channels.get(dmOffChannel);
                        channel.send(`<@${member.id}> Your DMs are disabled so I will send the captchas through here. Are you a bot?\n\`\`Retries left: ${3-i}\`\``, { files: [buffer] });
                    }
                });
            const m = await channel.awaitMessages(m => !isNaN(m.content), { max: 1, time:60000, errors: ["time"] })
                .then(collected => collected.first())
                .catch(collected => collected.first());
            if(m == undefined) {
                await channel.send((dmsDisabled ? `<@${member.id}> ` : "") + "Timeout! You took too much time in responding to an easy math question.");
            } else if(m.content == res) {
                await channel.send((dmsDisabled ? `<@${member.id}> ` : "") + "Success! You got the answer right, you must have a very high IQ!");
                this.client.emit("log", `The user ${member.user.tag}(${member.user.id}) solved the captchas after ${i+1} try/tries`);
                await member.roles.remove(roleToRemove);
                await member.roles.add(roleToGive);
                return;
            } else {
                await channel.send((dmsDisabled ? `<@${member.id}> ` : "") + "Failure... that answer isn't right.");
            }
            continue;
        }
        await member.send("You are going to be kicked out of the server because you failed solving the captchas. RIP").catch(() => {if(dmsDisabled) this.client.emit("warn", `oh ${member.user.tag}(${member.user.id}) had DMs disabled rip`);});
        await member.kick("Failed to solve the captchas");
        this.client.emit("log", `Kicked the user ${member.user.tag}(${member.user.id}) from `);
    }   
    
};

function randomNumber(max, floor = true) {
    const number = Math.random() * max;
    return floor ? Math.floor(number) : number;
}