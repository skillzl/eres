/* eslint-disable no-inline-comments */
module.exports = (client) => {
/**
 * This function initializes the client's emoji dictionary.
 * Each emoji is assigned a specific key for easy access.
 */
	client.emoji = async () => {
		// Define the emoji dictionary
		client.emoji = {
			red_emoji: '<:red_emoji:1126936340022435963>', // Red emoji
			green_emoji: '<:green_emoji:1126936345043030026>', // Green emoji

			clock: '⏱', // Clock emoji
			heartbeat: '💓', // Heartbeat emoji

			balance: '<:balance_emoji:1129875960188112966>', // Balance emoji
			star: '<:star_emoji:1126279940321574913>', // Star emoji
			ticket: '<:ticket_emoji:1170117538433212538>', // Ticket emoji
			music: '<:music_emoji:1188172803934011442>', // Music emoji
			moon: '<:moon_emoji:1139513847238119425>', // Moon emoji
			mail: '<:mail_emoji:1170364505616826398>', // Mail emoji
			verify: '<:verify_emoji:1139514506884681850>', // Verify emoji
			partnered: '<:partner_emoji:1139514892320251905>', // Partnered emoji
			crown: '<:owner_emoji:1139506434707574874>', // Crown emoji

			staff_emoji: '<:staff_badge:1139567579371946064>', // Staff badge emoji
			partnered_badge: '<:partner_badge:1139567761287282698>', // Partner badge emoji
			hypesquad: '<:hypesquad_badge:1139568237764427806>', // Hypesquad badge emoji
			hunter_one: '<:bughunter_level1_badge:1139571311534931978>', // Hunter level 1 badge emoji
			hunter_two: '<:bughunter_level2_badge:1139571316542947468>', // Hunter level 2 badge emoji
			hypesquad_house_one: '<:house1_badge:1139571326621843496>', // Hypesquad house 1 badge emoji
			hypesquad_house_two: '<:house2_badge:1139571331671793685>', // Hypesquad house 2 badge emoji
			hypesquad_house_tree: '<:house3_badge:1139571337136963695>', // Hypesquad house 3 badge emoji
			early_supporter: '<:early_supporter_badge:1139571489671229631>', // Early supporter badge emoji
			discord_system: '<:system_badge:1139571345039036487>', // Discord system badge emoji
			verified_bot: '<:verified_bot_badge:1139571349262696509>', // Verified bot badge emoji
			verified_developer: '<:verified_developer_badge:1139571354325237790>', // Verified developer badge emoji
			certified_moderator: '<:certified_moderator_badge:1139571322368835685>', // Certified moderator badge emoji
			active_developer: '<:active_developer_badge:1139571306313039872>', // Active developer badge emoji

			flag_emoji: '<:flag_emoji:1129876196549738626>', // Flag emoji
			gheart: '<:gheart_emoji:1129876399134625902>', // Green heart emoji
			heart: '<:heart_emoji:1129876126047670403>', // Heart emoji
			seven: '<:seven_emoji:1129876077041422356>', // Seven emoji
			skull: '<:skull_emoji:1129876004748411041>', // Skull emoji
			snowman: '<:snowman_emoji:1129876037493334017>', // Snowman emoji
		};
	};
};