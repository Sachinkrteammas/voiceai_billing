import api from "./api";

export const getSummary = (fromDate, toDate) =>
  api.get("/dashboard/summary", {
    params: {
      from_date: fromDate,
      to_date: toDate,
    },
  });

export const getDailyUsage = (fromDate, toDate) =>
  api.get("/dashboard/daily-usage", {
    params: {
      from_date: fromDate,
      to_date: toDate,
    },
  });

export const getBotBreakdown = (fromDate, toDate) =>
  api.get("/dashboard/bot-breakdown", {
    params: {
      from_date: fromDate,
      to_date: toDate,
    },
  });

export const getDailyBreakdown = (fromDate, toDate) =>
  api.get("/dashboard/daily-breakdown", {
    params: {
      from_date: fromDate,
      to_date: toDate,
    },
  });

export const getCalls = (fromDate, toDate) =>
  api.get("/dashboard/calls", {
    params: {
      from_date: fromDate,
      to_date: toDate,
    },
  });

