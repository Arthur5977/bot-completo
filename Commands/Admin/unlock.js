const Discord = require("discord.js")

module.exports = {
    name: "unlock",
    description: "📱 [Admin] Utilize para destrancar um canal",
    type: 1,

    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageChannels)) return interaction.reply(`Você não possui a permissão \`Genrenciar Canais\` para poder utilizar este comando.`)

        interaction.reply({ content: `🔓 O canal foi destrancado pelo usuário ${interaction.member}` }).then(msg => {
            interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: true }).catch(e => {
                interaction.edit(`❌ Ops, algo deu errado ao destrancar trancar este chat.`)
            })
        });
    }
}