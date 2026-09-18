export interface VehicleData {
  id: string;
  brand: string;
  model: string;
  variant: string;
  batteryNetKwh: number;
  maxKwDc: number;
  maxKwAc: number;
  systemVoltage: 400 | 800;
  typical10to80Min: number;
  consumptionKwhPer100Km: number;
  year: number;
}

export const VEHICLES_DATA: VehicleData[] = [
  {
    id: "tesla-model-y-lr",
    brand: "Tesla",
    model: "Model Y",
    variant: "Long Range AWD (75 kWh netto)",
    batteryNetKwh: 75,
    maxKwDc: 250,
    maxKwAc: 11,
    systemVoltage: 400,
    typical10to80Min: 27,
    consumptionKwhPer100Km: 16.9,
    year: 2024
  },
  {
    id: "tesla-model-3-sr",
    brand: "Tesla",
    model: "Model 3",
    variant: "Standard Range RWD (57 kWh)",
    batteryNetKwh: 57,
    maxKwDc: 170,
    maxKwAc: 11,
    systemVoltage: 400,
    typical10to80Min: 25,
    consumptionKwhPer100Km: 14.5,
    year: 2024
  },
  {
    id: "vw-id4-pro",
    brand: "Volkswagen",
    model: "ID.4",
    variant: "Pro Performance (77 kWh)",
    batteryNetKwh: 77,
    maxKwDc: 175,
    maxKwAc: 11,
    systemVoltage: 400,
    typical10to80Min: 28,
    consumptionKwhPer100Km: 17.5,
    year: 2024
  },
  {
    id: "vw-id3-pro",
    brand: "Volkswagen",
    model: "ID.3",
    variant: "Pro (58 kWh)",
    batteryNetKwh: 58,
    maxKwDc: 120,
    maxKwAc: 11,
    systemVoltage: 400,
    typical10to80Min: 30,
    consumptionKwhPer100Km: 15.6,
    year: 2024
  },
  {
    id: "skoda-enyaq-85",
    brand: "Škoda",
    model: "Enyaq",
    variant: "85 (77 kWh)",
    batteryNetKwh: 77,
    maxKwDc: 175,
    maxKwAc: 11,
    systemVoltage: 400,
    typical10to80Min: 28,
    consumptionKwhPer100Km: 16.8,
    year: 2024
  },
  {
    id: "hyundai-ioniq-5-84",
    brand: "Hyundai",
    model: "Ioniq 5",
    variant: "84 kWh AWD (80 kWh netto / 800V)",
    batteryNetKwh: 80,
    maxKwDc: 260,
    maxKwAc: 11,
    systemVoltage: 800,
    typical10to80Min: 18,
    consumptionKwhPer100Km: 17.8,
    year: 2024
  },
  {
    id: "kia-ev6-long-range",
    brand: "Kia",
    model: "EV6",
    variant: "Long Range AWD (74 kWh netto / 800V)",
    batteryNetKwh: 74,
    maxKwDc: 235,
    maxKwAc: 11,
    systemVoltage: 800,
    typical10to80Min: 18,
    consumptionKwhPer100Km: 17.2,
    year: 2024
  },
  {
    id: "bmw-i4-edrive40",
    brand: "BMW",
    model: "i4",
    variant: "eDrive40 (81 kWh)",
    batteryNetKwh: 81,
    maxKwDc: 205,
    maxKwAc: 11,
    systemVoltage: 400,
    typical10to80Min: 31,
    consumptionKwhPer100Km: 16.5,
    year: 2024
  },
  {
    id: "bmw-ix1-xdrive30",
    brand: "BMW",
    model: "iX1",
    variant: "xDrive30 (65 kWh)",
    batteryNetKwh: 65,
    maxKwDc: 130,
    maxKwAc: 22,
    systemVoltage: 400,
    typical10to80Min: 29,
    consumptionKwhPer100Km: 17.3,
    year: 2024
  },
  {
    id: "audi-q4-etron-45",
    brand: "Audi",
    model: "Q4 e-tron",
    variant: "45 (77 kWh)",
    batteryNetKwh: 77,
    maxKwDc: 175,
    maxKwAc: 11,
    systemVoltage: 400,
    typical10to80Min: 28,
    consumptionKwhPer100Km: 17.4,
    year: 2024
  },
  {
    id: "mercedes-eqa-250",
    brand: "Mercedes-Benz",
    model: "EQA",
    variant: "250+ (70 kWh)",
    batteryNetKwh: 70,
    maxKwDc: 100,
    maxKwAc: 11,
    systemVoltage: 400,
    typical10to80Min: 32,
    consumptionKwhPer100Km: 16.2,
    year: 2024
  },
  {
    id: "volvo-ex30-sm-er",
    brand: "Volvo",
    model: "EX30",
    variant: "Single Motor Extended Range (64 kWh)",
    batteryNetKwh: 64,
    maxKwDc: 153,
    maxKwAc: 22,
    systemVoltage: 400,
    typical10to80Min: 26,
    consumptionKwhPer100Km: 15.7,
    year: 2024
  },
  {
    id: "cupra-born-58",
    brand: "Cupra",
    model: "Born",
    variant: "170 kW (58 kWh)",
    batteryNetKwh: 58,
    maxKwDc: 135,
    maxKwAc: 11,
    systemVoltage: 400,
    typical10to80Min: 29,
    consumptionKwhPer100Km: 15.9,
    year: 2024
  },
  {
    id: "mg4-electric-64",
    brand: "MG",
    model: "MG4",
    variant: "Comfort / Luxury (62 kWh netto)",
    batteryNetKwh: 62,
    maxKwDc: 140,
    maxKwAc: 11,
    systemVoltage: 400,
    typical10to80Min: 26,
    consumptionKwhPer100Km: 16.0,
    year: 2024
  },
  {
    id: "porsche-taycan-plus",
    brand: "Porsche",
    model: "Taycan",
    variant: "Performance-Batterie Plus (97 kWh netto / 800V)",
    batteryNetKwh: 97,
    maxKwDc: 320,
    maxKwAc: 22,
    systemVoltage: 800,
    typical10to80Min: 18,
    consumptionKwhPer100Km: 18.2,
    year: 2024
  },
  {
    id: "fiat-500e-42",
    brand: "Fiat",
    model: "500e",
    variant: "Icon (37 kWh netto)",
    batteryNetKwh: 37,
    maxKwDc: 85,
    maxKwAc: 11,
    systemVoltage: 400,
    typical10to80Min: 35,
    consumptionKwhPer100Km: 14.1,
    year: 2024
  }
];
