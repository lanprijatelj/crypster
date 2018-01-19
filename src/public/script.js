var price = {};
var difficulty = {};
var userInput = {};
var results = {};

function calculateMiningProfit(input) {
    if (input.hashrateUnit == "TH/s") {
        var hashrate = input.hashrate * Math.pow(10, 12);
    } else if (input.hashrateUnit == "GH/s") {
        var hashrate = input.hashrate * Math.pow(10, 9);
    } else {
        var hashrate = input.hashrate * Math.pow(10, 6);
    }
    return (hashrate * (1 - (input.fee / 100)) * (1 - (input.reject / 100)) * input.reward / (Math.pow(2, 32) * input.diff)) * input.value;
}

$(window).on("load", function () {    
    userInput.selectedCurrency = $("select[name=currency]").val();

    $.post("/diffBTC").done(function (response) {
        difficulty.btc = response.difficultyBTC;
        //console.log(difficulty);
        $("#diff").val(difficulty.btc);
    });

    $.post("/diffETH").done(function (response) {
        difficulty.eth = response.difficultyETH[0].difficulty;
        //console.log(difficulty);        
    });

    $.post("/diffLTC").done(function (response) {
        difficulty.ltc = response.difficultyLTC;
        //console.log(difficulty);       
    });

    $.post("/price").done(function (response) {
        price.btc = response.valueBTC;
        price.eth = response.valueETH;
        price.ltc = response.valueLTC;
        //console.log(price);
        if (userInput.selectedCurrency == "BTC") {
            $("#value").val(price.btc);
        } else if (userInput.selectedCurrency == "ETH") {
            $("#value").val(price.eth);
        } else {
            $("#value").val(price.ltc);
        }
    });
});

$("select[name=currency]").change(function () {
    userInput.selectedCurrency = $("select[name=currency]").val();
    if (userInput.selectedCurrency == "BTC") {
        $("#valuta").text("BTC");
        $("#value").val(price.btc);
        $("#diff").val(difficulty.btc);
        $("#hashRateUnit").val("TH/s");
    } else if (userInput.selectedCurrency == "ETH") {
        $("#valuta").text("ETH");
        $("#value").val(price.eth);
        $("#diff").val(difficulty.eth);
        $("#hashRateUnit").val("GH/s");
    } else {
        $("#valuta").text("LTC");
        $("#value").val(price.ltc);
        $("#diff").val(difficulty.ltc);
        $("#hashRateUnit").val("MH/s");
    }
});

$("#calcMain").change(sendParameters);
$("input[name=hashrate]").keyup(sendParameters);

function sendParameters() {
    userInput.hashrate = $("input[name=hashrate]").val();
    userInput.fee = $("input[name=fee]").val();
    userInput.reject = $("input[name=reject]").val();
    userInput.reward = $("input[name=reward]").val();
    userInput.diff = $("input[name=diff]").val();
    userInput.value = $("input[name=value]").val();
    userInput.hashrateUnit = $("select[name=hashrateUnit]").val();
    userInput.power = $("input[name=power]").val();
    userInput.powerCost = $("input[name=powerCost]").val();
    var hourlyCost = userInput.power * userInput.powerCost / 1000;

    results.miningProfitS = calculateMiningProfit(userInput);
    //results.btcMined = results.miningProfitS / userInput.value;
    results.miningProfitH = results.miningProfitS * 3600;
    results.miningProfitD = results.miningProfitS * 86400;
    results.miningProfitW = results.miningProfitD * 7;
    results.miningProfitM = results.miningProfitD * 30;
    results.miningProfitY = results.miningProfitM * 12;

    $(".h :nth-child(2)").html((results.miningProfitH / userInput.value).toFixed(7));
    $(".h :nth-child(3)").html((results.miningProfitH).toFixed(2));
    $(".h :nth-child(4)").html((hourlyCost).toFixed(2));
    $(".h :nth-child(5)").html((results.miningProfitH - hourlyCost).toFixed(2));
    $(".d :nth-child(2)").html((results.miningProfitD / userInput.value).toFixed(2));
    $(".d :nth-child(3)").html((results.miningProfitD).toFixed(2));
    $(".d :nth-child(4)").html((hourlyCost * 24).toFixed(2));
    $(".d :nth-child(5)").html((results.miningProfitD - (hourlyCost * 24)).toFixed(2));
    $(".w :nth-child(2)").html((results.miningProfitW / userInput.value).toFixed(2));
    $(".w :nth-child(3)").html((results.miningProfitW).toFixed(2));
    $(".w :nth-child(4)").html((hourlyCost * 168).toFixed(2));
    $(".w :nth-child(5)").html((results.miningProfitW - (hourlyCost * 168)).toFixed(2));
    $(".m :nth-child(2)").html((results.miningProfitM / userInput.value).toFixed(2));
    $(".m :nth-child(3)").html((results.miningProfitM).toFixed(2));
    $(".m :nth-child(4)").html((hourlyCost * 720).toFixed(2));
    $(".m :nth-child(5)").html((results.miningProfitM - (hourlyCost * 720)).toFixed(2));
    $(".y :nth-child(2)").html((results.miningProfitY / userInput.value).toFixed(2));
    $(".y :nth-child(3)").html((results.miningProfitY).toFixed(2));
    $(".y :nth-child(4)").html((hourlyCost * 8760).toFixed(2));
    $(".y :nth-child(5)").html((results.miningProfitY - (hourlyCost * 8760)).toFixed(2));
    //console.log(results.miningProfitS);
}