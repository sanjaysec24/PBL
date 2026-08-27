export function formatTemperature(val: number): string {
  return `${val.toFixed(1)} °C`;
}

export function formatPh(val: number): string {
  return val.toFixed(2);
}

export function formatTds(val: number): string {
  return `${Math.round(val)} ppm`;
}

export function formatTurbidity(val: number): string {
  return `${val.toFixed(1)} NTU`;
}

export function formatWaterLevel(val: number): string {
  return `${Math.round(val)} %`;
}
