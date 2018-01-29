var price = {};
var difficulty = {};
var userInput = {};
var results = {};

function calculateCoinsMinedBTC(input) {
    if (input.hashrateUnit == "TH/s") {
        var hashrate = input.hashrate * Math.pow(10, 12);
    } else if (input.hashrateUnit == "GH/s") {
        var hashrate = input.hashrate * Math.pow(10, 9);
    } else {
        var hashrate = input.hashrate * Math.pow(10, 6);
    }
    return (hashrate * (1 - (input.fee / 100)) * (1 - (input.reject / 100)) * input.reward / (Math.pow(2, 32) * input.diff));
}

function calculateCoinsMinedETH(input) {
    if (input.hashrateUnit == "TH/s") {
        var factor = 1;
        var hashrate = input.hashrate * Math.pow(10, 6);
    } else if (input.hashrateUnit == "GH/s") {
        var factor = 1000;
        var hashrate = input.hashrate * Math.pow(10, 3);
    } else {
        var factor = 1000000;
        var hashrate = input.hashrate;
    }
    console.log(hashrate);
    return ((hashrate * factor / ((input.diff / Math.pow(10, 12)) / 14.8 * Math.pow(10, 12))) * ((60 / 14.8) * input.reward)) * (1 - (input.fee / 100)) * (1 - (input.reject / 100)) / 60;
}

function calculateCoinsMinedLTC(input) {
    if (input.hashrateUnit == "TH/s") {
        var hashrate = input.hashrate * Math.pow(10, 9);
    } else if (input.hashrateUnit == "GH/s") {
        var hashrate = input.hashrate * Math.pow(10, 6);
    } else {
        var hashrate = input.hashrate * Math.pow(10, 3);
    }
    return (input.reward * hashrate) / (49.7 * input.diff) / 86400;
}

function calculateProfitPerTimeFrame(miningProfit, diffChange, timeFrame) {
    var profit = {};
    profit.miningProfitH = (miningProfit * 3600);
    profit.miningProfitD = (miningProfit * 86400);
    profit.miningProfitW = (miningProfit * 604800);
    profit.miningProfitM = (miningProfit * 2628000);
    profit.year = 0;
    profit.miningProfitY = [];
    for (var i = 0; i <= timeFrame; i++) {
        if (i == 0) {
            profit.miningProfitY[i] = 0;
        }
        else if (i == 1) {
            profit.miningProfitY[i] = profit.miningProfitM;
            profit.year += profit.miningProfitY[i];
        } else {
            profit.miningProfitY[i] = profit.miningProfitY[i - 1] * (1 - (diffChange / 100));
            if (i < 13) {
                profit.year += profit.miningProfitY[i];
            }
        }

    }
    return profit;
}

function calculateCosts(hourlyCost) {
    var cost = {};
    cost.H = hourlyCost;
    cost.D = hourlyCost * 24;
    cost.W = hourlyCost * 168;
    cost.M = hourlyCost * 730;
    cost.Y = hourlyCost * 8760;
    return cost;
}

function calculateNetProfit(costs, profits, timeFrame, value, valueChange) {
    var net = {};
    net.h = (profits.miningProfitH * value) - costs.H;
    net.d = (profits.miningProfitD * value) - costs.D;
    net.w = (profits.miningProfitW * value) - costs.W;
    net.m = (profits.miningProfitM * value) - costs.M;
    net.y = [];
    net.year = 0;
    for (var i = 0; i <= timeFrame; i++) {
        if (i == 0) {
            net.y[i] = 0;
        } else {
            value = value * (1 + (valueChange / 100));
            net.y[i] = profits.miningProfitY[i] * value - costs.M;
            if (i < 13) {
                net.year += net.y[i];
            }
        }

    }
    return net;
}

function calculateROI(net, investment, timeFrame) {
    var roi = [];
    for (var i = 0; i <= timeFrame; i++) {
        if (i == 0) {
            roi[i] = -1 * investment;
        } else {
            roi[i] = roi[i - 1] + net.y[i];
        }
    }
    //console.log(roi);
    return roi;
}

function drawChart(timeFrame, dataMined, dataROI) {
    var labels = [];
    for (var i = 0; i <= timeFrame; i++) {
        labels[i] = i;
    }
    var ctx = document.getElementById("chart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Net mining profits per month',
                data: dataMined,
                borderColor: "rgba(45, 118, 237, 1)",
                backgroundColor: "rgba(45, 118, 237, 0.5)"
            }, {
                label: 'profit $$$',
                data: dataROI,
                borderColor: "rgb(255, 239, 22)",
                backgroundColor: "rgba(255, 239, 22, 0.5)"
            }],
            labels: labels
        },
        options: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: ''
                    },
                    ticks: {
                        suggestedMin: dataROI[0],
                        suggestedMax: dataMined[dataMined.length - 1]
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'months'
                    }
                }]
            },
            responsive: true,
            events: ["click"]
        }
    });
}

$(window).on("load", function () {
    addListeners();
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

    drawChart(12, 0, 0);


    $('.drawer').drawer();


});


setTimeout(function () {
    $('#welcomeMessage').css({
        "border-style": 'hidden'
    });
}, 4400);

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});


$("select[name=currency]").change(function () {
    userInput.selectedCurrency = $("select[name=currency]").val();
    $("input[name=hashrate]").val("");
    if (userInput.selectedCurrency == "BTC") {
        $("#valuta").text("BTC");
        $("#value").val(price.btc);
        $("input[name=reward]").val("12.5");
        $("#diff").val(difficulty.btc);
        $("#hashRateUnit").val("TH/s");
    } else if (userInput.selectedCurrency == "ETH") {
        $("#valuta").text("ETH");
        $("input[name=reward]").val("3");
        $("#value").val(price.eth);
        $("#diff").val(difficulty.eth);
        $("#hashRateUnit").val("MH/s");
    } else {
        $("#valuta").text("LTC");
        $("#value").val(price.ltc);
        $("input[name=reward]").val("25");
        $("#diff").val(difficulty.ltc);
        $("#hashRateUnit").val("MH/s");
    }
});

$("#resetButton").click(function () {
    userInput.selectedCurrency = $("select[name=currency]").val();
    $("input[name=CoinValueChange]").val("0");
    $("input[name=diffChange]").val("15");
    $("input[name=hashrate]").val("");
    if (userInput.selectedCurrency == "BTC") {
        $("#hashrate").val("");
        $("#valuta").text("BTC");
        $("#value").val(price.btc);
        $("input[name=reward]").val("12.5");
        $("#diff").val(difficulty.btc);
        $("#hashRateUnit").val("TH/s");
        sendParameters();
    } else if (userInput.selectedCurrency == "ETH") {
        $("#hashrate").val("");
        $("#valuta").text("ETH");
        $("input[name=reward]").val("3.5");
        $("#value").val(price.eth);
        $("#diff").val(difficulty.eth);
        $("#hashRateUnit").val("MH/s");
        sendParameters();
    } else {
        $("#hashrate").val("");
        $("#valuta").text("LTC");
        $("#value").val(price.ltc);
        $("input[name=reward]").val("25");
        $("#diff").val(difficulty.ltc);
        $("#hashRateUnit").val("MH/s");
        sendParameters();
    }
});

function addListeners() {
    $("#hashRateUnit").change(sendParameters);
    $("input[name=hashrate]").keyup(sendParameters);
    $("input[name=fee]").keyup(sendParameters);
    $("input[name=reject]").keyup(sendParameters);
    $("input[name=reward]").keyup(sendParameters);
    $("input[name=diff]").keyup(sendParameters);
    $("input[name=CoinValueChange]").keyup(sendParameters);
    $("input[name=value]").keyup(sendParameters);
    $("input[name=power]").keyup(sendParameters);
    $("input[name=powerCost]").keyup(sendParameters);
    $("input[name=diffChange]").keyup(sendParameters);
    $("input[name=invest]").keyup(sendParameters);
    $("input[name=time]").keyup(sendParameters);
}

function sendParameters() {
    userInput.currency = $("#currency").val();
    userInput.hashrate = $("input[name=hashrate]").val();
    userInput.fee = $("input[name=fee]").val();
    userInput.reject = $("input[name=reject]").val();
    userInput.reward = $("input[name=reward]").val();
    userInput.diff = $("input[name=diff]").val();
    userInput.value = $("input[name=value]").val();
    userInput.hashrateUnit = $("select[name=hashrateUnit]").val();
    userInput.power = $("input[name=power]").val();
    userInput.powerCost = $("input[name=powerCost]").val();
    userInput.diffChange = $("input[name=diffChange]").val();
    userInput.invest = $("input[name=invest]").val();
    userInput.timeFrame = $("input[name=time]").val();
    userInput.coinValueChange = $("input[name=CoinValueChange]").val();
    var hourlyCost = userInput.power * userInput.powerCost / 1000;

    if (userInput.currency == "BTC") {
        results.miningProfitS = calculateCoinsMinedBTC(userInput);
    } else if (userInput.currency == "ETH") {
        results.miningProfitS = calculateCoinsMinedETH(userInput);
    } else {
        results.miningProfitS = calculateCoinsMinedLTC(userInput);
    }

    var res = calculateProfitPerTimeFrame(results.miningProfitS, userInput.diffChange, userInput.timeFrame);
    var costs = calculateCosts(hourlyCost);
    var net = calculateNetProfit(costs, res, userInput.timeFrame, userInput.value, userInput.coinValueChange);
    var roi = calculateROI(net, userInput.invest, userInput.timeFrame);

    drawChart(userInput.timeFrame, net.y, roi);

    $(".h :nth-child(2)").html((res.miningProfitH).toFixed(7));
    $(".h :nth-child(3)").html((net.h + costs.H).toFixed(2));
    $(".h :nth-child(4)").html((costs.H).toFixed(2));
    $(".h :nth-child(5)").html((net.h).toFixed(2));
    $(".d :nth-child(2)").html((res.miningProfitD).toFixed(4));
    $(".d :nth-child(3)").html((net.d + costs.D).toFixed(2));
    $(".d :nth-child(4)").html((costs.D).toFixed(2));
    $(".d :nth-child(5)").html((net.d).toFixed(2));
    $(".w :nth-child(2)").html((res.miningProfitW).toFixed(4));
    $(".w :nth-child(3)").html((net.w + costs.W).toFixed(2));
    $(".w :nth-child(4)").html((costs.W).toFixed(2));
    $(".w :nth-child(5)").html((net.w).toFixed(2));
    $(".m :nth-child(2)").html((res.miningProfitM).toFixed(4));
    $(".m :nth-child(3)").html((net.m + costs.M).toFixed(2));
    $(".m :nth-child(4)").html((costs.M).toFixed(2));
    $(".m :nth-child(5)").html((net.m).toFixed(2));
    $(".y :nth-child(2)").html((res.year).toFixed(4));
    $(".y :nth-child(3)").html((net.year + costs.Y).toFixed(2));
    $(".y :nth-child(4)").html((costs.Y).toFixed(2));
    $(".y :nth-child(5)").html((net.year).toFixed(2));
    //console.log(results.miningProfitS);
}
