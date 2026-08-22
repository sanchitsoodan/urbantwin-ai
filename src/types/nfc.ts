export type NFCTagType = 'admin_badge' | 'operator_badge' | 'traffic_sensor' | 'water_valve' | 'ambulance_unit' | 'incident_dispatch';

export interface NFCBadgePayload {
  type: 'badge';
  userId: string;
  fullName: string;
  email: string;
  role: string;
  city: string;
  securityToken: string;
}

export interface NFCAssetPayload {
  type: 'asset';
  assetId: string;
  title: string;
  category: 'traffic' | 'utility' | 'emergency';
  coordinates: [number, number];
  cityId: string;
  telemetryStatus: string;
}

export interface NFCDispatchPayload {
  type: 'dispatch';
  incidentId: string;
  targetHospital: string;
  etaMin: number;
  routeChecksum: string;
}

export type NFCPayload = NFCBadgePayload | NFCAssetPayload | NFCDispatchPayload;

export interface NFCScanResult {
  serialNumber: string;
  tagType: NFCTagType;
  label: string;
  timestamp: string;
  payload: NFCPayload;
  rawText?: string;
}
