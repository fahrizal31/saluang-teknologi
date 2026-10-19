/**
 * Mapping nama negara dalam Bahasa Indonesia untuk kode ISO 2 huruf populer.
 */
const COUNTRY_NAME_MAP: Record<string, string> = {
  ID: 'Indonesia',
  SG: 'Singapura',
  MY: 'Malaysia',
  US: 'Amerika Serikat',
  GB: 'Inggris (UK)',
  AU: 'Australia',
  JP: 'Jepang',
  KR: 'Korea Selatan',
  DE: 'Jerman',
  NL: 'Belanda',
  FR: 'Prancis',
  CA: 'Kanada',
  CN: 'Tiongkok',
  IN: 'India',
  TH: 'Thailand',
  VN: 'Vietnam',
  PH: 'Filipina',
  SA: 'Arab Saudi',
  AE: 'Uni Emirat Arab',
  TR: 'Turki',
  RU: 'Rusia',
  BR: 'Brasil',
  ES: 'Spanyol',
  IT: 'Italia',
  CH: 'Swiss',
  SE: 'Swedia',
  NZ: 'Selandia Baru',
  HK: 'Hong Kong',
  TW: 'Taiwan',
};

/**
 * Mengubah kode negara 2 huruf ISO menjadi emoji bendera resmi (Unicode Regional Indicator Symbols).
 * Contoh: 'ID' -> 🇮🇩, 'US' -> 🇺🇸, 'SG' -> 🇸🇬
 */
export function getFlagEmoji(countryCode?: string | null): string {
  if (!countryCode || countryCode === 'UNKNOWN' || countryCode === 'LOCAL') {
    return '🌐';
  }
  const clean = countryCode.trim().toUpperCase();
  if (clean.length !== 2) return '🌐';

  try {
    const codePoints = clean
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return '🌐';
  }
}

/**
 * Mengambil nama negara yang ramah pengguna dalam Bahasa Indonesia.
 */
export function getCountryName(countryCode?: string | null): string {
  if (!countryCode || countryCode === 'UNKNOWN' || countryCode === 'LOCAL') {
    return 'Indonesia';
  }
  const code = countryCode.trim().toUpperCase();
  if (COUNTRY_NAME_MAP[code]) {
    return COUNTRY_NAME_MAP[code];
  }

  // Gunakan Intl.DisplayNames jika ada
  try {
    const intl = new Intl.DisplayNames(['id'], { type: 'region' });
    const name = intl.of(code);
    if (name) return name;
  } catch {}

  return code;
}
