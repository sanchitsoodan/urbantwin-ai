export interface AdminNFCCard {
  id: string;
  cardUid: string;
  badgeNumber: string;
  fullName: string;
  email: string;
  role: string;
  city: string;
  themeGradient: string;
  badgeAccent: string;
  icon: string;
  securityHash: string;
}

export interface NFCScanResult {
  serialNumber: string;
  tagType: 'admin_badge' | 'hardware_card';
  label: string;
  timestamp: string;
  cardData: AdminNFCCard;
  rawText?: string;
}
