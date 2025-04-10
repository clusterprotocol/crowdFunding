// context/WalletConnectionContext.tsx
import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";

interface WalletContextType {
  isWalletConnected: boolean;
  currentAccount: string | null;
  connectWallet: () => Promise<void>;
}

export const WalletConnectionContext = createContext<WalletContextType>({
  isWalletConnected: false,
  currentAccount: null,
  connectWallet: async () => {},
});

export const WalletConnectionContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [isWalletConnected, setWalletConnected] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setCurrentAccount(accounts[0]);
        setWalletConnected(true);
      } catch (err) {
        console.error("Wallet connection error:", err);
      }
    }
  };

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          setWalletConnected(true);
        }
      }
    };
    checkIfWalletIsConnected();
  }, []);

  return (
    <WalletConnectionContext.Provider value={{ isWalletConnected, currentAccount, connectWallet }}>
      {children}
    </WalletConnectionContext.Provider>
  );
};
