const { ActionRowBuilder, EmbedBuilder, ButtonBuilder } = require("discord.js");
const config = require('../../config.json');

module.exports = {
    name: "avatarserver",
    description: "📱 [Utilidade] Utilize para baixar o avatar do servidor",
    run: async (client, interaction) => {

        const button = new ButtonBuilder()
            .setEmoji("📋")
            .setLabel("Fazer download")
            .setStyle(5)
            .setURL(interaction.guild.iconURL({ dynamic: true, format: "png", size: 4096 }));

        const row = new ActionRowBuilder().addComponents(button);

        let embed = new EmbedBuilder()
            .setTitle(`🖼 ${interaction.guild.name}`)
            .setColor(config.client.embed)
            .setImage(interaction.guild.iconURL({ dynamic: true, format: "png", size: 4096 }))

        interaction.reply({ embeds: [embed], components: [row] })

    }
}