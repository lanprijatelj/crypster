var price = {};
var userInput = {};

var $jq = jQuery.noConflict();

$jq(window).on("load", function () {
    addListeners();
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


$jq(function () {
    $jq('[data-toggle="tooltip"]').tooltip()
});

$jq("select[name=currency1]").change(function () {
    userInput.selectedCurrency1 = $jq("select[name=currency1]").val();
    $jq("#btcLogo").css({'display': 'none'});
    $jq("#ltcLogo").css({'display': 'none'});
    $jq("#ethLogo").css({'display': 'none'});
    $jq("#zecLogo").css({'display': 'none'});
    $jq("#xmrLogo").css({'display': 'none'});
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
    }
});

$jq("select[name=currency2]").change(function () {
    userInput.selectedCurrency2 = $jq("select[name=currency2]").val();
    $jq("#btcLogo2").css({'display': 'none'});
    $jq("#ltcLogo2").css({'display': 'none'});
    $jq("#ethLogo2").css({'display': 'none'});
    $jq("#zecLogo2").css({'display': 'none'});
    $jq("#xmrLogo2").css({'display': 'none'});
    $jq("#usdLogo2").css({'display': 'none'});
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
});


function addListeners() {

}

function sendParameters() {

}
