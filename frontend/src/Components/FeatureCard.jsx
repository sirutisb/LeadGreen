export default function FeatureCard({ icon, title, description }) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="flex justify-center mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">{title}</h3>
        <p className="text-green-700">{description}</p>
      </div>
    )
  }
