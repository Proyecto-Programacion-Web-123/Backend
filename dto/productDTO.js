class ProductDto {
    constructor(product) {
        this.id_product = product.id_product;
        this.name = product.name;
        this.description = product.description;
        this.price = product.price;
        this.image_url = product.image_url;
        this.release_date = product.release_date;
    }

    static map(products) {
        return products.map(product => new ProductDto(product));
    }
}

module.exports = ProductDto;
