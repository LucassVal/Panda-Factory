/**
 * 📜 Google Apps Script (GAS) Connection Hook
 * ============================================
 * Handles all GAS endpoint calls
 */

import { useState, useCallback } from "react";

/**
 * GAS Deployment URL
 * Replace with your actual GAS web app URL
 */
const GAS_URL =
  import.meta.env.VITE_GAS_URL ||
  "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";

/**
 * GAS API Endpoints mapped to actions
 */
const GAS_ACTIONS = {
  // Admin
  KILL_SWITCH: "killSwitch",
  GET_METRICS: "getMetrics",
  GET_USERS: "getUsers",
  GET_ERRORS: "getErrors",

  // Transactions
  GET_TRANSACTIONS: "getTransactions",
  GET_TREASURY: "getTreasury",

  // User
  GET_USER_DATA: "getUserData",
  UPDATE_USER: "updateUser",

  // Health
  HEALTH_CHECK: "healthCheck",
};

/**
 * Call GAS endpoint
 */
async function callGAS(action, params = {}, signature = null) {
  const url = new URL(GAS_URL);
  url.searchParams.append("action", action);

  // Add params
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  // Add signature if provided (for protected actions)
  if (signature) {
    url.searchParams.append("signature", signature);
  }

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`GAS request failed: ${response.status}`);
      return {
        success: false,
        error: `GAS request failed: ${response.status}`,
        isolated: true,
      };
    }

    const data = await response.json();

    if (data.error) {
      console.error(`GAS error: ${data.error}`);
      return { success: false, error: data.error, isolated: true };
    }

    return { success: true, ...data };
  } catch (error) {
    console.error(`GAS call failed [${action}]:`, error);
    return { success: false, error: error.message, action, isolated: true };
  }
}

/**
 * useGAS Hook
 * Provides convenient methods for all GAS endpoints
 */
export function useGAS() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Execute GAS action with loading state
   */
  const execute = useCallback(async (action, params = {}, signature = null) => {
    setIsLoading(true);
    setError(null);

    const result = await callGAS(action, params, signature);

    if (!result.success) {
      setError(result.error);
    }

    setIsLoading(false);
    return result;
  }, []);

  /**
   * Health Check
   */
  const healthCheck = useCallback(async () => {
    return execute(GAS_ACTIONS.HEALTH_CHECK);
  }, [execute]);

  /**
   * Get Founder Metrics
   */
  const getMetrics = useCallback(async () => {
    return execute(GAS_ACTIONS.GET_METRICS);
  }, [execute]);

  /**
   * Get Treasury Data
   */
  const getTreasury = useCallback(async () => {
    return execute(GAS_ACTIONS.GET_TREASURY);
  }, [execute]);

  /**
   * Get Transactions
   */
  const getTransactions = useCallback(
    async (limit = 10) => {
      return execute(GAS_ACTIONS.GET_TRANSACTIONS, { limit });
    },
    [execute],
  );

  /**
   * Get Users List
   */
  const getUsers = useCallback(async () => {
    return execute(GAS_ACTIONS.GET_USERS);
  }, [execute]);

  /**
   * Get Errors
   */
  const getErrors = useCallback(async () => {
    return execute(GAS_ACTIONS.GET_ERRORS);
  }, [execute]);

  /**
   * KILL SWITCH - Emergency stop all services
   * Requires Ed25519 signature
   */
  const killSwitch = useCallback(
    async (signature, reason = "") => {
      if (!signature) {
        console.error("Ed25519 signature required for kill switch");
        return {
          success: false,
          error: "Ed25519 signature required for kill switch",
          isolated: true,
        };
      }

      console.warn("⚠️ KILL SWITCH ACTIVATED");

      return execute(GAS_ACTIONS.KILL_SWITCH, { reason }, signature);
    },
    [execute],
  );

  /**
   * Get User Data
   */
  const getUserData = useCallback(
    async (uid) => {
      return execute(GAS_ACTIONS.GET_USER_DATA, { uid });
    },
    [execute],
  );

  /**
   * Update User
   */
  const updateUser = useCallback(
    async (uid, data) => {
      return execute(GAS_ACTIONS.UPDATE_USER, {
        uid,
        data: JSON.stringify(data),
      });
    },
    [execute],
  );

  return {
    isLoading,
    error,
    clearError: () => setError(null),

    // Methods
    healthCheck,
    getMetrics,
    getTreasury,
    getTransactions,
    getUsers,
    getErrors,
    getUserData,
    updateUser,

    // Protected
    killSwitch,

    // Raw
    execute,
  };
}

/**
 * GAS Actions enum for external use
 */
export { GAS_ACTIONS };

export default useGAS;
