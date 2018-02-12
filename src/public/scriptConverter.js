var price = {};
var userInput = {};

var $jq = jQuery.noConflict();

$jq(window).on("load", function () {
    userInput.selectedCurrency1 = $jq("select[name=currency1]").val();
    userInput.selectedCurrency2 = $jq("select[name=currency2]").val();

    $jq.post("/price").done(function (response) {
        price.btc = response.valueBTC;
        price.eth = response.valueETH;
        price.ltc = response.valueLTC;
        price.zec = response.valueZEC;
        price.xmr = response.valueXMR;

        if (userInput.selectedCurrency1 == "BTC") {
            $jq("#value2").val(price.btc);
        }
    });

    $jq.post("/exchRate").done(function (response) {
        price.eur = response.rate;              
    });


    $jq('.drawer').drawer();

    $jq('#my_popup').popup({
        opacity: 0.8,
        transition: 'all 0.5s',
        onopen: function () {
            $jq("main,h1,h3").css({
                "filter": "blur(5px)",
                "-webkit-filter": "blur(5px)"
            });
        },
        onclose: function () {
            $jq("main,h1,h3").css({
                "filter": "blur(0px)",
                "-webkit-filter": "blur(0px)"
            });
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
    } else if ($jq(window).width() < 480) {
        $jq('#crtice').fadeOut();
    }
});

setTimeout(function () {
    $jq('#welcomeMessage').css({
        "border-style": 'hidden'
    });
}, 4400);

function changedFirstCurrency() {
    var val1 = $jq("#value1").val();
    var currency1 = userInput.selectedCurrency1;
    var currency2 = userInput.selectedCurrency2;
    var result = calculate(val1, currency1, currency2);
    $jq("#value2").val(result);
}

function changedSecondCurrency() {
    var val2 = $jq("#value2").val();
    var currency1 = userInput.selectedCurrency1;
    var currency2 = userInput.selectedCurrency2;
    var result = calculate(val2, currency2, currency1);
    $jq("#value1").val(result);
}

$jq("#value1").keyup(function () {
    var val1 = $jq("#value1").val();
    var currency1 = userInput.selectedCurrency1;
    var currency2 = userInput.selectedCurrency2;
    var result = calculate(val1, currency1, currency2);
    $jq("#value2").val(result);
});

$jq("#value2").keyup(function () {
    var val2 = $jq("#value2").val();
    var currency1 = userInput.selectedCurrency1;
    var currency2 = userInput.selectedCurrency2;
    var result = calculate(val2, currency2, currency1);
    $jq("#value1").val(result);
});


$jq(function () {
    $jq('[data-toggle="tooltip"]').tooltip()
});

$jq("select[name=currency1]").change(function () {
    userInput.selectedCurrency1 = $jq("select[name=currency1]").val();
    $jq("#btcLogo").css({'display': 'none'});
    $jq("#ltcLogo").css({'display': 'none'});
    $jq("#ethLogo").css({'display': 'none'});
    $jq("#zecLogo").css({'display': 'none'});
    $jq("#xmrLogo").css({'display': 'none'})
    $jq("#usdLogo").css({'display': 'none'});
    $jq("#eurLogo").css({'display': 'none'});
    if (userInput.selectedCurrency1 == "BTC") {
        $jq("#value2").val(price.btc);
        $jq("#btcLogo").css({'display': 'block'});
    } else if (userInput.selectedCurrency1 == "ETH") {
        $jq("#value2").val(price.eth);
        $jq("#ethLogo").css({'display': 'block'});

    } else if (userInput.selectedCurrency1 == "ZEC") {
        $jq("#value2").val(price.zec);
        $jq("#zecLogo").css({'display': 'block'});

    } else if (userInput.selectedCurrency1 == "XMR") {
        $jq("#value2").val(price.xmr);
        $jq("#xmrLogo").css({'display': 'block'});

    } else if (userInput.selectedCurrency1 == "LTC") {
        $jq("#value2").val(price.ltc);
        $jq("#ltcLogo").css({'display': 'block'});
    } else if (userInput.selectedCurrency1 == "USD") {
        //  $jq("#value1").val(price.ltc);
        $jq("#usdLogo").css({'display': 'block'});
    }
    else if (userInput.selectedCurrency1 == "EUR") {
        //  $jq("#value1").val(price.ltc);
        $jq("#eurLogo").css({'display': 'block'});
    }
    changedFirstCurrency();
});

$jq("select[name=currency2]").change(function () {
    userInput.selectedCurrency2 = $jq("select[name=currency2]").val();
    $jq("#btcLogo2").css({'display': 'none'});
    $jq("#ltcLogo2").css({'display': 'none'});
    $jq("#ethLogo2").css({'display': 'none'});
    $jq("#zecLogo2").css({'display': 'none'});
    $jq("#xmrLogo2").css({'display': 'none'});
    $jq("#usdLogo2").css({'display': 'none'});
    $jq("#eurLogo2").css({'display': 'none'});
    if (userInput.selectedCurrency2 == "BTC") {
        //   $jq("#value1").val(price.btc);
        $jq("#btcLogo2").css({'display': 'block'});
    } else if (userInput.selectedCurrency2 == "ETH") {
        //    $jq("#value2").val(price.eth);
        $jq("#ethLogo2").css({'display': 'block'});

    } else if (userInput.selectedCurrency2 == "ZEC") {
        //   $jq("#value1").val(price.zec);
        $jq("#zecLogo2").css({'display': 'block'});

    } else if (userInput.selectedCurrency2 == "XMR") {
        //    $jq("#value1").val(price.xmr);
        $jq("#xmrLogo2").css({'display': 'block'});

    } else if (userInput.selectedCurrency2 == "LTC") {
        //  $jq("#value1").val(price.ltc);
        $jq("#ltcLogo2").css({'display': 'block'});
    } else if (userInput.selectedCurrency2 == "USD") {
        //  $jq("#value1").val(price.ltc);
        $jq("#usdLogo2").css({'display': 'block'});
    }
    else if (userInput.selectedCurrency2 == "EUR") {
        //  $jq("#value1").val(price.ltc);
        $jq("#eurLogo2").css({'display': 'block'});
    }
    changedSecondCurrency();
});

function calculate(val, currency1, currency2) {
    if (currency1 == "BTC") {
        var c1 = price.btc;
    } else if (currency1 == "ETH") {
        var c1 = price.eth;
    } else if (currency1 == "ZEC") {
        var c1 = price.zec;
    } else if (currency1 == "XMR") {
        var c1 = price.xmr;
    } else if (currency1 == "LTC") {
        var c1 = price.ltc;
    } else if (currency1 == "USD") {
        var c1 = 1;
    } else if (currency1 == "EUR") {
        var c1 = price.eur;
    }

    if (currency2 == "BTC") {
        var c2 = price.btc;
    } else if (currency2 == "ETH") {
        var c2 = price.eth;
    } else if (currency2 == "ZEC") {
        var c2 = price.zec;
    } else if (currency2 == "XMR") {
        var c2 = price.xmr;
    } else if (currency2 == "LTC") {
        var c2 = price.ltc;
    } else if (currency2 == "USD") {
        var c2 = 1;
    } else if (currency2 == "EUR") {
        var c2 = price.eur;
    }
    return (val * c1 / c2);
}
