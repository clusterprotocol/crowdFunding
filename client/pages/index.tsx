import { useContext } from 'react';
import { Box, Button } from "@mui/material";
import type { NextPage } from "next";
import { Campaigns } from "../components";
import { WalletConnectionContext } from "../context/WalletConnectionContext";

const Home: NextPage = () => {
  const { isWalletConnected, connectWallet } = useContext(WalletConnectionContext);

  if (!isWalletConnected) {
    return (
      <Box sx={{ width: '100%', height: "100vh", display: 'flex', justifyContent: 'center', alignItems: 'center', p: 0 }}>
        <Button variant="contained" onClick={connectWallet}>
          Connect Wallet
        </Button>
      </Box>
    );
  } else {
    return <Campaigns />;
  }
};

export default Home;
