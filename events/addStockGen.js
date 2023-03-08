const Discord = require('discord.js')
const config = require('../config.json');
const fs = require('fs');
const os = require('node:os')

/*============================= | Create Product | =========================================*/
module.exports = {
    name: 'createProduct',
    async execute(interaction) {
        if (interaction.isButton() && interaction.customId.startsWith("addstockgen")) {
            if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({
                content: `❌ | ${interaction.user}, Você precisa da permissão \`ADMNISTRATOR\` para usar este comando!`,
                ephemeral: true,
            })

            const modal = new Discord.ModalBuilder()
                .setCustomId('create_stockgen')
                .setTitle(`Adicionar novo estoque`)

            const service = new Discord.TextInputBuilder()
                .setCustomId('service')
                .setLabel('Qual é o serviço?')
                .setRequired(true)
                .setMaxLength(50)
                .setStyle(1)
                .setPlaceholder('Free, Boost, Premium');

            const platform = new Discord.TextInputBuilder()
                .setCustomId('platform')
                .setLabel('Qual é a plataforma?')
                .setRequired(true)
                .setMaxLength(50)
                .setStyle(1)
                .setPlaceholder('Rockstar, Disney, Netflix ...');

            const accounts = new Discord.TextInputBuilder()
                .setCustomId('accounts')
                .setLabel('Quais são as contas?')
                .setRequired(true)
                .setMaxLength(4000)
                .setStyle(2)
                .setPlaceholder('example@example.com')

            modal.addComponents(
                new Discord.ActionRowBuilder().addComponents(service),
                new Discord.ActionRowBuilder().addComponents(platform),
                new Discord.ActionRowBuilder().addComponents(accounts)
            );

            return interaction.showModal(modal);
        }

        if (interaction.isModalSubmit() && interaction.customId.startsWith('create_stockgen')) {
            const service = interaction.fields.getTextInputValue('service').toLowerCase();
            const platform = interaction.fields.getTextInputValue('platform');
            const accounts = interaction.fields.getTextInputValue('accounts');

            const quantity = accounts.split('\n').length;

            if (!config.gerador.filter(s => s.name === service)[0]) return interaction.reply({ content: `❌ | O serviço \`${service}\` não foi encontrado!` });

            const filePath = `${__dirname}/../stock/gerador/${service}/${platform}.txt`;

            fs.appendFile(filePath, os.EOL + accounts, function (error, result) { });
            fs.readFile(filePath, function (error, data) {
                data = data.toString();
                const position = data.split('\n').slice(0, 1).join('\n');
                if (position.length < 2) {
                    data = data.split('\n').slice(1).join('\n');
                    fs.writeFile(filePath, data, function (error) { })
                }
            })

            const channel = interaction.guild.channels.cache.get(config.gerador_channel_stock)

            channel.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.client.embed)
                        .setTitle('Novos stocks foram adicionados!')
                        .setDescription(`> **🆔 Serviço recebido:** ${service[0].toUpperCase() + service.slice(1)}\n> **📦 Produto:** ${platform[0].toUpperCase() + platform.slice(1)}\n> **🛒 Quantidade:** ${quantity}\n> **👥 Adicionado por:** ${interaction.user}`)
                ]
            })

            return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.client.embed)
                        .setTitle('Conta(s) adicionada')
                        .setDescription(`Conta adicionada com successo \`${accounts}\` no serviço \`${platform}\`!`)
                ]
            })
        }
    }
}