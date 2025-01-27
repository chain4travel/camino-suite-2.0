import { GenerateKeyPhrase } from '../../components/create-wallet/generate-key-phrase';
import MnemonicKeys from '../../components/create-wallet/mnemonic-keys';
import { useState } from 'react';

export const CreateWallet = () => {
  const [GenerateKeys, setGenerateKeys] = useState<boolean>(false);


  const handleGenerateKeys = () => {
    setGenerateKeys(true);
  }

  const handleComplete = () => {
    setGenerateKeys(false);
  }

  const renderCreateWallet = () => {
    if (!GenerateKeys) {
      return <GenerateKeyPhrase handleGenerateKeys={handleGenerateKeys} />
    }
    return <MnemonicKeys onComplete={handleComplete} />
  }

  return (
    <div className="flex items-center justify-center h-full p-4">
      {renderCreateWallet()}
    </div>
  );
}
