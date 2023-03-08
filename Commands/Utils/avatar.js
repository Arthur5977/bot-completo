const { ActionRowBuilder, EmbedBuilder, ButtonBuilder } = require("discord.js");
const config = require('../../config.json');

module.exports = {
    name: "avatar",
    description: "📱 [Utilidade] Utilize para baixar um avatar",
    options: [
        {
            name: 'user',
            type: 6,
            description: 'Mostra o avatar do seu perfil ou o avatar do perfil de outro usuário',
            require: false
        },
    ],
    run: async (client, interaction) => {

        let user = interaction.options.getUser('user') || interaction.user;
        let avatar = user.displayAvatarURL({ dynamic: true, format: "png", size: 4096 })

        const button = new ButtonBuilder()
            .setEmoji("📋")
            .setLabel("Fazer download")
            .setStyle(5)
            .setURL(avatar);

        const row = new ActionRowBuilder().addComponents(button);

        let embed = new EmbedBuilder()
            .setTitle(`🖼 ${user.username}`)
            .setColor(config.client.embed)
            .setImage(avatar)

        interaction.reply({ embeds: [embed], components: [row] })

    }
}