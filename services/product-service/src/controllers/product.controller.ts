import { Request, Response, NextFunction } from "express";
import Product from "../models/product.model";
import STATUS_CODES from "../utils/statusCodes";
import MESSAGES from "../utils/messages";

// CREATE Product
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.create(req.body);
    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: MESSAGES.PRODUCT.CREATED,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// GET All Products
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await Product.find();
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: MESSAGES.PRODUCT.FETCHED,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// GET Product by ID
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: MESSAGES.PRODUCT.NOT_FOUND,
      });
    }
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: MESSAGES.PRODUCT.FETCHED,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE Product
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: MESSAGES.PRODUCT.NOT_FOUND,
      });
    }

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: MESSAGES.PRODUCT.UPDATED,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE Product
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: MESSAGES.PRODUCT.NOT_FOUND,
      });
    }

    res.status(STATUS_CODES.OK).json({
      success: true,
      message: MESSAGES.PRODUCT.DELETED,
    });
  } catch (error) {
    next(error);
  }
};
