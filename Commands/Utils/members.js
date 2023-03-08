const Discord = require("discord.js")
const config = require('../../config.json');

module.exports = {
    name: "members", // Coloque o nome do comando
    description: "📱 [Utilidade] Exibir a quantidade de membros no servidor!", // Coloque a descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(config.client.embed)
                    .setThumbnail(`${interaction.guild.iconURL({ dynamic: true })}`)
                    .setTitle(`Total de membros ${interaction.guild.name}`)
                    .setDescription(`**Total de membros:** \`${interaction.guild.memberCount}\` membros \n**Membros online:** \`${interaction.guild.members.cache.filter((x) => x.presence?.status == 'online').size}\` membros \n**Membros ausentes:** \`${interaction.guild.members.cache.filter((x) => x.presence?.status == 'idle').size}\` membros \n**Membros ocupados:** \`${interaction.guild.members.cache.filter((x) => x.presence?.status == 'dnd').size}\` membros`)
                    .setFooter({ text: `Copyright © ${interaction.guild.name}` })
                    .setTimestamp()
            ]
        });
    }
}