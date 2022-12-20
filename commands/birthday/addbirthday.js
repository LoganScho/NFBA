const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'addbirthday',
  category: 'birthday',
  permissions: ['ADMINISTRATOR'],
  ownerOnly: false,
  usage: 'addbirthday [@member] [dd/mm]',
  examples: ['addbirthday @Sckoco 27/12'],
  description: 'Ajouter un anniversaire',
  options: [
    {
      name: 'target',
      description: "L'utilisateur dont on souhaite ajouter l'anniversaire",
      type: ApplicationCommandOptionType.User,
      required: true
    },
    {
      name: 'date',
      description: "La date de l'anniversaire",
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],
  async runInteraction(client, interaction) {
    const target = interaction.options.getMember('target');
    const date = interaction.options.getString('date');

    // TODO: Ajouter vérification des données

    await client.createBirthday(target, date);
    return interaction.reply(`Anniversaire de ${target.user.tag} ajouté au ${date}`);
  }
}