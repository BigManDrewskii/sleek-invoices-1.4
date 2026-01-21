import axios from "axios";
import * as db from "./db";

/**
 * Fetch latest exchange rates from external API
 * Using exchangerate-api.com (free tier: 1500 requests/month)
 */
export async function fetchExchangeRates(): Promise<Record<string, number>> {
  try {
    // Free API endpoint (no key required for basic usage)
    const response = await axios.get(
      "https://api.exchangerate-api.com/v4/latest/USD",
      { timeout: 5000 } // 5 second timeout
    );

    if (response.data && response.data.rates) {
      return response.data.rates as Record<string, number>;
    }

    throw new Error("Invalid response from exchange rate API");
  } catch (error) {
    console.error("[Currency] Failed to fetch exchange rates:", error);
    console.warn("[Currency] Using fallback exchange rates");

    // Fallback to hardcoded rates (USD as base)
    return {
      USD: 1,
      EUR: 0.92,
      GBP: 0.79,
      JPY: 149.5,
      CAD: 1.36,
      AUD: 1.53,
      CHF: 0.88,
      CNY: 7.24,
      INR: 83.12,
    };
  }
}

/**
 * Update exchange rates in database
 */
export async function updateExchangeRates(): Promise<void> {
  try {
    console.log("[Currency] Fetching latest exchange rates...");
    const rates = await fetchExchangeRates();

    console.log("[Currency] Updating database with new rates...");
    await db.updateExchangeRates(rates);

    console.log("[Currency] Exchange rates updated successfully");
  } catch (error) {
    console.error("[Currency] Failed to update exchange rates:", error);
    throw error;
  }
}

/**
 * Initialize default currencies if not already in database
 */
export async function initializeDefaultCurrencies(): Promise<void> {
  const currencies = await db.getAllCurrencies();

  if (currencies.length > 0) {
    console.log("[Currency] Currencies already initialized");
    return;
  }

  console.log("[Currency] Initializing default currencies...");

  // Fetch current rates
  const rates = await fetchExchangeRates();

  // Common currencies to initialize
  const defaultCurrencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
  ];

  for (const currency of defaultCurrencies) {
    const rate = rates[currency.code] || 1;

    await db.createCurrency({
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      exchangeRateToUSD: rate.toString(),
      isActive: 1,
    });
  }

  console.log("[Currency] Default currencies initialized");
}
