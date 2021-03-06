
const teemo = require("./teemo");

// result is backwards
module.exports.diff = function(r1, r2) {
    const tiers = [ 'i', 'b', 's', 'g', 'p', 'd', 'm', 'gm', 'c' ];
    const divs  = [ '4', '3', '2', '1' ];

    // "G4" => ['g', '4', 97]
    const split = r => {
        const numerals = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-'];
        let i = 0;
        while (i < r.length && !numerals.includes(r[i]))
            i++;
        const lp = r.split(' ')[1];
        return [ r.slice(0, i), r.slice(i), lp ];
    };

    r1 = split(r1.toLowerCase());
    r2 = split(r2.toLowerCase());

    // relative value
    const t1 = tiers.findIndex(v => v == r2[0]) >= 0 ?
        tiers.findIndex(v => v == r2[0]) : NaN;
    const t2 = tiers.findIndex(v => v == r1[0]) >= 0 ?
        tiers.findIndex(v => v == r1[0]) : NaN;

    let cmp_r = t1 - t2;
    if (cmp_r) // nomalize
        cmp_r /= Math.abs(cmp_r);

    // difference in divions only significant if specified in both
    let cmp_d = 0;
    if (r1[1] && r2[1]) {
        // relative value
        const d1 = divs.findIndex(v => v == r2[1]) >= 0 ?
            divs.findIndex(v => v == r2[1]) : NaN;
        const d2 = divs.findIndex(v => v == r1[1]) >= 0 ?
            divs.findIndex(v => v == r1[1]) : NaN;

        cmp_d = d1 - d2;
        if (cmp_d) // normalize
            cmp_d /= Math.abs(cmp_d);
    }

    // difference in lp only significant if specified in both
    let cmp_lp = 0;
    if (r1[2] && r2[2]) {
        cmp_lp = r2[2] - r1[2];
        if (cmp_lp)
            cmp_lp /= Math.abs(cmp_lp);
    }

    return cmp_r * 10 + cmp_d * 0.1 + cmp_lp * 0.001;
}


// there is no reason for this to exist here..
async function makeRankSummary(name, acctName, rank) {

    const queues = {
        "RANKED_FLEX_SR" : "Flex 5:5",
        "RANKED_SOLO_5x5" : "Solo Queue",
        "RANKED_FLEX_TT" : "Flex 3:3"
    };
    const captitalizeFirstLetter = (string) =>
        string.charAt(0).toUpperCase() + string.slice(1);


    return new Promise((resolve, reject) => {
        //console.log(rank);
        if (rank.length == 0) {
            resolve(name + " is unranked");
        } else {

            let summary = { embed: {
                title: `${name}'s Rank`,
                description: `${name} has played `,
                fields: []
            }};

            let games = 0;

            rank.forEach(q => {
                games += q.wins + q.losses;

                summary.embed.fields.push({
                    name: `${queues[q.queueType] || q.queueType}${
                         q.position && q.position != "NONE" ? ` [${captitalizeFirstLetter(q.position.toLowerCase())}] `: " "
                        }- ${captitalizeFirstLetter(q.tier.toLowerCase())} ${q.rank} ${q.leaguePoints}LP`,
                    value: `${q.wins}W ${q.losses}L (${Math.round(q.wins / (q.wins + q.losses) * 1000) / 10}%)` +
                        ( q.miniSeries ? `\nSeries: (${q.miniSeries.progress.split("").join(") (")})` : "" )
                });
            });

            summary.embed.description += `${games} games this season on their account ${acctName}`;

            if (name != acctName)
                summary.embed.footer = { text: "to change your main account use \`-lol main\`" };

            resolve(summary);
        }
    });
}

module.exports.makeRankSummary = makeRankSummary;

function maxRank(ranks) {
    if (!ranks || !ranks.length)
        return;
    let max = ranks[0];
    for (let i = 0; i < ranks.length; i++)
        if (module.exports.diff(ranks[i], max) < 0)
            max = ranks[i];

    return max;
}

module.exports.max = maxRank;
module.exports.queues = teemo.rankedQueues;
module.exports.convert = teemo.convertRank;
