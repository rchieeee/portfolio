import { useEffect, useState } from 'react'
import { profile, socials } from '../portfolioData'
import { sounds } from '../utils/audio'

export default function ContactSection() {
  const [copied, setCopied] = useState(false)
  const [manilaTime, setManilaTime] = useState('')

  useEffect(() => {
    const update = () => {
      setManilaTime(
        new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: profile.timezone,
        }).format(new Date())
      )
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleCopyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(profile.email)
    }
    sounds.play('success')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const scrollToTop = () => {
    sounds.play('tick')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section id="contact" className="border-t border-gray-200 pt-16 pb-20 dark:border-gray-800">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-2xs sm:p-12 dark:border-gray-800 dark:bg-[#121216]">
        <div className="max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
            get in touch
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl dark:text-white">
            let&apos;s build something great together.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-gray-600 dark:text-gray-300">
            Whether you need a complete !full-stack web application, an automated AI workflow, or an experienced developer to join your team—my inbox is always open.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              onClick={() => sounds.play('press')}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 font-mono text-xs font-semibold text-white shadow-sm hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
            >
              <span>send an email ↗</span>
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3.5 font-mono text-xs font-semibold text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              <span>{copied ? '✓ Copied to clipboard' : 'copy email address'}</span>
            </button>
          </div>
        </div>

        {/* Subtle Bottom Footer */}
        <div className="mt-16 flex flex-col gap-6 border-t border-gray-200 pt-8 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
          <div className="space-y-1">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Did you have fun? Feel free to reach out at{' '}
              <a
                href={`mailto:${profile.email}`}
                className="font-mono text-gray-950 underline underline-offset-4 hover:opacity-75 dark:text-white"
              >
                {profile.email}
              </a>
            </div>
            <div className="font-mono text-xs text-gray-400 dark:text-gray-500">
              © {new Date().getFullYear()} {profile.name} · Lupon, Davao Oriental · {manilaTime} (UTC+8) · All rights reserved.
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 sm:gap-6">
            <div className="flex flex-wrap items-center gap-3.5 font-mono text-xs text-gray-500 dark:text-gray-400">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gray-950 hover:underline dark:hover:text-white"
                >
                  {s.label}
                </a>
              ))}
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="font-mono text-xs text-gray-400 hover:text-gray-950 dark:hover:text-white cursor-pointer"
              title="Back to top"
            >
              ↑ Top
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
