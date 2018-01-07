var price = {};
var difficulty = {}; 
$(window).on("load", function(){
    $.post("/diff").done(function (response) {
        difficulty.btc = response.difficulty;
        console.log(difficulty);
    });

    $.post("/price").done(function (response) {
        price.btc = response.valueBTC;
        price.eth = response.valueETH;
        price.ltc = response.valueLTC;
        console.log(price);
    });
});