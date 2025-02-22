export default function UserFeedBack(){
    return(
        <section className="w-full py-4 px-4 bg-[#f3f1ea] mt-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl md:text-[64px] font-serif text-center mb-16 text-black">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-green-50 p-6 rounded-lg shadow-lg">
                <p className="text-gray-600 italic mb-4">
                  "LeadGreen has completely changed how I approach sustainability. It's fun, engaging, and really makes
                  me feel like I'm making a difference!"
                </p>
                <p className="font-semibold text-black">Elon M.</p>
                <p className="text-sm text-gray-500">Environmental Enthusiast</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg shadow-lg">
                <p className="text-gray-600 italic mb-4">
                  "As a busy professional, I never thought I'd have time for eco-friendly habits. LeadGreen made it easy
                  and rewarding to incorporate sustainability into my daily routine."
                </p>
                <p className="font-semibold text-black">Adrew T.</p>
                <p className="text-sm text-gray-500">Head of Hustlers Uni </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg shadow-lg">
                <p className="text-gray-600 italic mb-4">
                  "The community aspect of LeadGreen is fantastic. I've connected with so many like-minded people and
                  learned tons of new ways to reduce my carbon footprint."
                </p>
                <p className="font-semibold text-black">Top Goon</p>
                <p className="text-sm text-gray-500">Student</p>
              </div>
            </div>
          </div>
        </section>
    )
}
