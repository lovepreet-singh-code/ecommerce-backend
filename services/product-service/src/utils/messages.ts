const MESSAGES = {
  PRODUCT: {
    CREATED: "Product created successfully",
    FETCHED: "Product fetched successfully",
    UPDATED: "Product updated successfully",
    DELETED: "Product deleted successfully",
    NOT_FOUND: "Product not found",
  },
  AUTH: {
    UNAUTHORIZED: "Unauthorized, please login",
    FORBIDDEN: "You do not have permission to perform this action",
    INVALID_TOKEN: "Invalid or expired token",
  },
  ERROR: {
    INTERNAL_SERVER_ERROR: "Something went wrong",
  },
} as const;

export default MESSAGES;
