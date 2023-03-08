const Discord = require("discord.js");
const config = require('../../config.json');

module.exports = {
    name: "ticket",
    description: "📱 [Configuração] Utilize para enviar uma embed para abrir um ticket",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({
            content: `**❌ | ${interaction.user}, Você precisa da permissão \`ADMNISTRATOR\` para usar este comando!**`,
            ephemeral: true,
        })

        await interaction.channel.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(config.embeds_color.embed_invisible)
                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .addFields(
                        { name: '🇧🇷 Brasil', value: `> Se você estiver precisando de ajuda clique no botão abaixo` },
                        { name: '🇺🇸 English', value: `> If you need help click the button below` }
                    )
                    .setFooter({ text: `Copyright © Medusa's Community` })
            ],
            components: [
                new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('start_ticket')
                            .setLabel('Abrir ticket')
                            .setEmoji('🎫')
                            .setStyle(2)
                    )
            ]
        });

        interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(config.embeds_color.embed_success)
                    .setDescription(`✅ | Embed enviada com sucesso!`)
            ],
            ephemeral: true
        })
    }
}