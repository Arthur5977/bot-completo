const Discord = require("discord.js");
const config = require('../../config.json')

module.exports = {
    name: "ativarkey", // Coloque o nome do comando
    description: "📱 [Configuração] Ativar key para receber um cargo!", // Coloque a descrição do comando
    options: [
        {
            name: 'key',
            type: Discord.ApplicationCommandOptionType.String,
            description: 'Qual a key que sera ativada?',
            required: true,
        },
    ],
    type: Discord.ApplicationCommand.ChatInput,

    run: async (client, interaction) => {
        let key = interaction.options.getString('key');

        if (interaction.channel.id !== config.gerarkey.channel_active_key) return interaction.reply(`❌ Você não está no canal permitido para ativar key!`)

        const row = await db.get(key);

        if (!row) return interaction.reply(`❌ A key inserida está inválida!`)

        if (row.includes(':')) {
            interaction.user.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(config.client.embed)
                        .setTitle('Conta gerada')
                        .setDescription(`\`\`\`${row}\`\`\``)
                ]
            }).then(() => {
                db.delete(key);
                interaction.reply(`✅ Key ativada com sucesso! Você recebeu a conta em seu privado!`)
            })
        } else {
            interaction.member.roles.add(row).then(() => {
                db.delete(key);
                interaction.reply(`✅ Key ativada com sucesso! Você recebeu o cargo ${interaction.guild.roles.cache.get(row)}`)
            }).catch(error => {
                interaction.reply(`❌ Não foi possível ativar a key, eu não possuo permissão! Contate a administração.`)
            })
        }
    }
}