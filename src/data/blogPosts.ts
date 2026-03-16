// ---------------------------------------------------------------------------
// Types and static data for blog posts
// Kept separate from BlogPost.tsx so the component file only exports
// components (required by react-refresh/only-export-components).
// ---------------------------------------------------------------------------

export interface BlogPostData {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string /** Supports basic markdown-style double-newline paragraphs */
  author: string
  publishedAt: string /** ISO date string */
  tags: string[]
  coverImage?: string
  readingTimeMinutes?: number
}

export const blogPosts: BlogPostData[] = [
  {
    id: '1',
    slug: 'choosing-the-right-body-armor',
    title: 'How to Choose the Right Body Armor for Your Needs',
    excerpt:
      'Not all body armor is created equal. This guide walks you through NIJ levels, plate materials, and how to match protection to your threat environment.',
    content: `Body armor is one of the most important investments you can make in personal protection. But with so many options on the market, it can be hard to know where to start.

**Start with the Threat Level**

The NIJ (National Institute of Justice) publishes the official threat levels for body armor, ranging from Level IIA to Level IV. Most civilians and law enforcement choose Level IIIA for handgun threats and Level III or Level IV when rifle threats are a concern.

**Plate Material Matters**

Steel plates are durable and affordable but heavier. Ceramic plates are lighter and highly effective against rifle rounds but can crack on multiple hits. UHMWPE (ultra-high-molecular-weight polyethylene) plates are the lightest option and increasingly popular for concealed carry applications.

**Fit and Comfort**

Even the best plate does nothing if it does not cover your vital zone. The front plate should sit high on your chest — the top edge roughly level with your collar bone — and cover your heart and lungs completely. Check our Size Guide for exact measurements.

**Our Recommendation**

For most everyday civilian needs, a Level IIIA soft armor panel or a lightweight Level III plate in a low-profile carrier gives excellent protection without sacrificing mobility. For higher-threat environments, our A4 Level III++ Alloy plates provide rifle protection at a competitive weight.`,
    author: 'Cross-Current Armory Team',
    publishedAt: '2026-01-15',
    tags: ['body armor', 'buyer guide', 'NIJ', 'protection'],
    readingTimeMinutes: 4,
  },
  {
    id: '2',
    slug: 'plate-carrier-setup-guide',
    title: 'The Complete Plate Carrier Setup Guide',
    excerpt:
      'A plate carrier is only as effective as its setup. Learn how to adjust, attach, and configure your carrier for maximum protection and mobility.',
    content: `A plate carrier is a serious piece of kit. Getting the setup right takes only a few minutes but makes a massive difference in both protection and comfort.

**Step 1 — Choose the Right Carrier**

Match the carrier to your plates. Our Concealment Plate Carrier is purpose-built for standard 10×12" SAPI and Shooter-cut plates. Verify plate dimensions before purchase.

**Step 2 — Insert Your Plates Correctly**

Hard plates should be inserted with the strike face (the curved surface) facing outward, away from your body. The curved side faces the threat.

**Step 3 — Adjust Shoulder Straps**

Shoulder straps should allow a full range of arm motion. You should be able to raise both arms above your head without the carrier shifting more than an inch. Tighten straps until the carrier fits snugly but does not restrict breathing.

**Step 4 — Cummerbund and Sides**

If your carrier includes a cummerbund, wrap it snugly around your torso. Side plates go in the cummerbund pockets. Adjust so the side plates cover your flanks without overlapping the front plate.

**Step 5 — The Jump Test**

Jump in place several times. Plates should not shift noticeably. A properly fitted carrier will move with your body, not independently of it.`,
    author: 'Cross-Current Armory Team',
    publishedAt: '2026-02-01',
    tags: ['plate carrier', 'setup', 'tactical gear', 'how-to'],
    readingTimeMinutes: 5,
  },
  {
    id: '3',
    slug: 'texas-proud-family-strong',
    title: 'Texas Proud, Family Strong — Our Story',
    excerpt:
      'Cross-Current Precision Armory was born from a simple idea: every warrior deserves access to quality gear without the big-brand markup.',
    content: `Cross-Current Precision Armory started the way most great small businesses do — with a problem worth solving and a family willing to work hard to solve it.

We are a small town, small business with big dreams. Our goal has always been to be the one-stop shop for every tactical, survival, and everyday warrior need. Whether you are a law enforcement professional, an avid outdoorsman, or a homeowner who wants to be prepared, we are here for you.

**Why We Started**

Finding quality tactical gear at a fair price felt unnecessarily difficult. Big brands charge a premium for their name. Discount sellers sacrifice quality. We carved out a middle ground: veteran-tested, family-curated gear at prices that respect your hard-earned money.

**What Drives Us**

We take pride in what we do and believe that if you give, you get. Every order we ship is a small act of trust — you trusting us with your protection, and us trusting that we are sending you something genuinely worth your investment.

**What Is Next**

We are constantly expanding our catalog, building out educational resources, and listening to our customers. If there is something you want to see on our shelves, reach out. We are a real team of real people, and we read every message.

Texas Proud. Family Strong.`,
    author: 'Cross-Current Armory Team',
    publishedAt: '2026-02-20',
    tags: ['about us', 'veteran owned', 'Texas', 'company story'],
    readingTimeMinutes: 3,
  },
]
