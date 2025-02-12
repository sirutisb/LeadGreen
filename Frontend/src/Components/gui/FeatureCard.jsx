
export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white w-full max-w-sm rounded-lg shadow-lg p-6 text-center transition duration-300 hover:bg-green-50 hover:shadow-xl">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-green-600 text-xl transition duration-300 group-hover:text-green-700">{title}</h3>
      <p className="text-green-700">{description}</p>
    </div>
  );
}
