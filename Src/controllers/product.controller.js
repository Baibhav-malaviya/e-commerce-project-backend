const Product = require("../models/products.model");
const Fuse = require("fuse.js");
const {
    uploadOnCloudinary,
    deleteFromCloudinary,
} = require("../utils/cloudinary");

const addProduct = async (req, res) => {
    const { name, description, price, stock, category, tags } = req.body;

    console.log(req.body);

    if (!name || !description || !price || !stock || !category)
        return res
            .status(403)
            .json({ message: "All the required fields are not given." });

    const productImageLocalPath = req.file?.path;

    if (!productImageLocalPath)
        return res.status(403).json({
            message:
                "something wrong in finding the local path of the product image",
        });

    const productImage = await uploadOnCloudinary(
        productImageLocalPath,
        "products"
    );

    if (!productImage)
        return res.status(403).json({
            message: "something wrong in uploading the product image",
        });

    const product = await Product.create({
        name,
        description,
        price,
        stock,
        category,
        tags,
        productImage: productImage?.url || "",
    });

    if (!product)
        return res
            .status(403)
            .json({ message: "something wrong in creating the new product" });

    const createdProduct = await Product.findById(product._id);

    return res.status(200).json({
        message: "Product created successfully",
        data: createdProduct,
    });
};

const getAllProduct = async (req, res) => {
    const allProduct = await Product.find();

    if (!allProduct)
        return res
            .status(404)
            .json({ message: "something wring in fetching all the products" });
    return res.status(200).json({
        message: "All the products fetched successfully",
        data: allProduct,
    });
};

const getProductById = async (req, res) => {
    // productId = 65b61ab2f41e8d3ce0764f9e (example)
    const { id: productId } = req.params;

    if (!productId)
        return res
            .status(402)
            .json({ message: "Couldn't find the product id" });
    const product = await Product.findById(productId);

    return res
        .status(200)
        .json({ message: "Product fetched successfully", data: product });
};

//todo :) WE HAVE TO TEST ON POSTMAN ALL OF THE BELOW CONTROLLERS

const deleteProductById = async (req, res) => {
    // productId =  65b61ab2f41e8d3ce0764f9e (example)
    const { id: productId } = req.params;

    if (!productId)
        return res
            .status(403)
            .json({ message: "Couldn't find the product id" });

    const product = await Product.findById(productId);
    const productImageUrl = product.productImage;
    await deleteFromCloudinary(productImageUrl);

    const deletedProduct = await Product.findByIdAndDelete(productId);

    return res.status(200).json({
        message: "Product deleted successfully",
        data: deletedProduct,
    });
};

const getProductByQuery = async (req, res) => {
    try {
        const { query } = req.query;
        console.log("QUERY: ", query);
        if (!query) return res.status(404).json({ message: "query not found" });

        // Fetch all products from the database

        const allProducts = await Product.find();
        if (!allProducts)
            return res.status(404).json({ message: "Product not found" });

        // Configure Fuse.js options for searching
        const options = {
            keys: ["name", "description", "category", "tags"], // Fields to search in
            includeScore: true, // Include search score in results
            threshold: 0.3, // Adjust matching threshold as needed
        };

        // Create a new Fuse instance with products and options
        const fuse = new Fuse(allProducts, options);

        // Perform the search
        const searchResults = fuse.search(query);

        // Extract the item property from each search result
        const products = searchResults.map((result) => result.item);

        return res.status(200).json({
            message: "Products fetched on the basis of query",
            data: products,
        });
    } catch (error) {
        console.error("Error searching products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getProductByCategory = async (req, res) => {
    try {
        const { query } = req.query;

        // Perform the search directly in the database using Mongoose queries
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: "i" } }, // Case-insensitive search for product name
                { description: { $regex: query, $options: "i" } }, // Case-insensitive search for product description
                { category: { $regex: query, $options: "i" } }, // Case-insensitive search for product category
                { tags: { $in: [query] } }, // Search for products with the specified tag
            ],
        });

        return res
            .status(200)
            .json({ message: "Fetched product on category", data: products });
    } catch (error) {
        console.error("Error searching products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    addProduct,
    getAllProduct,
    getProductById,
    deleteProductById,
    getProductByQuery,
    getProductByCategory,
};
