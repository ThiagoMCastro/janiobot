const Discord = require("discord.js");
const config = require("../../config.json");
module.exports.run = async (bot, message, args) => {
  if (!message.member) return;
  const user = message.mentions.users.first(); // returns the user object if an user mention exists
  const banReason = args.slice(1).join(" "); // Reason of the ban (Everything behind the mention)

  // Check if an user mention exists in this message
  if (!user) {
    try {
      // Check if a valid userID has been entered instead of a Discord user mention
      if (!message.guild.members.get(args.slice(0, 1).join(" ")))
        throw new Error("Couldn' get a Discord user with this userID!");
      // If the client (bot) can get a user with this userID, it overwrites the current user variable to the user object that the client fetched
      user = message.guild.members.get(args.slice(0, 1).join(" "));
      user = user.user;
    } catch (error) {
      return message.reply("Couldn' get a Discord user with this userID!");
    }
  }
  if (user === message.author)
    return message.channel.send("You can't ban yourself"); // Check if the user mention or the entered userID is the message author himsmelf
  if (!banReason)
    return message.reply("You forgot to enter a reason for this ban!"); // Check if a reason has been given by the message author
  if (!message.guild.member(user).bannable)
    return message.reply(
      "You can't ban this user because you the bot has not sufficient permissions!"
    ); // Check if the user is bannable with the bot's permissions

  await message.guild.ban(user); // Bans the user
  const banConfirmationEmbed = new Discord.RichEmbed()
    .setColor("RED")
    .setDescription(`✅ ${user.tag} foi banido com sucesso!!`);
  message.channel.send({
    embed: banConfirmationEmbed
  }); // Sends a confirmation embed that the user has been successfully banned

  const modlogChannelID = ""; // Discord channel ID where you want to have logged the details about the ban
  if (modlogChannelID.length !== 0) {
    if (!bot.channels.get(modlogChannelID)) return undefined; // Check if the modlogChannelID is a real Discord server channel that really exists

    const banConfirmationEmbedModlog = new Discord.RichEmbed()
      .setAuthor(
        `Banned by **${message.author.username}#${message.author.discriminator}**`,
        message.author.displayAvatarURL
      )
      .setThumbnail(user.displayAvatarURL)
      .setColor("RED")
      .setTimestamp().setDescription(`**Action**: Ban
**User**: ${user.username}#${user.discriminator} (${user.id})
**Reason**: ${banReason}`);
    bot.channels.get(modlogChannelID).send({
      embed: banConfirmationEmbedModlog
    }); // Sends the RichEmbed in the modlogchannel
  }
};

module.exports.help = {
  name: "ban",
  aliases: ["banir"],
  permission: "KICK_MEMBERS",
  category: "Moderação",
  description: "Bane esse merda",
  usage: "ban @user"
};
