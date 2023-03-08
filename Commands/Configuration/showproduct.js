const Discord = require("discord.js")
const config = require('../../config.json')

module.exports = {
    name: "showproduct", // Coloque o nome do comando
    description: "📱 [Configuração] Exibir produto para compra!", // Coloque a descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({
            content: `❌ | ${interaction.user}, Você precisa da permissão \`ADMNISTRATOR\` para usar este comando!`,
            ephemeral: true,
        })

        var row = await db.all();
        row = row.filter(p => p.id.startsWith('product_'));

        if (row.length < 1) return interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(config.client.embed)
                    .setDescription('Não há produtos cadastrados no momento.\nUtilize \`/addproduct\` para começar.')
            ]
        })

        const options = [];

        row.forEach(product => {
            options.push({ label: `${product.value.name} [R$${product.value.value.toFixed(2)}]`, value: `${product.value.id}` })
        });

        return interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(config.client.embed)
                    .setTitle('Exibir produto')
                    .setDescription('Selecione um produto no **menu** abaixo.\nAssim enviando o painel de compra neste canal.')
            ],
            components: [
                new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.SelectMenuBuilder()
                            .setCustomId('show_product')
                            .setPlaceholder('Selecione um produto!')
                            .addOptions(options)
                    )
            ],
            ephemeral: true
        })
    }
}