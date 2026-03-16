import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { CreditCard, Lock, Shield } from 'lucide-react'
import { TrustBadges, PaymentMethods, SecuritySeals } from './TrustBadges'

// Zod schema for payment form validation
const paymentSchema = z.object({
  cardNumber: z.string()
    .min(16, 'Card number must be at least 16 digits')
    .max(19, 'Card number is too long')
    .regex(/^\d[\d\s-]*\d$/, 'Invalid card number format'),
  cardName: z.string()
    .min(3, 'Name on card is required')
    .max(50, 'Name is too long'),
  expiry: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry must be in MM/YY format'),
  cvv: z.string()
    .min(3, 'CVV must be at least 3 digits')
    .max(4, 'CVV must be at most 4 digits')
    .regex(/^\d+$/, 'CVV must contain only numbers'),
  saveCard: z.boolean().optional(),
  billingSameAsShipping: z.boolean().optional()
})

type PaymentFormData = z.infer<typeof paymentSchema>

interface PaymentFormProps {
  onSubmit?: (data: PaymentFormData) => Promise<void>
  amount?: number
  showBillingAddress?: boolean
  className?: string
}

export function PaymentForm({ 
  onSubmit, 
  amount = 0,
  showBillingAddress = false,
  className = ''
}: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    mode: 'onChange',
    defaultValues: {
      cardNumber: '',
      cardName: '',
      expiry: '',
      cvv: '',
      saveCard: false,
      billingSameAsShipping: true
    }
  })

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '')
    const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value
    setValue('cardNumber', formattedValue)
    trigger('cardNumber')
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4)
    }
    setValue('expiry', value)
    trigger('expiry')
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setValue('cvv', value)
    trigger('cvv')
  }

  const handleFormSubmit = async (data: PaymentFormData) => {
    setIsProcessing(true)
    try {
      if (onSubmit) {
        await onSubmit(data)
      } else {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    } catch (error) {
      console.error('Payment processing error:', error)
      throw error
    } finally {
      setIsProcessing(false)
    }
  }

  const getCardType = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, '')
    if (number.startsWith('4')) return 'visa'
    if (number.startsWith('5')) return 'mastercard'
    if (number.startsWith('3')) return 'amex'
    return 'unknown'
  }

  const cardType = getCardType(watch('cardNumber'))

  return (
    <div className={`payment-form ${className}`}>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
            {amount > 0 && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-red-600">${amount.toFixed(2)}</p>
              </div>
            )}
          </div>
          
          <SecuritySeals />
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Card Number */}
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Card Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCard className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="cardNumber"
                type="text"
                {...register('cardNumber')}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className={`w-full pl-10 pr-16 py-3 border rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200 ${
                  errors.cardNumber 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                aria-invalid={errors.cardNumber ? 'true' : 'false'}
                aria-describedby={errors.cardNumber ? 'cardNumber-error' : undefined}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {cardType !== 'unknown' && (
                  <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">
                    {cardType === 'visa' && 'VISA'}
                    {cardType === 'mastercard' && 'MC'}
                    {cardType === 'amex' && 'AMEX'}
                  </div>
                )}
              </div>
            </div>
            {errors.cardNumber && (
              <p id="cardNumber-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.cardNumber.message}
              </p>
            )}
          </div>

          {/* Name on Card */}
          <div>
            <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-2">
              Name on Card <span className="text-red-500">*</span>
            </label>
            <input
              id="cardName"
              type="text"
              {...register('cardName')}
              placeholder="John Doe"
              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200 ${
                errors.cardName 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              aria-invalid={errors.cardName ? 'true' : 'false'}
              aria-describedby={errors.cardName ? 'cardName-error' : undefined}
            />
            {errors.cardName && (
              <p id="cardName-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.cardName.message}
              </p>
            )}
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <input
                id="expiry"
                type="text"
                {...register('expiry')}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                maxLength={5}
                className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200 ${
                  errors.expiry 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                aria-invalid={errors.expiry ? 'true' : 'false'}
                aria-describedby={errors.expiry ? 'expiry-error' : undefined}
              />
              {errors.expiry && (
                <p id="expiry-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.expiry.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                CVV <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="cvv"
                  type="text"
                  {...register('cvv')}
                  onChange={handleCvvChange}
                  placeholder="123"
                  maxLength={4}
                  className={`w-full px-3 py-3 pr-8 border rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200 ${
                    errors.cvv 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  aria-invalid={errors.cvv ? 'true' : 'false'}
                  aria-describedby={errors.cvv ? 'cvv-error' : undefined}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              {errors.cvv && (
                <p id="cvv-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.cvv.message}
                </p>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('saveCard')}
                className="mr-2 h-4 w-4 text-red-600 focus:ring-red-600 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">
                Save card information for future purchases
              </label>
            </div>

            {showBillingAddress && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('billingSameAsShipping')}
                  className="mr-2 h-4 w-4 text-red-600 focus:ring-red-600 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700">
                  Billing address same as shipping address
                </label>
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div className="py-4 border-t">
            <PaymentMethods />
          </div>

          {/* Security Trust Badges */}
          <div className="py-4 border-t">
            <TrustBadges variant="compact" badges={['ssl', 'security', 'guarantee']} />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing || !isValid}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 ${
              isProcessing || !isValid
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                <span>Complete Secure Payment</span>
              </>
            )}
          </button>

          {/* Security Notice */}
          <div className="text-center text-xs text-gray-500">
            <p className="flex items-center justify-center">
              <Lock className="h-3 w-3 mr-1" />
              Your payment information is encrypted and secure
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
