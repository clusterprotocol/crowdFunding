// components/SideBarItems.tsx

import { Box, List } from '@mui/material';
import React, { useState, useContext } from 'react';
import { sideBarItems } from '../utils/drawerItems';
import { StyledMenuItem } from '../styles/drawerStyles';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { useRouter } from 'next/router';
import { WalletConnectionContext } from '../context/WalletConnectionContext';

export interface EthereumProvider {
  isMetaMask?: boolean;
  selectedAddress?: string;
  chainId?: string;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeListener: (event: string, callback: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

const SideBarItems: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState<number>(0);
  const router = useRouter();
  const { isWalletConnected } = useContext(WalletConnectionContext);

  const disconnectWallet = () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      console.log("Disconnecting wallet...");
      // Optional: Add wallet-specific disconnect logic here
      window.location.reload(); // Quick refresh to reset session
    } else {
      console.warn("No wallet provider detected.");
    }
  };

  const handleSideBarItemClick = (index: number) => {
    if (index === sideBarItems.length - 1) {
      disconnectWallet();
    } else {
      setSelectedMenu(index);
      router.push(sideBarItems[index].route);
    }
  };

  return (
    <Box
      sx={{
        pt: 1.5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <List>
        {sideBarItems.map((item, index) => (
          <Box
            key={index}
            sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 3 }}
          >
            <StyledMenuItem
              onClick={() => handleSideBarItemClick(index)}
              selected={selectedMenu === index}
            >
              <item.icon />
            </StyledMenuItem>
          </Box>
        ))}
      </List>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <StyledMenuItem>
          <LightModeOutlinedIcon />
        </StyledMenuItem>
      </Box>
    </Box>
  );
};

export default SideBarItems;
