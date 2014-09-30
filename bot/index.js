'use strict';

var bot = {},
    events = require('events'),
    botEvents = new events.EventEmitter,
    btceTrade = require('./../exchangeAuth').btceTrade,
    btcePublic = require('./../exchangeAuth').btcePublic;

bot.check = function(data) {
    //    console.log(data);
};

botEvents.on('change', function(data) {
    // body...
    console.log('Emited');
    console.log(data);
    //this.trade()

});

botEvents.on('buy', function(data) {
    // body...
    console.log('Bot bought');
    console.log(data);
    //this.trade()
});

botEvents.on('sell', function(data) {
    // body...
    console.log('Bot sold');
    console.log(data);
    //this.trade()
});


bot.start = function(coinsToPlay, ordersAmount, percent, timeToLive) {
    var amount = 0.1,
        me = this; //Fix hardcoded
    me.trade();
};

bot._lastPrice = 0;

bot.ticker = function() {
    btcePublic.ticker('ltc_usd', function(err, data) {
        if (err) console.log(err);
        if (data.ticker.last != bot._lastPrice) {
            bot._lastPrice = data.ticker.last;
            botEvents.emit('change', data.ticker.last);
        }
    });
};

//bot._interval = setInterval(bot.ticker, 5000);

bot.trade = function(pair, type, rate, amount) {
    btceTrade.trade('ltc_usd', type, rate, amount, function(err, data) {
        if (err) console.log(err);
        botEvents.emit(type, data);
        console.log('Bot was created the order No ' + data);
        console.log(data);
    });
};

bot.cancel = function(orderNumber) {
    btceTrade.cancelOrder(orderNumber, function(err, data) {
        if (err) console.log(err);
        if (data) {
            console.log('Bot was canceld the order No ' + orderNumber);
            console.log(data);
        }
    });
};

bot.getPriceToSellFromPercent = function(price, percent) {
    var btceFee = 0.002; //Fix hardcoded;
    return price * (percent / 100 + btceFee) + price;
};

module.exports = bot;