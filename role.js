const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Add or remove a role from a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand(s => s.setName('add').setDescription('Add a role to a member')
      .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
      .addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true)))
    .addSubcommand(s => s.setName('remove').setDescription('Remove a role from a member')
      .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
      .addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true))),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const member = interaction.options.getMember('user');
    const role = interaction.options.getRole('role');

    if (!member) return interaction.reply({ embeds: [errorEmbed('User not found.')], ephemeral: true });
    if (role.position >= interaction.guild.members.me.roles.highest.position) {
      return interaction.reply({ embeds: [errorEmbed('I cannot manage this role (it is higher than my highest role).')], ephemeral: true });
    }

    try {
      if (sub === 'add') {
        if (member.roles.cache.has(role.id)) return interaction.reply({ embeds: [errorEmbed('User already has this role.')], ephemeral: true });
        await member.roles.add(role);
        await interaction.reply({ embeds: [successEmbed(`Added ${role} to ${member.user.tag}.`)] });
      } else {
        if (!member.roles.cache.has(role.id)) return interaction.reply({ embeds: [errorEmbed('User does not have this role.')], ephemeral: true });
        await member.roles.remove(role);
        await interaction.reply({ embeds: [successEmbed(`Removed ${role} from ${member.user.tag}.`)] });
      }
    } catch {
      await interaction.reply({ embeds: [errorEmbed('Failed to update role.')], ephemeral: true });
    }
  },
};
