const Discord = require("discord.js")

module.exports = {
    name: "deleteallticket", // Coloque o nome do comando
    description: "Deletar todos os tickets", // Coloque a descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply(`Você não tem permissão para utilizar este comando!`)

        var channels_ticket = await interaction.guild.channels.cache.filter(c => c.name.includes('🎫-'));

        channels_ticket.forEach(async element => {
            element = await element
            element.delete()
        });


        var channels_ticket_closed = await interaction.guild.channels.cache.filter(c => c.name.includes('closed-'));

        channels_ticket_closed.forEach(async element => {
            element = await element
            element.delete()
        });

        var channels_ticket_call = await interaction.guild.channels.cache.filter(c => c.name.includes('call-'));

        channels_ticket_call.forEach(async element => {
            element = await element
            element.delete()
        });

        db.deleteAll()

        return interaction.reply(`Todos os tickets forão apgados com sucesso!`)
    }
}