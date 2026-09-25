import { useState } from 'react'
import { techCategories } from '../portfolioData'
import { sounds } from '../utils/audio'

function TechIcon({ iconId }) {
  const baseClass = 'h-4.5 w-4.5 transition-transform duration-200'
  switch (iconId) {
    case 'react':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <ellipse cx="12" cy="12" rx="10" ry="4.2" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" />
        </svg>
      )
    case 'nextjs':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9.5" />
          <path d="M8.5 16V8.5L16.5 17V8.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'typescript':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M7 8.5h5M9.5 8.5v7M14 10.5c.3-.6 1-1 1.8-1 1 0 1.7.6 1.7 1.4 0 1.8-3.5 1.5-3.5 3.3 0 .8.8 1.4 1.8 1.4.8 0 1.5-.4 1.8-1" strokeLinecap="round" />
        </svg>
      )
    case 'javascript':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M8 12.5v2.2c0 .8-.5 1.3-1.3 1.3-.6 0-1.1-.4-1.2-1M13.5 10.5c.3-.6 1-1 1.8-1 1 0 1.7.6 1.7 1.4 0 1.8-3.5 1.5-3.5 3.3 0 .8.8 1.4 1.8 1.4.8 0 1.5-.4 1.8-1" strokeLinecap="round" />
        </svg>
      )
    case 'tailwind':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
        </svg>
      )
    case 'vite':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M13 2.5L3.5 13.5h8l-1 8 10-11.5h-8l1.5-7.5z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'html':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M16 18l5-6-5-6M8 6l-5 6 5 6M13.5 4l-3 16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'state':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="6" cy="6" r="2.5" />
          <circle cx="18" cy="6" r="2.5" />
          <circle cx="12" cy="18" r="2.5" />
          <path d="M8 7.5l3 8M16 7.5l-3 8" strokeLinecap="round" />
        </svg>
      )
    case 'node':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M12 2.5l8 4.6v9.2l-8 4.6-8-4.6V7.1L12 2.5z" />
          <path d="M12 12v9.2M12 12l8-4.6M12 12L4 7.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'express':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9.5" />
          <path d="M8 12h8M12 8v8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'python':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M12 4.5h4a2 2 0 012 2v2.5a2 2 0 01-2 2H9a2 2 0 00-2 2v2.5a2 2 0 002 2h4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="10" cy="7.5" r="1" fill="currentColor" />
          <circle cx="14" cy="16.5" r="1" fill="currentColor" />
        </svg>
      )
    case 'fastapi':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9.5" />
          <path d="M13 6l-5 6.5h4.5l-1 5.5 5.5-7h-4.5l1.5-5z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'api':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="4" width="18" height="6" rx="2" />
          <rect x="3" y="14" width="18" height="6" rx="2" />
          <path d="M7 7h.01M7 17h.01" strokeLinecap="round" />
        </svg>
      )
    case 'graphql':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="4" r="2" />
          <circle cx="19" cy="8" r="2" />
          <circle cx="19" cy="16" r="2" />
          <circle cx="12" cy="20" r="2" />
          <circle cx="5" cy="16" r="2" />
          <circle cx="5" cy="8" r="2" />
          <path d="M12 6v12M6.7 9l10.6 6M6.7 15l10.6-6" strokeLinecap="round" opacity="0.6" />
        </svg>
      )
    case 'websocket':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 12a8 8 0 0116 0M7 12a5 5 0 0110 0M10 12a2 2 0 014 0" strokeLinecap="round" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
      )
    case 'auth':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 2L4 5.5v6.2c0 5 3.4 9.7 8 10.8 4.6-1.1 8-5.8 8-10.8V5.5L12 2z" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'postgres':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <ellipse cx="12" cy="6" rx="8" ry="3" />
          <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
          <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
        </svg>
      )
    case 'supabase':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.2 2.5L3.8 14.2c-.3.4 0 1 .5 1h7.4l-1.4 6.3c-.2.7.7 1.1 1.2.6l9.7-11.8c.3-.4 0-1-.5-1h-7.6l1.6-6.3c.2-.7-.7-1.1-1.2-.5z" />
        </svg>
      )
    case 'firebase':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4.5 17L8 4.5l3.5 6M4.5 17l10-13 4 13-14 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'redis':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M12 3l8 4-8 4-8-4 8-4zM4 11l8 4 8-4M4 16l8 4 8-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'prisma':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 19L11 3l9 16-7-4-9 4z" strokeLinejoin="round" />
        </svg>
      )
    case 'docker':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <rect x="3" y="10" width="3" height="3" rx="0.5" />
          <rect x="7.5" y="10" width="3" height="3" rx="0.5" />
          <rect x="12" y="10" width="3" height="3" rx="0.5" />
          <rect x="7.5" y="6" width="3" height="3" rx="0.5" />
          <path d="M2 14c1 2 3.5 4 8 4s8-2 11-4c.5-2-1-4-3-4H2v4z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'vercel':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3L22 20H2L12 3z" strokeLinejoin="round" />
        </svg>
      )
    case 'git':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="6" cy="6" r="2.5" />
          <circle cx="6" cy="18" r="2.5" />
          <circle cx="18" cy="12" r="2.5" />
          <path d="M6 8.5v7M8.5 7l7 3.5" strokeLinecap="round" />
        </svg>
      )
    case 'wordpress':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <circle cx="12" cy="12" r="9.5" />
          <path d="M6.5 9l3.5 9 2.5-6.5L15 18l3-9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'woocommerce':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="9" cy="19" r="1.5" fill="currentColor" />
          <circle cx="17" cy="19" r="1.5" fill="currentColor" />
          <path d="M3 4h3l2.5 11h9.5l2-8H6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'php':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="6" width="18" height="12" rx="4" />
          <path d="M7 10h2a1.5 1.5 0 010 3H7m0 0v2M15 10h2a1.5 1.5 0 010 3h-2m0 0v2M12 10v5" strokeLinecap="round" />
        </svg>
      )
    case 'acf':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <path d="M7 8h10M7 12h7M7 16h4" strokeLinecap="round" />
        </svg>
      )
    case 'headless':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="5" width="8" height="6" rx="1.5" />
          <rect x="13" y="13" width="8" height="6" rx="1.5" />
          <path d="M7 11v4a2 2 0 002 2h4M17 13V9a2 2 0 00-2-2h-4" strokeLinecap="round" />
        </svg>
      )
    case 'speed':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3a9 9 0 00-9 9c0 3.5 2 6.5 5 8h8c3-1.5 5-4.5 5-8a9 9 0 00-9-9z" />
          <path d="M12 12l3-4" strokeLinecap="round" />
        </svg>
      )
    case 'claude':
    case 'openai':
    case 'prompt':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" strokeLinecap="round" />
          <circle cx="12" cy="12" r="2.5" fill="currentColor" />
        </svg>
      )
    case 'guardrail':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3L4 6.5v5.8c0 5 3.4 9.6 8 10.7 4.6-1.1 8-5.7 8-10.7V6.5L12 3z" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'rag':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="7" />
          <path d="M16.5 16.5L21 21M8 11h6M11 8v6" strokeLinecap="round" />
        </svg>
      )
    case 'biometrics':
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
          <path d="M9 15a4 4 0 006 0" strokeLinecap="round" />
        </svg>
      )
    default:
      return (
        <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
  }
}

// Custom signature ambient color halo on hover
function getIconGlow(iconId) {
  switch (iconId) {
    case 'react':
      return 'group-hover:text-cyan-500 group-hover:border-cyan-500/40 group-hover:bg-cyan-500/10 group-hover:shadow-[0_0_14px_rgba(6,182,212,0.25)]'
    case 'nextjs':
      return 'group-hover:text-gray-950 dark:group-hover:text-white group-hover:border-gray-400 dark:group-hover:border-gray-500 group-hover:shadow-[0_0_14px_rgba(255,255,255,0.18)]'
    case 'typescript':
      return 'group-hover:text-blue-500 group-hover:border-blue-500/40 group-hover:bg-blue-500/10 group-hover:shadow-[0_0_14px_rgba(59,130,246,0.25)]'
    case 'tailwind':
      return 'group-hover:text-sky-400 group-hover:border-sky-400/40 group-hover:bg-sky-400/10 group-hover:shadow-[0_0_14px_rgba(56,189,248,0.25)]'
    case 'javascript':
      return 'group-hover:text-amber-400 group-hover:border-amber-400/40 group-hover:bg-amber-400/10 group-hover:shadow-[0_0_14px_rgba(251,191,36,0.25)]'
    case 'vite':
      return 'group-hover:text-purple-400 group-hover:border-purple-400/40 group-hover:bg-purple-400/10 group-hover:shadow-[0_0_14px_rgba(168,85,247,0.25)]'
    case 'html':
      return 'group-hover:text-orange-500 group-hover:border-orange-500/40 group-hover:bg-orange-500/10 group-hover:shadow-[0_0_14px_rgba(249,115,22,0.25)]'
    case 'state':
      return 'group-hover:text-amber-500 group-hover:border-amber-500/40 group-hover:bg-amber-500/10 group-hover:shadow-[0_0_14px_rgba(245,158,11,0.25)]'
    case 'node':
      return 'group-hover:text-emerald-500 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/10 group-hover:shadow-[0_0_14px_rgba(16,185,129,0.25)]'
    case 'express':
      return 'group-hover:text-gray-950 dark:group-hover:text-white group-hover:border-gray-400 dark:group-hover:border-gray-500'
    case 'python':
      return 'group-hover:text-yellow-500 group-hover:border-yellow-500/40 group-hover:bg-yellow-500/10 group-hover:shadow-[0_0_14px_rgba(234,179,8,0.25)]'
    case 'fastapi':
      return 'group-hover:text-teal-500 group-hover:border-teal-500/40 group-hover:bg-teal-500/10 group-hover:shadow-[0_0_14px_rgba(20,184,166,0.25)]'
    case 'api':
      return 'group-hover:text-indigo-400 group-hover:border-indigo-400/40 group-hover:bg-indigo-400/10 group-hover:shadow-[0_0_14px_rgba(129,140,248,0.25)]'
    case 'graphql':
      return 'group-hover:text-pink-500 group-hover:border-pink-500/40 group-hover:bg-pink-500/10 group-hover:shadow-[0_0_14px_rgba(236,72,153,0.25)]'
    case 'websocket':
      return 'group-hover:text-emerald-400 group-hover:border-emerald-400/40 group-hover:bg-emerald-400/10 group-hover:shadow-[0_0_14px_rgba(52,211,153,0.25)]'
    case 'auth':
      return 'group-hover:text-blue-500 group-hover:border-blue-500/40 group-hover:bg-blue-500/10 group-hover:shadow-[0_0_14px_rgba(59,130,246,0.25)]'
    case 'postgres':
      return 'group-hover:text-indigo-400 group-hover:border-indigo-400/40 group-hover:bg-indigo-400/10 group-hover:shadow-[0_0_14px_rgba(99,102,241,0.25)]'
    case 'supabase':
      return 'group-hover:text-emerald-400 group-hover:border-emerald-400/40 group-hover:bg-emerald-400/10 group-hover:shadow-[0_0_14px_rgba(16,185,129,0.3)]'
    case 'firebase':
      return 'group-hover:text-amber-500 group-hover:border-amber-500/40 group-hover:bg-amber-500/10 group-hover:shadow-[0_0_14px_rgba(245,158,11,0.25)]'
    case 'redis':
      return 'group-hover:text-red-500 group-hover:border-red-500/40 group-hover:bg-red-500/10 group-hover:shadow-[0_0_14px_rgba(239,68,68,0.25)]'
    case 'prisma':
      return 'group-hover:text-teal-400 group-hover:border-teal-400/40 group-hover:bg-teal-400/10 group-hover:shadow-[0_0_14px_rgba(45,212,191,0.25)]'
    case 'docker':
      return 'group-hover:text-sky-500 group-hover:border-sky-500/40 group-hover:bg-sky-500/10 group-hover:shadow-[0_0_14px_rgba(14,165,233,0.25)]'
    case 'vercel':
      return 'group-hover:text-gray-950 dark:group-hover:text-white group-hover:border-gray-400 dark:group-hover:border-gray-500'
    case 'git':
      return 'group-hover:text-orange-500 group-hover:border-orange-500/40 group-hover:bg-orange-500/10 group-hover:shadow-[0_0_14px_rgba(249,115,22,0.25)]'
    case 'wordpress':
      return 'group-hover:text-blue-500 group-hover:border-blue-500/40 group-hover:bg-blue-500/10 group-hover:shadow-[0_0_14px_rgba(59,130,246,0.25)]'
    case 'woocommerce':
      return 'group-hover:text-purple-500 group-hover:border-purple-500/40 group-hover:bg-purple-500/10 group-hover:shadow-[0_0_14px_rgba(168,85,247,0.25)]'
    case 'php':
      return 'group-hover:text-indigo-400 group-hover:border-indigo-400/40 group-hover:bg-indigo-400/10 group-hover:shadow-[0_0_14px_rgba(99,102,241,0.25)]'
    case 'acf':
      return 'group-hover:text-emerald-500 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/10 group-hover:shadow-[0_0_14px_rgba(16,185,129,0.25)]'
    case 'headless':
      return 'group-hover:text-sky-400 group-hover:border-sky-400/40 group-hover:bg-sky-400/10 group-hover:shadow-[0_0_14px_rgba(56,189,248,0.25)]'
    case 'speed':
      return 'group-hover:text-amber-400 group-hover:border-amber-400/40 group-hover:bg-amber-400/10 group-hover:shadow-[0_0_14px_rgba(251,191,36,0.25)]'
    case 'claude':
      return 'group-hover:text-amber-500 group-hover:border-amber-500/40 group-hover:bg-amber-500/10 group-hover:shadow-[0_0_14px_rgba(245,158,11,0.25)]'
    case 'openai':
      return 'group-hover:text-emerald-400 group-hover:border-emerald-400/40 group-hover:bg-emerald-400/10 group-hover:shadow-[0_0_14px_rgba(52,211,153,0.25)]'
    case 'prompt':
      return 'group-hover:text-violet-400 group-hover:border-violet-400/40 group-hover:bg-violet-400/10 group-hover:shadow-[0_0_14px_rgba(167,139,250,0.25)]'
    case 'guardrail':
      return 'group-hover:text-blue-400 group-hover:border-blue-400/40 group-hover:bg-blue-400/10 group-hover:shadow-[0_0_14px_rgba(96,165,250,0.25)]'
    case 'rag':
      return 'group-hover:text-cyan-400 group-hover:border-cyan-400/40 group-hover:bg-cyan-400/10 group-hover:shadow-[0_0_14px_rgba(34,211,238,0.25)]'
    case 'biometrics':
      return 'group-hover:text-rose-400 group-hover:border-rose-400/40 group-hover:bg-rose-400/10 group-hover:shadow-[0_0_14px_rgba(251,113,133,0.25)]'
    default:
      return 'group-hover:text-gray-950 dark:group-hover:text-white group-hover:border-gray-400 dark:group-hover:border-gray-600'
  }
}

export default function TechRadar() {
  const [activeCategory, setActiveCategory] = useState(0)
  const currentCategory = techCategories[activeCategory] || techCategories[0]

  return (
    <section id="stack" className="py-14 sm:py-20">
      {/* ── Section Header ── */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Technical Toolchain
          </span>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl dark:text-white">
            Languages, Frameworks &amp; Systems
          </h2>
        </div>
      </div>

      {/* ── Main Layout: Sidebar Tabs (4 cols) + Active Grid (8 cols) ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Category Selector Tabs */}
        <div className="flex flex-row gap-2 overflow-x-auto pb-1 no-scrollbar lg:col-span-4 lg:flex-col lg:pb-0">
          {techCategories.map((cat, idx) => {
            const isActive = activeCategory === idx
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => {
                  sounds.play('tick')
                  setActiveCategory(idx)
                }}
                className={`group flex items-center justify-between rounded-xl px-4 py-3 text-left font-mono text-xs transition-all cursor-pointer select-none lg:w-full shrink-0 ${
                  isActive
                    ? 'border border-gray-950 bg-gray-950 text-white shadow-xs dark:border-white dark:bg-white dark:text-gray-950 font-semibold'
                    : 'border border-gray-200/90 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-950 dark:border-gray-800/90 dark:bg-[#111217] dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-[#161822] dark:hover:text-white'
                }`}
              >
                <span className="truncate pr-2">{cat.name}</span>
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-mono transition-colors shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white dark:bg-gray-900/20 dark:text-gray-950'
                      : 'bg-gray-100 text-gray-500 group-hover:text-gray-950 dark:bg-gray-800/80 dark:text-gray-400 dark:group-hover:text-white'
                  }`}
                >
                  {cat.items.length}
                </span>
              </button>
            )
          })}
        </div>

        {/* Active Category Cards Grid */}
        <div className="rounded-2xl border border-gray-200/90 bg-white/80 p-5 sm:p-6 shadow-sm backdrop-blur-md transition-colors lg:col-span-8 dark:border-gray-800/90 dark:bg-[#111217]/80">
          {/* Top Info Bar */}
          <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800/70">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-950 dark:text-white">
              {currentCategory.name}
            </h3>
            <span className="font-mono text-[11px] text-gray-500 dark:text-gray-400">
              {currentCategory.items.length} tools
            </span>
          </div>

          {/* 2-Column Clean Minimal Grid: Icon + Name Only */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {currentCategory.items.map((rawItem) => {
              const item =
                typeof rawItem === 'string'
                  ? { name: rawItem, iconId: '' }
                  : rawItem
              const glowClass = getIconGlow(item.iconId)

              return (
                <div
                  key={item.name}
                  className="group flex items-center gap-3 rounded-xl border border-gray-200/80 bg-gray-50/50 px-3.5 py-3 transition-all duration-200 hover:border-gray-400 hover:bg-white hover:shadow-xs dark:border-gray-800/80 dark:bg-[#14151e]/50 dark:hover:border-gray-700 dark:hover:bg-[#181a26]"
                >
                  {/* Cool Tech Icon with Ambient Glow on Hover */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200/90 bg-white text-gray-700 shadow-2xs transition-all duration-200 group-hover:scale-105 dark:border-gray-800/90 dark:bg-[#0d0e14] dark:text-gray-300 ${glowClass}`}
                  >
                    <TechIcon iconId={item.iconId} />
                  </div>

                  {/* Name Only */}
                  <span className="truncate font-mono text-[13px] font-semibold tracking-tight text-gray-900 transition-colors group-hover:text-gray-950 dark:text-gray-100 dark:group-hover:text-white">
                    {item.name}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
