export default function FAQ(){
    return(
        <section className="w-full py-20 px-4 bg-[#f3f1ea]">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-serif text-center mb-16 text-black">Frequently Asked Questions</h2>
          
                <div className="space-y-8">
                    <div className="bg-green-50 p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-semibold mb-2 text-green-700">How do I start using LeadGreen?</h3>
                        <p className="text-black text-lg">
                        Download the app from your device's app store, create an account, and start logging your eco-friendly
                        actions. You'll earn points and grow your virtual plant as you go!
                        </p>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-semibold mb-2 text-green-700">Is LeadGreen free to use?</h3>
                        <p className="text-black text-lg">
                        Yes, LeadGreen is free to sign up and use.
                        </p>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-semibold mb-2 text-green-700">How does LeadGreen verify eco-friendly actions?
                        </h3>
                        <p className="text-black text-lg">
                        We use a combination of QR code scanning at various university locations, photo verification, and community moderation to ensure the authenticity of logged actions.
                        </p>
                    </div>

                    
                </div>
            </div>
        </section>
    )
}