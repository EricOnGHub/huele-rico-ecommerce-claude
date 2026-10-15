import Image from "next/image";
import Link from "next/link";
import { Bag, Diamond, Gift, Globe, Ornament, Return, Shield, Truck } from "@/components/icons";
import { Newsletter } from "@/components/newsletter";
import { ProductGrid } from "@/components/product-grid";
import { RecentlyViewed } from "@/components/recently-viewed";
import { Seal } from "@/components/seal";
import { getCollectionProducts, getNewest } from "@/lib/commerce";
import { asset, isDemoMode, newsletterWebhook } from "@/lib/config";
import { getDict, lp } from "@/lib/i18n";
import { FAMILIES, toSummary } from "@/lib/scent";
import { site } from "@/lib/site";
import type { Lang } from "@/lib/types";

// The sign-up form only shows once it has somewhere to send emails (or in demo mode).
const newsletterEnabled = isDemoMode || Boolean(newsletterWebhook);

export async function HomeView({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const h = t.home;
  const [best, newest] = await Promise.all([getCollectionProducts("best-sellers", lang, 8).then((p) => p || []), getNewest(lang, 4)]);
  const trustIcons = [Shield, Diamond, Truck, Gift];
  const essenceIcons = [Diamond, Shield, Globe, Gift];
  const catLinks = ["/collections/men", "/collections/women", "/collections/gift-sets"];
  const catImages = [
    { src: "/images/para-el.webp", w: 600, h: 790 },
    { src: "/images/para-ella.webp", w: 600, h: 790 },
    { src: "/images/mailer-box.webp", w: 345, h: 285 },
  ];

  return (
    <>
      {/* ───── Hero ───── */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero-inner">
          <div>
            <p className="eyebrow">
              <Ornament width={14} height={14} /> {h.eyebrow}
            </p>
            <h1 id="hero-title">
              {h.h1a}
              <span className="bang">,</span>
              <br />
              {h.h1b}
              <span className="bang">!</span>
            </h1>
            <p className="hero-tag">{h.tag}</p>
            <p className="lead">{h.lead}</p>
            <div className="hero-ctas">
              <Link href={lp(lang, "/collections/best-sellers")} className="btn btn-primary">
                <Bag /> {h.ctaShop}
              </Link>
              <Link href={lp(lang, "/quiz")} className="btn btn-gold">
                <Ornament /> {h.ctaDiscover}
              </Link>
            </div>
            <ul className="hero-trust">
              {h.trustHero.map((item, i) => {
                const Icon = [Shield, Truck, Return][i];
                return (
                  <li key={item}>
                    <Icon /> {item}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="hero-media">
            <Image src={asset("/images/signature-bottle.webp")} alt={h.heroAlt} width={540} height={745} priority sizes="(max-width: 820px) 360px, 470px" />
            <Seal className="hero-seal" />
          </div>
        </div>
      </section>

      {/* ───── Trust bar ───── */}
      <section className="trust-bar" aria-label={h.trustLabel}>
        <div className="container trust-grid">
          {h.trust.map((item, i) => {
            const Icon = trustIcons[i];
            return (
              <div className="trust-item" key={item.title}>
                <Icon />
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ───── Shop by category ───── */}
      <section className="section" aria-labelledby="cat-title">
        <div className="container">
          <div className="section-head centered">
            <p className="eyebrow">{h.catEyebrow}</p>
            <h2 id="cat-title">{h.catTitle}</h2>
            <div className="ornament">
              <Ornament />
            </div>
          </div>
          <div className="cat-grid">
            {h.cats.map((c, i) => (
              <Link key={c.title} href={lp(lang, catLinks[i])} className={`cat-tile ${i === 2 ? "top-img" : ""}`}>
                <Image src={asset(catImages[i].src)} alt="" width={catImages[i].w} height={catImages[i].h} sizes="(max-width: 480px) 100vw, (max-width: 820px) 50vw, 33vw" />
                <p className="eyebrow">{c.eyebrow}</p>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
                <span className="link-arrow">{c.cta}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Best sellers ───── */}
      {best.length > 0 && (
        <section className="section section-alt" aria-labelledby="best-title">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="eyebrow">{h.bestEyebrow}</p>
                <h2 id="best-title">{h.bestTitle}</h2>
              </div>
              <Link href={lp(lang, "/collections/best-sellers")} className="link-arrow">
                {h.bestCta}
              </Link>
            </div>
            <ProductGrid products={best.map(toSummary)} />
          </div>
        </section>
      )}

      {/* ───── Scent quiz + families ───── */}
      <section className="section quiz-band" aria-labelledby="quiz-title">
        <div className="container quiz-band-inner">
          <div>
            <p className="eyebrow">{h.quizEyebrow}</p>
            <h2 id="quiz-title">{h.quizTitle}</h2>
            <p className="lead">{h.quizBody}</p>
            <Link href={lp(lang, "/quiz")} className="btn btn-primary">
              <Ornament /> {h.quizCta}
            </Link>
          </div>
          <div>
            <h3 className="subhead families-title">{h.familiesTitle}</h3>
            <ul className="family-tiles">
              {FAMILIES.map((f) => (
                <li key={f}>
                  <Link href={`${lp(lang, "/collections/all")}?family=${f}`} className={`family-tile fam-${f}`}>
                    <strong>{t.families[f].name}</strong>
                    <span>{t.families[f].body}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───── Lifestyle ───── */}
      <section className="lifestyle-banner" aria-labelledby="community-title">
        <Image src={asset("/images/lifestyle-rooftop.webp")} alt={h.lifeAlt} width={1672} height={941} sizes="100vw" />
        <div className="container">
          <p className="eyebrow">{h.lifeEyebrow}</p>
          <h2 id="community-title">{h.lifeTitle}</h2>
          <p>{h.lifeBody}</p>
          <Link href={lp(lang, "/pages/about")} className="btn btn-light">
            {h.lifeCta}
          </Link>
        </div>
      </section>

      {/* ───── Brand essence ───── */}
      <section className="section section-plum" aria-labelledby="essence-title">
        <div className="container">
          <div className="section-head centered">
            <p className="eyebrow">{h.essEyebrow}</p>
            <h2 id="essence-title">{h.essTitle}</h2>
            <p className="lead">{h.essLead}</p>
          </div>
          <div className="essence-grid">
            {h.essence.map((e, i) => {
              const Icon = essenceIcons[i];
              return (
                <div className="essence-item" key={e.title}>
                  <Icon />
                  <h3>{e.title}</h3>
                  <p>{e.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───── Authenticity ───── */}
      <section className="section" aria-labelledby="auth-title">
        <div className="container split reverse-mobile">
          <div>
            <p className="eyebrow">{h.authEyebrow}</p>
            <h2 id="auth-title">{h.authTitle}</h2>
            <p className="lead">{h.authLead}</p>
            <ol className="steps" style={{ gridTemplateColumns: "1fr", margin: "24px 0" }}>
              {h.authSteps.map((s) => (
                <li key={s.title}>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
            <Link href={lp(lang, "/pages/authenticity")} className="btn btn-outline">
              <Shield /> {h.authCta}
            </Link>
          </div>
          <div className="split-media small">
            <Image src={asset("/images/mailer-box.webp")} alt={h.boxAlt} width={345} height={285} sizes="(max-width: 820px) 100vw, 420px" />
          </div>
        </div>
      </section>

      {/* ───── New arrivals ───── */}
      {newest.length > 0 && (
        <section className="section section-alt" aria-labelledby="new-title">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="eyebrow">{h.newEyebrow}</p>
                <h2 id="new-title">{h.newTitle}</h2>
              </div>
              <Link href={`${lp(lang, "/collections/all")}?sort=newest`} className="link-arrow">
                {h.newCta}
              </Link>
            </div>
            <ProductGrid products={newest.map(toSummary)} />
          </div>
        </section>
      )}

      <RecentlyViewed />

      {/* ───── Gifting ───── */}
      <section className="section" aria-labelledby="gift-title">
        <div className="container split">
          <div className="gift-grid">
            <Image src={asset("/images/tissue-wrap.webp")} alt={h.giftAlts[0]} width={260} height={285} sizes="(max-width: 820px) 33vw, 200px" />
            <Image src={asset("/images/unboxing.webp")} alt={h.giftAlts[1]} width={207} height={163} sizes="(max-width: 820px) 33vw, 200px" />
            <Image src={asset("/images/gift-card.webp")} alt={h.giftAlts[2]} width={230} height={155} sizes="(max-width: 820px) 33vw, 200px" />
          </div>
          <div>
            <p className="eyebrow">{h.giftEyebrow}</p>
            <h2 id="gift-title">{h.giftTitle}</h2>
            <p className="lead">{h.giftBody}</p>
            <Link href={lp(lang, "/collections/gift-sets")} className="btn btn-primary">
              <Gift /> {h.giftCta}
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
              <p className="eyebrow">{t.newsletter.eyebrow}</p>
              <h2 id="news-title">{h.followTitle}</h2>
              <p className="lead" style={{ margin: "0 auto" }}>
                {h.followBody}
              </p>
            </div>
          )}
          <ul className="hashtags" aria-label={h.hashtagsLabel}>
            {site.hashtags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
