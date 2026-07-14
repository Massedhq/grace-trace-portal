import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 });

    const domain = new URL(url).hostname.replace('www.','');

    // Zillow blocks all scrapers — return early with helpful message
    if (domain.includes('zillow')) {
      return NextResponse.json({
        error: 'zillow_blocked',
        message: 'Zillow blocks all auto-import tools. The link has been saved — please fill in the details manually.',
        url,
        site: 'Zillow',
      });
    }

    // Fetch server-side with browser-like headers
    let html = '';
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
        redirect: 'follow',
      });
      if (response.ok) html = await response.text();
      else return NextResponse.json({ error: `Site returned ${response.status} — try filling details manually`, url, site: domain });
    } catch(e) {
      return NextResponse.json({ error: 'Could not reach site — try filling details manually', url, site: domain });
    }

    // Helper: extract meta tags
    function getMeta(names: string[]): string {
      for (const name of names) {
        const patterns = [
          new RegExp(`<meta[^>]+property=["']${name}["'][^>]+content=["']([^"']{3,500})["']`, 'i'),
          new RegExp(`<meta[^>]+content=["']([^"']{3,500})["'][^>]+property=["']${name}["']`, 'i'),
          new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']{3,500})["']`, 'i'),
          new RegExp(`<meta[^>]+content=["']([^"']{3,500})["'][^>]+name=["']${name}["']`, 'i'),
        ];
        for (const p of patterns) {
          const m = html.match(p);
          if (m?.[1]) return m[1].trim().replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
        }
      }
      return '';
    }

    function getTitle(): string {
      const og = getMeta(['og:title','twitter:title']);
      if (og) return og;
      const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      return m?.[1]?.trim().split('|')[0].split('-')[0].trim() || '';
    }

    function getPhoto(): string {
      const og = getMeta(['og:image','og:image:url','twitter:image','twitter:image:src']);
      if (og) return og.startsWith('//') ? 'https:'+og : og;
      // Try JSON-LD
      const ldMatch = html.match(/["']image["']\s*:\s*["']([^"']+(?:jpg|jpeg|png|webp)[^"']*)["']/i);
      if (ldMatch?.[1]) return ldMatch[1];
      return '';
    }

    function getDescription(): string {
      return getMeta(['og:description','twitter:description','description']).slice(0,500);
    }

    function getPrice(): string {
      // Try meta tags first
      const priceMeta = getMeta(['product:price:amount','price','og:price:amount']);
      if (priceMeta) return '$' + priceMeta;
      // Try patterns in HTML
      const patterns = [
        /\$\s*[\d,]+(?:\.\d{2})?(?:\s*(?:\/mo|\/month|per month))?/gi,
        /(?:price|asking|list(?:ed)?|sale)[:\s"']+\$\s*[\d,]+/gi,
        /(?:USD|Price)\s*[\d,]+/gi,
      ];
      for (const p of patterns) {
        const m = html.match(p);
        if (m?.[0]) return m[0].replace(/(?:price|asking|listed|sale|USD)[:\s"']*/i,'').trim();
      }
      return '';
    }

    function getSqFt(): string {
      const m = html.match(/([\d,]+)\s*(?:sq\.?\s*ft\.?|square\s*feet|SF\b)/i);
      return m ? m[1].replace(',','') + ' sq ft' : '';
    }

    function getRooms(): string {
      const m = html.match(/(\d+)\s*(?:bed(?:room)?s?|BR\b|bd\b)/i);
      return m ? m[1] + ' bedrooms' : '';
    }

    function getBaths(): string {
      const m = html.match(/(\d+(?:\.\d)?)\s*(?:bath(?:room)?s?|BA\b)/i);
      return m ? m[1] + ' baths' : '';
    }

    function getAddress(): string {
      // Try JSON-LD structured data
      const blocks = html.match(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi) || [];
      for (const block of blocks) {
        try {
          const text = block.replace(/<[^>]+>/g,'');
          const data = JSON.parse(text);
          const addr = data?.address || data?.location?.address || data?.geo?.address;
          if (addr?.streetAddress) return [addr.streetAddress, addr.addressLocality, addr.addressRegion].filter(Boolean).join(', ');
          if (typeof addr === 'string' && addr.length > 5) return addr;
        } catch(e) {}
      }
      // Try og:street-address or similar
      return getMeta(['og:street-address','place:location:latitude']) || '';
    }

    const result = {
      title: getTitle(),
      description: getDescription(),
      photo: getPhoto(),
      price: getPrice(),
      address: getAddress(),
      sqft: getSqFt(),
      beds: getRooms(),
      baths: getBaths(),
      site: domain,
      url,
    };

    // Check if we got anything useful
    const hasData = result.title || result.photo || result.price || result.description;
    if (!hasData) {
      return NextResponse.json({
        ...result,
        error: 'limited',
        message: 'This site limits auto-import. The link has been saved — please fill in the remaining details manually.',
      });
    }

    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message, url: '' }, { status: 200 });
  }
}