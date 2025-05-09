import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { formatAddress } from '../utils/format';

export default function WalletConnectButton({ onAccountChange }: { onAccountChange: (account: string | null) => void }) {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        setAccount(accounts[0]);
        onAccountChange(accounts[0]);
      } catch (error) {
        alert('Connection failed: ' + error.message);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
        onAccountChange(accounts[0] || null);
      });
    }
  }, [onAccountChange]);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg"
      onClick={connectWallet}
    >
      {account ? `Connected: ${formatAddress(account)}` : 'Connect Wallet'}
    </motion.button>
  );
}
