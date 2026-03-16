export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: BlogCategory
  author: string
  authorRole: string
  publishedAt: string
  readTime: number
  tags: string[]
  featured?: boolean
}

export type BlogCategory =
  | 'Gear Reviews'
  | 'Tactical Tips'
  | 'Industry News'
  | 'Company Updates'
  | 'How-To Guides'

export const blogCategories: BlogCategory[] = [
  'Gear Reviews',
  'Tactical Tips',
  'Industry News',
  'Company Updates',
  'How-To Guides',
]

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'a2-level-iii-plus-review',
    title: 'A2 Level III+ Alloy Body Armor: An In-Depth Field Review',
    category: 'Gear Reviews',
    author: 'James T.',
    authorRole: 'Tactical Instructor',
    publishedAt: '2026-03-10',
    readTime: 6,
    featured: true,
    tags: ['body armor', 'level III+', 'alloy', 'review'],
    excerpt:
      "After six months of field use in training environments, we put the A2 alloy plate through rigorous testing. Here's exactly what we found.",
    content: `Six months. That's how long we've had the A2 Level III+ Alloy Body Armor in rotation at our training facility. We ran it through everything we could throw at it — prolonged carry drills, force-on-force training, and range qualification — and it held up better than gear at twice the price.

## Construction and Weight

The A2 uses a multi-curve alloy composite that shaves significant weight compared to traditional AR500 steel plates. At under 4 lbs per plate, it represents a genuine step forward for operators who spend hours in a carrier. The edges are smooth and the finish uniform — no rough spots or manufacturing defects on any of our test plates.

## Fit and Comfort

The multi-curve profile sits naturally against the chest and distributes load well. After 8-hour training days, fatigue was noticeably lower compared to our steel plate control group. The plate fits standard 10×12 plate pockets without modification.

## Protection Performance

In controlled range testing (with proper backstop and safety protocols), the A2 stopped:
- .223 FMJ (M193)
- 5.56 M855 green tip
- 7.62×39 FMJ

No back-face deformation exceeded NIJ test standards on any of our sample plates. We observed zero pass-throughs.

## Verdict

If you're looking for a reliable, affordable Level III+ plate without sacrificing too much on weight, the A2 is hard to beat. We're recommending it to all our students as their primary training plate.

**Rating: 4.8 / 5.0**`,
  },
  {
    id: '2',
    slug: 'how-to-size-plate-carrier',
    title: 'How to Size and Fit Your Plate Carrier Correctly',
    category: 'How-To Guides',
    author: 'Sarah K.',
    authorRole: 'Security Consultant',
    publishedAt: '2026-03-05',
    readTime: 5,
    tags: ['plate carrier', 'sizing', 'fit', 'guide'],
    excerpt:
      "A plate carrier that doesn't fit correctly is worse than no armor at all. Our expert guide walks you through the entire process.",
    content: `A surprising number of people wear body armor that doesn't fit correctly — and in a real situation, that gap in coverage could be life-threatening. Let's fix that.

## Step 1: Measure Your Chest

Stand relaxed, arms at your sides. Wrap a soft measuring tape around the widest part of your chest (typically at nipple level). Keep the tape level and snug — not tight. Most adult males fall in the 38–44″ range, which corresponds to a 10×12 plate and a Medium carrier.

## Step 2: Determine Plate Size

See our [Size Guide](/size-guide) for the full chart, but the quick reference is:
- Under 38″ → 8×10 plate (SAPI Small)
- 38–44″ → 10×12 plate (SAPI Medium) — this fits most people
- Over 44″ → 11×14 plate (SAPI Large)

## Step 3: Position the Front Plate

The front plate's top edge should sit 2–3 finger-widths below your sternal notch (the dip at the top of your breastbone). This ensures your heart and lungs are covered while keeping the bottom edge above your navel for mobility.

## Step 4: Adjust the Carrier

Shoulder straps: snug enough that plates don't shift, but loose enough that you can raise both arms overhead. The cummerbund should be firm but not restrict breathing.

## Step 5: Movement Check

Perform a full range of motion — raise your arms, crouch, rotate your torso. Plates should stay centered. If they shift significantly, readjust the straps.

## Common Mistakes

- **Wearing the carrier too high**: Covers the collarbone but leaves the lower lungs exposed.
- **Straps too loose**: Plates bounce during movement and can cause bruising or injury.
- **Wrong plate cut**: SAPI cut vs. swimmer's cut vs. shooter's cut — make sure your carrier and plate match.`,
  },
  {
    id: '3',
    slug: 'concealment-carrier-everyday-carry',
    title: 'The Case for Concealment Carriers in Everyday Security Work',
    category: 'Tactical Tips',
    author: 'Mike R.',
    authorRole: 'Private Security Director',
    publishedAt: '2026-02-28',
    readTime: 4,
    tags: ['plate carrier', 'concealment', 'everyday carry', 'security'],
    excerpt:
      'When your job requires a low-profile appearance without sacrificing protection, a concealment carrier changes everything.',
    content: `Not every security role looks like a tactical unit. Corporate security, executive protection, and event staff need protection that doesn't intimidate clients or attract attention. That's where concealment plate carriers become essential.

## What Makes a Carrier "Concealment"?

A concealment carrier is designed with a slimmer profile, fewer external attachment points, and a lower-visibility silhouette. It's typically worn under a jacket or over a dress shirt and blends into professional attire better than a full tactical carrier loaded with MOLLE pouches.

## Trade-Offs to Consider

**What you gain:**
- Discretion and professional appearance
- Lighter loadout (no external pouches)
- Less intimidation factor in civilian settings

**What you give up:**
- Side-plate compatibility (on most concealment designs)
- MOLLE modularity
- Some ventilation compared to cummerbund-style carriers

## Our Concealment Plate Carrier

The Cross-Current Concealment Plate Carrier accepts standard 10×12 Level III and III+ plates in both front and back pockets. The streamlined cummerbund stays flat under a blazer, and the adjustable shoulder straps accommodate a wide range of body types.

For executive protection roles or plainclothes work, this carrier has become our most recommended product for daily wear.`,
  },
  {
    id: '4',
    slug: 'spring-2026-launch',
    title: 'Introducing Our Spring 2026 Product Line',
    category: 'Company Updates',
    author: 'Cross-Current Team',
    authorRole: 'Cross-Current Precision Armory',
    publishedAt: '2026-03-01',
    readTime: 3,
    tags: ['new products', 'spring 2026', 'company news'],
    excerpt:
      "We're thrilled to announce new additions to our body armor and plate carrier lineup for spring 2026.",
    content: `Cross-Current Precision Armory was founded with a simple mission: bring military-grade protection to everyday Americans at honest prices. This spring, we're expanding our catalog with several new additions.

## New This Season

**A4 Side Plates** — Complete your protection setup with our new 6×6 side plates, designed to pair seamlessly with the A4 Level III++ front and back plates. Available in Level III and Level III+.

**Concealment Plate Carrier – White** — By popular request, our bestselling Concealment carrier is now available in white, ideal for plainclothes law enforcement, summer wear, and operators who need a lighter-visible option.

**Coleman Perfect Flow 2-Burner Stove** — We're expanding beyond armor into tactical preparedness with the Coleman Perfect Flow, a reliable two-burner stove for field operations, camping, and emergency preparedness.

## What's Coming

We're actively working on:
- Soft armor inserts for our carriers (Level IIIA)
- A female-specific plate carrier cut
- Chest rigs and battle belt systems

## Thank You

We launched in January 2026 with a single product and a lot of Texas grit. The response from the community has been humbling. Every order, review, and referral drives us forward. Thank you for your support — it means everything to this small, veteran-owned business.`,
  },
  {
    id: '5',
    slug: 'nij-standards-explained',
    title: 'NIJ Body Armor Standards: What the Ratings Actually Mean',
    category: 'Industry News',
    author: 'James T.',
    authorRole: 'Tactical Instructor',
    publishedAt: '2026-02-20',
    readTime: 7,
    tags: ['NIJ', 'standards', 'body armor', 'ratings', 'education'],
    excerpt:
      "The NIJ ratings on body armor can be confusing. This guide breaks down exactly what each level means, how they're tested, and what you should look for.",
    content: `When you're buying body armor, the protection level rating is the most important specification on the label — and also one of the most misunderstood. Let's demystify NIJ 0101.06 (the current standard) and what it means for you.

## What is the NIJ?

The National Institute of Justice is the research arm of the U.S. Department of Justice. Their 0101.06 standard sets the bar for ballistic performance testing of personal body armor, and most reputable armor manufacturers in the U.S. test to or certify against this standard.

## Protection Levels

**Level II**
- Stops: 9 mm 124-grain FMJ at 1305 ft/s; .357 Magnum JSP 158-grain at 1430 ft/s
- Construction: Soft armor (typically Kevlar or Dyneema)
- Best for: Plainclothes officers who prioritize concealability over rifle protection

**Level IIIA**
- Stops: .357 SIG FMJ 125-grain at 1470 ft/s; .44 Magnum SJHP 240-grain at 1430 ft/s
- Construction: Soft armor (thicker than Level II)
- Best for: Law enforcement general duty (before rifle threats became more prevalent)

**Level III**
- Stops: 7.62×51 mm NATO (M80 ball) 147-grain FMJ at 2780 ft/s — 6 rounds
- Construction: Hard armor (steel, ceramic, or composite)
- Note: Does NOT necessarily stop M855 5.56 or M193; check with manufacturer

**Level III+ (Manufacturer Designation)**
- Stops: All Level III threats PLUS M855 5.56 green tip and/or M193
- Note: Not an official NIJ designation; performance varies by manufacturer
- Our plates: The A2 and A4 are tested to stop M855 and M193

**Level IV**
- Stops: .30 caliber AP (M2 AP) 166-grain at 2880 ft/s — 1 round
- Construction: Hard armor, typically ceramic composite
- Best for: Military environments with armor-piercing rifle threat

## The Testing Process

NIJ-certified labs test new armor by firing rounds at close range onto ballistic clay backing. Back-face deformation (the dent in the clay) cannot exceed 44 mm, and no rounds can penetrate. Plates also undergo conditioning tests (immersion, flex, drop, extreme temperatures) before ballistic testing.

## What to Look For When Buying

1. **Ask for test data**: Reputable manufacturers can provide ballistic test reports.
2. **Check NIJ's certified product list**: [NIJ certified armor list](https://www.nij.gov)
3. **Understand multi-hit vs. single-hit**: Level IV is often rated for one AP hit. Level III and III+ are typically multi-hit capable.
4. **Match armor to threat**: Don't overpay for Level IV if your threat environment is handgun calibers.`,
  },
]
