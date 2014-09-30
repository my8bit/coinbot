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
    // Fix Probably need to move on separate module
    (function() {
        $(generalUI);

        function generalUI() {
            setToggle($('#toggleManualBuy'), $('.manualTrade'));
            setToggle($('#toggleRules'), $('.autoRules'));
            setToggle($('#toggleChart'), $('#embeddedChart'));
            setToggle($('#toggleInfo'), $('.infoContainer'));
            installWidget();

            function installWidget() {
                //TODO CONFIGURE WIDGET
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
        /*
        socket.emit('fromClient', {
            msg: 'Emitted from client'
        });
        */
        socket.on('updateCurrency', function(data) {
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
        });
    }

    function createHeader() {
        var tr = $('#ordersTable');
        if (tr.length) return tr;
        tr = document.createElement('tr');
        tr.className = 'header';
        tr.id = 'ordersTable';
        tr.appendChild(createTh('Pair'));
        tr.appendChild(createTh('Type'));
        tr.appendChild(createTh('Price'));
        tr.appendChild(createTh('Amount'));
        tr.appendChild(createTh('Total'));
        tr.appendChild(createTh('Cancel'));
        return tr;
    };

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

    function updateTable(data) {
        $('#orderTable').find('tr').remove();
        if (!data.data) {
            $('#orderTable').append(createHeader());
            //$('#orderTable').append('<tr><td>You don\'t have an active orders</td></tr>');
        } else {
            var arrayOfCells = [];
            arrayOfCells.push(createHeader());

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
    }

    function clickToBuyButton() {
        //Fix make inacteve for 2 sec
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