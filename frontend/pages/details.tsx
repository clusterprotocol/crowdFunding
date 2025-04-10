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

// ✅ Define interfaces
interface Campaign {
  owner: string;
  title: string;
  description: string;
  target: string;
  deadline: string | number | { toNumber: () => number };
  amountCollected: string;
  image: string;
  donators: string[];
  donations: string[];
}

interface Donator {
  donator: string;
  donation: string;
}

const Details: React.FC = () => {
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
  }: {
    isCampaignDataLoading: boolean;
    allCampaignsData: Campaign[];
    isDonatorsDataLoading: boolean;
    donatationData: Donator[];
    setCampaignId: (id: string) => void;
    userCampaign: { id: number; data: Campaign }[];
  } = useContext(ContractContext);

  // ✅ Redirect if wallet not connected
  useEffect(() => {
    if (!isWalletConnected) {
      router.push('/');
    }
  }, [isWalletConnected, router]);

  // ✅ Set current campaign ID in context
  useEffect(() => {
    if (id && typeof id === 'string') {
      setCampaignId(id);
    }
  }, [id, setCampaignId]);

  const campaign: Campaign | null =
    typeof id === 'string' && allCampaignsData.length > Number(id)
      ? allCampaignsData[Number(id)]
      : null;

  if (!isWalletConnected) return null;

  if (!campaign || isCampaignDataLoading) {
    return <Typography sx={{ color: 'white' }}>Loading campaign details...</Typography>;
  }

  const { owner, title, description, target, deadline, amountCollected, image } = campaign;
  const targetEther = ethers.utils.formatEther(target);

  const deadlineTimestamp =
    typeof deadline === 'object' && 'toNumber' in deadline
      ? deadline.toNumber()
      : Number(deadline);

  const dayLeft = daysLeft(deadlineTimestamp);

  return (
    <Box>
      <Grid container spacing={5}>
        <Grid item md={12} lg={6}>
          <StyledImageBox alt="The Campaign" src={image} />
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
              {donatationData?.map((data: Donator, index: number) => (
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
};

export default Details;
