import { motion } from 'framer-motion'
import { Shield, Truck, Award } from 'lucide-react'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}

export function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="text-center group"
      role="article"
    >
      <div 
        className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-red-200 transition-colors"
        aria-hidden="true"
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}

export function Features() {
  return (
    <section className="py-16 bg-white" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="features-heading" className="sr-only">Our Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-red-600" />}
            title="Premium Protection"
            description="Level III+ and III++ body armor providing superior ballistic protection"
            delay={0.1}
          />
          <FeatureCard
            icon={<Truck className="h-8 w-8 text-blue-600" />}
            title="Fast Delivery"
            description="Quick shipping on all orders with tracking provided"
            delay={0.2}
          />
          <FeatureCard
            icon={<Award className="h-8 w-8 text-green-600" />}
            title="Expert Support"
            description="Knowledgeable staff ready to help you find the right gear"
            delay={0.3}
          />
        </div>
      </div>
    </section>
  )
}

export default Features
