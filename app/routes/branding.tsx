export default function BrandingRoute() {
  return (
    <div className="space-y-10">
      <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-[#334155] bg-[#0B1120]/80 p-10 shadow-[0_40px_120px_rgba(6,182,212,0.12)]">
          <span className="inline-flex rounded-full bg-[#06B6D4]/10 px-4 py-1 text-xs uppercase tracking-[0.32em] text-[#38BDF8]">Brand direction</span>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-[#F8FAFC]">TeamConnect identity</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#CBD5E1]/90">
            A premium enterprise brand designed for global teams. Reinforce trust with crisp gradients, intelligent data visualizations, and a secure digital workspace that feels both modern and authoritative.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-[#334155] bg-[#111827]/80 p-6">
              <p className="text-sm uppercase tracking-[0.32em] text-[#94A3B8]">Core values</p>
              <ul className="mt-4 space-y-3 text-sm text-[#E2E8F0]">
                <li>Secure collaboration at scale</li>
                <li>Data-first trust and transparency</li>
                <li>Effortless enterprise productivity</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-[#334155] bg-[#111827]/80 p-6">
              <p className="text-sm uppercase tracking-[0.32em] text-[#94A3B8]">Brand tone</p>
              <ul className="mt-4 space-y-3 text-sm text-[#E2E8F0]">
                <li>Authoritative, yet welcoming</li>
                <li>Precise analytics storytelling</li>
                <li>Enterprise-ready with human clarity</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-[#111827]/90 p-5 shadow-sm shadow-[#06B6D4]/10">
              <p className="text-3xl font-semibold text-[#F8FAFC]">99.9%</p>
              <p className="mt-2 text-sm text-[#94A3B8]">Platform uptime</p>
            </div>
            <div className="rounded-3xl bg-[#111827]/90 p-5 shadow-sm shadow-[#06B6D4]/10">
              <p className="text-3xl font-semibold text-[#F8FAFC]">120+</p>
              <p className="mt-2 text-sm text-[#94A3B8]">Global integrations</p>
            </div>
            <div className="rounded-3xl bg-[#111827]/90 p-5 shadow-sm shadow-[#06B6D4]/10">
              <p className="text-3xl font-semibold text-[#F8FAFC]">24/7</p>
              <p className="mt-2 text-sm text-[#94A3B8]">Operational visibility</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-[2rem] border border-[#334155] bg-gradient-to-br from-[#0B1120]/95 via-[#111827]/90 to-[#0F172A]/95 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.45)]">
          <div className="flex items-center justify-between rounded-3xl border border-[#334155] bg-[#111827]/80 p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[#94A3B8]">Visual system</p>
              <h3 className="mt-3 text-2xl font-semibold text-[#F8FAFC]">Signature product aesthetic</h3>
            </div>
            <div className="rounded-3xl bg-[#0F172A] px-4 py-3 text-sm text-[#38BDF8]">TeamConnect</div>
          </div>

          <div className="grid gap-4 rounded-[2rem] border border-[#334155] bg-[#0B1120]/90 p-6">
            <div className="rounded-3xl bg-[#111827]/80 p-5">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.32em] text-[#94A3B8]">Experience</span>
                <span className="rounded-full bg-[#06B6D4]/15 px-3 py-1 text-xs font-semibold text-[#38BDF8]">Premium</span>
              </div>
              <p className="text-base leading-7 text-[#E2E8F0]">Polished SaaS UI with premium glass surfaces, high-contrast clarity, and motion-ready layouts for executive workflows.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-[#111827]/80 p-5">
                <p className="text-sm uppercase tracking-[0.32em] text-[#94A3B8]">Brand palette</p>
                <p className="mt-3 text-lg font-semibold text-[#F8FAFC]">Teal, navy, steel</p>
              </div>
              <div className="rounded-3xl bg-[#111827]/80 p-5">
                <p className="text-sm uppercase tracking-[0.32em] text-[#94A3B8]">Voice</p>
                <p className="mt-3 text-lg font-semibold text-[#F8FAFC]">Secure, sharp, confident</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-[#334155] bg-[#0B1120]/80 p-8 shadow-[0_40px_120px_rgba(6,182,212,0.08)]">
          <span className="text-xs uppercase tracking-[0.32em] text-[#94A3B8]">Design system</span>
          <h3 className="mt-5 text-3xl font-semibold text-[#F8FAFC]">Positioning for enterprise growth</h3>
          <p className="mt-4 text-base leading-7 text-[#CBD5E1]/90">
            TeamConnect is built for Fortune 100 teams, C-suite decision-makers, and mission-critical collaboration. The experience balances control with accessibility, intelligence with calm simplicity.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-[#111827]/90 p-5 text-sm text-[#E2E8F0]">
              <p className="font-semibold text-[#F8FAFC]">Cloud-native</p>
              <p className="mt-3 text-[#94A3B8]">Responsive, secure SaaS infrastructure.</p>
            </div>
            <div className="rounded-3xl bg-[#111827]/90 p-5 text-sm text-[#E2E8F0]">
              <p className="font-semibold text-[#F8FAFC]">Executive-first</p>
              <p className="mt-3 text-[#94A3B8]">Clear data, fast decision support.</p>
            </div>
            <div className="rounded-3xl bg-[#111827]/90 p-5 text-sm text-[#E2E8F0]">
              <p className="font-semibold text-[#F8FAFC]">Global scale</p>
              <p className="mt-3 text-[#94A3B8]">Designed for 10k+ users and multi-region operations.</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#334155] bg-[#0B1120]/80 p-8 shadow-[0_40px_120px_rgba(6,182,212,0.08)]">
          <span className="text-xs uppercase tracking-[0.32em] text-[#94A3B8]">Brand narrative</span>
          <h3 className="mt-5 text-3xl font-semibold text-[#F8FAFC]">A premium story for the modern enterprise</h3>
          <ul className="mt-8 space-y-4 text-sm leading-7 text-[#E2E8F0]">
            <li>Instant trust through a refined visual language.</li>
            <li>Modern metrics and AI-enabled transparency.</li>
            <li>Designed for secure teams, compliance, and global operations.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
