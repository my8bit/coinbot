'use strict';

var bot = {},
    events = require('events'),
    _ = require('underscore'),
    Q = require('q'),
    botEvents = new events.EventEmitter,
    btceTrade = require('./../exchangeAuth').btceTrade,
    btcePublic = require('./../exchangeAuth').btcePublic;
var growl = require('growl');
//hardcoded values;
var PRICEPERCENT = 0.35,
    AMOUNT = 0.1;

bot.check = function(data) {
    //    console.log(data);
};

var logError = function(err) {
    if (err) {
        growl(err, {
            title: 'fail'
        });
        console.log(err);
        console.trace('trace');
        return true;
    } else {
        return false;
    }
};

botEvents.on('change', function(price) {
    console.log('Rate was changed');
    console.log(price);
    var priceToSell = bot.getPriceToSellFromPercent(bot._initPrice, PRICEPERCENT),
        priceToBuy = bot.getPriceToBuyFromPercent(bot._initPrice, PRICEPERCENT);

    console.log('priceToSell ' + priceToSell + ' and priceToBuy ' + priceToBuy);
    if (price > priceToSell) {
        console.log('Time to sell');
        /*        var newPriceToSell = bot.getPriceToSellFromPercent(price, PRICEPERCENT);
        bot.trade('ltc_usd', 'buy', price, AMOUNT).then(function() {
            bot.trade('ltc_usd', 'sell', newPriceToSell, AMOUNT);
        });
*/
        bot._initPrice = price;
        return;
    } else if (price < priceToBuy) {
        console.log('Time to buy');
        bot.trade('ltc_usd', 'buy', priceToBuy, AMOUNT).then(function() {
            bot.trade('ltc_usd', 'sell', priceToSell, AMOUNT);
        });
        bot._initPrice = price;
    }
});

botEvents.on('buy', function(data) {
    // body...
    console.log('Bot bought');
    console.log(data);
    growl(data, {
        title: 'Bot bought'
    });

    //this.trade()
});

botEvents.on('sell', function(data) {
    console.log('Bot sold');
    console.log(data);
    growl(data, {
        title: 'Bot sold'
    });
});

bot._orders = [];

bot.trade = function(pair, type, rate, amount, ttl) {
    var deferred = Q.defer();
    btceTrade.trade('ltc_usd', type, rate, amount, function(err, data) {
        if (logError(err)) return;
        console.log('Bot was created the order No ' + data.order_id);
        bot._orders.push(data.order_id);
        botEvents.emit(type, data);
        deferred.resolve();
    });
    return deferred.promise;
};

bot.start = function(coinsToPlay, type, rate, ordersAmount, percent, timeToLive) {
    var amount = 0.1,
        me = this; //Fix hardcoded
    me.trade('ltc_usd', type, rate, amount, percent, 60000);
};

//bot.start();

bot._lastPrice = 0;
bot._initPrice = false;

bot.ticker = function(data) {
    btcePublic.ticker('ltc_usd', function(err, data) {
        if (logError(err)) return;
        if (data) {
            var last = data.ticker.last;
            if (!bot._initPrice) bot._initPrice = last;
            if (last !== bot._lastPrice) {
                bot._lastPrice = last;
                botEvents.emit('change', last);
            }
        }
    });
};

bot.init = function() {
    //initPrice();
    //setTimeout(initOredrs, 2000);
    bot._interval = setInterval(bot.ticker, 5000);
};

/*function initPrice() {
    btcePublic.ticker('ltc_usd', function(err, data) {
        if (logError(err)) return;
        bot._lastPrice = data.ticker.last;
        bot._initPrice = data.ticker.last;
        console.log('Price value was inited');
    });
};


function initOredrs() {
    btceTrade.activeOrders('ltc_usd', function(err, data) {
        if (logError(err)) return;
        bot._orders = _.keys(data);
        console.log('Orders value was inited.')
    });
};
*/
//bot._interval = setInterval(bot.ticker, 5000);


bot.cancel = function(orderNumber) {
    btceTrade.cancelOrder(orderNumber, function(err, data) {
        if (err) console.log(err);
        if (data) {
            console.log('Bot was canceld the order No ' + orderNumber);
            console.log(data);
        }
    });
};

bot._orders = [];

bot.getOrders = function() {
    btceTrade.activeOrders('ltc_usd', function(err, data) {
        if (logError(err)) return;
        //if (data) console.log(data);
        var keys = _.keys(data);
        console.log(keys);
        console.log(bot._orders);
        var diff = _.difference(keys, bot._orders);
        if (diff.length) {
            console.log('different');
        }
        bot._orders = keys;
    });
};

/*
{
  '390863171': 
   { pair: 'ltc_usd',
     type: 'buy',
     amount: 0.1,
     rate: 0.123,
     timestamp_created: 1412075809,
     status: 0 },
  '390863474': 
   { pair: 'ltc_usd',
     type: 'buy',
     amount: 0.1,
     rate: 0.123,
     timestamp_created: 1412075827,
     status: 0 },
  '390863644': 
   { pair: 'ltc_usd',
     type: 'buy',
     amount: 0.1,
     rate: 0.321,
     timestamp_created: 1412075843,
     status: 0 }
}
*/

//bot.getOrders();

//setInterval(bot.getOrders, 3000); //TMP

bot.getPriceToSellFromPercent = function(price, percent) {
    var btceFee = 0.002; //Fix hardcoded;
    return (price + price * (percent / 100 + btceFee)).toFixed(6) * 1;
};
bot.getPriceToBuyFromPercent = function(price, percent) {
    var btceFee = 0.002; //Fix hardcoded;
    return (price - price * (percent / 100 + btceFee)).toFixed(6) * 1;
};
/*
{ '390749346': 
   { pair: 'ltc_usd',
     type: 'buy',
     amount: 0.1,
     rate: 0.2,
     timestamp_created: 1412067352,
     status: 0 } }
*/
bot.init();
//bot.ticker();
//setInterval(bot.ticker, 10000);
module.exports = bot;


/*
var orders = {};
orders._store = [];
orders.set = function(id) {
    var me = this;
    this._store.push(id);
    setTimeout(function() {
        me.cancel(id);
    }, 360000);
}
orders.cancel = function(id) {
    var me = this;
    btceTrade.cancelOrder(id, function(err, data) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(data);
        if (me._store.indexOf(id) + 1) {
            me._store.splice(me._store.indexOf(id), 1);
        }
    });
    
}


*/