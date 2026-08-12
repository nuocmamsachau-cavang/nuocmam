export const BRAND_ASSET_KEYS = [
  'brand_mascot_logo',
  'brand_horizontal_logo',
  'brand_favicon',
  'brand_hero_banner',
  'brand_site_title',
] as const;

export type BrandAssetKey = (typeof BRAND_ASSET_KEYS)[number];
export type BrandAssetMap = Partial<Record<BrandAssetKey, string>>;

export const DEFAULT_MASCOT_LOGO = '/manus-storage/nuoc-mam-ca-vang-mascot_834f1187.jpg';
export const DEFAULT_SITE_TITLE = 'Nước Mắm Cá Vàng - Tinh Túy Làng Nghề 200 Năm';

export function getBrandAsset(
  assets: BrandAssetMap | undefined,
  key: BrandAssetKey,
  fallback = '',
): string {
  const value = assets?.[key];
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback;
}

export function getPublicBrandConfig(assets: BrandAssetMap | undefined) {
  return {
    mascotLogo: getBrandAsset(assets, 'brand_mascot_logo', DEFAULT_MASCOT_LOGO),
    horizontalLogo: getBrandAsset(assets, 'brand_horizontal_logo'),
    favicon: getBrandAsset(assets, 'brand_favicon', DEFAULT_MASCOT_LOGO),
    heroBanner: getBrandAsset(assets, 'brand_hero_banner'),
    siteTitle: getBrandAsset(assets, 'brand_site_title', DEFAULT_SITE_TITLE),
  };
}

export function getHeroStyle(heroBanner = ''): Record<string, string> {
  if (!heroBanner) {
    return { background: 'linear-gradient(135deg, #C41E3A 0%, #8B1428 100%)' };
  }

  return {
    backgroundImage: `linear-gradient(135deg, rgba(196, 30, 58, 0.86), rgba(139, 20, 40, 0.9)), url(${heroBanner})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
}
