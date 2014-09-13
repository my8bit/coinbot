'use strict';

define('calculator', {
    init: function() {
        $(cashElements);
        $(addEventListeners);
        var buyInput, sellInput, priceInput,
            moneySpend;

        function cashElements() {
            buyInput = $('#buyPriceCalc');
            sellInput = $('#sellPriceCalc');
            priceInput = $('#priceCalc');
            moneySpend = $('#moneySpend');
        }

        function addEventListeners() {
            $('.calcFields').on('keyup', update);
        }

        function update() {
            var spend = parseInt(buyInput.val()) * parseInt(priceInput.val());
            if ($.isNumeric(spend)) moneySpend.text(spend);
            //console.log('buy ' + parseInt(buyInput.val()));
            //console.log('sell ' + parseInt(priceInput.val()));

            //console.log(spend);
        }
        //console.log('inited');
    }
});