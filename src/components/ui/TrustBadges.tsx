import { Shield, CheckCircle, Truck, Award, CreditCard, Lock } from 'lucide-react'

interface TrustBadge {
  id: string
  type: 'security' | 'payment' | 'shipping' | 'guarantee' | 'ssl' | 'award'
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  color: string
}

interface TrustBadgesProps {
  variant?: 'compact' | 'detailed'
  className?: string
  badges?: TrustBadge['type'][]
}

const defaultBadges: TrustBadge[] = [
  {
    id: 'ssl-secure',
    type: 'ssl',
    icon: Lock,
    title: 'SSL Secured',
    description: '256-bit encryption protection',
    color: 'text-green-600'
  },
  {
    id: 'secure-checkout',
    type: 'security',
    icon: Shield,
    title: 'Secure Checkout',
    description: 'Your data is protected',
    color: 'text-blue-600'
  },
  {
    id: 'payment-methods',
    type: 'payment',
    icon: CreditCard,
    title: 'Multiple Payment Options',
    description: 'Visa, Mastercard, PayPal, and more',
    color: 'text-purple-600'
  },
  {
    id: 'free-shipping',
    type: 'shipping',
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over $50',
    color: 'text-orange-600'
  },
  {
    id: 'money-back',
    type: 'guarantee',
    icon: CheckCircle,
    title: '30-Day Money Back',
    description: 'Satisfaction guaranteed',
    color: 'text-emerald-600'
  },
  {
    id: 'quality-assured',
    type: 'award',
    icon: Award,
    title: 'Quality Assured',
    description: 'Premium tactical gear',
    color: 'text-red-600'
  }
]

export function TrustBadges({ 
  variant = 'compact', 
  className = '',
  badges = ['ssl', 'security', 'payment', 'shipping', 'guarantee', 'award']
}: TrustBadgesProps) {
  const filteredBadges = defaultBadges.filter(badge => badges.includes(badge.type))

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-4 ${className}`}>
        {filteredBadges.map((badge) => {
          const Icon = badge.icon
          return (
            <div
              key={badge.id}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              title={badge.title}
            >
              <Icon className={`h-5 w-5 ${badge.color}`} />
              <span className="text-sm font-medium hidden sm:inline">{badge.title}</span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
      {filteredBadges.map((badge) => {
        const Icon = badge.icon
        return (
          <div
            key={badge.id}
            className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className={`p-2 bg-white rounded-full shadow-sm ${badge.color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                {badge.title}
              </h4>
              <p className="text-xs text-gray-600">
                {badge.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Payment method logos component
export function PaymentMethods({ className = '' }: { className?: string }) {
  const methods = [
    { name: 'Visa', width: 'w-12', height: 'h-8' },
    { name: 'Mastercard', width: 'w-12', height: 'h-8' },
    { name: 'PayPal', width: 'w-16', height: 'h-8' },
    { name: 'Apple Pay', width: 'w-12', height: 'h-8' },
    { name: 'Google Pay', width: 'w-12', height: 'h-8' },
  ]

  return (
    <div className={`flex items-center justify-center space-x-4 ${className}`}>
      <span className="text-sm text-gray-600 mr-2">Accepted Payment Methods:</span>
      {methods.map((method) => (
        <div
          key={method.name}
          className={`${method.width} ${method.height} bg-gray-200 rounded flex items-center justify-center text-xs font-medium text-gray-600`}
          title={method.name}
        >
          {method.name.split(' ')[0]}
        </div>
      ))}
    </div>
  )
}

// Security seals for checkout pages
export function SecuritySeals({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="flex items-center space-x-2 text-green-600">
        <Lock className="h-5 w-5" />
        <span className="text-sm font-medium">256-bit SSL Encryption</span>
      </div>
      
      <div className="flex items-center space-x-2 text-blue-600">
        <Shield className="h-5 w-5" />
        <span className="text-sm font-medium">PCI DSS Compliant</span>
      </div>
      
      <div className="flex items-center space-x-2 text-purple-600">
        <CheckCircle className="h-5 w-5" />
        <span className="text-sm font-medium">Secure Payment Gateway</span>
      </div>
    </div>
  )
}
