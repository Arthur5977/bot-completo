const Discord = require("discord.js");
const config = require('../../config.json')

module.exports = {
    name: "gerarkey", // Coloque o nome do comando
    description: "📱 [Configuração] Gerar key de um cargo!", // Coloque a descrição do comando
    options: [
        {
            name: 'role',
            type: 8,
            description: 'Qual o cargo que o usuário vai receber?',
            required: true,
        },
        {
            name: 'quantity',
            type: Discord.ApplicationCommandOptionType.Number,
            description: 'Qual a quantidade de keys serão geradas?',
            required: true,
        },
    ],
    type: Discord.ApplicationCommand.ChatInput,

    run: async (client, interaction) => {
        let role = interaction.options.getRole('role');
        let quantity = interaction.options.getNumber('quantity');

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

        for (let i = 0; i < quantity; i++) {
            const key = generateKey(25);
            options.push(key);
            db.set(key, role.id)
        }

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