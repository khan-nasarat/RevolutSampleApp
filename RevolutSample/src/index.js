import RevolutCheckout from '@revolut/checkout'
var public_Id;
var orderId;
var widgetRevolut;
// Set up revolut pay globally
const revolutPay = (async () => {
    var basketData = await getBasketData();
    const data = await RevolutCheckout.payments({
        local: 'en',
        mode: basketData.Mode,
        publicToken: basketData.PublicToken
    });
    return data
})()
async function getBasketData() {
    var result;
    $.ajax({
        url: "/Pages/Basket.aspx/GetBasketTotal",
        contentType: 'application/json',
        type: "POST",
        async: false,
        success: function (data) {
            result = data.d;
        },
        error: function (data) {
        }
    });
    return result;
}
// Entry point
async function component() {
    // initial bakset load, recreate basket set to false
    createRevolutPayment(false)
}
// Basket has been reloaded with new payment
function reloadBasket() {
    console.log('reloadBasket call..')
    // now have an updated payment amount and recreate basket set to true
    createRevolutPayment(true)
}
// Mounts the widget
async function createRevolutPayment(recreateBasket) {
    console.log('createRevolutPayment 1')
    var basketData = await getBasketData();
    // call create order endpoint with currency, amount
    const paymentOptions = {
        buttonStyle: {
            cashback: false
        },
        currency: basketData.CurrencyCode, totalAmount: basketData.BasketTotal, createOrder: async () => {
            await create()
            return { publicId: public_Id }
        }
    }
    // No need to recreate the basket so just mount and make payment
    if (!recreateBasket) {
        await revolutPay.then((value) => {
            // mount the widget
            mount(value.revolutPay, paymentOptions);
            // listen to payment event
            // makePayment(value.revolutPay)
            widgetRevolut = value.revolutPay
        });
    }
    // Basket needs to be recreated
    else {
        console.log('recreateBasket 1')
        await revolutPay.then((value) => {
            // destory original instance of widget which will contain old payment amount
            console.log('recreateBasket 2', value)
            value.revolutPay.destroy();
            // mount a new instance with new payment amount
            mount(value.revolutPay, paymentOptions);
            // makePayment(value.revolutPay)
            widgetRevolut = value.revolutPay;
        })
    }
}
// Mount the widget with payment options
function mount(widget, paymentOptions) {
    // assign to div tag where we want widget to display
    let div = document.getElementById("revolut-pay2.0")
    // mount
    widget.mount(div, paymentOptions)
    widget.on("payment", (event) => {
        console.log(event);
        switch (event.type) {
            case "cancel": {
                break;
            }
            case "success":
                $.ajax({
                    url: "/Pages/Payment/Revolut/RevolutWebMethods.aspx/RetriveOrder",
                    data: '{"orderId": "' + orderId + '"}',
                    contentType: 'application/json',
                    type: "POST",
                    async: false,
                    success: function (data) {
                        location.href = data.d.returnURL;
                    }
                });
                break;
            case "error":
                location.href = "/" + __countryCode + "pages/payment/PaymentError.aspx?IssueDetails=&ErrorDetails=" + event.error.message;
                break;
            default: {
                break;
                // var errorMes = "Please use a different payment method to checkout";
                //location.href = "/" + __countryCode + "pages/payment/PaymentError.aspx?IssueDetails=&ErrorDetails=" + errorMes;
            }
        }
    });
    // create button to mimic a basket reload event and add click to invoke reload basket function - can be done earlier
    document.getElementById("reloadBasket").addEventListener('click', reloadBasket)
}
// Handle payment event
async function makePayment(widget) {
    widget.on("payment", (event) => {
        console.log(event);
        switch (event.type) {
            case "cancel": {
                break;
            }
            case "success":
                $.ajax({
                    url: "/Pages/Payment/Revolut/RevolutWebMethods.aspx/RetriveOrder",
                    data: '{"orderId": "' + orderId + '"}',
                    contentType: 'application/json',
                    type: "POST",
                    async: false,
                    success: function (data) {
                        location.href = data.d.returnURL;
                    }
                });
                break;
            case "error":
                location.href = "/" + __countryCode + "pages/payment/PaymentError.aspx?IssueDetails=&ErrorDetails=" + event.error.message;
                break;
            default: {
                break;
                // var errorMes = "Please use a different payment method to checkout";
                //location.href = "/" + __countryCode + "pages/payment/PaymentError.aspx?IssueDetails=&ErrorDetails=" + errorMes;
            }
        }
    });
}
// Call create order in Payment Module which will invoke Revolut API
async function create() {
    $.ajax({
        url: "/Pages/Payment/Revolut/RevolutWebMethods.aspx/CreateOrder",
        contentType: 'application/json',
        type: "POST",
        async: false,
        success: function (data) {
            if (data.d.isAuthorized === true)
                location.href = data.d.returnURL;
            else {
                public_Id = data.d.Public_Id;
                orderId = data.d.Id;
                // makePayment(widgetRevolut)
            }
        },
        error: function (data) {
        }
    });
}
document.body.appendChild(component());