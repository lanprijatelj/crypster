var price = {};
var difficulty = {};
var userInput = {};
var results = {};
var moneroInfo = {};
var $jq = jQuery.noConflict();

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
    //console.log(hashrate);
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

function calculateCoinsMinedZEC(input) {
    if (input.hashrateUnit == "Sols/s") {
        var hashrate = input.hashrate ;
    } else if (input.hashrateUnit == "kSols/s") {
        var hashrate = input.hashrate * 1000;
    }
    return ((hashrate * (1 - (input.fee / 100)) * (1 - (input.reject / 100))) / (input.diff * 8192)) * input.reward;
}

function calculateCoinsMinedXMR(input) {
    if (input.hashrateUnit == "H/s") {
        var hashrate = input.hashrate ;
    } else if (input.hashrateUnit == "kH/s") {
        var hashrate = input.hashrate * 1000;
    }
    else if (input.hashrateUnit == "MH/s") {
        var hashrate = input.hashrate * 1000000;
    }
    return ( (hashrate * (1 - (input.fee / 100)) * (1 - (input.reject / 100))) * moneroInfo.blockReward) / (moneroInfo.difficulty);
}

function calculateProfitPerTimeFrame(miningProfit, diffChange, timeFrame) {
    var profit = {};
    profit.miningProfitH = (miningProfit * 3600);
    profit.miningProfitD = (miningProfit * 86400);
    profit.miningProfitW = (miningProfit * 604800);
    profit.miningProfitM = (miningProfit * 2628000);
    profit.year = 0;
    profit.miningProfitY = [];
    var factor = Math.abs(1 - (diffChange / 100));
    for (var i = 0; i <= timeFrame; i++) {
        if (i == 0) {
            profit.miningProfitY[i] = 0;
        }
        else if (i == 1) {
            profit.miningProfitY[i] = profit.miningProfitM;
            profit.year += profit.miningProfitY[i];
        } else {
            if (factor > 1) {
                factor *= -1;
            }
            profit.miningProfitY[i] = Math.abs(profit.miningProfitY[i - 1]) * factor;
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
    var factor = (1 + (valueChange / 100));
    for (var i = 0; i <= timeFrame; i++) {
        if (i == 0) {
            net.y[i] = 0;
        } else {
            value = value * factor;
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

function calculateBE(investment, incomes) {
    var days = 0;
    var count = 0;
    while (investment > 0) {
        investment -= incomes.y[count];
        count++;
    }
    if (count > 2) {
        return days = (count - 2) * 30.417 + (30.417 - (30.417 * (-1 * investment / incomes.y[count])));
    } else {
        return 30.417 - (30.417 * (-1 * investment / incomes.y[count - 1]));
    }

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
                label: 'Mining revenue/month',
                data: dataMined,
                borderColor: "rgba(45, 118, 237, 1)",
                backgroundColor: "rgba(45, 118, 237, 0.5)"
            }, {
                label: 'Profit $$$',
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

$jq(window).on("load", function () {
    addListeners();
    userInput.selectedCurrency = $jq("select[name=currency]").val();

    $jq.post("/diffBTC").done(function (response) {
        difficulty.btc = response.difficultyBTC;
        $jq("#diff").val(difficulty.btc);
    });

    $jq.post("/diffETH").done(function (response) {
        difficulty.eth = response.difficultyETH[0].difficulty;
    });

    $jq.post("/diffLTC").done(function (response) {
        difficulty.ltc = response.difficultyLTC;
    });

    $jq.post("/diffZEC").done(function (response) {
        difficulty.zec = Math.round(response.difficultyZEC);        
    });

    $jq.post("/moneroInfo").done(function (response) {
        moneroInfo = response;        
    });

    $jq.post("/price").done(function (response) {
        price.btc = response.valueBTC;
        price.eth = response.valueETH;
        price.ltc = response.valueLTC;
        price.zec = response.valueZEC;
        price.xmr = response.valueXMR;
        //console.log(price);
        if (userInput.selectedCurrency == "BTC") {
            $jq("#value").val(price.btc);
        }
    });

    drawChart(12, 0, 0);

    $jq('.drawer').drawer();

    $jq('#my_popup').popup({
        opacity: 0.8,
        transition: 'all 0.5s',
        onopen: function() {
            $jq("main,h1,h3").css({"filter":"blur(5px)",
            "-webkit-filter":"blur(5px)"});
        },
        onclose: function() {
            $jq("main,h1,h3").css({"filter":"blur(0px)",
                "-webkit-filter":"blur(0px)"});
        }
    });

    if ($jq(window).width() < 480 && window.scrollY == 0) {
        $jq("#crtice").hide();

    }
    if ($jq(window).width() < 480) {
        $jq("#crtice").hide();
    }

    tippy('[title]', {
        placement: 'left',
        animation: 'scale',
        duration: 500,
        arrow: true
    });

      $jq("#my_popup").css({"margin-top": "0"});
      $jq("#btcLogo").css({'display': 'block'});
});

/*resposive design-----------------------------------*/

$jq(document).scroll(function () {
    var y = $jq(this).scrollTop();
    if (y > 50 && $jq(window).width() < 480) {
        $jq('#crtice').fadeIn();
    } else if($jq(window).width() < 480){
        $jq('#crtice').fadeOut();
    }
});




setTimeout(function () {
    $jq('#welcomeMessage').css({
        "border-style": 'hidden'
    });
}, 4400);

$jq(function () {
    $jq('[data-toggle="tooltip"]').tooltip()
});

$jq("select[name=currency]").change(function () {
    userInput.selectedCurrency = $jq("select[name=currency]").val();
    $jq("input[name=hashrate]").val(""); 
    $jq("#BE").text("0"); 
    $jq(".sols").css({"display" : "none"}); 
    $jq(".hashes").css({"display" : "block"});
    $jq(".slowHashrate").css({"display" : "none"});
    $jq("#btcLogo").css({'display': 'none'});
    $jq("#ltcLogo").css({'display': 'none'});
    $jq("#ethLogo").css({'display': 'none'});
    $jq("#zecLogo").css({'display': 'none'});
    $jq("#xmrLogo").css({'display': 'none'});
    if (userInput.selectedCurrency == "BTC") {
        $jq("#valuta").text("BTC");
        $jq("#value").val(price.btc);
        $jq("input[name=reward]").val("12.5");
        $jq("#diff").val(difficulty.btc);
        $jq("#hashRateUnit").val("TH/s");
        $jq("#btcLogo").css({'display': 'block'});
    } else if (userInput.selectedCurrency == "ETH") {
        $jq("#valuta").text("ETH");
        $jq("input[name=reward]").val("3");
        $jq("#value").val(price.eth);
        $jq("#diff").val(difficulty.eth);
        $jq("#hashRateUnit").val("MH/s");
        $jq("#ethLogo").css({'display': 'block'});
    } else if (userInput.selectedCurrency == "ZEC") {
        $jq("#valuta").text("ZEC");
        $jq("input[name=reward]").val("10");
        $jq("#value").val(price.zec);
        $jq("#diff").val(difficulty.zec); 
        $jq(".hashes").css({"display" : "none"});       
        $jq(".sols").css({"display" : "block"});
        $jq("#hashRateUnit").val("Sols/s");
        $jq("#zecLogo").css({'display': 'block'});
    } else if (userInput.selectedCurrency == "XMR") {
        $jq("#valuta").text("XMR");
        $jq("input[name=reward]").val(moneroInfo.blockReward.toFixed(4));
        $jq("#value").val(price.xmr);
        $jq("#diff").val(moneroInfo.difficulty);
        $jq(".hashes").css({"display" : "none"});                
        $jq(".slowHashrate").css({"display" : "block"});
        $jq("#hashRateUnit").val("kH/s");
        $jq("#xmrLogo").css({'display': 'block'});
    } else {
        $jq("#valuta").text("LTC");
        $jq("#value").val(price.ltc);
        $jq("input[name=reward]").val("25");
        $jq("#diff").val(difficulty.ltc);
        $jq("#hashRateUnit").val("MH/s");
        $jq("#ltcLogo").css({'display': 'block'});
    }
});

$jq("#resetButton").click(function () {
    userInput.selectedCurrency = $jq("select[name=currency]").val();
    $jq("input[name=CoinValueChange]").val("0");
    $jq("input[name=diffChange]").val("15");
    $jq("input[name=hashrate]").val("");
    if (userInput.selectedCurrency == "BTC") {
        $jq("#hashrate").val("");
        $jq("#valuta").text("BTC");
        $jq("#value").val(price.btc);
        $jq("input[name=reward]").val("12.5");
        $jq("#diff").val(difficulty.btc);
        $jq("#hashRateUnit").val("TH/s");
        sendParameters();
    } else if (userInput.selectedCurrency == "ETH") {
        $jq("#hashrate").val("");
        $jq("#valuta").text("ETH");
        $jq("input[name=reward]").val("3.5");
        $jq("#value").val(price.eth);
        $jq("#diff").val(difficulty.eth);
        $jq("#hashRateUnit").val("MH/s");
        sendParameters();
    } else if (userInput.selectedCurrency == "ZEC") {
        $jq("#hashrate").val("");
        $jq("#valuta").text("ZEC");
        $jq("input[name=reward]").val("10");
        $jq("#value").val(price.zec);
        $jq("#diff").val(difficulty.zec);
        $jq("#hashRateUnit").val("Sols/s");
        sendParameters();
    } else if (userInput.selectedCurrency == "XMR") {
        $jq("#hashrate").val("");
        $jq("#valuta").text("XMR");
        $jq("input[name=reward]").val(moneroInfo.blockReward);
        $jq("#value").val(price.xmr);
        $jq("#diff").val(moneroInfo.difficulty);
        $jq("#hashRateUnit").val("kH/s");
        sendParameters();
    } else {
        $jq("#hashrate").val("");
        $jq("#valuta").text("LTC");
        $jq("#value").val(price.ltc);
        $jq("input[name=reward]").val("25");
        $jq("#diff").val(difficulty.ltc);
        $jq("#hashRateUnit").val("MH/s");
        sendParameters();
    }
});

function addListeners() {
    $jq("#hashRateUnit").change(sendParameters);
    $jq("input[name=hashrate]").keyup(sendParameters);
    $jq("input[name=fee]").keyup(sendParameters);
    $jq("input[name=reject]").keyup(sendParameters);
    $jq("input[name=reward]").keyup(sendParameters);
    $jq("input[name=diff]").keyup(sendParameters);
    $jq("input[name=CoinValueChange]").keyup(sendParameters);
    $jq("input[name=value]").keyup(sendParameters);
    $jq("input[name=power]").keyup(sendParameters);
    $jq("input[name=powerCost]").keyup(sendParameters);
    $jq("input[name=diffChange]").keyup(sendParameters);
    $jq("input[name=invest]").keyup(sendParameters);
    $jq("input[name=time]").keyup(sendParameters);
}

function sendParameters() {
    userInput.currency = $jq("#currency").val();
    userInput.hashrate = $jq("input[name=hashrate]").val();
    userInput.fee = $jq("input[name=fee]").val();
    userInput.reject = $jq("input[name=reject]").val();
    userInput.reward = $jq("input[name=reward]").val();
    userInput.diff = $jq("input[name=diff]").val();
    userInput.value = $jq("input[name=value]").val();
    userInput.hashrateUnit = $jq("select[name=hashrateUnit]").val();
    userInput.power = $jq("input[name=power]").val();
    userInput.powerCost = $jq("input[name=powerCost]").val();
    userInput.diffChange = $jq("input[name=diffChange]").val();
    userInput.invest = $jq("input[name=invest]").val();
    userInput.timeFrame = $jq("input[name=time]").val();
    userInput.coinValueChange = $jq("input[name=CoinValueChange]").val();
    var hourlyCost = userInput.power * userInput.powerCost / 1000;

    if (userInput.currency == "BTC") {
        results.miningProfitS = calculateCoinsMinedBTC(userInput);
    } else if (userInput.currency == "ETH") {
        results.miningProfitS = calculateCoinsMinedETH(userInput);
    } else if (userInput.currency == "ZEC") {
        results.miningProfitS = calculateCoinsMinedZEC(userInput);
    } else if (userInput.currency == "XMR") {
        results.miningProfitS = calculateCoinsMinedXMR(userInput);
    } else {
        results.miningProfitS = calculateCoinsMinedLTC(userInput);
    }

    var res = calculateProfitPerTimeFrame(results.miningProfitS, userInput.diffChange, userInput.timeFrame);
    var costs = calculateCosts(hourlyCost);
    var net = calculateNetProfit(costs, res, userInput.timeFrame, userInput.value, userInput.coinValueChange);
    var roi = calculateROI(net, userInput.invest, userInput.timeFrame);
    //console.log(userInput.invest);
    if (userInput.invest != "0") {
        var BE = calculateBE(userInput.invest, net);
        if (!isNaN(BE)) {
            $jq("#BE").text(BE.toFixed(2));
        } else {
            $jq("#BE").text("Never");
        }
    }

    drawChart(userInput.timeFrame, net.y, roi);

    $jq(".h :nth-child(2)").html((res.miningProfitH).toFixed(7));
    $jq(".h :nth-child(3)").html((net.h + costs.H).toFixed(2));
    $jq(".h :nth-child(4)").html((costs.H).toFixed(2));
    $jq(".h :nth-child(5)").html((net.h).toFixed(2));
    $jq(".d :nth-child(2)").html((res.miningProfitD).toFixed(4));
    $jq(".d :nth-child(3)").html((net.d + costs.D).toFixed(2));
    $jq(".d :nth-child(4)").html((costs.D).toFixed(2));
    $jq(".d :nth-child(5)").html((net.d).toFixed(2));
    $jq(".w :nth-child(2)").html((res.miningProfitW).toFixed(4));
    $jq(".w :nth-child(3)").html((net.w + costs.W).toFixed(2));
    $jq(".w :nth-child(4)").html((costs.W).toFixed(2));
    $jq(".w :nth-child(5)").html((net.w).toFixed(2));
    $jq(".m :nth-child(2)").html((res.miningProfitM).toFixed(4));
    $jq(".m :nth-child(3)").html((net.m + costs.M).toFixed(2));
    $jq(".m :nth-child(4)").html((costs.M).toFixed(2));
    $jq(".m :nth-child(5)").html((net.m).toFixed(2));
    $jq(".y :nth-child(2)").html((res.year).toFixed(4));
    $jq(".y :nth-child(3)").html((net.year + costs.Y).toFixed(2));
    $jq(".y :nth-child(4)").html((costs.Y).toFixed(2));
    $jq(".y :nth-child(5)").html((net.year).toFixed(2));
}
