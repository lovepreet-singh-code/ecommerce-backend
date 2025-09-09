import Product, { IProduct } from "../models/product.model";

export const createProduct = async (data: Partial<IProduct>) => {
  const product = new Product(data);
  return product.save();
};

export const getAllProducts = async () => {
  return Product.find();
};

export const getProductById = async (id: string) => {
  return Product.findById(id);
};

export const updateProduct = async (id: string, data: Partial<IProduct>) => {
  return Product.findByIdAndUpdate(id, data, { new: true });
};

export const deleteProduct = async (id: string) => {
  return Product.findByIdAndDelete(id);
};
