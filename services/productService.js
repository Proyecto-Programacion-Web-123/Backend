const ProductModel = require('../models/productModel');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const ProductDto = require('../dto/productDTO');

const ProductService = {
    getProducts: async () => {
        const products = await ProductModel.findAll();
        return ProductDto.map(products);
    },

    getProductById: async (id) => {
        if (!id) throw new BadRequestError('Product ID is required');
        const product = await ProductModel.findById(id);
        if (!product) throw new NotFoundError('Product not found');
        return new ProductDto(product);
    },

    createProduct: async ({ name, description, price }) => {
        if (!name || price == null) throw new BadRequestError("Name and price are required");

        const priceNumber = Number(price);
        if (isNaN(priceNumber)) throw new BadRequestError("Price must be a number");

        const product = await ProductModel.create({ name, description, price: priceNumber });
        return new ProductDto(product);
    },

    updateProduct: async (id, updates) => {
        if (!id) throw new BadRequestError('Product ID is required');
        const priceNumber = Number(updates.price);
        if (priceNumber != null && isNaN(priceNumber)) {
            throw new BadRequestError("Price must be a number");
        }
        const product = await ProductModel.update(id, updates);
        if (!product) throw new NotFoundError('Product not found');
        return new ProductDto(product);
    },

    deleteProduct: async (id) => {
        if (!id) throw new BadRequestError('Product ID is required');
        const product = await ProductModel.delete(id);
        if (!product) throw new NotFoundError('Product not found');
        return new ProductDto(product);
    },
};

module.exports = ProductService;