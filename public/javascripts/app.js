'use strict';

require.config({
    paths: {
        'jquery': 'jquery/dist/jquery.min',
        'bootstrap': 'bootstrap/dist/js/bootstrap.min',
        'socketio': '../socket.io/socket.io',
        'calculator': 'calculator/calculator',
        'manualTrade': 'manualTrade/manualTrade'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery']
        }
    }
});


requirejs([
    'jquery',
    'bootstrap',
    'socketio',
    'calculator',
    'manualTrade'
], function($, bootstrap, socketio, calculator, manualTrade) {
    //this is where all the site code should begin
    //var socket = socketio.connect(); 

    /*
     * Probably need to move on separate module
     * Some general UI
     */
    (function() {
        $(generalUI);

        function generalUI() {
            /*
            var manualTrade = $('.manualTrade');
            var calcInputs = $('.calcInputs');
            var autoRules = $('.autoRules');

            var toggleRulesButton = $('#toggleRules');
            var toggleManualBuyButton = $('#toggleManualBuy');
            var toggleCalculatorButton = $('#toggleCalculator');
            */

            setToggle($('#toggleManualBuy'), $('.manualTrade'));
            //setToggle($('#toggleCalculator'), $('.calcInputs'));
            setToggle($('#toggleRules'), $('.autoRules'));
            setToggle($('#toggleChart'), $('#embeddedChart'));
            setToggle($('#toggleInfo'), $('.infoContainer'));
            /*
            var curr = $('#currency');
            var value = 0;
            curr.text(curr.text() + value);
            */
            installWidget();
            /*
            ЕМА(С) = EMA(C-1)+((ЦЕНА(С)- ЕМА(С-1))*К). 
            теперь необходимо разобраться в этой формуле. 
            С – означает сегодняшний день. 
            С-1 – вчерашний день. 
            К=2/(Х+1), 
            где х – заданный период средней.
            */

            function installWidget() {

                /*CrossHair.prototype.setPosition = function(a, b, c) {
                    this._subscribed || (this._model.mainSeries().onRestarted().subscribe(this, CrossHair.prototype.clearMeasure), this._subscribed = !0);
                    this.index = a;
                    this.x = this._model.timeScale().indexToCoordinate(a);
                    c && !c.defaultPriceScale().isEmpty() ? (this.price = b, this.y = c.defaultPriceScale().priceToCoordinate(b), this.pane = c) : (this.y = this.price = NaN, this.pane = null);
                    this.visible = !0;
                    console.log(this.price);
                    this.updateAllViews()
                };*/
                //TODO CONFIGURE WIDGET

                /*window.tvChart = */
                new window.TradingView.widget({
                    'container_id': 'embeddedChart',
                    'width': 1140,
                    'height': 288,
                    'symbol': 'BTCE:LTCUSD',
                    //'watchlist': ['BTCE:LTCUSD'], //
                    'interval': '1',
                    'timezone': 'UTC',
                    'theme': 'White',
                    'style': '1',
                    //'hide_top_toolbar': true, //DEV
                    //'save_image': false, //
                    'toolbar_bg': '#f1f3f6',
                    'allow_symbol_change': true,
                    'hideideas': true,
                    'show_popup_button': true, // DEV
                    //'show_popup_button': false,
                    'popup_width': '1000',
                    'popup_height': '650'
                });
                //console.log(tvChart);
            }

            function setToggle(toggleButton, toggleTarget) {
                toggleButton.click(function() {
                    toggleTarget.slideToggle('slow');
                    var small = toggleButton.find('small.fa');
                    if (small.hasClass('fa-toggle-off')) {
                        small.removeClass('fa-toggle-off');
                        small.addClass('fa-toggle-on');
                    } else {
                        small.removeClass('fa-toggle-on');
                        small.addClass('fa-toggle-off');
                    }
                });
            }
        }

    })();

    calculator.init();
    manualTrade.init();


    /*
     * TURN OFF SOCKET WHILE FRONT-END
     */
    var io = socketio();
    var socket = io.connect();

    // if we get an 'info' emit from the socket server then console.log the data we recive
    socket.on('info', function(data) {
        console.log(data);
    });

    socket.on('connect', function(err, data) {
        console.log('connected ' + data);
        socket.emit('fromClient', {
            msg: 'Emitted from client'
        });
    });

    function onload() {
        socket.on('Server error', function(data) {
            console.error(data.error);
        });
        socket.on('toClient', function(data) {
            console.log(data);
        });
        socket.emit('fromClient', {
            msg: 'Emitted from client'
        });
        socket.on('updateCurrency', function(data) {
            //console.log(data);
            var price = data.cur.ticker.last.toFixed(3);
            $('#currency').text(price);
            console.log(data.cur.ticker);
            $('#percentageChange').text(getPercent(data.cur.ticker.high, data.cur.ticker.low).toFixed(3));
            $('#sellPrice').attr('placeholder', price);
            $('#buyPrice').attr('placeholder', price);

        });
        document.getElementById('buyButton').addEventListener('click', clickToBuyButton, false);
        $('#orderTable').on('click', '.cancelLinks', function() {
            //Fix this make more accurate
            $(this).parent().parent().fadeOut(2000).fadeIn(2000).fadeOut(2000).fadeIn(2000).fadeOut(2000).fadeIn(2000);
            console.log('Canceling order number ' + this.id);
            socket.emit('cancelOrderNo', {
                orderNumber: this.id
            });
        });
        socket.on('yourOrdersIs', function(data) {
            console.log(data);
        });

        socket.on('updateOrders', function(data) {
            console.log('This is orders above');
            console.log(data);
            updateTable(data);
            /*
"order_id":343154,
        "funds":{
            "usd":325,
            "btc":24.998,
            "ltc":0,
            ...
        }
            */
        });
    }

    function updateTable(data) {
        if (!data.data) {
            $('#orderTable').find('tr:not(.header)').remove();
            $('#orderTable').find('th').text('You don\'t have an orders.');
            //$('#orderTable').find('tr.header').append('<th>You don\'t have an orders.</th>');
        } else {
            /*
            th Pair
            th Type
            th Price
            th Amount
            th Total
            th Cancel
        */
            /*
{
    "data": {
        "386821124": {
            "pair": "ltc_usd",
            "type": "buy",
            "amount": 0.1,
            "rate": 2,
            "timestamp_created": 1411803718,
            "status": 0
        },
        "386821365": {
            "pair": "ltc_usd",
            "type": "buy",
            "amount": 0.1,
            "rate": 0.5,
            "timestamp_created": 1411803741,
            "status": 0
        }
    }
}
        */
            $('#orderTable').find('tr').remove();

            var arrayOfCells = [];
            var tr = document.createElement('tr');
            tr.className = 'header';
            tr.appendChild(createTh('Pair'));
            tr.appendChild(createTh('Type'));
            tr.appendChild(createTh('Price'));
            tr.appendChild(createTh('Amount'));
            tr.appendChild(createTh('Total'));
            tr.appendChild(createTh('Cancel'));
            arrayOfCells.push(tr);

            $.each(data.data, function(key) {
                var obj = data.data[key];
                var tr = document.createElement('tr');
                tr.appendChild(createTr(obj, 'pair'));
                tr.appendChild(createTr(obj, 'type'));
                tr.appendChild(createTr(obj, 'rate'));
                tr.appendChild(createTr(obj, 'amount'));
                var tdTotal = document.createElement('td');
                tdTotal.textContent = (obj.rate * obj.amount).toFixed(3);
                tr.appendChild(tdTotal);
                var tdCancel = document.createElement('td');
                var cancelLink = document.createElement('a');
                cancelLink.id = key;
                cancelLink.textContent = 'Cancel';
                cancelLink.href = '#';
                cancelLink.className = 'cancelLinks';
                tdCancel.appendChild(cancelLink);
                tr.appendChild(tdCancel);
                arrayOfCells.push(tr);
            });
            arrayOfCells.forEach(function(el) {
                $('#orderTable').append(el);
            });
        }

        function createTr(key, type) {
            var td = document.createElement('td');
            td.textContent = key[type];
            return td;
        }

        function createTh(tectContent) {
            var th = document.createElement('th');
            th.textContent = tectContent;
            return th;
        }
    }

    function clickToBuyButton() {
        /*socket.emit('giveMeActiveOrders', {
            msg: 'Emitted from client'
        });
        */
        var rate = $('#buyPrice').val();
        var amount = $('#buyAmount').val();
        rate = parseFloat(rate);
        amount = parseFloat(amount);
        if ((!isNaN(rate) && !isNaN(amount)) &&
            (typeof rate == 'number' && typeof amount == 'number')) {
            console.log(rate, amount);
            socket.emit('buyCoins', {
                rate: rate,
                amount: amount
            });
        } else {
            console.warn('Please specify both rate and amount.');
        }
    }

    function getPercent(oldValue, newValue) {
        return 100 - (oldValue / newValue) * 100;
    }
    $(onload);

    return {};
});