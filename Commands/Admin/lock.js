const Discord = require("discord.js")

module.exports = {
    name: "lock",
    description: "📱 [Admin] Utilize para trancar um canal",
    type: 1,

    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageChannels)) return interaction.reply(`Você não possui a permissão \`Genrenciar Canais\` para poder utilizar este comando.`)

        interaction.reply({ content: `🔒 O canal foi trancado pelo usuário ${interaction.member}` }).then(msg => {
            interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false }).catch(e => {
                interaction.edit(`❌ Ops, algo deu errado ao tentar trancar este chat.`)
            })
        });
    }
}