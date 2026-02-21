/**
 * 📜 useLicenses.js — License Management Hook (TICKET-12)
 *
 * Queries and caches user module licenses from RTDB via callGAS.
 * Used by PFStore to show install/open state and by modules to verify access.
 *
 * @version 1.0.0
 */

import { useState, useEffect, useCallback } from "react";
import { License } from "../services/callGAS";

/**
 * @param {Object} options
 * @param {boolean} options.autoFetch - Fetch licenses on mount (default: true)
 * @returns {{ licenses, isLicensed, loading, error, refresh }}
 */
export default function useLicenses({ autoFetch = true } = {}) {
  const [licenses, setLicenses] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all licenses from RTDB via GAS
  const fetchLicenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await License.list();
      if (result?.status === "SUCCESS") {
        setLicenses(result.licenses || {});
      } else {
        throw new Error(result?.error || "Failed to fetch licenses");
      }
    } catch (err) {
      console.warn("📜 License fetch failed, using cache:", err.message);
      // Try localStorage cache
      try {
        const cached = localStorage.getItem("pf_licenses");
        if (cached) setLicenses(JSON.parse(cached));
      } catch (_) {
        /* ignore */
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if a specific module is licensed
  const isLicensed = useCallback(
    (moduleId) => {
      const lic = licenses[moduleId];
      return !!lic && lic.status === "ACTIVE";
    },
    [licenses],
  );

  // Persist to localStorage for offline use
  useEffect(() => {
    if (Object.keys(licenses).length > 0) {
      localStorage.setItem("pf_licenses", JSON.stringify(licenses));
    }
  }, [licenses]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) fetchLicenses();
  }, [autoFetch, fetchLicenses]);

  return {
    licenses,
    isLicensed,
    loading,
    error,
    count: Object.keys(licenses).length,
    refresh: fetchLicenses,
  };
}
