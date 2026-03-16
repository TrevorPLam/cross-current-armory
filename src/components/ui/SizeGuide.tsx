import { useState } from 'react'
import { Ruler, ChevronDown, ChevronUp } from 'lucide-react'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface SizeRow {
  size: string
  chest: string
  plate: string
  height: string
  notes?: string
}

const armorSizes: SizeRow[] = [
  { size: 'XS', chest: '32–34"', plate: '8×10"', height: '5\'0"–5\'4"' },
  { size: 'S', chest: '34–36"', plate: '8×10" or 10×12"', height: '5\'4"–5\'7"' },
  { size: 'M', chest: '36–38"', plate: '10×12"', height: '5\'7"–5\'10"', notes: 'Most common' },
  { size: 'L', chest: '38–41"', plate: '10×12"', height: '5\'10"–6\'1"' },
  { size: 'XL', chest: '41–44"', plate: '11×14"', height: '6\'1"–6\'4"' },
  { size: 'XXL', chest: '44–48"', plate: '11×14"', height: '6\'4"+', notes: 'Custom carrier recommended' },
]

interface CompatibilityRow {
  plate: string
  carriers: string[]
  cutTypes: string[]
}

const compatibility: CompatibilityRow[] = [
  {
    plate: 'A2 – Level III+ Alloy (10×12")',
    carriers: ['Concealment Plate Carrier', 'Concealment Plate Carrier – White'],
    cutTypes: ['SAPI', 'Shooter'],
  },
  {
    plate: 'A4 Side Plates (6×8")',
    carriers: ['Concealment Plate Carrier', 'Concealment Plate Carrier – White'],
    cutTypes: ['SAPI'],
  },
  {
    plate: 'A4 – Level III++ Alloy (10×12")',
    carriers: ['Concealment Plate Carrier', 'Concealment Plate Carrier – White'],
    cutTypes: ['SAPI', 'Shooter'],
  },
  {
    plate: 'Heritage AR500 Steel (10×12")',
    carriers: ['Concealment Plate Carrier', 'Concealment Plate Carrier – White'],
    cutTypes: ['SAPI', 'Shooter'],
  },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
}

function CollapsibleSection({ title, children }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(true)

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        aria-expanded={open}
      >
        <span className="font-bold text-gray-900 text-lg">{title}</span>
        {open ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {open && <div className="overflow-x-auto">{children}</div>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface SizeGuideProps {
  className?: string
}

export function SizeGuide({ className = '' }: SizeGuideProps) {
  return (
    <section id="size-guide" className={`py-16 bg-white ${className}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Ruler className="h-8 w-8 text-red-600" />
            <h2 className="text-3xl md:text-4xl font-bold">Size Guide &amp; Compatibility</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Use the charts below to find the right plate size for your body measurements and
            confirm which plates are compatible with each carrier.
          </p>
        </div>

        {/* How to measure */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-3">How to Measure Your Chest</h3>
          <ol className="list-decimal list-inside space-y-1 text-gray-700 text-sm">
            <li>Wear a form-fitting shirt or no shirt.</li>
            <li>Hold a soft measuring tape horizontally around the fullest part of your chest, under your arms.</li>
            <li>Keep the tape snug but not tight — you should be able to breathe normally.</li>
            <li>Note the measurement in inches and use the size chart below.</li>
          </ol>
        </div>

        {/* Armor size chart */}
        <CollapsibleSection title="Armor Size Chart">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-4 py-3 text-left">Size</th>
                <th className="px-4 py-3 text-left">Chest</th>
                <th className="px-4 py-3 text-left">Plate Dimensions</th>
                <th className="px-4 py-3 text-left">Height Range</th>
                <th className="px-4 py-3 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {armorSizes.map((row, i) => (
                <tr
                  key={row.size}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-4 py-3 font-semibold text-red-700">{row.size}</td>
                  <td className="px-4 py-3">{row.chest}</td>
                  <td className="px-4 py-3">{row.plate}</td>
                  <td className="px-4 py-3">{row.height}</td>
                  <td className="px-4 py-3 text-gray-500 italic">{row.notes ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CollapsibleSection>

        {/* Compatibility chart */}
        <CollapsibleSection title="Plate &amp; Carrier Compatibility Chart">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-4 py-3 text-left">Plate</th>
                <th className="px-4 py-3 text-left">Compatible Carriers</th>
                <th className="px-4 py-3 text-left">Cut Types</th>
              </tr>
            </thead>
            <tbody>
              {compatibility.map((row, i) => (
                <tr
                  key={row.plate}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-4 py-3 font-semibold">{row.plate}</td>
                  <td className="px-4 py-3">
                    <ul className="list-disc list-inside space-y-0.5">
                      {row.carriers.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3">{row.cutTypes.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CollapsibleSection>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 text-center mt-6">
          Measurements are approximate. When in doubt, contact us for personalized sizing
          assistance at <a href="mailto:info@crosscurrentarmory.com" className="underline hover:text-gray-600">info@crosscurrentarmory.com</a>.
        </p>
      </div>
    </section>
  )
}
