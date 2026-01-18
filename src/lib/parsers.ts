
export interface CalendarEvent {
    date: string;
    status?: string; // e.g. "往期回顾", "今日"
    title: string;
    description: string;
    image?: string;
}

export interface Coupon {
    title: string;
    status: string; // e.g. "已领取", "未领取"
    image?: string;
    description?: string;
    price?: string;
    validity?: string;
    tags?: string[];
}

export function parseCalendarData(text: string): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    // Split by date headers ####
    const sections = text.split('####').filter(s => s.trim());

    for (const section of sections) {
        const lines = section.split('\n');
        const headerLine = lines[0].trim();
        // format: "12月8日 往期回顾" or "12月9日 Today"
        const dateMatch = headerLine.match(/^(\d+月\d+日)\s*(.*)?$/);
        const date = dateMatch ? dateMatch[1] : headerLine;
        const status = dateMatch ? dateMatch[2] : '';

        // Extract content
        const fullText = lines.slice(1).join('\n');

        // Extract Title
        // Extract Title
        const titleMatch = fullText.match(/\*\*活动标题\*\*：([\s\S]*?)(?=\\)/) || fullText.match(/\*\*活动标题\*\*：(.*?)\n/);
        const title = titleMatch ? titleMatch[1].trim() : 'No Title';

        // Extract Description
        let description = '';
        const descMatch = fullText.match(/\*\*活动内容介绍\*\*：([\s\S]*?)(?=\\)/) || fullText.match(/\*\*活动内容介绍\*\*：([\s\S]*?)(?=\*\*活动图片)/);
        if (descMatch) {
            description = descMatch[1].replace(/\\n/g, '\n').trim();
        }

        // Extract Image
        const imgMatch = fullText.match(/src="([^"]+)"/);
        const image = imgMatch ? imgMatch[1] : undefined;

        if (title !== 'No Title') {
            events.push({ date, status, title, description, image });
        }
    }
    return events;
}

export function parseAvailableCoupons(text: string): Coupon[] {
    const coupons: Coupon[] = [];
    // Split by bullet points that look like start of a coupon
    // The format is "- 优惠券标题：..."
    const items = text.split(/-\s+优惠券标题：/g).filter(s => s.trim());

    for (const item of items) {
        // We split by lines or key phrases to be safe
        const titleMatch = item.match(/^(.*?)\s*\\/);
        const title = titleMatch ? titleMatch[1].trim() : item.split('\n')[0].trim();

        const statusMatch = item.match(/状态：(.*?)\s*\\/);
        const status = statusMatch ? statusMatch[1].trim() : 'Unknown';

        const imgMatch = item.match(/src="([^"]+)"/);
        const image = imgMatch ? imgMatch[1] : undefined;

        // Strict filtering: discard if it's a markdown header or valid coupon structure is missing
        if (title.startsWith('#') || title.includes('列表') || status === 'Unknown') {
            continue;
        }

        coupons.push({ title, status, image });
    }
    return coupons;
}

export function parseMyCoupons(text: string): Coupon[] {
    const coupons: Coupon[] = [];
    // Split by H2 headers "## "
    // Raw parsing often leaves the # header as an item. We need to filter it.
    const sections = text.split('## ').filter(s => s.trim());

    for (const item of sections) {
        // Skip if it looks like a main title or empty
        const firstLine = item.split('\n')[0].trim();
        if (firstLine.includes('优惠券列表') || firstLine.startsWith('#')) {
            continue;
        }

        const lines = item.split('\n');
        const title = lines[0].trim().replace(/^#+\s*/, ''); // Clean leading # just in case

        if (!title) continue;

        const priceMatch = item.match(/\*\*优惠\*\*: (.*?)(?=\n)/);
        const price = priceMatch ? priceMatch[1] : undefined;

        const validMatch = item.match(/\*\*有效期\*\*: (.*?)(?=\n)/);
        const validity = validMatch ? validMatch[1] : undefined;

        const tagsMatch = item.match(/\*\*标签\*\*: (.*?)(?=\n)/);
        const tags = tagsMatch ? tagsMatch[1].split(/,|、/).map(t => t.trim()) : [];

        const imgMatch = item.match(/src="([^"]+)"/);
        const image = imgMatch ? imgMatch[1] : undefined;

        coupons.push({ title, status: 'Available', price, validity, tags, image });
    }
    return coupons;
}
