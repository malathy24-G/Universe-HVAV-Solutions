
{/* ================= HOW IT WORKS ================= */}
<section className="bg-white py-16 sm:py-24">
  <div className="container-content">
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-3xl font-extrabold text-navy sm:text-4xl">
        How It Works
      </h2>
      <p className="mt-4 text-base leading-relaxed text-slate sm:text-lg">
        From booking to a completed service, in four simple steps.
      </p>
    </div>

    <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {HOW_IT_WORKS.map(({ step, image, title, description }) => (
        <div
          key={step}
          className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
            <Image
              src={image}
              alt={`Step ${step}: ${title}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="p-5">
            <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-bold tracking-wide text-sky-700">
              STEP {step}
            </span>

            <h3 className="mt-3 text-lg font-bold text-navy">
              {title}
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-slate">
              {description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
