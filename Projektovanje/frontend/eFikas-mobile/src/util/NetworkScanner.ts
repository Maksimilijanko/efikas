import * as Network from 'expo-network';

const TARGET_PORT = 3566; 
const TIMEOUT_MS = 200;   
const BATCH_SIZE = 50;    

const checkIp = async (ip: string, apiKey: string): Promise<string | null> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`http://${ip}:${TARGET_PORT}/api/attention`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`, 
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      return ip;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const findFiscalDeviceIp = async (apiKey: string): Promise<string | null> => {
  try {
    const localIp = await Network.getIpAddressAsync();
    console.log("📱 IP Telefona:", localIp);

    if (!localIp || localIp === "0.0.0.0") return null;
    const subnet = localIp.split('.').slice(0, 3).join('.');
    
    const allIps: string[] = [];
    for (let i = 1; i < 255; i++) {
      const targetIp = `${subnet}.${i}`;
      if (targetIp !== localIp) allIps.push(targetIp);
    }

    console.log(`🔍 Počinjem skeniranje ${allIps.length} adresa koristeći API ključ...`);

    for (let i = 0; i < allIps.length; i += BATCH_SIZE) {
      const batch = allIps.slice(i, i + BATCH_SIZE);
      
      const promises = batch.map(ip => checkIp(ip, apiKey));
      
      const results = await Promise.all(promises);
      const found = results.find(ip => ip !== null);

      if (found) {
        console.log(`✅ KASA PRONAĐENA NA: ${found}`);
        return found; 
      }
    }

    console.log("❌ Kasa nije pronađena.");
    return null;

  } catch (e) {
    console.error("Greška pri skeniranju:", e);
    return null;
  }
};