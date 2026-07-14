import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 });

    // Fetch the page server-side (bypasses browser CORS)
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Site returned ${response.status}` }, { status: 200 });
    }

    const html = await response.text();

    // Extract Open Graph and meta tags — works on most listing sites
    function getMeta(property: string): string {
      const patterns = [
        new RegExp(`<meta[^>]+property=["']og:${property}["'][^>]+content=["']([^"']+)["']`, 'i'),
        new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${property}["']`, 'i'),
        new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i'),
        new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${property}["']`, 'i'),
      ];
      for (const p of patterns) {
        const m = html.match(p);
        if (m?.[1]) return m[1].trim();
      }
      return '';
    }

    function getTitle(): string {
      const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      return m?.[1]?.trim().replace(/\s*\|.*$/, '').replace(/\s*-.*$/, '').trim() || '';
    }

    function extractPrice(): string {
      // Common price patterns on listing sites
      const patterns = [
        /\$[\d,]+(?:,\d{3})*(?:\.\d{2})?(?:\/mo(?:nth)?)?/gi,
        /(?:Price|Asking|Listed at|Sale Price)[:\s]+\$[\d,]+/gi,
      ];
      for (const p of patterns) {
        const m = html.match(p);
        if (m?.[0]) return m[0].replace(/[Pp]rice[:\s]+/, '').trim();
      }
      return '';
    }

    function extractSqFt(): string {
      const m = html.match(/[\d,]+\s*(?:sq\.?\s*ft\.?|square\s*feet)/i);
      return m?.[0]?.trim() || '';
    }

    function extractBeds(): string {
      const m = html.match(/(\d+)\s*(?:bed(?:room)?s?|BR|bd)/i);
      return m?.[1] ? m[1] + ' bedrooms' : '';
    }

    function extractBaths(): string {
      const m = html.match(/(\d+(?:\.\d+)?)\s*(?:bath(?:room)?s?|BA|ba)/i);
      return m?.[1] ? m[1] + ' bathrooms' : '';
    }

    function extractAddress(): string {
      // Try structured data first
      const ldJson = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
      if (ldJson) {
        for (const block of ldJson) {
          try {
            const data = JSON.parse(block.replace(/<script[^>]*>|<\/script>/gi, ''));
            if (data?.address?.streetAddress) return data.address.streetAddress + (data.address.addressLocality ? ', ' + data.address.addressLocality : '');
            if (data?.location?.address) return data.location.address;
          } catch(e) {}
        }
      }
      return '';
    }

    function extractPhoto(): string {
      // Try og:image first (most reliable)
      const ogImage = getMeta('image');
      if (ogImage && (ogImage.startsWith('http') || ogImage.startsWith('//'))) {
        return ogImage.startsWith('//') ? 'https:' + ogImage : ogImage;
      }
      // Try first large img src
      const imgs = html.match(/<img[^>]+src=["']([^"']+(?:jpg|jpeg|png|webp)[^"']*)["']/gi);
      if (imgs) {
        for (const img of imgs) {
          const src = img.match(/src=["']([^"']+)["']/i)?.[1];
          if (src && (src.includes('http') || src.startsWith('//')) && !src.includes('logo') && !src.includes('icon')) {
            return src.startsWith('//') ? 'https:' + src : src;
          }
        }
      }
      return '';
    }

    function extractDescription(): string {
      const desc = getMeta('description') || getMeta('og:description');
      if (desc) return desc;
      // Try meta description
      const m = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{20,})["']/i);
      return m?.[1]?.trim() || '';
    }

    // Site-specific extraction hints
    const domain = new URL(url).hostname.replace('www.','');
    let siteHint = '';
    if (domain.includes('zillow')) siteHint = 'Zillow';
    else if (domain.includes('loopnet')) siteHint = 'LoopNet';
    else if (domain.includes('crexi')) siteHint = 'Crexi';
    else if (domain.includes('realtor')) siteHint = 'Realtor.com';
    else if (domain.includes('costar')) siteHint = 'CoStar';
    else if (domain.includes('commercialmls')) siteHint = 'CommercialMLS';

    const result = {
      title: getTitle() || getMeta('title'),
      description: extractDescription(),
      photo: extractPhoto(),
      price: extractPrice(),
      address: extractAddress(),
      sqft: extractSqFt(),
      beds: extractBeds(),
      baths: extractBaths(),
      site: siteHint || domain,
      url,
    };

    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 200 });
  }
}