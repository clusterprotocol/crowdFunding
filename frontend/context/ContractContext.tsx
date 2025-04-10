import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { WalletConnectionContext } from "./WalletConnectionContext";
import abi from "../contracts/CrowdFunding-abi.json";
import deployedAddress from "../contracts/CrowdFunding-address.json";

const CONTRACT_ADDRESS = deployedAddress.address;

interface Campaign {
  owner: string;
  title: string;
  description: string;
  target: string;
  deadline: string;
  amountCollected: string;
  image: string;
  donators: string[];
  donations: string[];
}

interface Donator {
  donator: string;
  donation: string;
}

interface ContractContextType {
  createCampaignCall: (
    title: string,
    description: string,
    target: string,
    deadline: Date,
    image: string
  ) => Promise<void>;
  donateCampaignCall: (campaignId: number, donateAmount: string) => Promise<void>;
  isDonateLoading: boolean;
  allCampaignsData: Campaign[];
  isCampaignDataLoading: boolean;
  isCreateCampaignLoading: boolean; 
  campaignId: string;
  setCampaignId: (id: string) => void;
  donatationData: Donator[];
  isDonatorsDataLoading: boolean;
  userCampaign: { id: number; data: Campaign }[];
}

export const ContractContext = createContext<ContractContextType>({} as ContractContextType);

export const ContractContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [allCampaignsData, setAllCampaignsData] = useState<Campaign[]>([]);
  const [isCampaignDataLoading, setIsCampaignDataLoading] = useState(true);
  const [isDonateLoading, setIsDonateLoading] = useState(false);
  const [campaignId, setCampaignId] = useState('');
  const [donatationData, setDonationData] = useState<Donator[]>([]);
  const [isDonatorsDataLoading, setIsDonatorsDataLoading] = useState(true);
  const [userCampaign, setUserCampaign] = useState<{ id: number; data: Campaign }[]>([]);
  const [isCreateCampaignLoading, setIsCreateCampaignLoading] = useState(false);


  const { currentAccount } = useContext(WalletConnectionContext);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined" && currentAccount) {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const _contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
      setContract(_contract);
    }
  }, [currentAccount]);

  const fetchAllCampaigns = useCallback(async () => {
    if (!contract) return;

    setIsCampaignDataLoading(true);
    try {
      const campaigns = await contract.getCampaigns();
      setAllCampaignsData(campaigns);
      console.log("Fetched campaigns:", campaigns);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    }
    setIsCampaignDataLoading(false);
  }, [contract]);

  const donateCampaignCall = useCallback(
    async (campaignId: number, donateAmount: string) => {
      if (!contract) return;
      setIsDonateLoading(true);
      try {
        const tx = await contract.donateToCampaign(campaignId, {
          value: ethers.utils.parseEther(donateAmount),
        });
        await tx.wait();
        console.log("Donation successful:", tx);
      } catch (err) {
        console.error("Donation failed:", err);
      }
      setIsDonateLoading(false);
    },
    [contract]
  );

  const createCampaignCall = useCallback(
    async (
      title: string,
      description: string,
      target: string,
      deadline: Date,
      image: string
    ) => {
      if (!contract) return;
      try {
        const tx = await contract.createCampaign(
          currentAccount,
          title,
          description,
          ethers.utils.parseEther(target),
          new Date(deadline).getTime(),
          image
        );
        await tx.wait();
        console.log("Campaign created:", tx);
        fetchAllCampaigns(); // Refresh after creating
      } catch (err) {
        console.error("Create campaign failed", err);
      }
    },
    [contract, currentAccount, fetchAllCampaigns]
  );

  useEffect(() => {
    if (contract && currentAccount) {
      fetchAllCampaigns();
    }
  }, [contract, currentAccount, fetchAllCampaigns]);

  useEffect(() => {
    const fetchDonators = async () => {
      if (!contract || campaignId === '') return;

      setIsDonatorsDataLoading(true);
      try {
        const donators = await contract.getDonators(Number(campaignId));
        const parsedDonations: Donator[] = [];
        for (let i = 0; i < donators[0].length; i++) {
          parsedDonations.push({
            donator: donators[0][i],
            donation: ethers.utils.formatEther(donators[1][i].toString()),
          });
        }
        setDonationData(parsedDonations);
      } catch (err) {
        console.error("Error fetching donators:", err);
      }
      setIsDonatorsDataLoading(false);
    };

    fetchDonators();
  }, [campaignId, contract]);

  useEffect(() => {
    if (!allCampaignsData || !currentAccount) return;

    const filtered = allCampaignsData
      .map((campaign, index) => ({
        id: index,
        data: campaign,
      }))
      .filter((c) => c.data.owner.toLowerCase() === currentAccount.toLowerCase());

    setUserCampaign(filtered);
  }, [allCampaignsData, currentAccount]);

  return (
    <ContractContext.Provider
      value={{
        createCampaignCall,
        donateCampaignCall,
        isDonateLoading,
        allCampaignsData,
        isCreateCampaignLoading,
        isCampaignDataLoading,
        campaignId,
        setCampaignId,
        donatationData,
        isDonatorsDataLoading,
        userCampaign,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

