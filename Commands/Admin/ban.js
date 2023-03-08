const Discord = require("discord.js")
const config = require('../../config.json');

module.exports = {
    name: "ban", // Coloque o nome do comando
    description: "📱 [Admin] Utilize para banir um usuário", // Coloque a descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "user",
            description: "Mencione um usuário para ser banido.",
            type: Discord.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "motivo",
            description: "Insira um motivo.",
            type: Discord.ApplicationCommandOptionType.String,
            required: false,
        }
    ],

    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.BanMembers)) return interaction.reply(`Você não possui a permissão \`Banir\` para poder utilizar este comando.`)
        let userr = interaction.options.getUser("user");
        let user = interaction.guild.members.cache.get(userr.id)
        let motivo = interaction.options.getString("motivo");
        if (!motivo) motivo = "Não definido.";

        let embed = new Discord.EmbedBuilder()
            .setColor(config.client.embed)
            .setDescription(`O usuário ${user} (\`${user.id}\`) foi banido com sucesso!`);

        let erro = new Discord.EmbedBuilder()
            .setColor(config.client.embed)
            .setDescription(`Não foi possível banir o usuário ${user} (\`${user.id}\`) do servidor!`);

        user.ban({ reason: [motivo] }).then(() => {
            interaction.reply({ embeds: [embed] })
        }).catch(e => {
            interaction.reply({ embeds: [erro] })
        })
    }
}