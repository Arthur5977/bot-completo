const Discord = require('discord.js')
const config = require('../config.json');
const fs = require('fs');
const os = require('node:os')

/*============================= | Create Product | =========================================*/
module.exports = {
    name: 'createProduct',
    async execute(interaction) {
        if (interaction.isButton() && interaction.customId.startsWith("addstockproducts")) {
            if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({
                content: `❌ | ${interaction.user}, Você precisa da permissão \`ADMNISTRATOR\` para usar este comando!`,
                ephemeral: true,
            })

            var row = await db.all();

            row = row.filter(p => p.id.startsWith('product_'));

            const options = [];
            row.forEach(product => {
                options.push({ label: `${product.value.name} [R$${product.value.value.toFixed(2)}]`, value: `${product.value.id}` })
            });

            return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.client.embed)
                        .setTitle('Ecsolha um produto')
                        .setDescription('Escolha um produto que você deseja adicionar o estoque!')
                ],
                components: [
                    new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.SelectMenuBuilder()
                                .setCustomId('addstockproductsmenu')
                                .setPlaceholder('Escolha um produto para adicionar o estoque!')
                                .addOptions(options)
                        )
                ],
                ephemeral: true
            })
        }

        if (interaction.isSelectMenu() && interaction.customId.startsWith('addstockproductsmenu')) {
            const product_id = interaction.values[0];

            const modal = new Discord.ModalBuilder()
                .setCustomId(`create_stockproducts-${product_id}`)
                .setTitle(`Adicionar novo estoque`)

            const accounts = new Discord.TextInputBuilder()
                .setCustomId('accounts')
                .setLabel('Quais são as contas?')
                .setRequired(true)
                .setMaxLength(4000)
                .setStyle(2)
                .setPlaceholder('example@example.com')

            modal.addComponents(
                new Discord.ActionRowBuilder().addComponents(accounts)
            );

            return interaction.showModal(modal);
        }

        if (interaction.isModalSubmit() && interaction.customId.startsWith('create_stockproducts')) {
            const product_id = interaction.customId.slice(interaction.customId.indexOf('-')).replace('-', '')

            const accounts = interaction.fields.getTextInputValue('accounts').split('\n');

            db.push(`product_${product_id}.stocks`, accounts);
            interaction.reply({ content: `✅ | Estoque adicionado com sucesso!` })
        }
    }
}