const Discord = require("discord.js");
const { joinVoiceChannel } = require('@discordjs/voice')
const sourcebin = require('sourcebin');
const config = require("./config.json");
const fs = require('fs');

const { QuickDB } = require("quick.db");
const { JsonDatabase } = require("wio.db");

// Database
global.db = new QuickDB();
global.dbJson = new JsonDatabase({
    databasePath: "./databases/myJsonDatabase.json"
});

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildMessageReactions,
        '32767'
    ]
});

global.embed_color = config.client.embed;

module.exports = client

client.on('interactionCreate', async (interaction) => {
    if (interaction.type === Discord.InteractionType.ApplicationCommand) {

        const cmd = client.slashCommands.get(interaction.commandName);

        if (!cmd) return interaction.reply({ content: `Erro, este comando não existe`, ephemeral: true });

        if (!interaction.member.permissions.has("ADMINISTRADOR")) return cmd.run(client, interaction);

        interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);

        cmd.run(client, interaction);
    }
});

client.on("ready", () => {
    console.log(`👋 Hello world`)
    console.log(`🤖 My name is ${client.user.username}`)
    console.log(`💔 I have ${client.users.cache.size} friends`)
    console.log(`👨 More than ${client.guilds.cache.size} groups support me.`)
});

/*============================= | Anti OFF | =========================================*/

process.on('multipleResolves', (type, reason, promise) => {
    return;
});
process.on('unhandRejection', (reason, promise) => {
    return;
});
process.on('uncaughtException', (error, origin) => {
    return;
});
process.on('uncaughtException', (error, origin) => {
    return;
});

client.on('interactionCreate', require('./events/addStockGen').execute)

/*============================= | STATUS RICH PRESENCE | =========================================*/

client.on("ready", () => {
    const messages = [
        `🤖 Duvidas?`,
        `🤖 ajuda`,
        `🎫 ticket`,
        `🥳 Gerando Contas...`,
        `🏡 Created By Medusa's Community`,
        `🌐 Version: v${require('discord.js').version.slice(0, 6)}`
    ]

    position = 0;

    setInterval(() => client.user.setPresence({
        activities: [{
            name: `${messages[position++ % messages.length]}`,
            type: Discord.ActivityType.Streaming,
            url: 'https://www.youtube.com/'
        }]
    }), 1000 * 10);

    client.user.setStatus("online");
});

/*============================= | Import handler | =========================================*/

client.slashCommands = new Discord.Collection()

require('./handler')(client)

client.login(config.client.token)

client.on('interactionCreate', require('./events/createProduct').execute)
client.on('interactionCreate', require('./events/showProduct').execute)
client.on('interactionCreate', require('./events/startCheckout').execute)
client.on('interactionCreate', require('./events/addStockProducts').execute)
client.on('interactionCreate', require('./events/editProduct').execute)

/*============================= | SYSTEM TICKET | =========================================*/

client.on("interactionCreate", require('./events/startTicket').execute);

/*============================= | UPDATE PRODUCT | =========================================*/
setInterval(async () => {
    var row = await db.all();
    row = row.filter(p => p.id.startsWith('product_'));

    row.forEach(async product => {
        if (!product.value.channel) return;

        const channel = await client.channels.cache.get(product.value.channel.channelId)
        const message = await channel.messages.fetch(product.value.channel.messageId).catch(() => { })

        try {
            message.edit({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.client.embed)
                        .setTitle(channel.guild.name)
                        .setThumbnail(channel.guild.iconURL({ dynamic: true, format: "png", size: 4096 }))
                        .setDescription(`\`\`\`yaml\n${product.value.body}\`\`\` \n**✉️・Nome:** \`${product.value.name}\`\n**💳・Preço:** \`R$${product.value.value.toFixed(2)}\`\n**🛒・Estoque:** \`${product.value.stocks ? product.value.stocks.length : 0}\``)
                        .setFooter({ text: `Para comprar clique no botão comprar` })
                ],
                components: [
                    new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId(`sales-${product.value.id}`)
                                .setStyle(2)
                                .setEmoji('🛒')
                                .setLabel('Comprar')
                        )
                ]
            })
        } catch (error) {

        }
    });
}, 60000);

const db = new QuickDB()

client.on('messageCreate', async (message) => {

  if (message.author.bot) return;
  if (message.channel.type == 'dm') return;

  let verificando = await db.get(`antilink_${message.guild.id}`);
  if (!verificando || verificando === "off" || verificando === null || verificando === false) return;

  if (verificando === "on") {

    if (!message.channel.permissionsFor(message.author).has(Discord.PermissionFlagsBits.ManageGuild))
      if (!message.channel.permissionsFor(message.author).has(Discord.PermissionFlagsBits.Administrator))

        if (message.content.includes("https".toLowerCase() || "http".toLowerCase() || "www".toLowerCase() || ".com".toLowerCase() || ".br".toLowerCase())) {

          message.delete();
          message.channel.send({
            content: `${message.author}`,
            embeds: [
              new Discord.EmbedBuilder()
                .setTitle(`System`)
                .setDescription(`**${message.author.tag},** Você não pode enviar links aqui.`)
                .setColor("Red")
                .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dinamyc: true }) })
            ]
          })
        }
  }
})