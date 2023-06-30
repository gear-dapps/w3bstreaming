import Identicon from '@polkadot/react-identicon';
import { decodeAddress } from '@gear-js/api';
import { useAccount, useApi } from '@gear-js/react-hooks';
import { Modal } from 'components';
import { cx, copyToClipboard } from '@/utils';
import copyToClipboardSVG from '@/assets/icons/binary-code.svg';
import penEditSVG from '@/assets/icons/pen-edit-icon.svg';
import exitSVG from '@/assets/icons/exit-icon.svg';
import { WALLET } from '../../consts';
import { useWallet } from '../../hooks';
import { WalletItem } from '../WalletItem';
import { WalletEntry, WalletId } from '../../types';

import styles from './WalletModal.module.scss';
import { Button } from '@/ui';
import { WalletModalProps } from './WalletModal.interface';

function WalletModal({ onClose }: WalletModalProps) {
  const { extensions, account, login, logout } = useAccount();
  const { wallet, walletAccounts, setWalletId, resetWalletId, getWalletAccounts, saveWallet, removeWallet } =
    useWallet();

  const getWallets = () =>
    Object.entries(WALLET).map(([id, { SVG, name }]) => {
      const isEnabled = extensions.some((extension) => extension.name === id);

      const accountsCount = getWalletAccounts(id as WalletId).length;
      const accountsStatus = `${accountsCount} ${accountsCount === 1 ? 'account' : 'accounts'}`;

      const onClick = () => setWalletId(id as WalletId);

      return (
        <li key={id}>
          <button type="button" className={cx(styles['wallet-button'])} onClick={onClick} disabled={!isEnabled}>
            <WalletItem icon={SVG} name={name} />
            <div className={cx(styles.status)}>
              <p className={cx(styles['status-text'])}>{isEnabled ? 'Enabled' : 'Disabled'}</p>
              {isEnabled && <p className={cx(styles['status-accounts'])}>{accountsStatus}</p>}
            </div>
          </button>
        </li>
      );
    });

  const getAccounts = () =>
    walletAccounts?.map((_account) => {
      const { address, meta } = _account;
      const isActive = address === account?.address;

      const handleClick = () => {
        login(_account);
        saveWallet();
        onClose();
      };

      const handleCopyClick = () => {
        const decodedAddress = decodeAddress(address);

        copyToClipboard(decodedAddress);
        onClose();
      };

      return (
        <li key={address} className={styles.account}>
          <button
            type="button"
            className={cx(styles['account-button'], isActive ? styles.active : '')}
            onClick={handleClick}
            disabled={isActive}>
            <Identicon value={address} size={21} theme="polkadot" />
            <span>{meta.name}</span>
          </button>
          <Button variant="icon" label="" icon={copyToClipboardSVG} onClick={handleCopyClick} />
        </li>
      );
    });

  const handleLogoutButtonClick = () => {
    logout();
    removeWallet();
    onClose();
  };

  return (
    <Modal heading={wallet ? 'Connect wallet' : 'Wallet connection'} onClose={onClose}>
      <ul className={cx(styles.list)}>{getAccounts() || getWallets()}</ul>
      {wallet && (
        <footer className={cx(styles.footer)}>
          <button type="button" className={cx(styles['wallet-button'])} onClick={resetWalletId}>
            <WalletItem icon={wallet.SVG} name={wallet.name} />
            <img src={penEditSVG} alt="edit" />
          </button>
          {account && (
            <div className={cx(styles['logout-button-container'])}>
              <Button variant="icon" size="small" label="" icon={exitSVG} />
              <button className={cx(styles['logout-button'])} onClick={handleLogoutButtonClick}>
                Exit
              </button>
            </div>
          )}
        </footer>
      )}
    </Modal>
  );
}

export { WalletModal };
