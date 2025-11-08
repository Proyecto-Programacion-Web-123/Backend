class OrderDetailDto {
    constructor(detail) {
        this.id_order_detail = detail.id_order_detail;
        this.id_order = detail.id_order;
        this.id_product = detail.id_product;
        this.quantity = detail.quantity;
        this.unit_price = detail.unit_price;
        this.subtotal = detail.subtotal;
    }

    static map(details) {
        return details.map(d => new OrderDetailDto(d));
    }
}

module.exports = OrderDetailDto;
