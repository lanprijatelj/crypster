var price = {};
var difficulty = {}; 
var selectedCurrency = "";

$(window).on("load", function(){
    selectedCurrency = $("select[name=currency]").val();
    $.post("/diff").done(function (response) {
        difficulty.btc = response.difficulty;
        console.log(difficulty);
        $("#diff").val(difficulty.btc);
    });

    $.post("/price").done(function (response) {
        price.btc = response.valueBTC;
        price.eth = response.valueETH;
        price.ltc = response.valueLTC;
        console.log(price);
        if(selectedCurrency == "BTC"){
            $("#value").val(price.btc);
        }else if(selectedCurrency == "ETH"){
            $("#value").val(price.eth);
        }else{
            $("#value").val(price.ltc);
        }
    });
});

$("select[name=currency]").change(function(){
    selectedCurrency = $("select[name=currency]").val();
    if(selectedCurrency == "BTC"){
        $("#value").val(price.btc);
        $("#hashRateUnit").val("TH/s");
    }else if(selectedCurrency == "ETH"){
        $("#value").val(price.eth);
        $("#hashRateUnit").val("GH/s");
    }else{
        $("#value").val(price.ltc);
        $("#hashRateUnit").val("MH/s");
    }    
});