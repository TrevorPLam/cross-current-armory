import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Users, Eye, TrendingUp } from 'lucide-react'

interface LivePurchase {
  id: string
  name: string
  location: string
  product: string
  timeAgo: string
}

interface LiveCounterProps {
  className?: string
  showNotifications?: boolean
  showStats?: boolean
}

const BUYER_NAMES = [
  'James W.', 'Sarah M.', 'Mike T.', 'Jennifer C.', 'David R.',
  'Amanda F.', 'Robert L.', 'Jessica K.', 'Chris P.', 'Ashley B.',
  'Brandon H.', 'Megan D.', 'Tyler G.', 'Lauren N.', 'Kevin S.',
]

const LOCATIONS = [
  'Houston, TX', 'Dallas, TX', 'Austin, TX', 'San Antonio, TX', 'Fort Worth, TX',
  'El Paso, TX', 'Nashville, TN', 'Phoenix, AZ', 'Denver, CO', 'Atlanta, GA',
]

const PRODUCTS = [
  'A2 – Level III+ Alloy Body Armor',
  'A4 Side Plates',
  'A4 – Level III++ Alloy Body Armor',
  'Heritage – Level III AR500 Steel Body Armor',
  'The Concealment Plate Carrier',
  'The Concealment Plate Carrier - White',
]

let notificationIdCounter = 0

function generatePurchase(): LivePurchase {
  notificationIdCounter += 1
  return {
    id: String(notificationIdCounter),
    name: BUYER_NAMES[Math.floor(Math.random() * BUYER_NAMES.length)],
    location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
    product: PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)],
    timeAgo: 'just now',
  }
}

function useLivePurchases() {
  const [purchases, setPurchases] = useState<LivePurchase[]>([])

  const addPurchase = useCallback(() => {
    const purchase = generatePurchase()
    setPurchases(prev => [purchase, ...prev.slice(0, 3)])
    // Remove oldest after 6 seconds
    setTimeout(() => {
      setPurchases(prev => prev.filter(p => p.id !== purchase.id))
    }, 6000)
  }, [])

  useEffect(() => {
    // Initial purchase after a short delay
    const initialTimeout = setTimeout(addPurchase, 2000)

    const scheduleNext = () => {
      const delay = Math.random() * 15000 + 8000 // 8–23 s
      return setTimeout(() => {
        addPurchase()
        timeoutRef = scheduleNext()
      }, delay)
    }

    let timeoutRef = scheduleNext()

    return () => {
      clearTimeout(initialTimeout)
      clearTimeout(timeoutRef)
    }
  }, [addPurchase])

  return purchases
}

export function LiveCounter({ className = '', showNotifications = true, showStats = true }: LiveCounterProps) {
  const purchases = useLivePurchases()
  const [viewerCount] = useState(() => Math.floor(Math.random() * 30) + 18)
  const [totalSold] = useState(() => Math.floor(Math.random() * 50) + 480)

  return (
    <div className={`live-counter ${className}`}>
      {showStats && (
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <Eye className="h-4 w-4" aria-hidden="true" />
            <span><strong>{viewerCount}</strong> people viewing now</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Users className="h-4 w-4 text-blue-500" aria-hidden="true" />
            <span><strong>{totalSold}+</strong> sold this month</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <TrendingUp className="h-4 w-4 text-red-500" aria-hidden="true" />
            <span><strong>High demand</strong> – low stock</span>
          </div>
        </div>
      )}

      {showNotifications && (
        <div
          className="fixed bottom-6 left-6 z-40 flex flex-col gap-3 pointer-events-none"
          aria-live="polite"
          aria-label="Recent purchases"
        >
          <AnimatePresence>
            {purchases.map(purchase => (
              <motion.div
                key={purchase.id}
                initial={{ opacity: 0, x: -60, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -60, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 flex items-start gap-3 max-w-xs pointer-events-auto"
                role="status"
              >
                <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
                  <ShoppingBag className="h-4 w-4 text-red-600" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">
                    {purchase.name} from {purchase.location}
                  </p>
                  <p className="text-xs text-gray-600 truncate">purchased <span className="font-medium">{purchase.product}</span></p>
                  <p className="text-xs text-green-600 mt-0.5">{purchase.timeAgo}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
