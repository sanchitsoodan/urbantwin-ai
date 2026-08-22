import { GoogleGenAI } from '@google/genai';
import { CityProfile, SimulationParams, SimulationResults } from '../types/city';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  sources?: string[];
}

export function getStoredGeminiApiKey(): string {
  return localStorage.getItem('URBANTWIN_GEMINI_KEY') || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
}

export function setStoredGeminiApiKey(key: string): void {
  if (key.trim()) {
    localStorage.setItem('URBANTWIN_GEMINI_KEY', key.trim());
  } else {
    localStorage.removeItem('URBANTWIN_GEMINI_KEY');
  }
}

/**
 * Builds the real-time dynamic digital twin context prompt
 */
function buildCitySystemPrompt(
  city: CityProfile,
  simParams: SimulationParams,
  simResults: SimulationResults,
  implementedSolutions: boolean
): string {
  const incidentsText = city.incidents.map(inc => 
    `- Incident ${inc.id} (${inc.title}): Located at ${inc.locationName}. Severity: ${inc.severity}. Status: ${inc.status}. Standard ETA: ${inc.standardETA}m, AI ETA: ${inc.optimizedETA}m. Target: ${inc.targetDestinationName}. Description: ${inc.description}`
  ).join('\n');

  const hospitalsText = city.hospitals.map(hosp => 
    `- Hospital ${hosp.name}: ${hosp.availableBeds} ICU beds available out of ${hosp.totalBeds} total (${hosp.emergencyCapacityPct}% emergency capacity). Ambulances on duty: ${hosp.activeAmbulances}.`
  ).join('\n');

  const corridorsText = city.corridors.map(c => 
    `- Corridor ${c.name}: Density ${c.currentDensityPct}%, Avg speed ${c.avgSpeedKmh} km/h, Congestion Level: ${c.congestionLevel}.`
  ).join('\n');

  return `You are UrbanTwin AI, the advanced AI Operations and Digital Twin Assistant for ${city.name}, ${city.country} (${city.flag}).
Your job is to assist city planners, emergency dispatchers, and operations commanders by answering questions using the real-time live data provided below.

### LIVE DIGITAL TWIN TELEMETRY FOR ${city.name.toUpperCase()}:
- **Overall City Health Score**: ${city.baselineScore.overall}/100 (Traffic: ${city.baselineScore.traffic}/100, Emergency: ${city.baselineScore.emergency}/100, Infrastructure: ${city.baselineScore.infrastructure}/100)
- **Baseline Average Speed**: ${city.baselineSpeedKmh} km/h
- **Baseline Congestion**: ${city.baselineCongestionPct}%
- **Average Ambulance ETA**: ${city.baselineAmbulanceEtaMin} min
- **AI Solution Status**: ${implementedSolutions ? 'Active & Implemented on Live Twin' : 'Pending Deployment'}

### ACTIVE CIVIC & TRAUMA INCIDENTS:
${incidentsText}

### EMERGENCY MEDICAL FACILITIES & CAPACITY:
${hospitalsText}

### KEY ARTERIAL TRAFFIC CORRIDORS:
${corridorsText}

### WHAT-IF SCENARIO SIMULATION STATE:
- **Active Road Closure**: ${simParams.roadClosure === 'none' ? 'None (All roads open)' : simParams.roadClosure}
- **Population Surge Factor**: +${simParams.populationIncreasePct}% (e.g. citywide events, rush, urban influx)
- **Weather Condition**: ${simParams.weather}
- **Disrupted State**: Travel Time: ${simResults.after.travelTimeMin} min, Congestion: ${simResults.after.congestionPct}%, Economic Loss: $${simResults.after.economicLossKUsd}k/day, Fuel Wasted: ${simResults.after.fuelWastedLiters.toLocaleString()} Liters/day
- **AI Detour & Optimized State**: Travel Time: ${simResults.aiOptimized.travelTimeMin} min, Congestion: ${simResults.aiOptimized.congestionPct}%, Economic Loss: $${simResults.aiOptimized.economicLossKUsd}k/day
- **AI Economic Savings**: $${simResults.economicSavingsUsd.toLocaleString()} per day saved, ${simResults.dailyCo2SavedKg.toLocaleString()} kg CO2 reduced

### RESPONSE GUIDELINES:
1. Always ground your answers in the specific metrics, locations, and hospitals of ${city.name}.
2. Be concise, actionable, and operations-focused. Use bullet points or bold numbers for key stats.
3. If asked about emergency dispatch, explain how AI signal synchronization (Green-Wave) and hospital triage work.
4. If asked about population growth or economic loss, quote the exact delay minutes and daily dollar/fuel savings.`;
}

/**
 * Intelligent Grounded Fallback when API key is missing or offline
 */
function generateLocalGroundedResponse(
  query: string,
  city: CityProfile,
  simParams: SimulationParams,
  simResults: SimulationResults,
  implementedSolutions: boolean
): string {
  const q = query.toLowerCase();

  // 1. Health Score / General Status
  if (q.includes('health') || q.includes('score') || q.includes('status') || q.includes('overview') || q.includes('situation')) {
    return `📊 **${city.name} Digital Twin Overview**:\n\n` +
      `• **Overall City Score**: **${city.baselineScore.overall}/100** (Traffic: ${city.baselineScore.traffic}, Emergency: ${city.baselineScore.emergency}, Infrastructure: ${city.baselineScore.infrastructure})\n` +
      `• **Current Traffic Congestion**: **${city.baselineCongestionPct}%** at an average speed of **${city.baselineSpeedKmh} km/h**.\n` +
      `• **Average Emergency ETA**: **${city.baselineAmbulanceEtaMin} minutes** across ${city.incidents.length} active event(s).\n` +
      `• **AI Mitigation Status**: ${implementedSolutions ? '🟢 Active & Synchronized' : '🟡 Recommended Action Plan Available'}.`;
  }

  // 2. Population & Economic Impact
  if (q.includes('population') || q.includes('economy') || q.includes('economic') || q.includes('cost') || q.includes('money') || q.includes('loss') || q.includes('dollar') || q.includes('fuel')) {
    const pop = simParams.populationIncreasePct;
    return `👥 **Population Surge & Economic Analysis (${city.name})**:\n\n` +
      `• **Current Population Growth Factor**: **+${pop}% surge** (Affecting arterial volume & transit queues).\n` +
      `• **Disrupted Economic Loss**: **$${simResults.after.economicLossKUsd}k / day** in lost commuter productivity and **${simResults.after.fuelWastedLiters.toLocaleString()} L** of idling fuel.\n` +
      `• **AI Optimized Detour**: Cuts economic loss to **$${simResults.aiOptimized.economicLossKUsd}k / day**.\n` +
      `• **Net AI Benefit**: Saves **$${simResults.economicSavingsUsd.toLocaleString()} / day** and eliminates **${simResults.dailyCo2SavedKg.toLocaleString()} kg of CO₂** emissions daily!`;
  }

  // 3. Hospitals & ICU Beds
  if (q.includes('hospital') || q.includes('bed') || q.includes('icu') || q.includes('medical') || q.includes('triage')) {
    const hospList = city.hospitals.map(h => 
      `• **${h.name}**: **${h.availableBeds} ICU beds available** (${h.emergencyCapacityPct}% capacity, ${h.activeAmbulances} active ambulances, avg response: ${h.avgResponseTimeMin}m)`
    ).join('\n');
    return `🏥 **Hospital & ICU Bed Telemetry for ${city.name}**:\n\n${hospList}\n\n` +
      `💡 *AI Triage Recommendation*: Route trauma cases to facilities with $>25$ available ICU beds to avoid emergency department bottlenecks.`;
  }

  // 4. Incidents & Accidents
  if (q.includes('accident') || q.includes('crash') || q.includes('incident') || q.includes('water') || q.includes('repair') || q.includes('leak') || q.includes('emergency')) {
    const incList = city.incidents.map(inc => 
      `• **${inc.title}** (${inc.id}) at *${inc.locationName}*:\n` +
      `  - Standard Congested ETA: **${inc.standardETA} min**\n` +
      `  - AI Green-Wave Route: **${inc.optimizedETA} min** (Saves **${(inc.standardETA - inc.optimizedETA).toFixed(1)} min**)\n` +
      `  - Target: **${inc.targetDestinationName}** (${inc.vehicleIcon})`
    ).join('\n\n');
    return `🚨 **Active Incident Dispatch Status in ${city.name}**:\n\n${incList}`;
  }

  // 5. Road Closures & Detours
  if (q.includes('road') || q.includes('close') || q.includes('block') || q.includes('detour') || q.includes('route') || q.includes('traffic')) {
    return `🛣️ **Corridor & Detour Navigation in ${city.name}**:\n\n` +
      `• **Active Closure**: ${simParams.roadClosure === 'none' ? 'All main avenues are currently open.' : `⛔ **${simParams.roadClosure}** is blocked.`}\n` +
      `• **Disrupted Travel Time**: **${simResults.after.travelTimeMin} min** (${simResults.after.congestionPct}% congestion).\n` +
      `• **AI Alternative Bypass**: Directs vehicles via dedicated bypass corridors, dropping travel time back to **${simResults.aiOptimized.travelTimeMin} min** (saving **${simResults.after.travelTimeMin - simResults.aiOptimized.travelTimeMin} min**).`;
  }

  // Generic Default Answer
  return `🤖 **UrbanTwin AI for ${city.name}**:\n\n` +
    `I have real-time access to the entire city operations command center. Here are live highlights:\n` +
    `• **City Health**: ${city.baselineScore.overall}/100 | **Traffic Congestion**: ${city.baselineCongestionPct}%\n` +
    `• **Active Incidents**: ${city.incidents.length} alert(s) monitored with automated green-wave priority.\n` +
    `• **Economic Savings**: AI bypasses and smart signals are saving **$${simResults.economicSavingsUsd.toLocaleString()} / day**.\n\n` +
    `Ask me about hospital ICU beds, traffic detours, population surge impact, or incident response times!`;
}

/**
 * Ask Gemini API with full digital twin grounding
 */
export async function askCityAI(
  userQuery: string,
  city: CityProfile,
  simParams: SimulationParams,
  simResults: SimulationResults,
  implementedSolutions: boolean
): Promise<{ text: string; sources?: string[] }> {
  const apiKey = getStoredGeminiApiKey();

  // If no Gemini API key is provided, use the rich grounded local engine
  if (!apiKey) {
    // Artificial small latency for realistic experience
    await new Promise(resolve => setTimeout(resolve, 350));
    const localText = generateLocalGroundedResponse(userQuery, city, simParams, simResults, implementedSolutions);
    return {
      text: localText + '\n\n*(⚡ Generated using Live Digital Twin Telemetry. Connect your Gemini API Key in Settings for open conversational mode)*',
      sources: [`${city.name} Telemetry Hub`, 'What-If Simulation Engine', 'Traffic Signal Network']
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = buildCitySystemPrompt(city, simParams, simResults, implementedSolutions);

    // Call Gemini 2.5 Flash for high speed and accurate multimodal reasoning
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
        maxOutputTokens: 800
      }
    });

    const replyText = response.text || generateLocalGroundedResponse(userQuery, city, simParams, simResults, implementedSolutions);
    return {
      text: replyText,
      sources: [`${city.name} Sensor Grid`, 'Gemini 2.5 Flash', 'City Operations Database']
    };
  } catch (error: any) {
    console.warn('Gemini API query error, falling back to local grounded twin engine:', error);
    const localText = generateLocalGroundedResponse(userQuery, city, simParams, simResults, implementedSolutions);
    return {
      text: localText + `\n\n*(Note: Gemini API reported "${error?.message || 'Authentication/Network error'}". Showing grounded digital twin telemetry).*`,
      sources: [`${city.name} Emergency Center`, 'Local Digital Twin Core']
    };
  }
}
