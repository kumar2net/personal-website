import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AuthorBio from '../../components/AuthorBio';

const NepalAnnapurnaCircuit = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate('/blog')}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Blog
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-6">
        Nepal Journeys: An Annapurna Circuit Adventure
      </h1>

      <div className="flex items-center text-gray-600 mb-8">
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>July 27, 2025</span>
      </div>

      <div className="flex gap-2 mb-8">
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          Adventure
        </span>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          Trekking
        </span>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
          Nepal
        </span>
        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
          Annapurna
        </span>
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
          Travel
        </span>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
          Mountains
        </span>
      </div>

      <AuthorBio
        author="Sanjaay Babu"
        bio="Starting Undergraduate Studies this Fall Semester"
      />

      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <header className="text-center mb-10">
            <p className="text-md sm:text-lg text-gray-600 mt-4">
              Our incredible journey through Nepal centered on the Annapurna
              Circuit trail, a challenging yet rewarding trek spanning
              approximately 120km from Phedi to Tatopani
            </p>
          </header>

          <section className="mb-8">
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Our incredible journey through Nepal centered on the{' '}
              <strong>Annapurna Circuit trail</strong>, a challenging yet
              rewarding trek spanning approximately{' '}
              <strong>120km from Phedi to Tatopani</strong>. Don't let the
              distance fool you; the "undulating terrain" with its endless
              stairs makes every kilometer a significant effort!
            </p>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              We flew into Kathmandu's Tribhuvan International Airport, then
              took a short domestic flight to Pokhara, the starting point of our
              hike.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Trek Highlights & Key Information
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Here's a quick summary of our Annapurna Circuit adventure:
            </p>

            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500 mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">
                        Feature
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-800">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-700">
                        Key Locations Visited
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        Phedi, Tatopani, Annapurna Base Camp, Ghandruk Village,
                        Poon Hill
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-700">
                        Overall Trek Duration
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        Approximately <strong>19 days</strong> (entire trip
                        including flights/hotels). The trek itself was ~120km.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-700">
                        Ascent to ABC (Annapurna Base Camp)
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        A significant portion of the overall trek, reaching{' '}
                        <strong>4130m</strong>. It was a multi-day ascent.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-700">
                        Descent from ABC
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        We took a little loop instead of taking the fastest
                        route down. Tatopani (1190m) was the end point of the
                        120km trek.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-gray-700">
                        Total Trip Cost
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        <strong>S$2,900</strong> (approx.{' '}
                        <strong>USD $2,262</strong>) *
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                *Based on an approximate exchange rate of 1 SGD = 0.78 USD. This
                rate can fluctuate.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Memorable Moments
            </h2>

            <div className="space-y-6">
              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  The Tatopani Hotspring
                </h3>
                <p className="text-base leading-relaxed">
                  A truly amazing and relaxing conclusion. "Tatopani" means hot
                  water, and the mineral-rich springs worked wonders after days
                  of trekking.
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Annapurna Base Camp (ABC)
                </h3>
                <p className="text-base leading-relaxed">
                  The pinnacle of our hike at <strong>4130m</strong>. Be mindful
                  of altitude mountain sickness (AMS) on the final approach. The
                  sunrise from ABC is absolutely breathtaking.
                </p>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Bamboo Forests
                </h3>
                <p className="text-base leading-relaxed">
                  Throughout the walk, we entered several beautiful bamboo
                  forests. The town with the bamboo forests was called Bamboo.
                  We felt incredibly serene while trudging through the tall
                  bamboo trees — a truly therapeutic experience! In Bamboo,
                  there is a shrine. Beyond this shrine, no meat is to be
                  brought up, as it is deemed to offend the shrine. It is said
                  that once, this rule was briefly relaxed and numerous natural
                  tragedies unfolded. Since then, this rule has been reinstated.
                </p>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Ghandruk Village
                </h3>
                <p className="text-base leading-relaxed">
                  A beautifully preserved medieval village, offering a
                  fascinating glimpse into traditional Nepali life with its
                  unique stone houses.
                </p>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Poon Hill
                </h3>
                <p className="text-base leading-relaxed">
                  An iconic viewpoint requiring an early start (around 3 AM) to
                  catch a stunning sunrise over the majestic{' '}
                  <strong>Dhaulagiri range</strong> and other Himalayan peaks.
                  Expect crowds!
                </p>
              </div>

              <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Pashupatinath Temple
                </h3>
                <p className="text-base leading-relaxed">
                  Considered a sacred temple, and is a UNESCO World Heritage
                  Site. No phones allowed inside. This is a Hindu temple, but
                  the architecture is unique and looks like a Buddhist temple.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Essential Tips for Trekkers
            </h2>

            <div className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-500 mb-6">
              <ul className="space-y-3 text-base leading-relaxed">
                <li className="flex items-start">
                  <span className="text-indigo-600 font-bold mr-2">•</span>
                  <span>
                    <strong>Tip Generously:</strong> Your porters and guides
                    work incredibly hard for low wages; they deserve your
                    gratitude.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-bold mr-2">•</span>
                  <span>
                    <strong>Package Inclusions:</strong> Our tour covered
                    teahouses, food, and equipment rental.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-bold mr-2">•</span>
                  <span>
                    <strong>Insurance & Gear:</strong> Secure good insurance,
                    including <strong>heli-evacuation</strong> at relevant
                    altitudes. Don't forget <strong>crampons</strong> for snowy
                    sections above 3500m.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-bold mr-2">•</span>
                  <span>
                    <strong>Food Variety:</strong> Expect diverse options, from
                    local Thali-style dishes (similar to Indian food) to
                    Western, Korean, and Chinese food, even at higher
                    elevations.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 font-bold mr-2">•</span>
                  <span>
                    <strong>Travel Hack:</strong> Hang washed clothes from your
                    backpack to dry them quickly in the wind!
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
              Trek Trail Location & Photo Album
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Trek Trail Location
                </h3>
                <p className="text-base leading-relaxed mb-4">
                  Explore the Annapurna Circuit trail route on Google Maps with
                  satellite terrain view:
                </p>
                <a
                  href="https://www.google.com/maps/@28.5304187,83.8512782,64825m/data=!3m1!1e3?entry=ttu&g_ep=EgoyMDI1MDcyMy4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"
                    />
                  </svg>
                  View Trail on Google Maps
                </a>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-l-4 border-purple-500">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Photo Album
                </h3>
                <p className="text-base leading-relaxed mb-4">
                  Check out our complete photo album from this incredible
                  journey:
                </p>
                <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-500 mb-4">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> Do check out the remarks in the photo
                    album for additional insights and stories!
                  </p>
                </div>
                <a
                  href="https://photos.app.goo.gl/dmJv8PbAqr7Jc25JA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  View Photo Album
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Blog interactions */}
    </motion.div>
  );
};

export default NepalAnnapurnaCircuit;
