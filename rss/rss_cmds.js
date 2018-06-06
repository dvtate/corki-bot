
let rss = require("./rss_stuff.js");
const logCmd = require("../logging.js");

module.exports = [

    { // add a subscription to a channel
        condition: function (msg) {
            return msg.content.match(/^-rss (?:add|sub) (\S+)/);
        },
        act: async function (msg) {
            logCmd(msg, "added a -rss sub (-rss add)");
            const url = msg.content.match(/^-rss (?:add|sub) (\S+)/)[1];
            rss.addRule(msg.channel.id, url);
            msg.channel.send("Added an rss subscription to this channel, to stop rss subscriptions in this channel use `-rss reset`");
        }
    },

    {
        condition: function (msg) {
            return msg.content.match(/^-rss reset(?:$|\s)/);
        },
        act: async function (msg) {
            logCmd(msg, "unsubscribed to -rss feeds");
            msg.channel.send(`removed ${rss.removeChannel(msg.channel.id)} rss subscriptions from this channel`);
        }
    },

    {
        condition: msg => msg.content.match(/^-(?:help rss|rss help|rss)(?:$|\s)/),
        act: async msg => msg.channel.send(rssHelpInfo)
    }

];

const rssHelpInfo = { embed : {
    title: "-rss help",
    description: "Corki bot can automatically forward all new updates from an RSS feed to this channel",
    fields: [
        {
            name: "Add a Subscription",
            value: "To add a subscription, use `-rss add <url>`"
        }, {
            name: "Remove Subscriptions",
            value: "To clear all subscriptions from a channel, use `-rss reset`"
        }, {
            name: "Example",
            value: `
lets assume we have a gaming related server and wanted a feed from (/r/gaming)[https://reddit.com/r/gaming]
\`-rss add https://reddit.com/r/gaming/new/.rss\`

we can continue to add more subscriptions and if it gets to be too much, we can remove our subscriptions via
\`-rss reset\``
        }
    ]
}};