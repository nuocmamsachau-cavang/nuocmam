import { describe, expect, it } from 'vitest';
import { BRAND_ASSET_KEYS, getBrandAsset, getHeroStyle, getPublicBrandConfig, DEFAULT_MASCOT_LOGO, DEFAULT_SITE_TITLE } from '../client/src/lib/brandAssets.js';
import { getBrandAssets } from './db.js';

describe('Brand Library asset helpers', () => {
  it('reads stored brand assets without failing on the reserved key column', async () => {
    const assets = await getBrandAssets();
    expect(assets).toBeDefined();
    expect(typeof assets).toBe('object');
  });

  it('defines the four supported public asset keys', () => {
    expect(BRAND_ASSET_KEYS).toEqual([
      'brand_mascot_logo',
      'brand_horizontal_logo',
      'brand_favicon',
      'brand_hero_banner',
      'brand_site_title',
    ]);
  });

  it('returns a stored asset and falls back for missing or blank values', () => {
    const assets = {
      brand_mascot_logo: 'https://cdn.example.com/mascot.png',
      brand_horizontal_logo: '   ',
    };

    expect(getBrandAsset(assets, 'brand_mascot_logo', '/fallback.png')).toBe('https://cdn.example.com/mascot.png');
    expect(getBrandAsset(assets, 'brand_horizontal_logo', '/fallback.png')).toBe('/fallback.png');
    expect(getBrandAsset(undefined, 'brand_favicon', '/favicon.ico')).toBe('/favicon.ico');
    expect(getBrandAsset(undefined, 'brand_site_title', 'Nước Mắm Cá Vàng - Tinh Túy Làng Nghề 200 Năm')).toContain('Nước Mắm Cá Vàng');
  });

  it('maps each stored asset to its public consumer without cross-wiring fields', () => {
    const config = getPublicBrandConfig({
      brand_mascot_logo: 'mascot-url',
      brand_horizontal_logo: 'horizontal-url',
      brand_favicon: 'favicon-url',
      brand_hero_banner: 'hero-url',
      brand_site_title: 'Tiêu đề kiểm thử',
    });

    expect(config).toEqual({
      mascotLogo: 'mascot-url',
      horizontalLogo: 'horizontal-url',
      favicon: 'favicon-url',
      heroBanner: 'hero-url',
      siteTitle: 'Tiêu đề kiểm thử',
    });
  });

  it('uses the mascot and title fallbacks when no brand settings exist', () => {
    const config = getPublicBrandConfig(undefined);
    expect(config.mascotLogo).toBe(DEFAULT_MASCOT_LOGO);
    expect(config.favicon).toBe(DEFAULT_MASCOT_LOGO);
    expect(config.siteTitle).toBe(DEFAULT_SITE_TITLE);
    expect(config.horizontalLogo).toBe('');
    expect(config.heroBanner).toBe('');
  });

  it('uses the red-gold gradient when no hero banner exists', () => {
    expect(getHeroStyle()).toEqual({
      background: 'linear-gradient(135deg, #C41E3A 0%, #8B1428 100%)',
    });
  });

  it('builds a covered hero background when a banner URL exists', () => {
    const style = getHeroStyle('https://cdn.example.com/hero.webp');
    expect(style.backgroundImage).toContain('https://cdn.example.com/hero.webp');
    expect(style.backgroundSize).toBe('cover');
    expect(style.backgroundPosition).toBe('center');
  });
});
