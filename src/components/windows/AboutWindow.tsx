import { about } from '../../data/content'
import { asset } from '../../data/assets'

function Chip({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-blush-200 bg-blush-50 px-3 py-1 text-[13px] font-medium text-blush-700">
      {children}
    </span>
  )
}

export default function AboutWindow() {
  return (
    <div className="p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {/* Avatar: usa ../assets/perfil.* si existe; si no, placeholder "MP" */}
        {asset('perfil') ? (
          <div
            className="h-28 w-28 shrink-0 rounded-2xl bg-[#f1edef] bg-cover bg-center shadow-lg"
            style={{ backgroundImage: `url("${asset('perfil')}")` }}
          />
        ) : (
          <div className="grid h-28 w-28 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blush-300 to-blush-600 text-4xl font-serif italic text-white shadow-lg">
            MP
          </div>
        )}
        <div className="flex-1">
          <p className="font-serif text-2xl italic text-blush-600">¡Hola! soy</p>
          <h2 className="font-serif text-3xl leading-tight text-ink">{about.name}</h2>
          <p className="mt-1 text-[15px] text-ink/60">{about.role}</p>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/80">
            <span className="marker font-serif text-[17px] italic">{about.tagline}</span>
          </p>
        </div>
      </div>

      <p className="mt-5 text-[15px] leading-relaxed text-ink/75">{about.intro}</p>

      <section className="mt-6">
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-ink/45">Habilidades</h3>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {about.skills.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>
      </section>

      <section className="mt-5">
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-ink/45">Herramientas</h3>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {about.tools.map((t) => (
            <span
              key={t}
              className="rounded-full bg-black/5 px-3 py-1 text-[13px] font-medium text-ink/70"
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-ink/45">Formación</h3>
        <ul className="mt-2.5 space-y-2.5">
          {about.studies.map((e) => (
            <li key={e.title} className="flex items-baseline justify-between gap-4">
              <div>
                <p className="text-[15px] font-medium text-ink">{e.title}</p>
                <p className="text-[13px] text-ink/55">{e.place}</p>
              </div>
              <span className="shrink-0 text-[13px] tabular-nums text-ink/50">{e.period}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
