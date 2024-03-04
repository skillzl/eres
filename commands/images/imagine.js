const Command = require('../../structures/CommandClass');

const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, SlashCommandBuilder } = require('discord.js');

const Replicate = require('replicate');

const models = [
	{
		name: 'Dreamshaper XL Turbo',
		value:
        'lucataco/dreamshaper-xl-turbo:0a1710e0187b01a255302738ca0158ff02a22f4638679533e111082f9dd1b615',
	},
	{
		name: 'OpenDALL-E (v1.1)',
		value:
        'lucataco/open-dalle-v1.1:1c7d4c8dec39c7306df7794b28419078cb9d18b9213ab1c21fdc46a1deca0144',
	},
	{
		name: 'fofr/sdxl-emoji (Memoji)',
		value: 'fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e',
	},
	{
		name: 'RealvisXL2 (LCM)',
		value: 'lucataco/realvisxl2-lcm:479633443fc6588e1e8ae764b79cdb3702d0c196e0cb2de6db39ce577383be77',
	},
	{
		name: 'SDXL-Lightning by ByteDance',
		value: 'lucataco/sdxl-lightning-4step:727e49a643e999d602a896c774a0658ffefea21465756a6ce24b7ea4165eba6a',
	},
];

module.exports = class Imagine extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('imagine')
				.setDescription('Generate an image using OpenAI')
				.addStringOption(o => o.setName('prompt').setDescription('What do you want to generate?').setRequired(true))
				.addStringOption(o => o.setName('model').setDescription('The model you want to choose').setRequired(true).setChoices(
					{
						name: 'Dreamshaper XL Turbo',
						value:
                        'lucataco/dreamshaper-xl-turbo:0a1710e0187b01a255302738ca0158ff02a22f4638679533e111082f9dd1b615',
					},
					{
						name: 'OpenDALL-E (v1.1)',
						value:
                        'lucataco/open-dalle-v1.1:1c7d4c8dec39c7306df7794b28419078cb9d18b9213ab1c21fdc46a1deca0144',
					},
					{
						name: 'fofr/sdxl-emoji (Memoji)',
						value: 'fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e',
					},
					{
						name: 'RealvisXL2 (LCM)',
						value: 'lucataco/realvisxl2-lcm:479633443fc6588e1e8ae764b79cdb3702d0c196e0cb2de6db39ce577383be77',
					},
					{
						name: 'SDXL-Lightning by ByteDance',
						value: 'lucataco/sdxl-lightning-4step:727e49a643e999d602a896c774a0658ffefea21465756a6ce24b7ea4165eba6a',
					})),
			usage: 'imagine <prompt> <model>',
			category: 'Images',
			permissions: ['Use Application Commands', 'Send Messages'],
		});
	}
	/**
 * Runs the function.
 *
 * @param {Client} client - The client object.
 * @param {Interaction} interaction - The interaction object.
 * @return {Promise<void>} - A promise that resolves when the function is finished.
 */
	async run(client, interaction) {
		try {
			await interaction.deferReply();

			const replicate = new Replicate({
				auth: process.env.REPLICATE_API_KEY,
			});

			const prompt = interaction.options.getString('prompt');
			const model = interaction.options.getString('model') || models[0].value;

			const output = await replicate.run(model, { input: { prompt } });

			const row = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setLabel('Download')
					.setStyle(ButtonStyle.Link)
					.setURL(`${output[0]}`),
			);

			const embed = new EmbedBuilder()
				.setTitle('Image Generated')
				.addFields({ name: 'Prompt', value: prompt })
				.setImage(output[0])
				.setColor(0x2B2D31);

			await interaction.editReply({ embeds: [embed], components: [row] });
		}
		catch (error) {
			const errEmbed = new EmbedBuilder()
				.setTitle('An error occurred')
				.setDescription('```' + error + '```')
				.setColor(0x2B2D31);

			interaction.editReply({ embeds: [errEmbed] });
		}
	}
};