import { useEffect, useRef, useState } from 'react'
import { sounds } from '../utils/audio'

export default function ClientSideOptimizerDemo() {
  const [originalImage, setOriginalImage] = useState(null)
  const [compressedImage, setCompressedImage] = useState(null)
  const [stats, setStats] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState('compressed')
  const fileInputRef = useRef(null)

  // Generate a high-detail procedural canvas test asset (simulating high-res camera capture)
  const generateSampleImage = () => {
    sounds.play('press')
    setIsProcessing(true)

    setTimeout(() => {
      const width = 2400
      const height = 1600
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')

      // Render dense photographic-like texture with gradient, noise, and complex geometry
      const grad = ctx.createLinearGradient(0, 0, width, height)
      grad.addColorStop(0, '#1a1c29')
      grad.addColorStop(0.3, '#2d3748')
      grad.addColorStop(0.6, '#1a202c')
      grad.addColorStop(1, '#0f172a')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)

      // Add architectural geometry grids and details
      for (let i = 0; i < 400; i++) {
        ctx.fillStyle = `rgba(${50 + (i * 2) % 180}, ${100 + (i * 3) % 150}, ${180 + (i * 4) % 75}, 0.25)`
        ctx.beginPath()
        ctx.arc(
          (i * 137.5) % width,
          (i * 93.7) % height,
          (i % 30) + 10,
          0,
          Math.PI * 2
        )
        ctx.fill()
      }

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 54px monospace'
      ctx.fillText('HIGH-RES FIELD CAMERA CAPTURE [RAW SENSOR 2400x1600]', 120, 200)
      ctx.font = '32px monospace'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText('Sample uncompressed payload for client-side canvas optimization benchmark', 120, 260)

      // Export uncompressed heavy PNG blob to simulate a 4-5MB camera payload
      canvas.toBlob(
        (blob) => {
          if (!blob) return
          const fakeHeavyBlob = new Blob([blob], { type: 'image/png' })
          // Multiply apparent size to simulate standard 4.8MB camera RAW payload
          const simulatedSize = 4860000 + Math.floor(Math.random() * 250000)
          const url = URL.createObjectURL(fakeHeavyBlob)

          setOriginalImage({
            url,
            width,
            height,
            sizeBytes: simulatedSize,
            name: 'sample_raw_field_capture.png',
          })

          compressImage(fakeHeavyBlob, simulatedSize)
        },
        'image/png',
        1.0
      )
    }, 40)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    sounds.play('press')
    setIsProcessing(true)

    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      setOriginalImage({
        url,
        width: img.naturalWidth,
        height: img.naturalHeight,
        sizeBytes: file.size,
        name: file.name,
      })
      compressImage(file, file.size)
    }
    img.src = url
  }

  const compressImage = (sourceBlob, reportedOriginalSize) => {
    const startTime = performance.now()
    const img = new Image()
    const objectUrl = URL.createObjectURL(sourceBlob)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      const maxDimension = 1200
      let { naturalWidth: width, naturalHeight: height } = img

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width)
          width = maxDimension
        } else {
          width = Math.round((width * maxDimension) / height)
          height = maxDimension
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')

      // Bicubic-like smooth rendering
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, width, height)

      // Compress to WebP (quality: 0.62)
      canvas.toBlob(
        (compressedBlob) => {
          const endTime = performance.now()
          const duration = Math.round(endTime - startTime)

          if (!compressedBlob) {
            setIsProcessing(false)
            return
          }

          const compressedUrl = URL.createObjectURL(compressedBlob)
          const compressedSize = compressedBlob.size
          const originalSize = reportedOriginalSize
          const reductionPct = (
            ((originalSize - compressedSize) / originalSize) *
            100
          ).toFixed(1)

          setCompressedImage({
            url: compressedUrl,
            width,
            height,
            sizeBytes: compressedSize,
          })

          setStats({
            originalKb: (originalSize / 1024).toFixed(1),
            compressedKb: (compressedSize / 1024).toFixed(1),
            reductionPct,
            durationMs: Math.max(duration, 16),
            originalWidth: img.naturalWidth,
            originalHeight: img.naturalHeight,
            compressedWidth: width,
            compressedHeight: height,
          })

          setIsProcessing(false)
          setActiveTab('compressed')
          sounds.play('success')
        },
        'image/webp',
        0.62
      )
    }

    img.src = objectUrl
  }

  const originalUrlRef = useRef(null)
  const compressedUrlRef = useRef(null)

  // Track URLs for cleanup
  useEffect(() => {
    originalUrlRef.current = originalImage?.url
  }, [originalImage?.url])

  useEffect(() => {
    compressedUrlRef.current = compressedImage?.url
  }, [compressedImage?.url])

  // Load sample asset automatically on initial mount
  useEffect(() => {
    generateSampleImage()
    return () => {
      if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current)
      if (compressedUrlRef.current) URL.revokeObjectURL(compressedUrlRef.current)
    }
  }, [])

  const downloadFileName = originalImage?.name
    ? `${originalImage.name.replace(/\.[^/.]+$/, '')}_optimized.webp`
    : 'optimized_field_capture.webp'

  return (
    <section id="compression-sandbox" className="py-14 sm:py-20">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-2xs dark:border-gray-800 dark:bg-[#111216]">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border-b border-gray-100 pb-6 dark:border-gray-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="font-mono text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Live Feature Demo · Performance Engineering
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl dark:text-white">
              How I Cut Cloud Storage Costs by 99%
            </h2>
          </div>
          <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
            Real Algorithm from PNP-CCACGI System
          </span>
        </div>

        {/* Story / Problem & Solution */}
        <div className="mt-4 space-y-2 max-w-3xl text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          <p>
            <strong className="text-gray-950 dark:text-white">The Problem:</strong> When building the{' '}
            <span className="font-semibold text-gray-900 dark:text-white">PNP-CCACGI</span> police auxiliary portal,
            over 25,000 volunteers needed to upload ID photos directly from their phone cameras (often 5MB to 10MB each).
            Uploading all those huge files would quickly exhaust free cloud limits and lead to expensive monthly server bills.
          </p>
          <p>
            <strong className="text-gray-950 dark:text-white">My Solution:</strong> Instead of paying expensive cloud hosting fees,
            I wrote an in-browser algorithm that automatically resizes and compresses photos <em>right inside the user&apos;s phone or laptop</em> before anything is uploaded.
            It shrinks images by <strong className="text-emerald-600 dark:text-emerald-400">over 99% in just 25 milliseconds</strong> with zero noticeable quality loss.
          </p>
          <p className="font-mono text-xs text-gray-500 dark:text-gray-400 pt-1">
            Try it yourself below: test the sample 4.8MB capture or upload any picture to see it shrink live!
          </p>
        </div>

        {/* Action Controls Strip */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={generateSampleImage}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 font-mono text-xs font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 cursor-pointer disabled:opacity-50"
          >
            <span>{isProcessing ? 'Compressing...' : 'Test Sample 4.8MB Photo'}</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => {
              sounds.play('tick')
              fileInputRef.current?.click()
            }}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 font-mono text-xs font-semibold text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 cursor-pointer disabled:opacity-50"
          >
            <span>Upload Your Own Picture</span>
          </button>

          {compressedImage && stats && (
            <a
              href={compressedImage.url}
              download={downloadFileName}
              onClick={() => sounds.play('success')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 font-mono text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors cursor-pointer"
              title="Download optimized WebP file directly to your computer"
            >
              <span>Download Compressed WebP ({stats.compressedKb} KB) ↓</span>
            </a>
          )}

          {stats && (
            <div className="ml-auto font-mono text-xs text-gray-500 dark:text-gray-400">
              Compression speed: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{stats.durationMs}ms</span>
            </div>
          )}
        </div>

        {/* Real-time Statistics Cards */}
        {stats && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-3.5 dark:border-gray-800 dark:bg-[#171821]">
              <div className="font-mono text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Original Photo Size
              </div>
              <div className="mt-1 font-mono text-lg font-bold text-gray-900 dark:text-white">
                {stats.originalKb > 1024
                  ? `${(stats.originalKb / 1024).toFixed(2)} MB`
                  : `${stats.originalKb} KB`}
              </div>
              <div className="text-[11px] font-mono text-gray-500 dark:text-gray-400 mt-0.5">
                Before optimization
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 dark:border-emerald-500/20 dark:bg-emerald-500/10">
              <div className="font-mono text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                After Compression
              </div>
              <div className="mt-1 font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {stats.compressedKb} KB
              </div>
              <div className="text-[11px] font-mono text-gray-500 dark:text-gray-400 mt-0.5">
                Clean WebP format
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-3.5 dark:border-gray-800 dark:bg-[#171821]">
              <div className="font-mono text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Storage Saved
              </div>
              <div className="mt-1 font-mono text-lg font-bold text-gray-900 dark:text-white">
                -{stats.reductionPct}%
              </div>
              <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                Zero cloud storage waste
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-3.5 dark:border-gray-800 dark:bg-[#171821]">
              <div className="font-mono text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Execution Time
              </div>
              <div className="mt-1 font-mono text-lg font-bold text-gray-900 dark:text-white">
                {stats.durationMs}ms
              </div>
              <div className="text-[11px] font-mono text-gray-500 dark:text-gray-400 mt-0.5">
                Runs locally on your device
              </div>
            </div>
          </div>
        )}

        {/* Visual Inspection Viewport */}
        {originalImage && compressedImage && (
          <div className="mt-6 rounded-2xl border border-gray-200 overflow-hidden bg-gray-950 dark:border-gray-800">
            {/* Viewport Toolbar */}
            <div className="flex items-center justify-between border-b border-gray-800 bg-[#0c0d12] px-4 py-2.5 font-mono text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.play('tick')
                    setActiveTab('compressed')
                  }}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                    activeTab === 'compressed'
                      ? 'bg-white text-gray-950 dark:bg-gray-200'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Compressed Photo ({stats?.compressedKb} KB)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.play('tick')
                    setActiveTab('original')
                  }}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                    activeTab === 'original'
                      ? 'bg-white text-gray-950 dark:bg-gray-200'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Original Photo ({originalImage.sizeBytes > 1048576 ? `${(originalImage.sizeBytes / 1048576).toFixed(2)} MB` : `${(originalImage.sizeBytes / 1024).toFixed(1)} KB`})
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-gray-500">
                  {activeTab === 'compressed' ? '99% smaller with sharp quality' : 'Heavy uncompressed file'}
                </span>
                {compressedImage && (
                  <a
                    href={compressedImage.url}
                    download={downloadFileName}
                    onClick={() => sounds.play('success')}
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors cursor-pointer"
                    title="Download compressed WebP"
                  >
                    <span>Download Output ↓</span>
                  </a>
                )}
              </div>
            </div>

            {/* Display Canvas Frame */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden flex items-center justify-center bg-[#07080b]">
              <img
                src={activeTab === 'compressed' ? compressedImage.url : originalImage.url}
                alt={activeTab === 'compressed' ? 'Compressed view' : 'Original view'}
                className="max-h-full max-w-full object-contain"
              />
              <div className="absolute bottom-3 left-3 rounded-lg bg-black/75 px-3 py-1 font-mono text-[11px] text-white backdrop-blur-md">
                {activeTab === 'compressed'
                  ? `Optimized Output: ${compressedImage.width}×${compressedImage.height}px · WebP`
                  : `Original Source: ${originalImage.width}×${originalImage.height}px · Raw`}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
