import { Box, List } from '@mui/material';
import React, { useState, useContext } from 'react';
import { sideBarItems } from '../utils/drawerItems';
import { StyledMenuItem } from '../styles/drawerStyles';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { useRouter } from 'next/router';
import { WalletConnectionContext } from '../context/WalletConnectionContext';

const SideBarItems = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const router = useRouter();
  const { connectWallet } = useContext(WalletConnectionContext);

  const disconnectWallet = () => {
    // You can enhance this logic to actually clear connection state
    // For now, we just simulate disconnect
    if (typeof window.ethereum !== "undefined") {
      // Optionally clear cached state here
      window.location.reload(); // Quick workaround
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
    <Box sx={{ pt: 1.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <List>
        {sideBarItems.map((item, index) => (
          <Box key={index} sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 3 }}>
            <StyledMenuItem onClick={() => handleSideBarItemClick(index)} selected={selectedMenu === index}>
              <item.icon />
            </StyledMenuItem>
          </Box>
        ))}
      </List>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
        <StyledMenuItem>
          <LightModeOutlinedIcon />
        </StyledMenuItem>
      </Box>
    </Box>
  );
};

export default SideBarItems;
