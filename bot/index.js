'use strict';

var bot = {},
    events = require('events'),
    _ = require('underscore'),
    botEvents = new events.EventEmitter,
    btceTrade = require('./../exchangeAuth').btceTrade,
    btcePublic = require('./../exchangeAuth').btcePublic;

bot.check = function(data) {
    //    console.log(data);
};

var logError = function(err) {
    if (err) {
        console.log(err);
        return true;
    } else {
        return false;
    }
};

botEvents.on('change', function(price) {
    // body...
    console.log('Emited');
    console.log(price);
    bot.getOrders();
    //bot.trade('ltc_usd', 'buy', bot.getPriceToBuyFromPercent(price, 0.25), 0.1);
});

botEvents.on('buy', function(data) {
    // body...
    console.log('Bot bought');
    console.log(data);

    //this.trade()
});

botEvents.on('sell', function(data) {
    console.log('Bot sold');
    console.log(data);
});

bot._orders = [];

bot.trade = function(pair, type, rate, amount, ttl) {
    btceTrade.trade('ltc_usd', type, rate, amount, function(err, data) {
        if (logError(err)) return;
        console.log('Bot was created the order No ' + data.order_id);
        bot._orders.push(data.order_id);
        botEvents.emit(type, data);
    });
};

bot.start = function(coinsToPlay, type, rate, ordersAmount, percent, timeToLive) {
    var amount = 0.1,
        me = this; //Fix hardcoded
    me.trade('ltc_usd', type, rate, amount, percent, 60000);
};

//bot.start();

bot._lastPrice = 0;

bot.ticker = function() {
    btcePublic.ticker('ltc_usd', function(err, data) {
        if (logError(err)) return;
        if (data.ticker.last !== bot._lastPrice) {
            bot._lastPrice = data.ticker.last;
            botEvents.emit('change', data.ticker.last);
        }
    });
};

bot.init = function() {
    initPrice();
    setTimeout(initOredrs, 2000);
    bot._interval = setInterval(bot.ticker, 5000);

};

function initPrice() {
    btcePublic.ticker('ltc_usd', function(err, data) {
        if (logError(err)) return;
        bot._lastPrice = data.ticker.last;
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
/*btceTrade.tradeHistory({}, function(err, data) {
    console.log("history");
    console.log(data);
});
*/

/*btceTrade.orderList({}, function(err, data) {
    console.log("OrderInfo");
    console.log(data);
});
*/
/*
btceTrade.orderInfo({
    order_id: 390800720
}, function(err, data) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("OrderInfo");
    console.log(data);
});
*/

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
        //console.log(diff);
        /*
        if (diff.length) {
            //           console.log();
        } else {
            //         console.log();
        }
        */
        /*        botEvents.emit('updateOrders', {
            data: data
        });
        if (bot._orders !== data) {
            bot._orders = data;
        }
        */
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