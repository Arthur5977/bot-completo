const Discord = require("discord.js");
const { QuickDB } = require('quick.db')
const db = new QuickDB()

module.exports = {
    name: "antilink",
    description: '[👑 Moderação] Antilinks',
    options: [
        {
            name: 'opção',
            description: 'Selecione uma opção.',
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Ativar',
                    value: 'on',
                },
                {
                    name: 'Desativar',
                    value: 'off',
                }
            ],
        },
    ],


    run: async (client, interaction, args) => {
        const option = interaction.options.getString("opção")

        if (!interaction.channel.permissionsFor(interaction.user).has(Discord.PermissionFlagsBits.ManageGuild))
            return interaction.reply({
                content: `**\\❌| ${interaction.user}, Você precisa da permissão \`MANAGE_GUILD\` para usar este comando!**`,
                ephemeral: true
            })

        if (option === "on") {
            db.set(`antilink_${interaction.guild.id}`, "on");
            interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle(`Ativado!`)
                        .setColor("Green")
                        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dinamyc: true }) })
                        .setDescription(`\\✔️ **${interaction.user.tag},** O sistema de antilinks foi ativado com sucesso em **${interaction.guild.name}**`)
                ],
            });

        };
        if (option === "off") {

            db.set(`antilink_${interaction.guild.id}`, "off");
            interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle(`Desativado!`)
                        .setColor("Red")
                        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dinamyc: true }) })
                        .setDescription(`\\❌ **${interaction.user.tag},** O sistema de antilinks foi desaativado com sucesso em **${interaction.guild.name}**`)
                ],
            });
        };
    }
}