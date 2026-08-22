import { AdminNFCCard, NFCScanResult } from '../types/nfc';

// Check if browser has native Web NFC API (e.g. Chrome on Android)
export function isWebNFCSupported(): boolean {
  return typeof window !== 'undefined' && 'NDEFReader' in window;
}

// 4 OFFICIAL NFC ADMIN CARDS
export const OFFICIAL_NFC_ADMIN_CARDS: AdminNFCCard[] = [
  {
    id: 'nfc_admin_01',
    cardUid: '04:A1:88:F1:01',
    badgeNumber: 'SEC-ADM-01',
    fullName: 'Sanchit Soodan',
    email: 'sanchitsoodan2405@gmail.com',
    role: 'Super Admin (System Owner)',
    city: 'Chandigarh / Global Operations',
    themeGradient: 'from-indigo-900 via-slate-900 to-purple-950',
    badgeAccent: 'border-amber-400 text-amber-400 bg-amber-400/10',
    icon: '👑',
    securityHash: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
  },
  {
    id: 'nfc_admin_02',
    cardUid: '04:B2:77:E2:02',
    badgeNumber: 'TRF-ADM-02',
    fullName: 'Elena Rostova',
    email: 'elena.traffic@urbantwin.ai',
    role: 'Chief Traffic Systems Commander (Admin)',
    city: 'London / Delhi Traffic Network',
    themeGradient: 'from-blue-900 via-slate-900 to-indigo-950',
    badgeAccent: 'border-blue-400 text-blue-400 bg-blue-400/10',
    icon: '🚦',
    securityHash: 'SHA256:88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936f031589'
  },
  {
    id: 'nfc_admin_03',
    cardUid: '04:C3:66:D3:03',
    badgeNumber: 'EMS-ADM-03',
    fullName: 'Dr. David K. Vance',
    email: 'david.ems@urbantwin.ai',
    role: 'Emergency Trauma Director (Admin)',
    city: 'New York / Mumbai Trauma Command',
    themeGradient: 'from-emerald-900 via-slate-900 to-teal-950',
    badgeAccent: 'border-emerald-400 text-emerald-400 bg-emerald-400/10',
    icon: '🚑',
    securityHash: 'SHA256:5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
  },
  {
    id: 'nfc_admin_04',
    cardUid: '04:D4:55:C4:04',
    badgeNumber: 'UTL-ADM-04',
    fullName: 'Marcus Sterling',
    email: 'marcus.utilities@urbantwin.ai',
    role: 'Smart Utilities & Grid Chief (Admin)',
    city: 'Bengaluru / Power & Water Core',
    themeGradient: 'from-amber-950 via-slate-900 to-stone-900',
    badgeAccent: 'border-amber-400 text-amber-400 bg-amber-400/10',
    icon: '⚡',
    securityHash: 'SHA256:4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a'
  }
];

// Start hardware Web NFC scanner
export async function startHardwareNFCScan(
  onCardMatched: (card: AdminNFCCard, serialNumber: string) => void,
  onError: (errMessage: string) => void
): Promise<AbortController | null> {
  if (!isWebNFCSupported()) {
    onError('Web NFC API is not available on this browser/OS. Please use Chrome on an NFC-enabled Android device or the Demo Simulator section.');
    return null;
  }

  try {
    const ndef = new (window as any).NDEFReader();
    const abortController = new AbortController();
    
    await ndef.scan({ signal: abortController.signal });

    ndef.onreading = (event: any) => {
      const serialNumber = event.serialNumber || `04:${Date.now().toString(16).slice(-8)}`;
      let matchedCard: AdminNFCCard | null = null;
      let rawContent = '';

      for (const record of event.message.records) {
        if (record.recordType === 'text') {
          const textDecoder = new TextDecoder(record.encoding || 'utf-8');
          rawContent = textDecoder.decode(record.data);
          try {
            const parsed = JSON.parse(rawContent);
            if (parsed.email) {
              matchedCard = OFFICIAL_NFC_ADMIN_CARDS.find(c => c.email.toLowerCase() === parsed.email.toLowerCase()) || null;
            }
          } catch {
            // Check if string contains any of our admin emails or names
            matchedCard = OFFICIAL_NFC_ADMIN_CARDS.find(c => 
              rawContent.toLowerCase().includes(c.email.toLowerCase()) ||
              rawContent.toLowerCase().includes(c.fullName.toLowerCase())
            ) || null;
          }
        }
      }

      // If no payload match, match by serial or default to Super Admin
      if (!matchedCard) {
        matchedCard = OFFICIAL_NFC_ADMIN_CARDS.find(c => c.cardUid === serialNumber) || OFFICIAL_NFC_ADMIN_CARDS[0];
      }

      onCardMatched(matchedCard, serialNumber);
    };

    ndef.onreadingerror = () => {
      onError('Error reading NFC card. Please hold card flat against the device sensor.');
    };

    return abortController;
  } catch (err: any) {
    onError(err?.message || 'Failed to initialize Web NFC scanner.');
    return null;
  }
}

// Write selected Admin Card to a blank physical NFC Tag
export async function writeCardToPhysicalTag(card: AdminNFCCard): Promise<boolean> {
  if (!isWebNFCSupported()) {
    throw new Error('Writing physical NFC tags requires an NFC-enabled Android phone running Google Chrome.');
  }

  const ndef = new (window as any).NDEFReader();
  const textEncoder = new TextEncoder();
  const cardPayload = {
    type: 'urbantwin_admin_card',
    badgeNumber: card.badgeNumber,
    fullName: card.fullName,
    email: card.email,
    role: card.role,
    securityHash: card.securityHash,
    issuedAt: new Date().toISOString()
  };

  await ndef.write({
    records: [
      {
        recordType: 'text',
        data: textEncoder.encode(JSON.stringify(cardPayload))
      }
    ]
  });

  return true;
}
