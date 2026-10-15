import { getDict } from "@/lib/i18n";
import { SEASONS } from "@/lib/scent";
import type { Lang, ScentProfile as Profile } from "@/lib/types";

function Meter({ value, label, caption }: { value: number; label: string; caption: string }) {
  return (
    <div className="meter">
      <div className="meter-head">
        <span>{label}</span>
        <span className="muted">{caption}</span>
      </div>
      <div className="meter-track" role="meter" aria-valuemin={1} aria-valuemax={5} aria-valuenow={value} aria-label={`${label}: ${caption}`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={i <= value ? "on" : ""} />
        ))}
      </div>
    </div>
  );
}

export function ScentProfile({ profile, lang }: { profile: Profile; lang: Lang }) {
  const t = getDict(lang);
  return (
    <section className="scent-profile" aria-labelledby="profile-title">
      <h2 id="profile-title" className="subhead pdp-subhead">
        {t.profile.title}
      </h2>
      <div className="family-pills" aria-label={t.profile.family}>
        {profile.families.map((f) => (
          <span key={f} className={`family-pill fam-${f}`} title={t.families[f].body}>
            {t.families[f].name}
          </span>
        ))}
      </div>
      <Meter value={profile.longevity} label={t.profile.longevity} caption={t.profile.longevityScale[profile.longevity - 1]} />
      <Meter value={profile.sillage} label={t.profile.sillage} caption={t.profile.sillageScale[profile.sillage - 1]} />
      <div className="profile-row">
        <span>{t.profile.season}</span>
        <ul className="tag-list">
          {SEASONS.map((s) => (
            <li key={s} className={profile.seasons.includes(s) ? "on" : "off"} aria-hidden={!profile.seasons.includes(s)}>
              {t.seasons[s]}
            </li>
          ))}
        </ul>
      </div>
      <div className="profile-row">
        <span>{t.profile.time}</span>
        <ul className="tag-list">
          <li className={profile.time.includes("day") ? "on" : "off"}>☀ {t.profile.day}</li>
          <li className={profile.time.includes("night") ? "on" : "off"}>☾ {t.profile.night}</li>
        </ul>
      </div>
    </section>
  );
}
