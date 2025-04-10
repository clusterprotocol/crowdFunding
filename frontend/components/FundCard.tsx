import React, { useState, useContext, useEffect } from 'react';
import {
  Backdrop,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import {
  StyledFundCardBtn,
  StyledFundTextField,
  StyledTitleTypography,
} from '../styles/detailsStyle';
import {
  StyledBox,
  StyledSubBox,
  StyledTitle,
} from '../styles/fundCardStyles';
import { ContractContext } from '../context/ContractContext';

interface FundCardProps {
  id: string | number;
}

const FundCard: React.FC<FundCardProps> = ({ id }) => {
  const { donateCampaignCall, isDonateLoading } = useContext(ContractContext);

  

  const [open, setOpenState] = useState(false);
  const [amount, setAmount] = useState('');

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleOnBtnClick = async () => {
    if (!amount) return;

    await donateCampaignCall(Number(id), amount);
    setAmount('');
  };

  useEffect(() => {
    setOpenState(isDonateLoading);
  }, [isDonateLoading]);

  return (
    <>
      <StyledBox>
        <StyledTitleTypography>Fund</StyledTitleTypography>
        <StyledSubBox>
          <StyledTitle>Pledge without reward</StyledTitle>
          <StyledFundTextField
            onChange={handleValueChange}
            value={amount}
            type="number"
            placeholder="0.1 ETH"
            disabled={isDonateLoading}
          />
          <StyledFundCardBtn
            onClick={handleOnBtnClick}
            disabled={isDonateLoading || !amount}
          >
            {isDonateLoading ? 'Processing...' : 'Fund Campaign'}
          </StyledFundCardBtn>
        </StyledSubBox>
      </StyledBox>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default FundCard;
