const Discord = require("discord.js")
const moment = require('moment-timezone')
const config = require('../../config.json');

module.exports = {
    name: "estastic", // Coloque o nome do comando
    description: "📱 [Utilidade] Ver as estatísticas da loja do mês atual!", // Coloque a descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.BanMembers)) interaction.reply(`Você não possui permissão para utilizar este comando.`);

        const row = await dbJson.get(`${moment().utc().tz('America/Sao_Paulo').format('D/M/Y')}`);

        if (!row) return interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(config.client.embed)
                    .setTitle(interaction.guild.name + ' | Estatísticas')
                    .setDescription('Este mês a loja ainda não teve nenhuma venda!')
            ]
        })

        return interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(config.client.embed)
                    .setTitle(interaction.guild.name + ' | Estatísticas')
                    .addFields(
                        { name: '🛒 Produtos comprados:', value: `\`\`\`${row.pedidos} compra(s) realizadas\`\`\`` },
                        { name: '💸 Dinheiro gasto:', value: `\`\`\`R$ ${row.compras.toFixed(2)}\`\`\`` }
                    )
            ]
        })
    }
}