const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
 launcherid = config.launcherid;
const request = require("request");
const devkey = config.devkey;
process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

async function requestfarmInfo(launcherid, devkey){
  return new Promise(function(resolve, reject){
    const options = {
      url: 'https://developer.pool.space/api/v1/farms/'+launcherid,
      headers: {
        Accept : "text/plain",
          'User-Agent': 'request',
        'Developer-Key' : devkey
      }
    };
    request(options,  async function(err, res){
      const info = JSON.parse(res.body);
    if(err) reject(err);
      await resolve(info);
    })
  });
  console.log("Running")
};
async function getPoolStats(devkey){
  return new Promise(function(resolve, reject){
    const options1 = {
      url: 'https://developer.pool.space/api/v1/pool',
      headers: {
        Accept : "text/plain",
          'User-Agent': 'request',
        'Developer-Key' : devkey
      }
    };
     request(options1,  function(err, res){
      const info1 = JSON.parse(res.body);  
      if(err) reject(err);
      resolve(info1);
    })

  });
 await console.log("Running")
};

function getPayouts(launcherid, devkey){
  console.log(launcherid, devkey);
  return new Promise(function(resolve, reject){
    const options2 = {
      url: 'https://developer.pool.space/api/v1/farms/'+launcherid+'/payouts',
      headers: {
        Accept : "text/plain",
          'User-Agent': 'request',
        'Developer-Key' : devkey
      }
    };
     request(options2,  async function(err,res){
      const info2 = JSON.parse(res.body);
      if(err) reject(err);
      await   resolve(info2)
   
  });       
    
  })
  console.log("Running")






}

function getPartials(launcherid, devkey){
  return new Promise(function(resolve, reject){
    const options3 = {
      url: 'https://developer.pool.space/api/v1/farms/'+launcherid+'/partials',
      headers: {
        Accept : "text/plain",
          'User-Agent': 'request',
        'Developer-Key' : devkey
      }
    };
     request(options3,  async function(err, res){
      const info3 = JSON.parse(res.body);
      if(err) reject(err);
      await resolve(info3);
    });
  });
  console.log("Running")
};



client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

});

client.on('message',async msg => {
    
  if (msg.content.startsWith(config.command) && msg.author.id == config.botAuthor) {
      console.log("Should work")
     var msgSent = await msg.reply("Starting...")
      async function sendshit(){
      let farminfo = await requestfarmInfo(launcherid, devkey);
      var unpaid = farminfo.unpaidBalanceInXCH;
      var paid = farminfo.totalPaidInXCH;
      var totalBlocks = farminfo.blocksFound;
      var rank = farminfo.rank;
      var plots = farminfo.estimatedPlots;
      var points = farminfo.pendingPoints;
     
     //new function
      let poolStats = await getPoolStats(devkey);
      var active_Farms = (poolStats.totalActiveFarms)
    //new function
    let payouts = await getPayouts(launcherid, devkey);
    var time = (payouts.results[0].payoutDateTimeUtc)
    var timeconvert = time.replace("T", " ");
    var timedone = timeconvert.split('.')[0];
    var payam = payouts.results[0].payoutBalanceInXCH;
//new function
      let partials = await getPartials(launcherid, devkey);
      var subdate = partials.results[0].submissionDateTimeUtc;
      var diff =partials.results[0].difficulty;
      var active = Boolean(partials.results[0].state.code);
    
      var uff1 = subdate.replace("T", " ");
      var date = uff1.split('.')[0]
     // console.log(timedone1);





  const embed = new Discord.MessageEmbed()
            .setTitle('Chia-Status')
            .setURL('https://pool.space/account/'+launcherid)
            .setAuthor('Jaeger33211')
            .setDescription("Some Stats for "+config.Nickname+ " ` s Chia Farm")
            .setColor('#18ff24')
            .setThumbnail('https://mk0asiacryptotopf9lu.kinstacdn.com/wp-content/uploads/2021/02/image_2021-02-08_170419.png')
            .setImage('https://files.readme.io/40e32a9-small-space_farmer-04.png')
           // .setFooter('This is a example footer', 'https://example.png')
            .addFields({
              name: 'Unpaid: ',
              value: unpaid,
              inline: true
            }, {
              name: 'Paid: ',
              value: paid,
              inline: true
            }, {
              name: 'Total Blocks found: ',
              value: totalBlocks,
              inline: true
              
            }, {
              name: 'Current Rank',
              value: rank,
              inline: true,
            },
            {
                name: 'Current est. Plots: ',
                value: plots,
                inline: true
            },{
                name: 'Current Points: ',
                value: points,
                inline: true
            },{
                name: 'Current Active Farms(space pool) : ',
                value: active_Farms,
                inline: true 
            },{
              name: 'Last Payout (UTC) : ',
              value: timedone,
              inline: true 
          },{
            name: 'Last Payout Amount : ',
            value: payam+" XCH",
            inline: false 
        },{
          name: 'Last Partial recieved (UTC) : ',
          value: date,
          inline: true 
      },{
        name: 'Current Difficulty : ',
        value: diff,
        inline: true 
    },{
      name: 'Farm Healthy : ',
      value: active,
      inline: true 
  }
            )
            .setTimestamp();
            msgSent.edit(embed);
        }
       sendshit();
        setInterval(sendshit, config.timeout)
    };
});

client.login(config.DCToken);

