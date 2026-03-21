export const PLATAFORMA_URLS = {
  Netflix: "https://www.netflix.com",
  Prime: "https://www.primevideo.com",
  "Prime Video": "https://www.primevideo.com",
  "Disney+": "https://www.disneyplus.com",
  "HBO Max": "https://www.hbomax.com",
  Max: "https://www.hbomax.com",
  NOW: "https://www.nowtv.com",
  "Sky Go": "https://www.skygo.sky.com",
  "Now TV": "https://www.nowtv.com",
};

export function obterURLPlataforma(nomePlataforma) {
  return PLATAFORMA_URLS[nomePlataforma] || "#";
}
