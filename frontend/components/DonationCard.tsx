import React from 'react';
import { Box } from '@mui/material';
import {
  StyledFlexColBox,
  StyledTextTypograhy,
  StyledTitleTypography,
} from '../styles/detailsStyle';

interface DonationData {
  donator: string;
  donation: string;
}

interface DonationCardProps {
  index: number;
  data: DonationData;
}

const DonationCard: React.FC<DonationCardProps> = ({ index, data }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      <StyledTextTypograhy>
        {index + 1}. {data.donator}
      </StyledTextTypograhy>
      <StyledTextTypograhy>{data.donation} ETH</StyledTextTypograhy>
    </Box>
  );
};

export default DonationCard;
