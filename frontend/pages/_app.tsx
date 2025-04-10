// pages/_app.tsx
import type { AppProps } from "next/app";
import "../styles/globals.css";
import theme from '../styles/theme'
import { ThemeProvider } from "@emotion/react";
import { ResponsiveDrawer } from "../components";
import { WalletConnectionContextProvider } from "../context/WalletConnectionContext";
import { ContractContextProvider } from "../context/ContractContext";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={theme}>
      <WalletConnectionContextProvider>
        <ContractContextProvider>
          <ResponsiveDrawer>
            <Component {...pageProps} />
          </ResponsiveDrawer>
        </ContractContextProvider>
      </WalletConnectionContextProvider>
    </ThemeProvider>
  );
}

export default MyApp;
