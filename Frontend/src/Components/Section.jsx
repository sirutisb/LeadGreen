import { ArrowRight} from 'lucide-react'
export default function Section(){
    return(
<section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-green-700 mb-4">Track Your Sustainability Journey</h1>
          <p className="text-xl text-green-700 mb-8">
            Empower yourself to make eco-friendly choices and reduce your carbon footprint.
          </p>
          <a
            href="#get-started"
            className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 transition-colors duration-300"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </section>
    )
}
