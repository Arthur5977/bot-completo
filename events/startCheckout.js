const Discord = require('discord.js')
const config = require('../config.json')
const moment = require('moment-timezone')
const mercadopago = require('mercadopago');
/*============================= | Create Product | =========================================*/
module.exports = {
    name: 'startCheckout',
    async execute(interaction) {
        if (interaction.isButton() && interaction.customId.startsWith("sales-")) {
            const product_id = interaction.customId.slice(interaction.customId.indexOf('-')).replace('-', '')
            const row = await db.get(`product_${product_id}`);

            if (!row) return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.client.embed)
                        .setTitle('Produto não encontrado!')
                        .setDescription('Este produto pode não estar mais disponível!')
                ],
                ephemeral: true
            })

            if (!row.stocks || row.stocks.length < 1) return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.client.embed)
                        .setTitle('Produto sem estoque!')
                        .setDescription('Este produto está sem estoque no momento, volte mais tarde!')
                ],
                ephemeral: true
            })

            if (interaction.guild.channels.cache.find(c => c.name === `carrinho-${interaction.user.id}`)) {
                return interaction.reply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(config.client.embed)
                            .setTitle('Carrinho')
                            .setDescription(`Você já possui um carrinho aberto, finalize a compra para abrir um novo!`)
                    ],
                    ephemeral: true,
                })
            }

            interaction.guild.channels.create({
                name: `carrinho - ${interaction.user.id}`,
                type: 0,
                parent: config.sales.checkout_category_id,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ["ViewChannel"]
                    },
                    {
                        id: interaction.user.id,
                        allow: ["ViewChannel"],
                        deny: ["SendMessages", "AttachFiles", "AddReactions"]
                    }
                ]
            }).then(async (channel) => {
                interaction.reply({ content: `**✅ | ${interaction.user} Seu carrinho foi criado ** com sucesso, aqui está ${channel}`, ephemeral: true })

                var qrcode = false;
                var pix = false;
                var quantity = 1;
                var product_price = row.value * quantity

                const protocol = Math.floor(Math.random() * 900000) + 100000;;

                channel.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(config.client.embed)
                            .setTitle('Carrinho')
                            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, format: "png", size: 4096 }))
                            .setDescription('Seu carrinho foi criado com sucesso, informações:')
                            .addFields([
                                { name: 'Produto', value: `\`${row.name}\``, inline: true },
                                { name: 'Quantidade', value: `\`${quantity} item(s)\``, inline: true },
                                { name: 'Preço', value: `\`R$${(row.value * quantity).toFixed(2)}\``, inline: true },
                            ])
                    ],
                    components: [
                        new Discord.ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setCustomId(`remove_checkout_product`)
                                    .setStyle(2)
                                    .setLabel('-'),
                                new Discord.ButtonBuilder()
                                    .setCustomId(`add_checkout_product`)
                                    .setStyle(2)
                                    .setLabel('+'),
                                new Discord.ButtonBuilder()
                                    .setCustomId(`confirm_checkout_product`)
                                    .setStyle(3)
                                    .setLabel('Finalizar'),
                                new Discord.ButtonBuilder()
                                    .setCustomId(`cancel_checkout`)
                                    .setStyle(4)
                                    .setLabel('Cancelar')
                            ),
                    ]
                }).then(async msg => {
                    const filter = i => i.member.id === interaction.user.id;
                    const collector = msg.createMessageComponentCollector({ filter });
                    collector.on('collect', interaction2 => {
                        if (interaction2.customId === "remove_checkout_product") {
                            if (quantity <= 1) return interaction2.reply({ content: `Você não pode deixar o stock abaixo de 0`, ephemeral: true })

                            quantity -= 1;

                            product_price = row.value * quantity;

                            interaction2.update({
                                embeds: [
                                    new Discord.EmbedBuilder()
                                        .setColor(config.client.embed)
                                        .setTitle('Carrinho')
                                        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, format: "png", size: 4096 }))
                                        .setDescription('Seu carrinho foi criado com sucesso, informações:')
                                        .addFields([
                                            { name: 'Produto', value: `\`${row.name}\``, inline: true },
                                            { name: 'Quantidade', value: `\`${quantity} item(s)\``, inline: true },
                                            { name: 'Preço', value: `\`R$${(row.value * quantity).toFixed(2)}\``, inline: true },
                                        ])
                                ],
                                components: [
                                    new Discord.ActionRowBuilder()
                                        .addComponents(
                                            new Discord.ButtonBuilder()
                                                .setCustomId(`remove_checkout_product`)
                                                .setStyle(2)
                                                .setLabel('-'),
                                            new Discord.ButtonBuilder()
                                                .setCustomId(`add_checkout_product`)
                                                .setStyle(2)
                                                .setLabel('+'),
                                            new Discord.ButtonBuilder()
                                                .setCustomId(`confirm_checkout_product`)
                                                .setStyle(3)
                                                .setLabel('Finalizar'),
                                            new Discord.ButtonBuilder()
                                                .setCustomId(`cancel_checkout`)
                                                .setStyle(4)
                                                .setLabel('Cancelar'),
                                        ),
                                ]
                            });
                        } else if (interaction2.customId === "add_checkout_product") {
                            if (quantity >= row.stocks.length) return interaction2.reply({ content: `Você não pode adicionar o stock acima do valor`, ephemeral: true })

                            quantity += 1;

                            product_price = row.value * quantity;

                            interaction2.update({
                                embeds: [
                                    new Discord.EmbedBuilder()
                                        .setColor(config.client.embed)
                                        .setTitle('Carrinho')
                                        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, format: "png", size: 4096 }))
                                        .setDescription('Seu carrinho foi criado com sucesso, informações:')
                                        .addFields([
                                            { name: 'Produto', value: `\`${row.name}\``, inline: true },
                                            { name: 'Quantidade', value: `\`${quantity} item(s)\``, inline: true },
                                            { name: 'Preço', value: `\`R$${product_price.toFixed(2)}\``, inline: true },
                                        ])
                                ],
                                components: [
                                    new Discord.ActionRowBuilder()
                                        .addComponents(
                                            new Discord.ButtonBuilder()
                                                .setCustomId(`remove_checkout_product`)
                                                .setStyle(2)
                                                .setLabel('-'),
                                            new Discord.ButtonBuilder()
                                                .setCustomId(`add_checkout_product`)
                                                .setStyle(2)
                                                .setLabel('+'),
                                            new Discord.ButtonBuilder()
                                                .setCustomId(`confirm_checkout_product`)
                                                .setStyle(3)
                                                .setLabel('Finalizar'),
                                            new Discord.ButtonBuilder()
                                                .setCustomId(`cancel_checkout`)
                                                .setStyle(4)
                                                .setLabel('Cancelar'),
                                        ),
                                ]
                            });
                        } else if (interaction2.customId === "cancel_checkout") {
                            interaction2.channel.delete().then(() => {
                                interaction2.user.send({
                                    embeds: [
                                        new Discord.EmbedBuilder()
                                            .setColor(config.client.embed)
                                            .setTitle('Pedido cancelado!')
                                            .setDescription(`Seu pedido de n° ${protocol} foi cancelado, caso isso seja um erro\nentre em contato com a equipe para reportar o problema!`)
                                            .addFields([
                                                {
                                                    name: 'ID da compra', value: `\`\`\`${protocol}\`\`\``
                                                },
                                                { name: 'Pedido finalizado por:', value: `\`\`\`${interaction2.user.tag}\`\`\`` },
                                                { name: 'Data de finalização', value: `\`\`\`${moment().utc().tz('America/Sao_Paulo').format('DD/M/Y - HH:mm:ss')}\`\`\`` }
                                            ])
                                    ]
                                })
                            })
                        } else if (interaction2.customId === "confirm_checkout_product") {
                            interaction2.message.delete()
                            interaction2.channel.send({
                                embeds: [
                                    new Discord.EmbedBuilder()
                                        .setColor(config.client.embed)
                                        .setTitle('Pagamento')
                                        .setDescription('Após realiar o pagamento envie o comprovante no canal para que seja analizado sua compra!\n\nRealize o pagamento do(s) produto(s) informações:')
                                        .setImage(config.sales.banner_sales)
                                        .addFields([
                                            { name: 'Produto', value: `\`${row.name}\``, inline: true },
                                            { name: 'Quantidade', value: `\`${quantity} item(s)\``, inline: true },
                                            { name: 'Preço', value: `\`R$${(row.value * quantity).toFixed(2)}\``, inline: true },
                                        ])
                                ],
                                components: [
                                    new Discord.ActionRowBuilder()
                                        .addComponents(
                                            new Discord.ButtonBuilder()
                                                .setCustomId(`qrcode_checkout_product`)
                                                .setStyle(2)
                                                .setLabel('QR Code'),
                                            new Discord.ButtonBuilder()
                                                .setCustomId(`pix_checkout_product`)
                                                .setStyle(2)
                                                .setLabel('Copia e Cola'),
                                            new Discord.ButtonBuilder()
                                                .setCustomId(`cancel_checkout`)
                                                .setStyle(4)
                                                .setLabel('Fechar Carrinho'),
                                            new Discord.ButtonBuilder()
                                                .setCustomId(`confirm_payment_checkout`)
                                                .setStyle(3)
                                                .setLabel('Confirmar'),
                                        ),
                                ]
                            }).then(async msg => {
                                interaction2.channel.edit({
                                    permissionOverwrites: [
                                        {
                                            id: interaction2.guild.id,
                                            deny: ["ViewChannel"]
                                        },
                                        {
                                            id: interaction2.user.id,
                                            allow: ["ViewChannel", "SendMessages", "AttachFiles"],
                                            deny: ["AddReactions"]
                                        }
                                    ]
                                })
                                const collector2 = msg.createMessageComponentCollector();

                                collector2.on('collect', async interaction3 => {
                                    if (interaction3.customId === "qrcode_checkout_product") {
                                        interaction3.channel.send({
                                            embeds: [
                                                new Discord.EmbedBuilder()
                                                    .setColor(config.client.embed)
                                                    .setImage(config.sales.banco.qrcode)
                                            ],
                                        })

                                        qrcode = true;

                                        interaction3.update({
                                            embeds: [
                                                new Discord.EmbedBuilder()
                                                    .setColor(config.client.embed)
                                                    .setTitle('Pagamento')
                                                    .setDescription('Após realiar o pagamento envie o comprovante no canal para que seja analizado sua compra!\n\nRealize o pagamento do(s) produto(s) informações:')
                                                    .setImage('https://cdn.discordapp.com/attachments/1037732718290665573/1038633629141717022/standard_2.gif')
                                                    .addFields([
                                                        { name: 'Produto', value: `\`${row.name}\``, inline: true },
                                                        { name: 'Quantidade', value: `\`${quantity} item(s)\``, inline: true },
                                                        { name: 'Preço', value: `\`R$${product_price.toFixed(2)}\``, inline: true },
                                                    ])
                                            ],
                                            components: [
                                                new Discord.ActionRowBuilder()
                                                    .addComponents(
                                                        new Discord.ButtonBuilder()
                                                            .setCustomId(`qrcode_checkout_product`)
                                                            .setStyle(2)
                                                            .setLabel('QR Code')
                                                            .setDisabled(qrcode ? true : false),
                                                        new Discord.ButtonBuilder()
                                                            .setCustomId(`pix_checkout_product`)
                                                            .setStyle(2)
                                                            .setLabel('Copia e Cola')
                                                            .setDisabled(pix ? true : false),
                                                        new Discord.ButtonBuilder()
                                                            .setCustomId(`cancel_checkout`)
                                                            .setStyle(4)
                                                            .setLabel('Fechar Carrinho'),
                                                        new Discord.ButtonBuilder()
                                                            .setCustomId(`confirm_payment_checkout`)
                                                            .setStyle(3)
                                                            .setLabel('Confirmar'),
                                                    ),
                                            ]
                                        })
                                    } else if (interaction3.customId === "pix_checkout_product") {
                                        interaction3.channel.send({
                                            embeds: [
                                                new Discord.EmbedBuilder()
                                                    .setColor(config.client.embed)
                                                    .setDescription(`${config.sales.banco.chave_pix}`)
                                            ]
                                        })

                                        pix = true;

                                        interaction3.update({
                                            embeds: [
                                                new Discord.EmbedBuilder()
                                                    .setColor(config.client.embed)
                                                    .setTitle('Pagamento')
                                                    .setDescription('Após realiar o pagamento envie o comprovante no canal para que seja analizado sua compra!\n\nRealize o pagamento do(s) produto(s) informações:')
                                                    .setImage('https://cdn.discordapp.com/attachments/1037732718290665573/1038633629141717022/standard_2.gif')
                                                    .addFields([
                                                        { name: 'Produto', value: `\`${row.name}\``, inline: true },
                                                        { name: 'Quantidade', value: `\`${quantity} item(s)\``, inline: true },
                                                        { name: 'Preço', value: `\`R$${product_price.toFixed(2)}\``, inline: true },
                                                    ])
                                            ],
                                            components: [
                                                new Discord.ActionRowBuilder()
                                                    .addComponents(
                                                        new Discord.ButtonBuilder()
                                                            .setCustomId(`qrcode_checkout_product`)
                                                            .setStyle(2)
                                                            .setLabel('QR Code')
                                                            .setDisabled(qrcode ? true : false),
                                                        new Discord.ButtonBuilder()
                                                            .setCustomId(`pix_checkout_product`)
                                                            .setStyle(2)
                                                            .setLabel('Copia e Cola')
                                                            .setDisabled(pix ? true : false),
                                                        new Discord.ButtonBuilder()
                                                            .setCustomId(`cancel_checkout`)
                                                            .setStyle(4)
                                                            .setLabel('Fechar Carrinho'),
                                                        new Discord.ButtonBuilder()
                                                            .setCustomId(`confirm_payment_checkout`)
                                                            .setStyle(3)
                                                            .setLabel('Confirmar'),
                                                    ),
                                            ]
                                        })
                                    } else if (interaction3.customId === "cancel_checkout") {
                                        interaction3.channel.delete().then(() => {
                                            interaction3.user.send({
                                                embeds: [
                                                    new Discord.EmbedBuilder()
                                                        .setColor(config.client.embed)
                                                        .setTitle('Pedido cancelado!')
                                                        .setDescription('Realize o pagamento do(s) produto(s) informações:\n\n**Obs:** *Após realiar o pagamento envie o comprovante no canal para que seja analizado sua compra!*')
                                                        .addFields([
                                                            {
                                                                name: 'ID da compra', value: `\`\`\`${protocol}\`\`\``
                                                            },
                                                            { name: 'Pedido finalizado por:', value: `\`\`\`${interaction2.user.tag}\`\`\`` },
                                                            { name: 'Data de finalização', value: `\`\`\`${moment().utc().tz('America/Sao_Paulo').format('DD/M/Y - HH:mm:ss')}\`\`\`` }
                                                        ])
                                                ]
                                            })
                                        })
                                    } else if (interaction3.customId === "confirm_payment_checkout") {
                                        if (!interaction3.member.roles.cache.get(config.sales.role_permission_approved)) return interaction3.reply({ content: `Você não tem permissão de aprovar a compra!`, ephemeral: true })

                                        if (row.stocks.length < quantity) return interaction3.channel.send({
                                            embeds: [
                                                new Discord.EmbedBuilder()
                                                    .setColor(config.client.embed)
                                                    .setTitle(interaction2.guild.name + ' | Compra aprovada')
                                                    .setDescription(`Infelizmente alguem comprou esse produto antes de você, mande mensagem para algum dos staffs e apresente o codigo: \`\`\`[${payment.body.id}]\`\`\``)
                                            ]
                                        })

                                        interaction3.channel.delete();

                                        const stocks = row.stocks.slice(0, quantity);
                                        db.pull(`product_${row.id}.stocks`, stocks)

                                        const owner_id = interaction3.channel.name.replace('carrinho-', '');
                                        const user = await interaction.guild.members.fetch(owner_id);

                                        if (!user.roles.cache.get(config.sales.role_customer)) user.roles.add(config.sales.role_customer);

                                        user.send({
                                            embeds: [
                                                new Discord.EmbedBuilder()
                                                    .setColor(config.client.embed)
                                                    .setTitle(interaction2.guild.name)
                                                    .setDescription('Sua compra foi aprovada com successo!')
                                                    .addFields([
                                                        { name: '🤖 Ativação', value: `\`\`\`${stocks.join('\n')}\`\`\`` },
                                                        { name: '📦 Produto:', value: `\`\`\`${row.name}\`\`\`` },
                                                        { name: '🛒 Quantidade', value: `\`\`\`${quantity}\`\`\`` },
                                                        { name: '💸 Valor:', value: `\`\`\`R$${product_price.toFixed(2)}\`\`\`` },
                                                        { name: '🆔 ID da compra:', value: `\`\`\`${protocol}\`\`\`` },
                                                        { name: '📅 Data da compra:', value: `\`\`\`${moment().utc().tz('America/Sao_Paulo').format('DD/MM/YYYY - HH:mm:ss')}\`\`\`` }
                                                    ])
                                            ]
                                        })

                                        const channel = interaction3.guild.channels.cache.get(config.sales.channel_sales);
                                        channel.send({
                                            embeds: [
                                                new Discord.EmbedBuilder()
                                                    .setColor(config.client.embed)
                                                    .setTitle(interaction3.guild.name + ' | Venda aprovada')
                                                    .addFields([
                                                        { name: `🤖 Cliente`, value: `\`\`\`${user.user.tag}\`\`\`` },
                                                        { name: `📦 Produto:`, value: `\`\`\`${row.name}\`\`\`` },
                                                        { name: `💸 Valor:`, value: `\`\`\`R$${product_price.toFixed(2)}\`\`\`` },
                                                        { name: `🛒 Quantidade:`, value: `\`\`\`${quantity}\`\`\`` },
                                                        { name: '📅 Data da compra:', value: `\`\`\`${moment().utc().tz('America/Sao_Paulo').format('DD/MM/YYYY - HH:mm:ss')}\`\`\`` }
                                                    ])
                                            ]
                                        })

                                        dbJson.add("pedidostotal", 1)
                                        dbJson.add("gastostotal", product_price)
                                        dbJson.add(`${moment().utc().tz('America/Sao_Paulo').format('D/M/Y')}.pedidos`, 1)
                                        dbJson.add(`${moment().utc().tz('America/Sao_Paulo').format('D/M/Y')}.compras`, product_price)
                                        dbJson.add(`${interaction2.user.id}.compras`, product_price)
                                        dbJson.add(`${interaction2.user.id}.pedidos`, 1)
                                    }
                                })
                            })
                        }
                    })
                })
            })
        }
    }
}