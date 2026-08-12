import { describe, expect, it } from 'vitest';
import { BRAND_ASSET_KEYS, getBrandAsset, getHeroStyle } from './brandAssets';

describe('Brand Library asset helpers', () => {
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
