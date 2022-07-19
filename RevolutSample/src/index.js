// Step 1
import RevolutCheckout from '@revolut/checkout'

async function component() {   
 
    console.log("in index.js inside component")
    let orderId = "Value"

  async function create() {

        console.log("in index.js create async function")
        var result;

        var createOrder = {
            amount: 908,
            captureMode: 0,
            merchantOrderExtRef: "OrderIDfromFP",
            customerEmail: "nasarathkhan@gmail.com",
            description: "NEW FP Purchase",
            currency: "GBP",
            settlementCurrency: "GBP",
            merchantCustomerExtRef: "myOrderRef1"      
        }

        console.log("in index.js making ajax call")

        $.ajax({            
            url: "/revolut/create",
            data: JSON.stringify(createOrder),
            contentType: 'application/json',
            type: "POST",
            async: false,
            success: function (data) { 

                console.log(data)
                orderId = data.value.id
                console.log(data.value.publicId)
                result = data;
            },
            error: function (data) {
                alert('error');
            }
        });

        return result;
    }

// Step 3
const { revolutPay } = await RevolutCheckout.payments({
    local: 'en',
    mode: 'sandbox',
    publicToken: "pk_xvYW2jXVjl6uIECsoMotSc58HZNEIwl2X5DUugsLOrprGVf1" 
})
    console.log("in index.js after importing revolut")

    const paymentOptions = {
        currency: "GBP", totalAmount: 908, createOrder: async () => {

            console.log("before create method")
            var order = await create()
            
            console.log(order.value.Id)
            console.log(order.value.publicId)

            return { publicId: order.value.publicId }

            //await create().then(order => {
            //    console.log(order.value.publicId)
            //    return { publicId: order.value.publicId }
            //});       
        }
    }

    let target = document.getElementById("revolut-pay2.0")
    //Step 2
    revolutPay.mount(target, paymentOptions)

    //Step 4
    revolutPay.on("payment", (event) => {

        var retrivedOrder;
        switch (event.type) {
            case "cancel": {
                alert("User cancelled at: " + event.dropOffState);
                break;
            }
            case "success":
                {
                    var retrieveOrder = {
                        orderId: orderId
                    }

                    $.ajax({
                        url: "/revolut/retrieve",
                        data: retrieveOrder,
                        contentType: 'application/json',
                        type: "GET",
                        async: false,
                        success: function (data) {

                            retrivedOrder = data;
                            if (retrivedOrder.state === "COMPLETED")
                                alert('Order retrieved successfully');
                        },
                        error: function (data) {
                            alert('error');
                        }
                    });
                    console.log(retrivedOrder)
                    alert("Payment with Revpay2 successful");

                    break;
                }
            case "error":
               alert(
                    "Something went wrong with RevolutPay 2.0:" + event.error
                );
                break;
            default: {
                console.log(event);
            }
        }
    });
 }

document.body.appendChild(component());


