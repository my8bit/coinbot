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

            var curr = $('#currency');
            var value = 0;
            curr.text(curr.text() + value);

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
                window.addEventListener("message", function(n) {
                    console.log(n);
                });
                TradingView.widget.prototype.render = function() {
                    var e = this.generateUrl();
                    var scriptContent = "document.addEventListener('DOMContentLoaded', function() { console.log(window); }, false)";
                    var script = '<script type="text/javascript" >' + scriptContent + '</script>';

                    return '<iframe id="' + this.id + '"' + ' src="' + e + '"' + (this.options.autosize ? ' style="width: 100%; height: 100%;"' : ' width="' + this.options.width + '"' + ' height="' + this.options.height + '"') + ' frameborder="0" allowTransparency="true" scrolling="no">' + script + '</iframe>'
                }
                window.tvChart = new TradingView.widget({
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
                console.log(tvChart);
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
     *
    var io = socketio();
    var socket = io.connect();

    // if we get an 'info' emit from the socket server then console.log the data we recive
    socket.on('info', function(data) {
        console.log(data);
    });

    socket.on('connect', function(data) {
        console.log('connected ' + data);
        //            socket.emit('fromClient', { msg: 'Emitted from client' });
    });

    function onload() {

        socket.on('toClient', function(data) {
            console.log(data);
        });
        socket.emit('fromClient', {
            msg: 'Emitted from client'
        });
        socket.on('updateCurrency', function(data) {
            //console.log(data);
            $('#currency').text('Currency is - ' + data.cur.ticker.last);
        });

    }

    $(onload);
*/
    //    return {};
});