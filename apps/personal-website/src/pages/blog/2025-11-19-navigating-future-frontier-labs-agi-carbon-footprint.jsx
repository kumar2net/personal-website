import BlogPostLayout from "../../components/BlogPostLayout";
import PromptBox from "../../components/engagement/PromptBox";

const heroImage = "https://oaidalleapiprodscus.blob.core.windows.net/private/org-alKt26JO7M7biVXF9ceaWChd/user-YjTrTRAgTLLT1HoDP6tqaTTv/img-vXuCrFTMC7L8H6Kr7Q8q53ZL.png?st=2025-11-19T01%3A19%3A28Z&se=2025-11-19T03%3A19%3A28Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=31d50bd4-689f-439b-a875-f22bd677744d&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-11-19T02%3A01%3A49Z&ske=2025-11-20T02%3A01%3A49Z&sks=b&skv=2024-08-04&sig=x74xsytjMoBqBhk6vnpHbV06qVuHMb%2BNj9wPwpIXL1A%3D";
const postSlug = "navigating-future-frontier-labs-agi-carbon-footprint";

const tags = ["Frontier Labs","AGI","Automation","Carbon Footprint","Technology Trends"];

const publishedDate = "2025-11-19";

export default function BlogPost() {
  return (
    <BlogPostLayout
      title="Navigating the Future: Frontier Labs, AGI, and Our Role in a Changing World"
      description="Exploring the upcoming announcements from Frontier Labs, reflecting on our environmental responsibilities inspired by Dr. Abdul Kalam, and contemplating life in an age dominated by AGI and automation."
      publishedDate={publishedDate}
      tags={tags}
      heroImage={heroImage}
      slug={postSlug}
    >
      <div className="space-y-8">
        
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg shadow-lg">
            1
          </span>
          Anticipating Major Announcements from Frontier Labs
        </h2>
        <div className="prose prose-lg max-w-none">
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            As we approach the Thanksgiving weekend, I believe we'll witness significant announcements from all the Frontier Labs. These organizations remind me of Kadothgajan, constantly yearning for greater compute capacity. Today, I want to highlight my top five Frontier Labs that I'm closely watching. Looking ahead, 2026 seems poised to be a litmus test for these labs, determining their impact and breakthroughs in the tech landscape.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg shadow-lg">
            2
          </span>
          Our Shared Responsibility to Reduce Carbon Footprint
        </h2>
        <div className="prose prose-lg max-w-none">
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            Beyond technological advancements, I firmly believe each of us must contribute to reducing our carbon footprint. Reflecting on the wise words of Dr. Abdul Kalam: "Don't ask what your country has done for you — ask what you can do for your country." This mindset drives home the importance of individual action amidst global challenges.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg shadow-lg">
            3
          </span>
          Envisioning Life with AGI and Automation
        </h2>
        <div className="prose prose-lg max-w-none">
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            What happens when AGI is achieved and automation takes over our routine tasks? Will robots handle all our sundry jobs while we endlessly scroll through screens, idling away our time? It's a compelling question about purpose and productivity in a world where manual effort diminishes.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg shadow-lg">
            4
          </span>
          Evolving Skills and Interfaces in a Digital World
        </h2>
        <div className="prose prose-lg max-w-none">
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            Skills like typing at speed, shorthand, multilingual speaking, grammar mastery, and even conversions between metric and imperial units are becoming obsolete. We no longer need to memorize these as technology handles them seamlessly. However, even the mobile device interface — the touch and click — needs evolution. A natural voice or vision-based interface that works reliably is the next frontier. For instance, the recent Lenskart IPO in India drew attention when they announced spectacles capable of payments via UPI just by looking at a shopkeeper's QR code — a glimpse into this future.
          </p>
        </div>
      </section>


        {/* Engagement Section */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <PromptBox slug={postSlug} />
        </div>
      </div>
    </BlogPostLayout>
  );
}
