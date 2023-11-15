const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '6402877699:AAE4gkptl-Eam4o8lo7Yuu-Lze-1Q6JpBcc';
const webAppUrl = 'https://ephemeral-kleicha-d732de.netlify.app';

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const groupId = '-1002081140106';


    if(text === '/start') {
        await bot.sendMessage(chatId,
            '👋 <b>Приветствуем, в нашем магазине Airvac</b>' +
            '\n\n🛒 Чтобы перейти в интернет-магазин пропишите команду - /shop',
            
            {
                parse_mode: 'HTML'
            })
    }

    if(text === '/shop') {
        await bot.sendMessage(chatId,
            'Чтобы открыть наш интернет-магазин нажмите кнопку ниже ⬇️',

            {
                parse_mode: 'HTML',
                reply_markup: {
                    keyboard: [
                        [{text: 'Магазин', web_app: {url: webAppUrl}}]
                    ],
                    resize_keyboard: true
                }
            })
    }


    if(msg?.web_app_data?.data) {
        const data = JSON.parse(msg?.web_app_data?.data)
        console.log(data)
        if (data?.deliveryMethod === 'delivery') {
            try {
                await bot.sendMessage(chatId,'✅ <b>Спасибо за покупку! Ваш заказ принят.</b>', {
                    parse_mode: 'HTML'
                });
                await bot.sendMessage(chatId,`
                    \n🛒 <b>Ваш заказ: </b>${data?.cartList.map(item => `\n${item.name} - (${item.count} шт.)`)}
                    \n📦 <b>Детали заказа: </b>\nИмя: ${data?.userName}\nТелефон: ${data?.userPhone?.value}\nАдрес доставки: ${data?.userStreet?.value}, ${data?.userAddress}\nСпособ доставки: ${data?.userDelivery?.value}
                    \n💰 <b>Сумма: </b>${data?.totalSum} руб
                `, {
                    parse_mode: 'HTML'
                });
                await bot.sendMessage(groupId,`✅ <b>Новый заказ на доставку от клиента ${data?.userName}</b>`, {
                    parse_mode: 'HTML'
                })
                await bot.sendMessage(groupId,`
                    \n🛒 <b>Заказ: </b>${data?.cartList.map(item => `\n${item.name} - (${item.count} шт.)`)}
                    \n📦 <b>Детали заказа: </b>\nИмя: ${data?.userName}\nТелефон: ${data?.userPhone?.value}\nАдрес доставки: ${data?.userStreet?.value}, ${data?.userAddress}\nСпособ доставки: ${data?.userDelivery?.value}
                    \n💰 <b>Сумма: </b>${data?.totalSum} руб
                `, {
                    parse_mode: 'HTML'
                });
                setTimeout( async () => {
                    await bot.sendMessage(chatId,'В ближайшее время наш менеджер свяжется с вами для подтверждения заказа');
                }, 3000)
            } catch (e) {
                console.log(e)
            }
        } else {
            try {
                await bot.sendMessage(chatId,'✅ <b>Спасибо за покупку! Ваш заказ принят.</b>', {
                    parse_mode: 'HTML'
                })
                await bot.sendMessage(chatId,`
                \n🛒 <b>Ваш заказ: </b>${data?.cartList.map(item => `\n${item.name} - (${item.count} шт.)`)}
                    \n📦 <b>Детали заказа: </b>\nИмя: ${data?.userName}\nТелефон: ${data?.userPhone.value}\nСамовывоз по адресу: Минск, Уручская, 23Б
                    \n💰 <b>Сумма: </b>${data?.totalSum} руб
                `, {
                    parse_mode: 'HTML'
                });
                await bot.sendMessage(groupId,`✅ <b>Новый заказ на самовывоз от клиента ${data?.userName}</b>`, {
                    parse_mode: 'HTML'
                })
                await bot.sendMessage(groupId,`
                \n🛒 <b>Заказ: </b>${data?.cartList.map(item => `\n${item.name} - (${item.count} шт.)`)}
                    \n📦 <b>Детали заказа: </b>\nИмя: ${data?.userName}\nТелефон: ${data?.userPhone.value}\nСамовывоз по адресу: Минск, Уручская, 23Б
                    \n💰 <b>Сумма: </b>${data?.totalSum} руб
                `, {
                    parse_mode: 'HTML'
                });
                setTimeout( async () => {
                    await bot.sendMessage(chatId,'В ближайшее время наш менеджер свяжется с вами для подтверждения заказа');
                }, 3000)
            } catch (e) {
                console.log(e)
            }
        }
    }
});
