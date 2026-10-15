import Image from "next/image";
import Link from "next/link";
import { Newsletter } from "@/components/newsletter";
import { ProductGrid } from "@/components/product-grid";
import { Seal } from "@/components/seal";
import { Bag, Diamond, Gift, Globe, Ornament, Return, Shield, Truck } from "@/components/icons";
import { getCollectionProducts, getProducts, isDemoMode } from "@/lib/commerce";
import { site } from "@/lib/site";

export const revalidate = 300;

// The sign-up form only shows once it has somewhere to send emails (or in demo mode).
const newsletterEnabled = isDemoMode || Boolean(process.env.NEWSLETTER_WEBHOOK_URL);

export default async function HomePage() {
  const [bestSellers, newArrivals] = await Promise.all([
    getCollectionProducts("best-sellers", "featured", 8).then((p) => p || []),
    getProducts({ sort: "newest", first: 4 }),
  ]);

  return (
    <>
      {/* ───── Hero ───── */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero-inner">
          <div>
            <p className="eyebrow">
              <Ornament width={14} height={14} /> Authentic Designer Fragrances
            </p>
            <h1 id="hero-title">
              Huele Rico<span className="bang">,</span>
              <br />
              Paga Menos<span className="bang">!</span>
            </h1>
            <p className="hero-tag">Smell Rich. Pay Less.</p>
            <p className="lead">
              100% authentic designer perfumes and colognes for him and her — always below retail, shipped fast and free across the U.S.
            </p>
            <div className="hero-ctas">
              <Link href="/collections/best-sellers" className="btn btn-primary">
                <Bag /> Shop Best Sellers
              </Link>
              <Link href="/collections/all" className="btn btn-gold">
                <Ornament /> Descubre tu aroma
              </Link>
            </div>
            <ul className="hero-trust">
              <li>
                <Shield /> 100% Originales
              </li>
              <li>
                <Truck /> Free shipping $50+
              </li>
              <li>
                <Return /> 30-day returns
              </li>
            </ul>
          </div>
          <div className="hero-media">
            <Image
              src="/images/signature-bottle.webp"
              alt="Huele Rico! signature plum perfume bottle with gold cap, orchid, amber and vanilla"
              width={540}
              height={745}
              priority
              sizes="(max-width: 820px) 360px, 470px"
            />
            <Seal className="hero-seal" />
          </div>
        </div>
      </section>

      {/* ───── Trust bar ───── */}
      <section className="trust-bar" aria-label="Why shop Huele Rico!">
        <div className="container trust-grid">
          <div className="trust-item">
            <Shield />
            <div>
              <strong>Original Only</strong>
              <span>100% authentic, factory sealed</span>
            </div>
          </div>
          <div className="trust-item">
            <Diamond />
            <div>
              <strong>Below Retail</strong>
              <span>Luxury for less, always</span>
            </div>
          </div>
          <div className="trust-item">
            <Truck />
            <div>
              <strong>Fast Free Shipping</strong>
              <span>On U.S. orders $50+</span>
            </div>
          </div>
          <div className="trust-item">
            <Gift />
            <div>
              <strong>Giftable Luxury</strong>
              <span>Signature unboxing</span>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Shop by category ───── */}
      <section className="section" aria-labelledby="cat-title">
        <div className="container">
          <div className="section-head centered">
            <p className="eyebrow">Shop by Category</p>
            <h2 id="cat-title">Find your signature scent</h2>
            <div className="ornament">
              <Ornament />
            </div>
          </div>
          <div className="cat-grid">
            <Link href="/collections/men" className="cat-tile">
              <Image src="/images/para-el.webp" alt="" width={600} height={790} sizes="(max-width: 480px) 100vw, (max-width: 820px) 100vw, 33vw" />
              <p className="eyebrow">Para Él</p>
              <h3>Men&rsquo;s Cologne</h3>
              <p>Fresh, woody and bold — the scents that turn heads.</p>
              <span className="link-arrow">Shop For Him</span>
            </Link>
            <Link href="/collections/women" className="cat-tile">
              <Image src="/images/para-ella.webp" alt="" width={600} height={790} sizes="(max-width: 480px) 100vw, (max-width: 820px) 50vw, 33vw" />
              <p className="eyebrow">Para Ella</p>
              <h3>Women&rsquo;s Perfume</h3>
              <p>Floral, gourmand and radiant — luxury that feels like you.</p>
              <span className="link-arrow">Shop For Her</span>
            </Link>
            <Link href="/collections/gift-sets" className="cat-tile top-img">
              <Image src="/images/mailer-box.webp" alt="" width={345} height={285} sizes="(max-width: 480px) 100vw, (max-width: 820px) 50vw, 33vw" />
              <p className="eyebrow">Regalos</p>
              <h3>Gift Sets</h3>
              <p>Beautiful products. Meaningful moments.</p>
              <span className="link-arrow">Shop Gifts</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ───── Best sellers ───── */}
      {bestSellers.length > 0 && (
        <section className="section section-alt" aria-labelledby="best-title">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="eyebrow">Los Favoritos</p>
                <h2 id="best-title">Best Sellers</h2>
              </div>
              <Link href="/collections/best-sellers" className="link-arrow">
                Shop All Best Sellers
              </Link>
            </div>
            <ProductGrid products={bestSellers} />
          </div>
        </section>
      )}

      {/* ───── Lifestyle ───── */}
      <section className="lifestyle-banner" aria-labelledby="community-title">
        <Image
          src="/images/lifestyle-rooftop.webp"
          alt="Four friends in Huele Rico! plum hoodies and jackets laughing together on a city rooftop at sunset"
          width={1672}
          height={941}
          sizes="100vw"
        />
        <div className="container">
          <p className="eyebrow">Somos Comunidad</p>
          <h2 id="community-title">Smell rich with your people.</h2>
          <p>
            We&rsquo;re a community that celebrates scent, self-expression and smart luxury — together. Designer fragrance
            shouldn&rsquo;t be out of reach. Aquí, hueles rico y pagas menos.
          </p>
          <Link href="/pages/about" className="btn btn-light">
            Our Story
          </Link>
        </div>
      </section>

      {/* ───── Brand essence ───── */}
      <section className="section section-plum" aria-labelledby="essence-title">
        <div className="container">
          <div className="section-head centered">
            <p className="eyebrow">Brand Essence</p>
            <h2 id="essence-title">Luxury. Authenticity. Meaning.</h2>
            <p className="lead">Everything we do comes back to one promise: {site.promise}</p>
          </div>
          <div className="essence-grid">
            <div className="essence-item">
              <Diamond />
              <h3>Smart Luxury</h3>
              <p>Premium quality. Smarter choice.</p>
            </div>
            <div className="essence-item">
              <Shield />
              <h3>Original Only</h3>
              <p>100% authentic designer fragrances.</p>
            </div>
            <div className="essence-item">
              <Globe />
              <h3>Bilingual Reach</h3>
              <p>English &amp; Español. One brand, two voices.</p>
            </div>
            <div className="essence-item">
              <Gift />
              <h3>Giftable Lifestyle</h3>
              <p>Beautiful products. Meaningful moments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Authenticity ───── */}
      <section className="section" aria-labelledby="auth-title">
        <div className="container split reverse-mobile">
          <div>
            <p className="eyebrow">Autenticidad · Confianza · Esencia</p>
            <h2 id="auth-title">100% original o te devolvemos tu dinero.</h2>
            <p className="lead">
              Every bottle we sell is genuine, factory-sealed and sourced through trusted distribution channels. If it&rsquo;s
              not authentic, you get your money back. Period.
            </p>
            <ol className="steps" style={{ gridTemplateColumns: "1fr", margin: "24px 0" }}>
              <li>
                <h3>Sourced right</h3>
                <p>We buy from authorized distributors and verified wholesale partners — never knock-offs or &ldquo;inspired by&rdquo; dupes.</p>
              </li>
              <li>
                <h3>Inspected &amp; sealed</h3>
                <p>Batch codes, packaging and cellophane are checked before every order ships.</p>
              </li>
              <li>
                <h3>Guaranteed</h3>
                <p>Our authenticity promise is backed by a full money-back guarantee.</p>
              </li>
            </ol>
            <Link href="/pages/authenticity" className="btn btn-outline">
              <Shield /> Shop Authenticity
            </Link>
          </div>
          <div className="split-media small">
            <Image
              src="/images/mailer-box.webp"
              alt="Plum Huele Rico! mailer box printed with Autenticidad. Confianza. Esencia."
              width={345}
              height={285}
              sizes="(max-width: 820px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* ───── New arrivals ───── */}
      {newArrivals.length > 0 && (
        <section className="section section-alt" aria-labelledby="new-title">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="eyebrow">Lo Nuevo</p>
                <h2 id="new-title">New Arrivals</h2>
              </div>
              <Link href="/collections/all?sort=newest" className="link-arrow">
                Shop New
              </Link>
            </div>
            <ProductGrid products={newArrivals} />
          </div>
        </section>
      )}

      {/* ───── Gifting ───── */}
      <section className="section" aria-labelledby="gift-title">
        <div className="container split">
          <div className="gift-grid">
            <Image src="/images/tissue-wrap.webp" alt="Huele Rico! monogram tissue paper with HR seal sticker" width={260} height={285} sizes="(max-width: 820px) 33vw, 200px" />
            <Image src="/images/unboxing.webp" alt="Open plum gift box with monogram tissue inside" width={207} height={163} sizes="(max-width: 820px) 33vw, 200px" />
            <Image src="/images/gift-card.webp" alt="Plum Huele Rico! gift card reading Descubre tu esencia" width={230} height={155} sizes="(max-width: 820px) 33vw, 200px" />
          </div>
          <div>
            <p className="eyebrow">Giftable Luxury</p>
            <h2 id="gift-title">Every order arrives ready to gift.</h2>
            <p className="lead">
              Soft-touch plum boxes, monogram tissue, gold-foil seals and a bilingual thank-you card. For birthdays, aniversarios,
              Navidad and Día de las Madres — or just because you deserve it.
            </p>
            <Link href="/collections/gift-sets" className="btn btn-primary">
              <Gift /> Shop Gift Sets
            </Link>
          </div>
        </div>
      </section>

      {/* ───── Newsletter + community ───── */}
      <section className="section section-plum" aria-labelledby="news-title">
        <div className="container">
          {newsletterEnabled ? (
            <Newsletter />
          ) : (
            <div className="newsletter">
              <p className="eyebrow">Únete a la Familia</p>
              <h2 id="news-title">Huele bien. Vive mejor.</h2>
              <p className="lead" style={{ margin: "0 auto" }}>
                Follow along for restocks, new arrivals and community drops.
              </p>
            </div>
          )}
          <ul className="hashtags" aria-label="Community hashtags">
            {site.hashtags.map((h) => (
              <li key={h} style={{ color: "var(--soft-ivory)" }}>
                {h}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
