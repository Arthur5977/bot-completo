const Discord = require("discord.js")
const config = require('../../config.json');

module.exports = {
    name: "clear", // Coloque o nome do comando
    description: "📱 [Admin] Utilize para limpar um canal", // Coloque a descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'quantidade',
            description: 'Número de mensagens para serem apagadas.',
            type: Discord.ApplicationCommandOptionType.Number,
            required: true,
        }
    ],

    run: async (client, interaction) => {

        let numero = interaction.options.getNumber('quantidade')

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) return interaction.reply(`Você não possui a permissão \`Genrenciar Canais\` para poder utilizar este comando.`)

        if (parseInt(numero) > 99 || parseInt(numero) <= 0) return interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(embed_color)
                    .setDescription(`\`/clear [1 - 99]\``)
            ]
        })

        interaction.channel.bulkDelete(parseInt(numero))

        let embed = new Discord.EmbedBuilder()
            .setColor(config.client.embed)
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setDescription(`✅ | O canal de texo ${interaction.channel} teve \`${numero}\` mensagens deletadas por \`${interaction.user.username}\`.`);

        interaction.reply({ embeds: [embed] }).then(() => { setTimeout(() => { interaction.deleteReply() }, 10000) })
    }

}