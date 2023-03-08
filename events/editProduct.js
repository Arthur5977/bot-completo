const Discord = require('discord.js');
const config = require('../config.json');

/*============================= | Create Product | =========================================*/
module.exports = {
    name: 'editProduct',
    async execute(interaction) {
        if (interaction.isSelectMenu() && interaction.customId.startsWith("edit_product")) {
            if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({
                content: `❌ | ${interaction.user}, Você precisa da permissão \`ADMNISTRATOR\` para usar este comando!`,
                ephemeral: true,
            })

            const product_id = interaction.values[0];

            var row = await db.get(`product_${product_id}`);
            if (row.length < 1) return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.client.embed)
                        .setTitle('Produto não encontrado!')
                        .setDescription('Este produto não foi encontrado no banco de dados!')
                ]
            })

            interaction.update({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.client.embed)
                        .setTitle(interaction.guild.name)
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true, format: "png", size: 4096 }))
                        .setDescription(`Você está editando um produto, Produto sendo gerenciado: ${row.id}`)
                ],
                components: [
                    new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId('edit_name')
                                .setLabel('Nome')
                                .setStyle(2),
                            new Discord.ButtonBuilder()
                                .setCustomId('edit_description')
                                .setLabel('Descrição')
                                .setStyle(2),
                            new Discord.ButtonBuilder()
                                .setCustomId('edit_value')
                                .setLabel('Preço')
                                .setStyle(2),
                            new Discord.ButtonBuilder()
                                .setCustomId('edit_stock')
                                .setLabel('Estoque')
                                .setStyle(2),
                            new Discord.ButtonBuilder()
                                .setCustomId('delete_product')
                                .setLabel('Deletar')
                                .setStyle(4),
                        ),
                    new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId('closed_edit_product')
                                .setLabel('Fechar')
                                .setStyle(4),
                        )
                ]
            }).then(msg => {
                const filter = i => i.member.id === interaction.user.id;
                const collector = msg.createMessageComponentCollector({ filter });
                collector.on('collect', async (interaction2) => {
                    if (interaction2.customId === "edit_name") {
                        const msg = await interaction2.reply('Digite qual o nome você que deseja colocar!')
                        const collectorName = interaction2.channel.createMessageCollector();
                        collectorName.on('collect', (interactionName) => {
                            db.set(`product_${row.id}.name`, `${interactionName.content}`)
                            interaction2.editReply(`Nome alterado com sucesso!`).then(m => { setTimeout(() => { m.delete() }, 1000) })
                            interactionName.delete();
                            collectorName.stop();
                        });
                    } else if (interaction2.customId === "edit_description") {
                        const msg = await interaction2.reply('Digite qual a descrição que você deseja colocar!')
                        const collectorDescription = interaction2.channel.createMessageCollector();
                        collectorDescription.on('collect', (interactionName) => {
                            db.set(`product_${row.id}.body`, `${interactionName.content}`)
                            interaction2.editReply(`Descrição alterada com sucesso!`).then(m => { setTimeout(() => { m.delete() }, 1000) })
                            interactionName.delete();
                            collectorDescription.stop()
                        });
                    } else if (interaction2.customId === "edit_value") {
                        const msg = await interaction2.reply('Digite qual o valor que você deseja colocar!')
                        const collectorValue = interaction2.channel.createMessageCollector();
                        collectorValue.on('collect', (interactionName) => {
                            db.set(`product_${row.id}.value`, parseFloat(interactionName.content))
                            interaction2.editReply(`Valor alterado com sucesso!`).then(m => { setTimeout(() => { m.delete() }, 1000) })
                            interactionName.delete();
                            collectorValue.stop()
                        });
                    } else if (interaction2.customId === "edit_stock") {
                        interaction2.reply({
                            embeds: [
                                new Discord.EmbedBuilder()
                                    .setColor(config.client.embed)
                                    .setDescription('Escolha uma opção para gerenciar o estoque!')
                            ],
                            components: [
                                new Discord.ActionRowBuilder()
                                    .addComponents(
                                        new Discord.ButtonBuilder()
                                            .setCustomId('view_stock')
                                            .setLabel('Ver estoque')
                                            .setStyle(2),
                                        new Discord.ButtonBuilder()
                                            .setCustomId('take_stock_random')
                                            .setLabel('Take estoque')
                                            .setStyle(2),
                                        new Discord.ButtonBuilder()
                                            .setCustomId('remove_stock')
                                            .setLabel('Remover estoque')
                                            .setStyle(2),
                                        new Discord.ButtonBuilder()
                                            .setCustomId('back_stock')
                                            .setLabel('Voltar')
                                            .setStyle(4),
                                    )
                            ]
                        }).then((msg) => {

                            const collectorStock = interaction2.channel.createMessageComponentCollector();
                            collectorStock.on('collect', async (interactionStock) => {
                                if (interactionStock.customId === "view_stock") {
                                    interactionStock.reply({
                                        embeds: [
                                            new Discord.EmbedBuilder()
                                                .setColor(config.client.embed)
                                                .setDescription(`\`\`\`${row.stocks.join('\n')}\`\`\``)
                                        ],
                                        ephemeral: true
                                    })
                                } else if (interactionStock.customId === "take_stock_random") {
                                    const stock_generated = Math.floor(Math.random() * row.stocks.length);
                                    interactionStock.reply({
                                        embeds: [
                                            new Discord.EmbedBuilder()
                                                .setColor(config.client.embed)
                                                .setDescription(`\`\`\`${row.stocks[stock_generated]}\`\`\``)
                                        ],
                                        ephemeral: true
                                    })

                                    row.stocks = row.stocks.filter(p => p !== row.stocks[stock_generated])

                                    db.pull(`product_${row.id}.stocks`, row.stocks[stock_generated])
                                } else if (interactionStock.customId === "remove_stock") {
                                    interactionStock.reply(`Insira o stock que você deseja remover!`).then(msg => {
                                        const collectorRemoveStock = interaction2.channel.createMessageCollector();
                                        collectorRemoveStock.on('collect', async (interactionRemoveStock) => {
                                            const stockRemove = row.stocks.filter(p => p === interactionRemoveStock.content)

                                            if (!stockRemove || !stockRemove[0]) return collectorRemoveStock.stop() + interactionStock.deleteReply() + interactionRemoveStock.delete() + interactionRemoveStock.channel.send(`Estoque não encontrado!`).then(msg => { setTimeout(() => { msg.delete() }, 1000); })

                                            row.stocks = row.stocks.filter(p => p !== stockRemove[0])
                                            db.pull(`product_${row.id}.stocks`, stockRemove[0])
                                            interactionRemoveStock.delete();
                                            interactionStock.deleteReply()
                                            interactionRemoveStock.channel.send(`Estoque removido com sucesso!`).then(msg => { setTimeout(() => { msg.delete() }, 1000); })
                                            collectorRemoveStock.stop();
                                        });
                                    })
                                } else if (interactionStock.customId === "back_stock") {
                                    collectorStock.stop();
                                }
                            });

                            collectorStock.on('end', collected => {
                                interaction2.deleteReply();
                            })
                        })
                    } else if (interaction2.customId === "delete_product") {
                        interaction.deleteReply();
                        db.delete(`product_${row.id}`);
                    } else if (interaction2.customId === "closed_edit_product") {
                        collector.stop();
                    }
                })

                collector.on('end', collected => {
                    interaction.deleteReply();
                })
            })
        }
    }
}