import { useEffect, useState } from 'react'
import { profile } from '../portfolioData'

const TIMEZONES = [
  {
    region: 'Americas (PST / EST)',
    cities: 'San Francisco, New York, Toronto',
    overlap: '3–4 Hours Synchronous Window',
    detail: 'Evening syncs & morning sprint handoffs aligned with US business hours.',
    timeZone: 'America/New_York',
    code: 'EST / PST',
  },
  {
    region: 'Europe (GMT / CET)',
    cities: 'London, Berlin, Amsterdam',
    overlap: '4–5 Hours Synchronous Window',
    detail: 'Direct daytime sprint overlap from morning Europe into Manila afternoon.',
    timeZone: 'Europe/London',
    code: 'GMT / UTC+0',
  },
  {
    region: 'Asia-Pacific & Australia (AEST / SGT)',
    cities: 'Singapore, Tokyo, Sydney',
    overlap: '8+ Hours Full Synchronous Day',
    detail: 'Full-day synchronous pair programming and live issue resolution.',
    timeZone: 'Australia/Sydney',
    code: 'AEST / UTC+10',
  },
]

export default function GlobalAvailabilityRadar() {
  const [manilaTime, setManilaTime] = useState('')
  const [regionalTimes, setRegionalTimes] = useState({})

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date()
      
      setManilaTime(
        new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: profile.timezone || 'Asia/Manila',
        }).format(now)
      )

      const calculated = {}
      TIMEZONES.forEach((tz) => {
        calculated[tz.region] = new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: tz.timeZone,
        }).format(now)
      })
      setRegionalTimes(calculated)
    }

    updateTimes()
    const timer = setInterval(updateTimes, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="availability-radar" className="py-14 sm:py-20">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-2xs dark:border-gray-800 dark:bg-[#111216]">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border-b border-gray-100 pb-6 dark:border-gray-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                Available for Q4 Engagements
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl dark:text-white">
              Global Deployment &amp; Timezone Radar
            </h2>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-gray-600 dark:text-gray-400">
            <span>Base Station:</span>
            <span className="font-bold text-gray-950 dark:text-white">Manila (UTC+8)</span>
            <span className="rounded bg-gray-100 px-2 py-0.5 font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
              {manilaTime || '00:00:00'}
            </span>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Architected for distributed engineering teams. Archie provides predictable synchronous working windows 
          across North America, Europe, and the Asia-Pacific region with disciplined communication rhythms and rapid issue turnaround.
        </p>

        {/* Timezone Overlap Grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TIMEZONES.map((tz) => (
            <div
              key={tz.region}
              className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-gray-50/50 p-5 dark:border-gray-800/80 dark:bg-[#15161d]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    {tz.code}
                  </span>
                  <span className="font-mono text-xs font-semibold text-gray-900 dark:text-white">
                    {regionalTimes[tz.region] || '--:--'}
                  </span>
                </div>

                <h3 className="mt-2 text-base font-bold text-gray-950 dark:text-white">
                  {tz.region}
                </h3>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {tz.cities}
                </div>

                <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>{tz.overlap}</span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                  {tz.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Engineering Performance SLAs */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50/70 p-5 sm:p-6 dark:border-gray-800 dark:bg-[#151720]">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
            Service Level Agreements &amp; Engineering Guarantees
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <div className="font-mono text-xl sm:text-2xl font-extrabold text-gray-950 dark:text-white">
                &lt; 2 Hours
              </div>
              <div className="mt-1 font-mono text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                First Response SLA
              </div>
              <div className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                Direct engineer communication via Slack, Discord, or Email.
              </div>
            </div>

            <div>
              <div className="font-mono text-xl sm:text-2xl font-extrabold text-gray-950 dark:text-white">
                Sprint 1
              </div>
              <div className="mt-1 font-mono text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Working Prototype
              </div>
              <div className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                Functional deployment delivered within the first milestone.
              </div>
            </div>

            <div>
              <div className="font-mono text-xl sm:text-2xl font-extrabold text-gray-950 dark:text-white">
                100%
              </div>
              <div className="mt-1 font-mono text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Lint &amp; Type Safety
              </div>
              <div className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                Zero compiler warnings, clean code review standards.
              </div>
            </div>

            <div>
              <div className="font-mono text-xl sm:text-2xl font-extrabold text-gray-950 dark:text-white">
                Zero-SaaS
              </div>
              <div className="mt-1 font-mono text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Cloud Cost Shield
              </div>
              <div className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                Custom auth and client optimization protecting your OPEX.
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
