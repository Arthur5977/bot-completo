const Discord = require("discord.js")
const config = require('../../config.json');
const fs = require('fs');

module.exports = {
    name: "gen", // Coloque o nome do comando
    description: "📱 [Utilidade] Gerar uma conta aleatória!", // Coloque a descrição do comando
    options: [
        {
            name: 'platform',
            description: 'Plataforma que vai gerar a conta!',
            type: 3,
            required: true,
        },
    ],
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        const platform = interaction.options.getString('platform');

        var type = {}

        config.gerador.forEach(gerador => {
            if (interaction.channel.id == gerador.channel) {
                type = gerador
                return;
            }
        });

        if (!type.name) {
            return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.client.embed)
                        .setTitle('Canal sem permissão')
                        .setDescription('Esse canal não tem acesso ao gerador, se redirecione para o canal de gerador!')
                ]
            })
        }

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

        const filePath = `${__dirname}/../../stock/gerador/${type.name}/${platform}.txt`;

        fs.readFile(filePath, function (error, data) {
            if (error) return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.client.embed)
                        .setTitle('Serviço não encontrado')
                        .setDescription(`Não existe nenhum serviço chamado \`${platform}\` no meu estoque.`)
                ]
            })

            data = data.toString();
            const position = data;
            const firstLine = data.split('\n')[0];

            if (!position) return interaction.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.client.embed)
                        .setTitle('Sem estoque')
                        .setDescription(`O Serviço selecionado está atualmente sem estoque, tente novamente mais tarde.`)
                ]
            })

            interaction.member.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.client.embed)
                        .setTitle('Conta gerada com êxito')
                        .setDescription(`\`\`\`${firstLine}\`\`\` \n**💼 | Serviço selecionado:** ${platform[0].toUpperCase() + platform.slice(1)} \n**🎄 | Expirou:** Não definido\n**🛒 | Autor:** ${interaction.member}`)
                        .setImage('https://cdn.discordapp.com/attachments/1037732718290665573/1038284438385205309/standard_1.gif')
                ]
            })

            data = data.split('\n').slice(1).join('\n');
            fs.writeFile(filePath, data, function (error) {
                return interaction.reply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(config.client.embed)
                            .setTitle('Conta gerada com êxito')
                            .setDescription(`Pronto, o serviço \`${platform}\` que você selecionou, já foi gerado e já está em seu privado, caso a conta não funcione não reclame, algumas delas são uncheckeds ou antigas.`)
                            .setImage('https://cdn.discordapp.com/attachments/1037732718290665573/1038285330547232779/TESTE.gif')
                    ]
                })
            });
        });
    }
}