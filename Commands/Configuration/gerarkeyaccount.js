const Discord = require("discord.js");
const config = require('../../config.json')

module.exports = {
    name: "gerarkeyaccount", // Coloque o nome do comando
    description: "📱 [Configuração] Gerar key de uma conta!", // Coloque a descrição do comando
    options: [
        {
            name: 'account',
            type: Discord.ApplicationCommandOptionType.String,
            description: 'Qual a conta que o usuário vai receber?',
            required: true,
        },
    ],
    type: Discord.ApplicationCommand.ChatInput,

    run: async (client, interaction) => {
        let account = interaction.options.getString('account');

        if (!interaction.member.permissions.has('ADMINISTRADOR')) return interaction.reply(`Você não tem permissão de \`ADMINISTRADOR\` para utilizar este comando!`)

        function generateKey(qnt) {
            var strings = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
            var key = "";

            for (let i = 0; i < qnt; i++) {
                key += strings[Math.floor(Math.random() * strings.length)];
            }

            return key;
        }

        const options = [0];

        const key = generateKey(25);
        options.push(key);
        db.set(key, account)

        interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(config.client.embed)
                    .setDescription(`Eu já enviei a key gerada em sua \`DM\`!`)
            ]
        })

        interaction.user.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor(config.client.embed)
                    .setTitle('Key gerada')
                    .setDescription(`Suas keys foram geradas com sucesso!\n\`\`\`${options.join('\n')}\`\`\``)
            ]
        })
    }
}