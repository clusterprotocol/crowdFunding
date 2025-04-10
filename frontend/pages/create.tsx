import {
  Box,
  Typography,
  Backdrop,
  CircularProgress,
  Grid,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import {
  StyledBox,
  StyledBoxCard,
  StyledInputLable,
  StyledLargeTextField,
  StyledSubmitBtn,
  StyledTextField,
  StyledTitleTypography,
} from '../styles/createCampaignStyles';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { ContractContext } from '../context/ContractContext';

const CreateCampaign: React.FC = () => {
  const [open, setOpenState] = useState(false);
  const [name, setName] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [story, setStory] = useState('');
  const [goal, setGoal] = useState('');
  const [date, setDate] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const { createCampaignCall, isCreateCampaignLoading } = useContext(ContractContext);

  // ✅ Event handlers with correct typing
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleCampaignNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCampaignName(e.target.value);
  };

  const handleStoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStory(e.target.value);
  };

  const handleGoalValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoal(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImgUrl(e.target.value);
  };

  const handleCreateCampaign = () => {
    if (name && campaignName && story && goal && date && imgUrl) {
      createCampaignCall(campaignName, story, goal, new Date(date), imgUrl);
    }
  };
  

  useEffect(() => {
    setOpenState(isCreateCampaignLoading);
  }, [isCreateCampaignLoading]);

  return (
    <>
      <StyledBox>
        <StyledTitleTypography variant="h4">Start Campaign 🚀</StyledTitleTypography>
        <Grid container spacing={2} sx={{ justifyContent: 'center', width: '100%' }}>
          <Grid item md={5.5} sm={11}>
            <StyledInputLable>Your Name*</StyledInputLable>
            <StyledTextField onChange={handleNameChange} value={name} placeholder="Md Raziur Rahaman Ronju" />
          </Grid>
          <Grid item md={5.5} sm={11}>
            <StyledInputLable>Campaign Title*</StyledInputLable>
            <StyledTextField onChange={handleCampaignNameChange} value={campaignName} placeholder="Write a title" />
          </Grid>
          <Grid item xs={11}>
            <StyledInputLable>Story*</StyledInputLable>
            <StyledLargeTextField
              onChange={handleStoryChange}
              value={story}
              rows={10}
              multiline
              placeholder="Write your story"
            />
          </Grid>
          <Grid item xs={11}>
            <StyledBoxCard>
              <CurrencyExchangeIcon />
              <Typography sx={{ fontWeight: 'bold' }} variant="h5">
                You will get 100% of the raised amount.
              </Typography>
            </StyledBoxCard>
          </Grid>
          <Grid item md={5.5} sm={11}>
            <StyledInputLable>Goal*</StyledInputLable>
            <StyledTextField
              type="number"
              onChange={handleGoalValueChange}
              value={goal}
              placeholder="0.10 ETH"
            />
          </Grid>
          <Grid item md={5.5} sm={11}>
            <StyledInputLable>Date*</StyledInputLable>
            <StyledTextField type="date" onChange={handleDateChange} value={date} />
          </Grid>
          <Grid item md={11}>
            <StyledInputLable>Campaign Image*</StyledInputLable>
            <StyledTextField
              onChange={handleImageUrlChange}
              value={imgUrl}
              placeholder="Enter campaign image URL"
            />
          </Grid>
        </Grid>
        <StyledSubmitBtn onClick={handleCreateCampaign}>Submit new campaign</StyledSubmitBtn>
      </StyledBox>

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default CreateCampaign;
