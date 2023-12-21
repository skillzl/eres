const Event = require('../../structures/EventClass');
const db = require('../../database/manager');
const { MessageAttachment, MessageMentions, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class MessageCreate extends Event {
  constructor(client) {
    super(client, {
      name: 'messageCreate',
      category: 'message',
    });
  }

  async run(message) {
    if (!message.author.bot) {
      const { user } = await db.getUserById(message.author.id);
      const xp = Math.ceil(Math.random() * (1 * 5));

      const calculateUserXp = (xp) => Math.floor(0.1 * Math.sqrt(xp));

      const oldLevel = calculateUserXp(user.xp || 0);
      const newLevel = calculateUserXp((user.xp || 0) + xp);

      if (newLevel > oldLevel) {
        const canvas = createCanvas(1026, 285);
        const ctx = canvas.getContext('2d');

        // Load a background
        const background = await loadImage(path.join('./assets/canva/level-up-background.png'));

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.font = '30px sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(`Congratulations, ${message.author.username}!`, canvas.width / 2, canvas.height / 2);

        ctx.fillText(`Level Up: ${oldLevel} --> ${newLevel}`, canvas.width / 2, canvas.height / 2 + 40);

        const buffer = canvas.toBuffer(); 

        const attachment = new AttachmentBuilder(buffer, 'levelup.png');

        await message.channel.send({
          content: `Congratulations, ${message.author.username}! \n\nLevel Up: ${oldLevel} --> ${newLevel}`,
          files: [attachment],
        });

        await db.updateUserById(message.author.id, { xp: user.xp + xp });
      }
    }
  }
};
