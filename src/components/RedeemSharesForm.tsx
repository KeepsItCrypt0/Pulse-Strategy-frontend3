import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { contract } from '../utils/contract';
import { formatNumber } from '../utils/format';

export default function RedeemSharesForm({ account, onTransaction }: { account: string | null; onTransaction: () => void }) {
  const [amount, setAmount] = useState('');
  const [redeemableVpls, setRedeemableVpls] = useState('0');
  const [plstrBalance, setPlstrBalance] = useState('0');
  const [loading, setLoading] = useState(false);

  const fetchBalance = async () => {
    if (!account) return;
    try {
      const balance = await contract.balanceOf(account);
      setPlstrBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const calculateRedeemable = async (input: string) => {
    if (!input || !account) {
      setRedeemableVpls('0');
      return;
    }
    try {
      const redeemable = await contract.getRedeemableStakedPLS(account, ethers.parseEther(input));
      setRedeemableVpls(ethers.formatEther(redeemable));
    } catch (error) {
      console.error('Error calculating redeemable:', error);
    }
  };

  const redeemShares = async () => {
    if (!account || !window.ethereum) return alert('Please connect your wallet!');
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await contract.connect(signer).redeemShares(ethers.parseEther(amount));
      await tx.wait();
      alert('Shares redeemed successfully!');
      onTransaction();
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBalance();
    calculateRedeemable(amount);
  }, [account, amount]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 glass"
    >
      <h2 className="text-xl font-bold mb-4">Redeem PLSTR</h2>
      <p>PLSTR Balance: {formatNumber(plstrBalance)} PLSTR</p>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="p-2 rounded bg-gray-900 text-white w-full mb-4"
        placeholder="Enter PLSTR amount"
      />
      <p>Redeemable vPLS: {formatNumber(redeemableVpls)} vPLS</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={redeemShares}
        disabled={loading || !account}
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg w-full"
      >
        {loading ? 'Processing...' : 'Redeem PLSTR'}
      </motion.button>
    </motion.div>
  );
}
