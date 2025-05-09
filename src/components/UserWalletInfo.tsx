import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { contract, vPLSContract } from '../utils/contract';
import { formatNumber } from '../utils/format';

export default function UserWalletInfo({ account }: { account: string | null }) {
  const [plstrBalance, setPlstrBalance] = useState('0');
  const [vplsBalance, setVplsBalance] = useState('0');
  const [redeemableVpls, setRedeemableVpls] = useState('0');

  const fetchData = async () => {
    if (!account) return;
    try {
      const plstr = await contract.balanceOf(account);
      const vpls = await vPLSContract.balanceOf(account);
      const redeemable = await contract.getRedeemableStakedPLS(account, plstr);
      setPlstrBalance(ethers.formatEther(plstr));
      setVplsBalance(ethers.formatEther(vpls));
      setRedeemableVpls(ethers.formatEther(redeemable));
    } catch (error) {
      console.error('Error fetching wallet info:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [account]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 glass"
    >
      <h2 className="text-xl font-bold mb-4">Your Wallet</h2>
      {account ? (
        <>
          <p>PLSTR Balance: {formatNumber(plstrBalance)} PLSTR</p>
          <p>vPLS Balance: {formatNumber(vplsBalance)} vPLS</p>
          <p>Redeemable vPLS: {formatNumber(redeemableVpls)} vPLS</p>
        </>
      ) : (
        <p>Connect your wallet to view balances.</p>
      )}
    </motion.div>
  );
}
