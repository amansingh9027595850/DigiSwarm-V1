import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '@/api/settings.api';

const FALLBACK = {
  siteName: 'DigiSwarm',
  tagline: 'Your Trusted Partner for Digital Marketing Excellence in Uttarakhand',
  logo: { url: '' },
  favicon: { url: '' },
  contact: {
    email: 'hr@digiswarm.in',
    phone: '+91 9548014460',
    whatsapp: '919548014460',
    address:
      '2nd floor, House No. 88, Govind Nagar, East Rest Camp, Guru Nanak Vihar, Race Course, Dehradun, Uttarakhand 248001',
    mapUrl:
      'https://www.google.com/maps?q=Govind+Nagar+Race+Course+Dehradun+248001&output=embed',
  },
  socials: {
    instagram: 'https://www.instagram.com/digiswarm',
    linkedin: 'https://www.linkedin.com/company/digiswarm?_l=en_US',
    facebook: 'https://www.facebook.com/DigiSwarm/',
    twitter: 'https://x.com/digiswarm',
    youtube: 'https://www.youtube.com/@digiswarm',
  },
  analytics: {},
  maintenance: { enabled: false, message: '' },
};

// Pick the first non-empty value (treats '', null, undefined as missing).
const pick = (...vals) => vals.find((v) => v !== undefined && v !== null && v !== '');

// Merge API settings on top of FALLBACK so blank API fields fall back to
// defaults (avoids the footer address flicker where empty string wins).
function mergeSettings(api) {
  if (!api) return FALLBACK;
  return {
    ...FALLBACK,
    ...api,
    logo: { ...FALLBACK.logo, ...(api.logo || {}) },
    favicon: { ...FALLBACK.favicon, ...(api.favicon || {}) },
    socials: {
      linkedin: pick(api.socials?.linkedin, FALLBACK.socials.linkedin),
      instagram: pick(api.socials?.instagram, FALLBACK.socials.instagram),
      facebook: pick(api.socials?.facebook, FALLBACK.socials.facebook),
      twitter: pick(api.socials?.twitter, FALLBACK.socials.twitter),
      youtube: pick(api.socials?.youtube, FALLBACK.socials.youtube),
    },
    analytics: { ...FALLBACK.analytics, ...(api.analytics || {}) },
    maintenance: { ...FALLBACK.maintenance, ...(api.maintenance || {}) },
    contact: {
      email: pick(api.contact?.email, FALLBACK.contact.email),
      phone: pick(api.contact?.phone, FALLBACK.contact.phone),
      whatsapp: pick(api.contact?.whatsapp, FALLBACK.contact.whatsapp),
      address: pick(api.contact?.address, FALLBACK.contact.address),
      mapUrl: pick(api.contact?.mapUrl, FALLBACK.contact.mapUrl),
    },
    siteName: pick(api.siteName, FALLBACK.siteName),
    tagline: pick(api.tagline, FALLBACK.tagline),
  };
}

export function useSettings() {
  const { data, ...rest } = useQuery({
    queryKey: ['public', 'settings'],
    queryFn: () => settingsApi.getPublic(),
    staleTime: 5 * 60 * 1000,
    placeholderData: { data: FALLBACK },
  });
  return { settings: mergeSettings(data?.data), ...rest };
}
