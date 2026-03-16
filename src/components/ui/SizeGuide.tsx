import { useState } from 'react'
import { X, Ruler, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Types ────────────────────────────────────────────────────────────────────

interface SizeRow {
  size: string
  chestMin: number
  chestMax: number
  plateWidth: string
  plateHeight: string
  weight: string
  description: string
}

interface CompatibilityRow {
  carrier: string
  plateSize: string
  notes: string
}

// ── Static data ──────────────────────────────────────────────────────────────

const plateSizes: SizeRow[] = [
  {
    size: 'XS / 6″×8″',
    chestMin: 28,
    chestMax: 34,
    plateWidth: '6″',
    plateHeight: '8″',
    weight: '~1.5 lbs',
    description: 'Youth / very slim frames',
  },
  {
    size: 'S / 8″×10″',
    chestMin: 34,
    chestMax: 38,
    plateWidth: '8″',
    plateHeight: '10″',
    weight: '~3 lbs',
    description: 'SAPI Small — smaller adults, female body armor',
  },
  {
    size: 'M / 10″×12″',
    chestMin: 38,
    chestMax: 44,
    plateWidth: '10″',
    plateHeight: '12″',
    weight: '~4.5 lbs',
    description: 'SAPI Medium — most common adult size',
  },
  {
    size: 'L / 11″×14″',
    chestMin: 44,
    chestMax: 50,
    plateWidth: '11″',
    plateHeight: '14″',
    weight: '~5.5 lbs',
    description: 'SAPI Large — larger build / extra coverage',
  },
  {
    size: 'XL / 11″×15″',
    chestMin: 50,
    chestMax: 60,
    plateWidth: '11″',
    plateHeight: '15″',
    weight: '~6 lbs',
    description: 'SAPI XL — very large frames',
  },
]

const compatibilityData: CompatibilityRow[] = [
  {
    carrier: 'The Concealment Plate Carrier',
    plateSize: '10″×12″ (M)',
    notes: 'Front & back pockets only. No side-plate pockets.',
  },
  {
    carrier: 'The Concealment Plate Carrier – White',
    plateSize: '10″×12″ (M)',
    notes: 'Same profile as standard concealment carrier.',
  },
  {
    carrier: 'Generic Tactical Plate Carrier (MOLLE)',
    plateSize: '8″×10″, 10″×12″, 11″×14″',
    notes: 'Most MOLLE carriers accept these three sizes. Verify manufacturer spec.',
  },
]

// ── Subcomponents ────────────────────────────────────────────────────────────

function SizeTableRow({ row, recommended }: { row: SizeRow; recommended: boolean }) {
  return (
    <tr
      className={`border-b border-gray-100 transition-colors ${
        recommended ? 'bg-red-50' : 'hover:bg-gray-50'
      }`}
    >
      <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
        {row.size}
        {recommended && (
          <span className="ml-2 text-xs font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full">
            Recommended
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-gray-600 text-sm">
        {row.chestMin}″ – {row.chestMax}″
      </td>
      <td className="px-4 py-3 text-gray-600 text-sm">
        {row.plateWidth} × {row.plateHeight}
      </td>
      <td className="px-4 py-3 text-gray-600 text-sm">{row.weight}</td>
      <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">
        {row.description}
      </td>
    </tr>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

interface SizeGuideProps {
  /** If provided, show inline; otherwise renders a trigger button + modal */
  inline?: boolean
  className?: string
}

export function SizeGuide({ inline = false, className = '' }: SizeGuideProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [chestSize, setChestSize] = useState(40)
  const [showHowTo, setShowHowTo] = useState(false)

  const recommended = plateSizes.find(
    row => chestSize >= row.chestMin && chestSize <= row.chestMax
  ) ?? plateSizes[2]

  const content = (
    <div className={`${inline ? '' : 'p-6'}`}>
      {/* Measurement calculator */}
      <div className="mb-8 p-5 bg-red-50 border border-red-100 rounded-2xl">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Ruler className="h-5 w-5 text-red-600" aria-hidden="true" />
          Find Your Plate Size
        </h3>

        <div className="mb-4">
          <label htmlFor="chest-slider" className="block text-sm font-medium text-gray-700 mb-2">
            Your chest circumference: <span className="text-red-600 font-bold">{chestSize}″</span>
          </label>
          <input
            id="chest-slider"
            type="range"
            min={28}
            max={60}
            value={chestSize}
            onChange={e => setChestSize(Number(e.target.value))}
            className="w-full accent-red-600"
            aria-valuenow={chestSize}
            aria-valuemin={28}
            aria-valuemax={60}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>28″</span>
            <span>60″</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-gray-600">Recommended size:</span>
          <span className="font-bold text-red-700 bg-white px-3 py-1 rounded-lg border border-red-200">
            {recommended.size}
          </span>
          <span className="text-gray-500">({recommended.plateWidth} × {recommended.plateHeight})</span>
        </div>

        {/* How to measure */}
        <button
          onClick={() => setShowHowTo(prev => !prev)}
          className="mt-4 flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium focus:outline-none"
        >
          How to measure your chest
          {showHowTo ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
        <AnimatePresence initial={false}>
          {showHowTo && (
            <motion.ol
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden list-decimal list-inside mt-3 space-y-1 text-xs text-gray-600"
            >
              <li>Stand upright with arms at your sides.</li>
              <li>Wrap a soft measuring tape around the fullest part of your chest (usually at nipple level).</li>
              <li>Keep the tape parallel to the floor and snug — not tight.</li>
              <li>Record the measurement in inches.</li>
            </motion.ol>
          )}
        </AnimatePresence>
      </div>

      {/* Size table */}
      <div className="mb-8">
        <h3 className="font-bold text-gray-900 mb-4">Plate Size Chart</h3>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 text-white text-left">
                <th className="px-4 py-3 font-semibold">Size</th>
                <th className="px-4 py-3 font-semibold">Chest</th>
                <th className="px-4 py-3 font-semibold">Plate Dimensions</th>
                <th className="px-4 py-3 font-semibold">Weight</th>
                <th className="px-4 py-3 font-semibold hidden md:table-cell">Notes</th>
              </tr>
            </thead>
            <tbody>
              {plateSizes.map(row => (
                <SizeTableRow
                  key={row.size}
                  row={row}
                  recommended={row.size === recommended.size}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compatibility table */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4">Carrier Compatibility Chart</h3>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 text-white text-left">
                <th className="px-4 py-3 font-semibold">Carrier</th>
                <th className="px-4 py-3 font-semibold">Plate Size(s)</th>
                <th className="px-4 py-3 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {compatibilityData.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">{row.carrier}</td>
                  <td className="px-4 py-3 text-gray-600">{row.plateSize}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  if (inline) {
    return <div className={className}>{content}</div>
  }

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-semibold underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-1 rounded ${className}`}
        aria-haspopup="dialog"
      >
        <Ruler className="h-4 w-4" aria-hidden="true" />
        Size Guide
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Dialog */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="size-guide-title"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-3xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
              style={{ maxHeight: 'calc(100vh - 2rem)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <Ruler className="h-5 w-5 text-red-600" aria-hidden="true" />
                  <h2 id="size-guide-title" className="text-lg font-bold text-gray-900">
                    Body Armor Size Guide
                  </h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600"
                  aria-label="Close size guide"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="overflow-y-auto flex-1">
                {content}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
