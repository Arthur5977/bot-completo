const Discord = require("discord.js")
const config = require('../../config.json');

module.exports = {
    name: "ping", // Coloque o nome do comando
    description: "📱 [Utilidade] Utilize para ver o ping do bot", // Coloque a descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {

        let ping = client.ws.ping;

        let embed = new Discord.EmbedBuilder()
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setColor(config.client.embed)
            .setTitle('Latência')
            .setDescription(`:ping_pong: A latência do Bot é de: \`${ping}ms\``);

        interaction.reply({ embeds: [embed] });
    }
}