const {REST, Routes} = require('discord.js');
const fs = require('fs');
const { Client, GatewayIntentBits, PermissionsBitField, ChannelType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageCollector } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
let config = require('./Config/config.json');
/*{
    // console.log(interaction.options.get('number').value); // вывод второво параметка который передаёт пользователь
}*/

function CreateEmbedBuilder()
{
    const message = new EmbedBuilder()
        .setColor('#FA747D')
        .setTitle("Тикеты")
        .setAuthor({name: 'Поддержка'})
        .setTitle('Создайте тикет для связи с администрацией')
        .setDescription(`Для этого кликните на кнопку под сообщением`)
    return message;
}

function CreateButtons()
{
    const button_1 = new ButtonBuilder()
        .setCustomId('createticket')
        .setLabel("создать тикет")
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🖊️')
    return button_1;
}

function checkRole(interaction) 
{
    for (let i = 0; i <= interaction.member._roles.length; i++) {
        for (let j = 0; j < config.roleImmunityId.length; j++) {
            if (interaction.member._roles[i] == config.roleImmunityId[j]) {
                return 1;
            }
        }
    }
    return 0;
}

const commands = [
    {
        name: 'ticket',
        description: 'Создать тикерт',
        description_localizations: {'ru': "Создать тикерт", 'en-US': "Создать тикерт"},
    }
];

const rest = new REST({ version: '10' }).setToken(config.Token);

(async () => {
    try {
        console.log('Начал обновлять команды приложения (/).');
        await rest.put(Routes.applicationCommands(config.id_bot), { body: commands });
        console.log('Успешно перезагружено приложение (/) команды.');
        setTimeout(() => {
            const channel = client.channels.cache.get("1056178099127058442");
            const message = CreateEmbedBuilder();
            const button_1 = CreateButtons();
            channel.send({embeds: [message], components: [new ActionRowBuilder().addComponents(button_1)], ephemeral: true});
        }, 15000);

        // setTimeout(PizdaHuy(), 15000);
        
    } catch (error) {
      console.error(error);
    }
})();

client.on('ready', async () => {
    console.log(`Бот авторизировался как ${client.user.tag}!`);
});


client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    // console.log('Dvij');
    // console.log(interaction);

    const guild = client.guilds.cache.get(config.Guild_id);
    const channel_ru = guild.channels.cache.get(config.channel_ru_ticket_id);
    try {
        if(checkRole(interaction)){
            if (interaction.commandName === 'ticket') {
                // const message = new EmbedBuilder()
                //     .setColor('#FA747D')
                //     .setTitle("Тикеты")
                //     .setAuthor({name: 'Поддержка'})
                //     .setTitle('Создайте тикет для связи с администрацией')
                //     .setDescription(`
                //         Для этого кликните на кнопку под сообщением
                //     `)

                // const button_1 = new ButtonBuilder()
                //     .setCustomId('createticket')
                //     .setLabel("создать тикет")
                //     .setStyle(ButtonStyle.Danger)
                //     .setEmoji('📥')
                const message = CreateEmbedBuilder();
                const button_1 = CreateButtons();
                interaction.reply({embeds: [message], components: [new ActionRowBuilder().addComponents(button_1)], ephemeral: true});

            }
        }else{
            await interaction.reply({content: `У вас нету доступа к этой команде!`, ephemeral: true});
        }

        if (!interaction.isButton()) {
            const filter = i => i.customId === 'createticket' && i.customId === 'closeticket';

            const collector = interaction.channel.createMessageComponentCollector({filter});

            collector.on('collect', async i => {
                if (i.customId === 'createticket') {
                    let Buffery = config.count_ticket;
                    while(Buffery.toString().length < 4)
                    {
                        Buffery = '0' + Buffery;
                    }

                    guild.channels.create({
                        name: `Тикет-#${Buffery}`,
                        type: ChannelType.GuildText,
                        permissionOverwrites: [
                            {
                                id: guild.roles.everyone,
                                deny: [
                                    PermissionsBitField['Flags'].ManageChannels,
                                    PermissionsBitField['Flags'].CreateInstantInvite,
                                    PermissionsBitField['Flags'].ChangeNickname,
                                    PermissionsBitField['Flags'].SendTTSMessages,
                                    PermissionsBitField['Flags'].SendMessagesInThreads,
                                    PermissionsBitField['Flags'].UseApplicationCommands,
                                    PermissionsBitField['Flags'].SendMessages,
                                    PermissionsBitField['Flags'].ReadMessageHistory,
                                    PermissionsBitField['Flags'].ViewChannel,
                                    PermissionsBitField['Flags'].MentionEveryone
                                ]
                            },
                            {
                                id: i.user.id,
                                allow: [
                                    PermissionsBitField['Flags'].UseApplicationCommands,
                                    PermissionsBitField['Flags'].SendMessages,
                                    PermissionsBitField['Flags'].ReadMessageHistory,
                                    PermissionsBitField['Flags'].ViewChannel
                                ],
                                deny: [
                                    PermissionsBitField['Flags'].ManageChannels,
                                    PermissionsBitField['Flags'].CreateInstantInvite,
                                    PermissionsBitField['Flags'].ChangeNickname,
                                    PermissionsBitField['Flags'].SendTTSMessages,
                                    PermissionsBitField['Flags'].SendMessagesInThreads,
                                    PermissionsBitField['Flags'].MentionEveryone
                                ]
                            },
                            {
                                id: config.id_bot,
                                allow: [
                                    PermissionsBitField['Flags'].ViewChannel,
                                    PermissionsBitField['Flags'].ReadMessageHistory,
                                    PermissionsBitField['Flags'].SendMessages
                                ]
                            },
                            {
                                id: guild.roles.cache.get(config.ticket_admin_ru).id,
                                allow: [
                                    PermissionsBitField['Flags'].ViewChannel,
                                    PermissionsBitField['Flags'].ReadMessageHistory,
                                    PermissionsBitField['Flags'].SendMessages
                                ],
                                deny: [
                                    PermissionsBitField['Flags'].CreateInstantInvite,
                                    PermissionsBitField['Flags'].ChangeNickname,
                                    PermissionsBitField['Flags'].MentionEveryone
                                ]
                            }
                        ],
                        parent: client.channels.cache.find(ct => ct.name.startsWith("тест категория")).id,
                      })
                      .then(new_channel => {
                        i.reply({content: `Ваш чат ${new_channel.name} создан`, ephemeral: true})
                        config.count_ticket++;
                        Rewriting(config);


                        const message = new EmbedBuilder()
                        .setColor('#FA747D')
                        .setTitle("Тикеты")
                        .setAuthor({name: 'Поддержка'})
                        .setTitle('Закрыть тикет')
                        .setDescription(`Нажмите на кнопку чтобы закрыть тикет`)

                        const button_2 = new ButtonBuilder()
                            .setCustomId('closeticket')
                            .setLabel("закрыть тикет")
                            .setStyle(ButtonStyle.Success)
                            .setEmoji('❌')

                        new_channel.send({embeds: [message], components: [new ActionRowBuilder().addComponents(button_2)]});
                        
                      })
                      .catch(console.error);
                } else if (i.customId === 'closeticket') {
                    console.log('закрыл тикет');
                }
            })


        }
    } catch (error) {
        console.error(error);
    }
    
});

client.login(config.Token);

function Rewriting(newJson)
{
    fs.writeFileSync('./Config/config.json', JSON.stringify(newJson));
}