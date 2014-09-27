'use strict';

define('calculator', {
    init: function() {
        $(cashElements);
        $(addEventListeners);
        var buyInput, sellInput, priceInput,
            moneySpend, treshold;

        function cashElements() {
            buyInput = $('#buyPriceCalc');
            sellInput = $('#sellPriceCalc');
            priceInput = $('#priceCalc');
            moneySpend = $('#moneySpend');
            treshold = $('#treshold');
        }

        function addEventListeners() {
            $('.calcFields').on('keyup', update);
        }

        function update() {
            //TODO rounding values
            //TODO refactoring
            var marketFee = 0.002; //Fix hardcoded for btc-e
            var spend = parseFloat(buyInput.val()) * parseFloat(priceInput.val());
            var tresholdSum = parseFloat(priceInput.val()) + 2 * marketFee * parseFloat(priceInput.val());
            if ($.isNumeric(spend)) {
                moneySpend.text(spend);
                treshold.text(tresholdSum);
            }
            //priceInput
            //console.log('buy ' + parseInt(buyInput.val()));
            //console.log('sell ' + parseInt(priceInput.val()));

            //console.log(spend);
        }
        //console.log('inited');
    },
    getPercent: function(oldValue, newValue) {
        return 100 - (oldValue / newValue) * 100;
    }
});