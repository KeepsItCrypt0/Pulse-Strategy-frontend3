import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { contract } from '../utils/contract';
import { formatNumber, formatDate } from '../utils/format';

export default function AdminPanel({ account }: { account: string | null }) {
  const [isOwner, setIsOwner] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [recoverToken, setRecoverToken] = useState('');
  const [recoverRecipient, setRecoverRecipient] = useState('');
  const [recoverAmount, setRecoverAmount] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [nextMintTime, setNextMintTime] = useState('0');
  const [issuanceEnd, setIssuanceEnd] = useState('0');
  const [loading, setLoading] = useState(false);

  const fetchOwnerData = async () => {
    if (!account) return;
    try {
      const owner = await contract.owner();
      setIsOwner(owner.toLowerCase() === account.toLowerCase());
      if (isOwner) {
        const [_, period] = await contract.getContractInfo();
        setIssuanceEnd(period.toString());
        const nextMint = await contract.getOwnerMintInfo();
        setNextMintTime(nextMint.toString());
      }
    } catch (error) {
      console.error('Error fetching owner data:', error);
    }
  };

  const depositStakedPLS = async () => {
    if (!account || !window.ethereum) return;
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await contract.connect(signer).depositStakedPLS(ethers.parseEther(depositAmount));
      await tx.wait();
      alert('vPLS deposited successfully!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  const mintShares = async () => {
    if (!account || !window.ethereum) return;
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await contract.connect(signer).mintShares(ethers.parseEther(mintAmount));
      await tx.wait();
      alert('Shares minted successfully!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  const recoverTokens = async () => {
    if (!account || !window.ethereum) return;
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await contract.connect(signer).recoverTokens(recoverToken, recoverRecipient, ethers.parseEther(recoverAmount));
      await tx.wait();
      alert('Tokens recovered successfully!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  const transferOwnership = async () => {
    if (!account || !window.ethereum) return;
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await contract.connect(signer).transferOwnership(newOwner);
      await tx.wait();
      alert('Ownership transferred successfully!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOwnerData();
  }, [account]);

  if (!isOwner) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 glass"
    >
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      <p>Issuance End: {issuanceEnd ? formatDate(Number(issuanceEnd)) : 'N/A'}</p>
      <p>Next Mint: {nextMintTime ? formatDate(Number(nextMintTime)) : 'N/A'}</p>
      <div className="mt-4">
        <h3 className="font-bold">Deposit vPLS</h3>
        <input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          className="p-2 rounded bg-gray-900 text-white w-full mb-2"
          placeholder="Enter vPLS amount"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={depositStakedPLS}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg w-full"
        >
          {loading ? 'Processing...' : 'Deposit vPLS'}
        </motion.button>
      </div>
      <div className="mt-4">
        <h3 className="font-bold">Mint PLSTR</h3>
        <input
          type="number"
          value={mintAmount}
          onChange={(e) => setMintAmount(e.target.value)}
          className="p-2 rounded bg-gray-900 text-white w-full mb-2"
          placeholder="Enter PLSTR amount"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={mintShares}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg w-full"
        >
          {loading ? 'Processing...' : 'Mint PLSTR'}
        </motion.button>
      </div>
      <div className="mt-4">
        <h3 className="font-bold">Recover Tokens</h3>
        <input
          type="text"
          value={recoverToken}
          onChange={(e) => setRecoverToken(e.target.value)}
          className="p-2 rounded bg-gray-900 text-white w-full mb-2"
          placeholder="Token address"
        />
        <input
          type="text"
          value={recoverRecipient}
          onChange={(e) => setRecoverRecipient(e.target.value)}
          className="p-2 rounded bg-gray-900 text-white w-full mb-2"
          placeholder="Recipient address"
        />
        <input
          type="number"
          value={recoverAmount}
          onChange={(e) => setRecoverAmount(e.target.value)}
          className="p-2 rounded bg-gray-900 text-white w-full mb-2"
          placeholder="Amount"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={recoverTokens}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg w-full"
        >
          {loading ? 'Processing...' : 'Recover Tokens'}
        </motion.button>
      </div>
      <div className="mt-4">
        <h3 className="font-bold">Transfer Ownership</h3>
        <input
          type="text"
          value={newOwner}
          onChange={(e) => setNewOwner(e.target.value)}
          className="p-2 rounded bg-gray-900 text-white w-full mb-2"
          placeholder="New owner address"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={transferOwnership}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg w-full"
        >
          {loading ? 'Processing...' : 'Transfer Ownership'}
        </motion.button>
      </div>
    </motion.div>
  );
          }
