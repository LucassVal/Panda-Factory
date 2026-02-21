import { useState, useEffect, useCallback, useRef } from "react";
import { firebaseDB } from "./useFirebase";
import { Wallet } from "../services/callGAS";

/**
 * 💰 useWallet v1.0 — Real-time Panda Coin Wallet
 * Subscribes to Firebase RTDB for live balance updates.
 * Falls back to mock data when Firebase is unavailable.
 *
 * @see useFirebase.js §Wallet RTDB helpers
 * @see callGAS.js §Wallet
 * @see PF_MASTER_ARCHITECTURE.md §Economy
 */

// ── Mock fallback data ──
const MOCK_BALANCE = 500;
const MOCK_TRANSACTIONS = [
  {
    id: "tx-001",
    type: "credit",
    amount: 500,
    description: "Welcome Bonus",
    timestamp: Date.now() - 86400000 * 3,
    source: "system",
  },
  {
    id: "tx-002",
    type: "credit",
    amount: 100,
    description: "Monthly Free Credits",
    timestamp: Date.now() - 86400000 * 2,
    source: "system",
  },
  {
    id: "tx-003",
    type: "debit",
    amount: 50,
    description: "CRM Module Install",
    timestamp: Date.now() - 86400000,
    source: "store",
  },
  {
    id: "tx-004",
    type: "credit",
    amount: 30,
    description: "Mining Reward (Partner Mode)",
    timestamp: Date.now() - 3600000,
    source: "mining",
  },
];

// PC → BRL conversion rate (1 PC = R$ 0.01)
const PC_TO_BRL = 0.01;

export function useWallet(uid) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("loading"); // "real" | "mock" | "loading"
  const unsubRef = useRef(null);

  // ── Subscribe to real-time balance from RTDB ──
  useEffect(() => {
    if (!uid) {
      setMode("mock");
      setBalance(MOCK_BALANCE);
      setTransactions(MOCK_TRANSACTIONS);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const init = async () => {
      try {
        // Try real Firebase subscription
        const unsub = firebaseDB.subscribeWalletBalance(uid, (val) => {
          if (!cancelled) {
            setBalance(val || 0);
            setMode("real");
          }
        });
        unsubRef.current = unsub;

        // Fetch transaction history
        const history = await firebaseDB.getWalletHistory(uid);
        if (!cancelled) {
          setTransactions(history.length > 0 ? history : MOCK_TRANSACTIONS);
          setIsLoading(false);
        }
      } catch (err) {
        console.warn(
          "💰 Wallet: Firebase unavailable, using mock:",
          err.message,
        );
        if (!cancelled) {
          setMode("mock");
          setBalance(MOCK_BALANCE);
          setTransactions(MOCK_TRANSACTIONS);
          setError(null); // mock is fine, not an error
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      cancelled = true;
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
    };
  }, [uid]);

  // ── Computed values ──
  const balanceBRL = (balance * PC_TO_BRL).toFixed(2);

  // ── Actions ──
  const recharge = useCallback(async (amount) => {
    try {
      const result = await Wallet.recharge(amount);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!uid) return;
    setIsLoading(true);
    try {
      const [bal, history] = await Promise.all([
        firebaseDB.getWalletBalance(uid),
        firebaseDB.getWalletHistory(uid),
      ]);
      setBalance(bal);
      setTransactions(history.length > 0 ? history : MOCK_TRANSACTIONS);
      setMode("real");
    } catch {
      setMode("mock");
      setBalance(MOCK_BALANCE);
      setTransactions(MOCK_TRANSACTIONS);
    } finally {
      setIsLoading(false);
    }
  }, [uid]);

  return {
    balance,
    balanceBRL,
    transactions,
    isLoading,
    error,
    mode,
    recharge,
    refresh,
    pcToBRL: PC_TO_BRL,
  };
}
