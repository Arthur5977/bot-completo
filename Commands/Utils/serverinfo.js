const Discord = require("discord.js")

module.exports = {
    name: "serverinfo", // Coloque o nome do comando
    description: "📱 [Utilidade] Utilize para ver informações sobre o servidor", // Coloque a descrição do comando
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {

        let membros = interaction.guild.memberCount;
        let canais = interaction.guild.channels.cache.size;

        let chats = interaction.guild.channels.cache.filter(c => c.type === "GUILD_TEXT").size;
        let calls = interaction.guild.channels.cache.filter(c => c.type === "GUILD_VOICE").size;

        let emojis = interaction.guild.emojis.cache.size;
        let dono_id = interaction.guild.ownerId;
        let dono = interaction.guild.members.cache.get(dono_id);
        let data = interaction.guild.createdAt.toLocaleDateString("pt-br");

        let embed = new Discord.EmbedBuilder()
            .setColor(embed_color)
            .setAuthor({ name: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setThumbnail(`${interaction.guild.iconURL({ dynamic: true })}`)
            .addFields(
                {
                    name: `**💻 ID**`,
                    value: `${interaction.guild.id}`,
                    inline: true
                },
                {
                    name: `**👑 Dono**`,
                    value: `${dono} (${dono.id})`,
                    inline: true
                },
                {
                    name: `**💬 Canais (${canais})**`,
                    value: `**📝 Texto:** ${chats} \n **🗣 Voz:** ${calls}`,
                    inline: true
                },
                {
                    name: `**😎 Emojis**`,
                    value: `${emojis}`,
                    inline: true
                },
                {
                    name: `**📅 Criado em**`,
                    value: `${data}`,
                    inline: true
                },
                {
                    name: `**👥 Membros**`,
                    value: `${membros}`,
                    inline: true
                },
            )
            .setFooter({ text: `Copyright © ${client.user.username}` });

        interaction.reply({ embeds: [embed] })

    }
}