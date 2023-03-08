const Discord = require("discord.js");
const config = require('../../config.json');
const fs = require('fs');

module.exports = {
    name: "stock", // Coloque o nome do comando
    description: "📱 [Utilidade] Ver a quantidade de estoque disponível do gerador!", // Coloque a descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        const channel = interaction.channel;

        let type = {}

        config.gerador.forEach(gerador => {
            if (channel.id == gerador.channel) {
                type = gerador
                return;
            }
        });

        if (!type.name) return interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(config.client.embed)
                    .setTitle('Canal inválido')
                    .setDescription('Você precisa estar em um canal correto para ver o estoquess!')
            ]
        })

        if (!interaction.member.roles.cache.has(type.role)) {
            return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.client.embed)
                        .setTitle('Sem permissão')
                        .setDescription('Você não tem permissão para utilizar esse gerador!')
                ]
            })
        }

        const stock = [];

        fs.readdir(`${__dirname}/../../stock/gerador/${type.name}/`, function (err, files) {
            files.forEach(function (file) {
                if (!file.endsWith('.txt')) return
                stock.push(file)
            });

            const fields = [];

            stock.forEach(async function (data) {
                const acc = fs.readFileSync(`${__dirname}/../../stock/gerador/${type.name}/${data}`, 'utf-8')
                var lines = [];
                acc.split(/\r?\n/).forEach(function (line) {
                    lines.push(line);
                });
                if (lines == '') {
                    lines = lines.slice(0, -1)
                }
                fields.push({ name: data.replace('.txt', '')[0].toUpperCase() + data.replace('.txt', '').slice(1), value: `${lines.length}` })
            });

            const embed = new Discord.EmbedBuilder()
                .setColor(config.client.embed)
                .setTitle(`Estoque - ${type.name[0].toUpperCase() + type.name.slice(1)}`)
                .setDescription(`Veja abaixo o estoque disponível de contas do serviço: **${type.name[0].toUpperCase() + type.name.slice(1)}**\n`)
                .addFields(fields);

            // });

            interaction.reply({ embeds: [embed] })
        })
    }
}