import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Plus, Minus, ShoppingBag, Shield, ArrowRight, ArrowLeft } from 'lucide-react'
import { useCart } from '@/hooks'
import { TrustBadges, PaymentMethods, SecuritySeals } from '@/components/ui/TrustBadges'
import { createCartCheckoutUrl, isShopifyConfigured } from '@/lib/shopify'

// Zod schemas for checkout forms
const shippingSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().min(5, 'ZIP code is required'),
})

const paymentSchema = z.object({
  cardNumber: z.string().min(16, 'Card number is required'),
  cardName: z.string().min(3, 'Name on card is required'),
  expiry: z.string().min(5, 'Expiry date is required'),
  cvv: z.string().min(3, 'CVV is required'),
  saveCard: z.boolean().optional()
})

type ShippingFormData = z.infer<typeof shippingSchema>
type PaymentFormData = z.infer<typeof paymentSchema>

interface CartProps {
  className?: string
}

export function Cart({ className = '' }: CartProps) {
  const {
    cartItems,
    checkoutState,
    isOpen,
    setIsOpen,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    updateCheckoutInfo,
    nextStep,
    previousStep,
    resetCheckout
  } = useCart()

  const [isProcessing, setIsProcessing] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const handleProceedToCheckout = async () => {
    setCheckoutError(null)
    if (!isShopifyConfigured()) {
      setCheckoutError('Checkout is not configured. Add VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN to .env.')
      return
    }
    const lines = cartItems
      .filter((item) => item.product.shopifyVariantId)
      .map((item) => ({
        merchandiseId: item.product.shopifyVariantId!,
        quantity: item.quantity,
      }))
    if (lines.length === 0) {
      setCheckoutError('No items are available for checkout. Products need Shopify variant IDs.')
      return
    }
    if (lines.length < cartItems.length) {
      setCheckoutError(`${cartItems.length - lines.length} item(s) could not be added to checkout (missing product link).`)
    }
    setIsProcessing(true)
    try {
      const checkoutUrl = await createCartCheckoutUrl(lines)
      window.location.href = checkoutUrl
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Checkout failed.')
      setIsProcessing(false)
    }
  }

  const shopifyReady = isShopifyConfigured()
  const cartItemsWithVariant = cartItems.filter((item) => item.product.shopifyVariantId).length

  // Shipping form
  const shippingForm = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    mode: 'onChange'
  })

  // Payment form
  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    mode: 'onChange'
  })

  const handleShippingSubmit = (data: ShippingFormData) => {
    updateCheckoutInfo('customerInfo', {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone
    })
    updateCheckoutInfo('shippingAddress', {
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip
    })
    nextStep()
  }

  const handlePaymentSubmit = async () => {
    setIsProcessing(true)
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      updateCheckoutInfo('paymentMethod', 'credit_card')
      nextStep()
    } catch (error) {
      console.error('Payment failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const totalPrice = getTotalPrice()
  const shipping = totalPrice > 50 ? 0 : 9.99
  const tax = totalPrice * 0.08
  const finalTotal = totalPrice + shipping + tax

  if (!isOpen) {
    return null
  }

  // Cart View
  if (checkoutState.step === 'cart') {
    return (
      <div className={`fixed inset-0 z-50 ${className}`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5 text-red-600" />
                <h2 className="text-lg font-semibold">Shopping Cart ({cartItems.length})</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-gray-500">IMG</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.product.name}</h3>
                        <p className="text-gray-600">${item.product.price}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <TrustBadges variant="compact" badges={['ssl', 'security', 'payment']} />

                {checkoutError && (
                  <p className="text-sm text-red-600" role="alert">
                    {checkoutError}
                  </p>
                )}

                <button
                  onClick={handleProceedToCheckout}
                  disabled={isProcessing || (shopifyReady && cartItemsWithVariant === 0)}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      <span>Redirecting to checkout…</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {!shopifyReady && (
                  <p className="text-xs text-gray-500">
                    Add Shopify Storefront API env vars to enable checkout.
                  </p>
                )}

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full border border-gray-300 hover:bg-gray-50 py-2 rounded-lg transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Shipping Step
  if (checkoutState.step === 'shipping') {
    return (
      <div className={`fixed inset-0 z-50 ${className}`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <button
                  onClick={previousStep}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <h2 className="text-lg font-semibold">Shipping Information</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Progress */}
            <div className="px-4 py-3 bg-gray-50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-600 font-medium">Step 1 of 3</span>
                <span className="text-gray-600">Shipping → Payment → Review</span>
              </div>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-4">
              <form onSubmit={shippingForm.handleSubmit(handleShippingSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      {...shippingForm.register('firstName')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                    {shippingForm.formState.errors.firstName && (
                      <p className="text-red-600 text-xs mt-1">{shippingForm.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      {...shippingForm.register('lastName')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                    {shippingForm.formState.errors.lastName && (
                      <p className="text-red-600 text-xs mt-1">{shippingForm.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    {...shippingForm.register('email')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                  {shippingForm.formState.errors.email && (
                    <p className="text-red-600 text-xs mt-1">{shippingForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                  <input
                    type="tel"
                    {...shippingForm.register('phone')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <input
                    {...shippingForm.register('address')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                  {shippingForm.formState.errors.address && (
                    <p className="text-red-600 text-xs mt-1">{shippingForm.formState.errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                      {...shippingForm.register('city')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                    {shippingForm.formState.errors.city && (
                      <p className="text-red-600 text-xs mt-1">{shippingForm.formState.errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input
                      {...shippingForm.register('state')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                    {shippingForm.formState.errors.state && (
                      <p className="text-red-600 text-xs mt-1">{shippingForm.formState.errors.state.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP *</label>
                    <input
                      {...shippingForm.register('zip')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                    {shippingForm.formState.errors.zip && (
                      <p className="text-red-600 text-xs mt-1">{shippingForm.formState.errors.zip.message}</p>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>

            <div className="border-t p-4">
              <SecuritySeals />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Payment Step
  if (checkoutState.step === 'payment') {
    return (
      <div className={`fixed inset-0 z-50 ${className}`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <button
                  onClick={previousStep}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <h2 className="text-lg font-semibold">Payment Information</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Progress */}
            <div className="px-4 py-3 bg-gray-50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-600 font-medium">Step 2 of 3</span>
                <span className="text-gray-600">Shipping → Payment → Review</span>
              </div>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-6">
                <PaymentMethods />
              </div>

              <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number *</label>
                  <input
                    {...paymentForm.register('cardNumber')}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                  {paymentForm.formState.errors.cardNumber && (
                    <p className="text-red-600 text-xs mt-1">{paymentForm.formState.errors.cardNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card *</label>
                  <input
                    {...paymentForm.register('cardName')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                  {paymentForm.formState.errors.cardName && (
                    <p className="text-red-600 text-xs mt-1">{paymentForm.formState.errors.cardName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry *</label>
                    <input
                      {...paymentForm.register('expiry')}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                    {paymentForm.formState.errors.expiry && (
                      <p className="text-red-600 text-xs mt-1">{paymentForm.formState.errors.expiry.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV *</label>
                    <input
                      {...paymentForm.register('cvv')}
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                    {paymentForm.formState.errors.cvv && (
                      <p className="text-red-600 text-xs mt-1">{paymentForm.formState.errors.cvv.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...paymentForm.register('saveCard')}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">Save card for future purchases</label>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handlePaymentSubmit}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Order</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="border-t p-4">
              <TrustBadges variant="compact" badges={['ssl', 'security', 'guarantee']} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Order Complete
  if (checkoutState.step === 'complete') {
    return (
      <div className={`fixed inset-0 z-50 ${className}`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
          <div className="flex flex-col h-full">
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Complete!</h2>
                <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been confirmed.</p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-2">Order Total</p>
                  <p className="text-2xl font-bold text-gray-900">${finalTotal.toFixed(2)}</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      resetCheckout()
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
