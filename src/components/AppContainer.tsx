import { useState } from 'react';
import WalletConnectButton from './WalletConnectButton';
import UserWalletInfo from './UserWalletInfo';
import ContractInfo from './ContractInfo';
import IssueSharesForm from './IssueSharesForm';
import RedeemSharesForm from './RedeemSharesForm';
import AdminPanel from './AdminPanel';
import TransactionHistory from './TransactionHistory';
import StrategyControllerInfo from './StrategyControllerInfo';

export default function AppContainer() {
  const [account, setAccount] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);

  const handleTransaction = () => {
    setRefresh(refresh + 1);
  };

  return (
    <>
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">PulseStrategy</h1>
        <WalletConnectButton onAccountChange={setAccount} />
      </header>
      <main className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UserWalletInfo account={account} key={refresh} />
          <ContractInfo />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <IssueSharesForm account={account} onTransaction={handleTransaction} />
          <RedeemSharesForm account={account} onTransaction={handleTransaction} />
        </div>
        <AdminPanel account={account} />
        <TransactionHistory account={account} key={refresh} />
        <StrategyControllerInfo />
      </main>
    </>
  );
}
