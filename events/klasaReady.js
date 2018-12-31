const { Event } = require("klasa");
const { tasks } = require("../settings.json");

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            once: true
        });
    }

    async run() {
        for(const value of tasks)
            if(!this.client.schedule.tasks.some(task => task.taskName === value.taskName))
                await this.client.schedule.create(value.taskName, value.cron);
    }   
};
