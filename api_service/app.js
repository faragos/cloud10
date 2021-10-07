import express from 'express'
import {customers} from './data.js'
import {products} from './data.js'
const app = express()
const port = 3000
let orderCount = 0;

customers.forEach( (customer) => {orderCount += customer.orders.length})

app.use(express.json());

app.post('/', (req, res) => {
    res.send(processDialogFlowRequest(req, res))
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


function processDialogFlowRequest(req, res) {
    const parameters = req.body.queryResult.parameters;
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

function generateOrderId(){
    orderCount++;
    return orderCount > 9 ? "O-00" + orderCount : "O-000" + orderCount;
}

function orderProduct(productId, customerId){
    if (!productId || !customerId) return;

    let currentCustomer = customers.find(customer => customer.customerId === customerId);
    if (!currentCustomer) return createDialogFlowResponse("Customer not found")
    if (!products.find(p => p.productId === productId)) return createDialogFlowResponse("Product not found")

    const deliveryDate = new Date(Date.now());
    deliveryDate.setDate(deliveryDate.getDate() + 2)

    const newOrder = {
        orderId: generateOrderId(),
        productId: productId,
        status: "open",
        deliveryDate: deliveryDate
    }

    currentCustomer.orders.push(newOrder)

    const response = "Order ID: " + newOrder.orderId +
        " Status: " + newOrder.status +
        " Delivery Date: " + newOrder.deliveryDate.toDateString();

    return createDialogFlowResponse(response)
}

function getOrderInfo(orderId, customerId) {
    if (!orderId || !customerId) return;
    let currentCustomer = customers.find(customer => customer.customerId === customerId);
    if (!currentCustomer) return createDialogFlowResponse("Customer not found");

    const order = customers
                    .find(customer => customer.customerId === customerId)
                    .orders
                    .find(order => order.orderId === orderId)

    if (!order) return createDialogFlowResponse("Order not found")

    const product = products.find(product => product.productId === order.productId);
    const response = "Order ID: " + order.orderId +
        " Product: " + product.name +
        " Product Detail: " + product.description +
        " Status: " + order.status +
        " Delivery Date: " + order.deliveryDate.toDateString();

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
        response = "order already canceld"
    } else {
        order.status = "canceled";
        response = "order successfully canceled";
    }
    return createDialogFlowResponse(response);
}

function repairOrder(orderId, customerId) {
    if (!orderId || !customerId) return;
    let currentCustomer = customers.find(customer => customer.customerId === customerId);
    if (!currentCustomer) return createDialogFlowResponse("Customer not found");
    if (!currentCustomer.orders.find(o => o.orderId === orderId)) return createDialogFlowResponse("Order not found");

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

    return createDialogFlowResponse("add repair")
}

function createDialogFlowResponse(fulfillmentText) {
    return { fulfillmentText: fulfillmentText};
}