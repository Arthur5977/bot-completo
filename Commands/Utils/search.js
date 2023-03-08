const Discord = require("discord.js")
const config = require('../../config.json');

module.exports = {
    name: "search", // Coloque o nome do comando
    description: "📱 [Utilidade] Faça uma pesquisa no wikipedia de alguma informação", // Coloque a descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'search',
            description: 'Insira oque você deseja procurar!',
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    run: async (client, interaction) => {
        let search = interaction.options.getString('search');

        let search_url = `https://pt.wikipedia.org/wiki/${search}`;

        let embed = new Discord.EmbedBuilder()
            .setColor(config.client.embed)
            .setTitle(`Wiki ${search}`)
            .setDescription(`Encontrei um resultado sobre a sua pesquisa, clique no botão abaixo para saber mais!`)
            .setTimestamp()
            .setFooter({ text: `Copyright © ${client.user.username}` });

        if (search_url.includes(' ')) {
            search_url = search_url.replace(' ', '%20');
        }

        let button = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setEmoji('🌐')
                    .setLabel('Ir para pesquisa')
                    .setStyle(5)
                    .setURL(search_url)
            );
        interaction.reply({ embeds: [embed], components: [button] });
    }
}