import React, { useContext, useEffect } from 'react';
import { Grid, Box, Avatar, Typography } from '@mui/material';
import {
  StyledAddressTypography,
  StyledFlexColBox,
  StyledFlexRowBox,
  StyledImageBox,
  StyledTextTypograhy,
  StyledTitleTypography,
} from '../styles/detailsStyle';
import { DetailInfoCard } from '../components';
import DonationCard from '../components/DonationCard';
import FundCard from '../components/FundCard';
import { useRouter } from 'next/router';
import { WalletConnectionContext } from '../context/WalletConnectionContext';
import { ContractContext } from '../context/ContractContext';
import { daysLeft } from '../utils';
import { ethers } from 'ethers';

function Details() {
  const router = useRouter();
  const { id } = router.query;

  const { isWalletConnected } = useContext(WalletConnectionContext);
  const {
    isCampaignDataLoading,
    allCampaignsData,
    isDonatorsDataLoading,
    donatationData,
    setCampaignId,
    userCampaign,
  } = useContext(ContractContext);

  // ✅ Step 1: Redirect if not connected
  useEffect(() => {
    if (!isWalletConnected) {
      router.push('/');
    }
  }, [isWalletConnected]);

  // ✅ Step 2: Set campaign ID for fetching donators
  useEffect(() => {
    if (id) {
      setCampaignId(id as string);
    }
  }, [id]);

  // ✅ Step 3: Guard for loading
  const campaign = id ? allCampaignsData?.[Number(id)] : null;

  if (!isWalletConnected) return null;

  if (!campaign || isCampaignDataLoading) {
    return <Typography sx={{ color: 'white' }}>Loading campaign details...</Typography>;
  }

  // ✅ Step 4: Destructure safely
  const { owner, title, description, target, deadline, amountCollected, image } = campaign;

  const targetEther = ethers.utils.formatEther(target);
  const deadlineTimestamp =
    typeof deadline === 'object' && deadline.toNumber ? deadline.toNumber() : Number(deadline);
  const dayLeft = daysLeft(deadlineTimestamp);

  return (
    <Box>
      <Grid container spacing={5}>
        <Grid item md={12} lg={6}>
          <StyledImageBox component="img" alt="The Campaign" src={image} />
        </Grid>
        <Grid lg={6} item md={12}>
          <Box sx={{ display: 'flex', gap: 6, justifyContent: 'center', flexDirection: 'column' }}>
            <StyledFlexColBox>
              <StyledTitleTypography variant="h5">Creator</StyledTitleTypography>
              <StyledFlexRowBox>
                <Avatar />
                <StyledFlexColBox sx={{ gap: '0!important' }}>
                  <StyledAddressTypography>{owner}</StyledAddressTypography>
                  <Typography sx={{ color: 'gray' }}>
                    {(userCampaign?.length ?? 0)} Campaigns
                  </Typography>
                </StyledFlexColBox>
              </StyledFlexRowBox>
            </StyledFlexColBox>

            <StyledFlexRowBox>
              <DetailInfoCard value={donatationData?.length ?? 0} desc="Total Backers" />
              <DetailInfoCard value={targetEther} desc={`Raised ${targetEther}`} />
              <DetailInfoCard value={dayLeft} desc="Day Left" />
            </StyledFlexRowBox>
          </Box>
        </Grid>
      </Grid>

      <Grid spacing={10} container>
        <Grid lg={10} xl={7} item>
          <StyledFlexColBox>
            <StyledTitleTypography variant="h5">Story</StyledTitleTypography>
            <StyledTextTypograhy>{description}</StyledTextTypograhy>
          </StyledFlexColBox>

          <StyledFlexColBox>
            <StyledTitleTypography variant="h5">Donation</StyledTitleTypography>
            <Box>
              {donatationData?.map((data, index) => (
                <DonationCard key={index} index={index} data={data} />
              ))}
            </Box>
          </StyledFlexColBox>
        </Grid>

        <Grid lg={10} xl={3} item>
          <FundCard id={id as string} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Details;
