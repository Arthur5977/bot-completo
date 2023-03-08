const { channel } = require("diagnostics_channel");
const Discord = require("discord.js")
const config = require('../../config.json');

module.exports = {
    name: "sayembed", // Coloque o nome do comando
    description: "📱 [Utilidade] Utilize para enviar uma embed", // Coloque a descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'channel',
            description: 'Canal onde a mensagem sera enviada!',
            type: Discord.ApplicationCommandOptionType.Channel,
            required: true,

        },
        {
            name: 'image',
            description: 'Exemplo: imgur.com/ab2Kxz',
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'message',
            description: 'Exemplo: Olá tudo bem?',
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply(`Você não possui a permissão \`Administrador\` para poder utilizar este comando.`)

        let image = interaction.options.getString("image");
        let message = interaction.options.getString('message');
        let channel = interaction.options.getChannel('channel');

        let embed = new Discord.EmbedBuilder()
            .setColor(config.client.embed)
            .setDescription(`${message}`)
            .setImage(`${image}`);

        channel.send({ embeds: [embed] }).then(() => {
            interaction.reply(`Mensagem enviada com sucesso no canal ${channel}`);
        });
    }
}