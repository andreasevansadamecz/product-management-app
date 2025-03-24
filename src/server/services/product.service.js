// server/services/product.service.js
import Product from "../models/Product.js";

export default {
  async search({ page = 1, perPage = 5 }) {
    const skip = (page - 1) * perPage;
    const total = await Product.countDocuments();

    const records = await Product.find()
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: -1 });

    return {
      pagination: {
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
        totalRecords: total,
      },
      records,
    };
  },

  async create(data) {
    return await Product.create(data);
  },

  async retrieve(id) {
    return await Product.findById(id);
  },

  async update(id, data) {
    return await Product.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id) {
    return await Product.findByIdAndDelete(id);
  },
};
