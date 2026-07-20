import api from "./api";

export const getWalletSummary = () =>
  api.get("/wallet/summary");

export const getWalletTransactions = () =>
  api.get("/wallet/transactions");