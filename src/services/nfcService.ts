import { NFCScanResult, NFCPayload } from '../types/nfc';

// Check if browser has native Web NFC API (e.g. Chrome on Android)
export function isWebNFCSupported(): boolean {
  return typeof window !== 'undefined' && 'NDEFReader' in window;
}

// Preset Virtual / Simulated NFC Tags for instant testing & demo
export const DEMO_NFC_TAGS: NFCScanResult[] = [
  {
    serialNumber: 'NFC:04:A2:88:F1:C9',
    tagType: 'admin_badge',
    label: '👑 Sanchit Soodan — Super Admin Smart Card',
    timestamp: 'Physical Card Emulated',
    payload: {
      type: 'badge',
      userId: 'usr_sanchit_superadmin',
      fullName: 'Sanchit Soodan',
      email: 'sanchitsoodan2405@gmail.com',
      role: 'Super Admin (System Owner)',
      city: 'Chandigarh',
      securityToken: 'SEC_ADMIN_KEY_9884'
    }
  },
  {
    serialNumber: 'NFC:04:55:12:34:AA',
    tagType: 'traffic_sensor',
    label: '🚦 Jan Marg Sector 17 Traffic Controller Tag',
    timestamp: 'Street Junction Controller #CHD-17',
    payload: {
      type: 'asset',
      assetId: 'CORR-CHD-02',
      title: 'Sector 17 & Jan Marg Junction Traffic Node',
      category: 'traffic',
      coordinates: [30.7415, 76.7825],
      cityId: 'chandigarh',
      telemetryStatus: 'Green-Wave Controller Active'
    }
  },
  {
    serialNumber: 'NFC:04:88:99:BC:11',
    tagType: 'water_valve',
    label: '🚰 Sector 34 Main Water Pressure Valve Tag',
    timestamp: 'Utility Substation Feeder #CHD-34',
    payload: {
      type: 'asset',
      assetId: 'CHD-1088',
      title: 'Sector 34 Municipal Water Pressure Regulator',
      category: 'utility',
      coordinates: [30.7230, 76.7685],
      cityId: 'chandigarh',
      telemetryStatus: 'Pressure Throttled to 3.2 Bar'
    }
  },
  {
    serialNumber: 'NFC:04:77:33:EE:44',
    tagType: 'ambulance_unit',
    label: '🚑 Trauma EMS Unit #44 Vehicle Tag',
    timestamp: 'Emergency Vehicle NFC Telemetry',
    payload: {
      type: 'dispatch',
      incidentId: 'CHD-1042',
      targetHospital: 'GMSH Hospital Sector 16',
      etaMin: 7.2,
      routeChecksum: 'RTE_OPT_GMSH_16'
    }
  }
];

// Start hardware Web NFC scan if device has an NFC reader
export async function startHardwareNFCScan(
  onTagScanned: (result: NFCScanResult) => void,
  onError: (errMessage: string) => void
): Promise<AbortController | null> {
  if (!isWebNFCSupported()) {
    onError('Web NFC is not supported on this browser/OS. Use Chrome on Android or our built-in NFC Simulator.');
    return null;
  }

  try {
    const ndef = new (window as any).NDEFReader();
    const abortController = new AbortController();
    
    await ndef.scan({ signal: abortController.signal });

    ndef.onreading = (event: any) => {
      const serialNumber = event.serialNumber || `NFC:${Date.now().toString(16)}`;
      let parsedPayload: NFCPayload | null = null;
      let rawText = '';

      for (const record of event.message.records) {
        if (record.recordType === 'text') {
          const textDecoder = new TextDecoder(record.encoding || 'utf-8');
          rawText = textDecoder.decode(record.data);
          try {
            parsedPayload = JSON.parse(rawText);
          } catch {
            parsedPayload = {
              type: 'asset',
              assetId: 'TAG_CUSTOM',
              title: rawText,
              category: 'traffic',
              coordinates: [30.7415, 76.7825],
              cityId: 'chandigarh',
              telemetryStatus: 'Custom NFC Tag'
            };
          }
        }
      }

      const scanResult: NFCScanResult = {
        serialNumber,
        tagType: parsedPayload?.type === 'badge' ? 'admin_badge' : 'traffic_sensor',
        label: (parsedPayload as any)?.title || (parsedPayload as any)?.fullName || 'Scanned Physical NFC Tag',
        timestamp: new Date().toLocaleTimeString(),
        payload: parsedPayload || DEMO_NFC_TAGS[0].payload,
        rawText
      };

      onTagScanned(scanResult);
    };

    ndef.onreadingerror = () => {
      onError('Error reading physical NFC tag. Please hold tag closer to device.');
    };

    return abortController;
  } catch (err: any) {
    onError(err?.message || 'Failed to initialize Web NFC scanner.');
    return null;
  }
}

// Write NDEF Payload to Physical NFC Tag
export async function writeHardwareNFCTag(payload: NFCPayload): Promise<boolean> {
  if (!isWebNFCSupported()) {
    throw new Error('Web NFC writing is only supported on NFC-enabled Android devices.');
  }

  const ndef = new (window as any).NDEFReader();
  const textEncoder = new TextEncoder();
  const jsonString = JSON.stringify(payload);

  await ndef.write({
    records: [
      {
        recordType: 'text',
        data: textEncoder.encode(jsonString)
      }
    ]
  });

  return true;
}
