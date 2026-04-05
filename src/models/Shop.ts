import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema({
  shop: { type: String, required: true, unique: true },
  accessToken: { type: String, required: true },
});

export const Shop =
  mongoose.models.Shop || mongoose.model("Shop", ShopSchema);