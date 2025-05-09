import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { contract, vPLSContract } from '../utils/contract';
import { formatNumber } from '../utils/format';

export default function IssueSharesForm({ account, onTransaction }: { account: string | null; onTransaction: () => void }) {
  const [amount, setAmount] = useState('');
  const [shares, setShares] = useState('0');
  const [fee, setFee] = useState('0');
  const [loading, setLoading] = useState(false);

  const calculateShares = async (input: string) => {
    if (!input) {
      setShares('0');
      setFee('0');
      return;
    }
    try {
      const [sharesReceived, feeReceived] = await contract.calculateSharesReceived(ethers.parseEther(input));
      setShares(ethers.formatEther(sharesReceived));
      setFee(ethers.formatEther(feeReceived));
    } catch (error) {
      console.error('Error calculating shares:', error);
    }
  };

  const approveVPLS = async () => {
    if (!account || !window.ethereum) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await vPLSContract.connect(signer).approve(contractAddress, ethers.parseEther(amount));
      await tx.wait();
      return true;
    } catch (error) {
      alert('Approval failed: ' + error.message);
      return false;
    }
  };

  const issueShares = async () => {
    if (!account || !window.ethereum) return alert('Please connect your wallet!');
    setLoading(true);
    try {
      const approved = await approveVPLS();
      if (!approved) throw new Error('Approval not granted');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await contract.connect(signer).issueShares(ethers.parseEther(amount));
      await tx.wait();
      alert('Shares issued successfully!');
      onTransaction();
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    calculateShares(amount);
  }, [amount]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 glass"
    >
      <h2 className="text-xl font-bold mb-4">Issue PLSTR</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="p-2 rounded bg-gray-900 text-white w-full mb-2"
        placeholder="Enter vPLS amount"
      />
      <p className="text-sm text-gray-400 mb-4">Minimum PLSTR received: 2,000 PLSTR</p>
      <p>PLSTR Received: {formatNumber(shares)} PLSTR</p>
      <p>Fee (0.5%): {formatNumber(fee)} vPLS</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={issueShares}
        disabled={loading || !account}
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg w-full"
      >
        {loading ? 'Processing...' : 'Issue PLSTR'}
      </motion.button>
    </motion.div>
  );
}
