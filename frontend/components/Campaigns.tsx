import React, { useContext } from 'react';
import { Grid, Typography, Backdrop, CircularProgress } from '@mui/material';
import { CampaignCard } from '.';
import { ContractContext } from '../context/ContractContext';

const Campains = () => {
  const { isCampaignDataLoading, allCampaignsData } = useContext(ContractContext);

  if (isCampaignDataLoading) {
    return (
      <Backdrop open sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <>
      <Typography sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>All Campaigns</Typography>
      <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
        {allCampaignsData?.map((campaign: any, index: number) => (
          <CampaignCard id={index} data={campaign} key={index} />
        ))}
      </Grid>
    </>
  );
};

export default Campains;
