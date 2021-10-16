export const products = [
    {
        productId: "P-0001",
        name: "IPhone 13",
        price: 1000,
        stock: 50
    },
    {
        productId: "P-0002",
        name: "IPhone 13 pro",
        price: 1200,
        stock: 50
    }
]

export const customers = [
    {
        customerId: "C-0001",
        firstName: "Armend",
        lastName: "Lesi",
        orders: [
            {
                orderId: "O-0001",
                productId: "P-0001",
                // Status = open, sent, delivered, canceled
                status: "delivered",
                deliveryDate: new Date("2021-10-06")
            }
        ],
    }
]