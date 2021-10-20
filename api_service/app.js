import express from 'express'
import {customers} from './data.js'
import {products} from './data.js'
import {executeQueries} from './chat.js'
import bodyParser from "body-parser";
const app = express()
const port = 3000
let orderCount = 0;

customers.forEach( (customer) => {orderCount += customer.orders.length})

app.use(bodyParser.json());
app.use(express.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/', (req, res) => {
    res.send(processDialogFlowRequest(req, res))
})

app.post('/chat', async (req, res) => {
    const result = await executeQueries("cloud10-espf", "123456789", [req.body.newMessage], req.body.language)

    res.send(JSON.stringify(result));
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

let language;
let customerNotFound;
let productNotFound;
let orderNotFound;
let orderAlreadyCanceled;
let orderSuccessfullyCanceled;
let addRepair;


function processDialogFlowRequest(req, res) {
    const parameters = req.body.queryResult.parameters;
    language = req.body.queryResult.languageCode;

    setLanguage()
    switch (req.body.queryResult.intent.displayName) {
        case 'product.order':
            return orderProduct(parameters.productId, parameters.customerId);
        case 'order.info':
            return getOrderInfo(parameters.orderId, parameters.customerId);
        case 'order.cancel':
            return cancelOrder(parameters.orderId, parameters.customerId);
        case 'order.repair':
            return repairOrder(parameters.orderId, parameters.customerId);
    }
}

function setLanguage() {
    if (language === 'de') {
        customerNotFound = 'Kunde nicht gefunden';
        productNotFound = 'Produkt nicht gefunden';
        orderNotFound = 'Bestellung nicht gefunden';
        orderAlreadyCanceled = 'Bestellung ist bereits abgebrochen';
        orderSuccessfullyCanceled = 'Bestellung erfolgreich abgebrochen';
        addRepair = 'Produkt in Reparatur aufgenommen';
    } else {
        customerNotFound = 'customer not found';
        productNotFound = 'product not found';
        orderNotFound = 'order not found';
        orderAlreadyCanceled = 'order already canceled';
        orderSuccessfullyCanceled = 'order successfully canceled';
        addRepair = 'product added to repair';
    }
}

function generateOrderId(){
    orderCount++;
    return orderCount > 9 ? "O-00" + orderCount : "O-000" + orderCount;
}

function orderProduct(productId, customerId){
    if (!productId || !customerId) return;

    let currentCustomer = customers.find(customer => customer.customerId === customerId);
    if (!currentCustomer) return createDialogFlowResponse(customerNotFound)
    if (!products.find(p => p.productId === productId)) return createDialogFlowResponse(productNotFound)

    const deliveryDate = new Date(Date.now());
    deliveryDate.setDate(deliveryDate.getDate() + 2)

    const newOrder = {
        orderId: generateOrderId(),
        productId: productId,
        status: "open",
        deliveryDate: deliveryDate
    }

    currentCustomer.orders.push(newOrder)
    let response;
    if (language === 'de') {
        response = "Bestell ID: " + newOrder.orderId +
            " Status: " + statusLanguage(newOrder.status) +
            " Lieferdatum: " + newOrder.deliveryDate.toDateString();
    } else {
        response = "Order ID: " + newOrder.orderId +
            " Status: " + newOrder.status +
            " Delivery Date: " + newOrder.deliveryDate.toDateString();
    }


    return createDialogFlowResponse(response)
}

function statusLanguage(status) {
        switch (status) {
            case 'open':
                return 'offen'
            case 'sent':
                return 'gesendet'
            case 'delivered':
                return 'ausgeliefert'
            case 'canceled':
                return 'abgebrochen'
        }
}

function getOrderInfo(orderId, customerId) {
    if (!orderId || !customerId) return;
    let currentCustomer = customers.find(customer => customer.customerId === customerId);
    if (!currentCustomer) return createDialogFlowResponse(customerNotFound);

    const order = customers
                    .find(customer => customer.customerId === customerId)
                    .orders
                    .find(order => order.orderId === orderId)

    if (!order) return createDialogFlowResponse(orderNotFound)

    const product = products.find(product => product.productId === order.productId);
    let response

    if (language === 'de') {
        response = "Bestell ID: " + order.orderId +
            " Produkt: " + product.name +
            " Status: " + statusLanguage(order.status) +
            " Lieferdatum: " + order.deliveryDate.toDateString();
    } else {
        response = "Order ID: " + order.orderId +
            " Product: " + product.name +
            " Status: " + order.status +
            " Delivery Date: " + order.deliveryDate.toDateString();
    }

    return createDialogFlowResponse(response)
}

function cancelOrder(orderId, customerId) {
    if (!orderId || !customerId) return;

    const order = customers
        .find(customer => customer.customerId === customerId)
        .orders
        .find(order => order.orderId === orderId)

    let response;
    if (order.status === "canceled") {
        response = orderAlreadyCanceled
    } else {
        order.status = "canceled";
        response = orderSuccessfullyCanceled;
    }
    return createDialogFlowResponse(response);
}

function repairOrder(orderId, customerId) {
    if (!orderId || !customerId) return;
    let currentCustomer = customers.find(customer => customer.customerId === customerId);
    if (!currentCustomer) return createDialogFlowResponse(customerNotFound);
    if (!currentCustomer.orders.find(o => o.orderId === orderId)) return createDialogFlowResponse(orderNotFound);

    if (currentCustomer.repaires) {
        currentCustomer.repaires.push({
            "orderId": orderId,
            "status": "in repair"
        })
    } else {
        currentCustomer.repaires = [
            {
                "orderId": orderId,
                "status": "in repair"
            }
        ]
    }

    return createDialogFlowResponse(addRepair)
}

function createDialogFlowResponse(fulfillmentText) {
    return { fulfillmentText: fulfillmentText};
}