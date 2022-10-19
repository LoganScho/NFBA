const { ApplicationCommandOptionType, EmbedBuilder, messageLink } = require('discord.js');
const Logger = require('../../utils/Logger');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'viewbirthday',
  category: 'birthday',
  permissions: ['ADMINISTRATOR'],
  ownerOnly: false,
  usage: 'viewbirthday <@member>',
  examples: ['viewbirthday @Sckoco 27/12'],
  description: 'Voir la liste des anniversaires ou celui d\'un membre',
  options: [
    {
      name: 'target',
      description: "L'utilisateur dont on souhaite connaitre l'anniversaire",
      type: ApplicationCommandOptionType.User,
      required: false
    }
  ],
  async runInteraction(client, interaction) {
    const target = interaction.options.getMember('target');
    let birthdays = {};
    
    try {
      const filePath = path.resolve(__dirname, "../../data/birthdays.json");
      const jsonString = fs.readFileSync(filePath);
      birthdays = JSON.parse(jsonString);
    } catch(err) {
      Logger.warn(err);
      return interaction.reply("Une erreur s'est produite lors de la récupération des anniversaires ! Veuillez contacter le développeur du bot");
    }

    let birthdaysArray = [];
    for(const bday in birthdays) {
      birthdaysArray.push([bday, birthdays[bday]]);
    }
    birthdaysArray.sort((a,b) => {
      let dayA = a.split('/')[0];
      let dayB = b.split('/')[0];
      let monthA = a.split('/')[1];
      let monthB = b.split('/')[1];
      if(monthA.localeCompare(monthB) == 0) {
        return dayA.localeCompare(dayB);
      }
      return monthA.localeCompare(monthB);
    });

    const embed = new EmbedBuilder()
      .setTitle('🎂 Liste des anniversaires')
      .setTimestamp()
      .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });

    let embedDescription = ``;
    if(!target) {  
      await birthdaysArray.forEach(async bday => {
        bday[1].forEach(async (userId) => {
          const user = await client.users.fetch(userId);
          embedDescription += `${user.tag} -> \`${bday[0]}\`\n`;
        });
      });
    } else {
      embed.setTitle(`🎂 L'anniversaire de ${target.user.tag}`);
      birthdaysArray.forEach(bday => {
        bday[1].forEach(userId => {
          if(userId = target.id) {
            embedDescription = `**${target.user.username}** fête son anniversaire le \`${bday[0]}\``;
          }
        });
      });
    }
    console.log(embedDescription);
    embed.setDescription(embedDescription);
    return interaction.reply({ embeds: [embed] });
  }
}