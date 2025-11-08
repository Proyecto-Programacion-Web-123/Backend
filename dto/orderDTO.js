class OrderDto {
    constructor(order) {
        this.id_order = order.id_order;
        this.id_user = order.id_user;
        this.date = order.date;
        this.total = order.total;
    }

    static map(orders) {
        return orders.map(order => new OrderDto(order));
    }
}

module.exports = OrderDto;
