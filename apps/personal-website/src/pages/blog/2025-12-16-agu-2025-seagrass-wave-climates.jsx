import { motion } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthorBio from "../../components/AuthorBio";

const Agu2025SeagrassWaveClimates = () => {
  const navigate = useNavigate();
  const articleRef = useRef(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/blog")}
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
        AGU 2025: Hydrodynamics and Seagrass Growth in the Indian River Lagoon
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
          />
        </svg>
        <span>December 16, 2025</span>
        <span className="mx-2">•</span>
        <span>6 min read</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          Coastal Resilience
        </span>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          Seagrass
        </span>
        <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
          Hydrodynamics
        </span>
        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
          Sediment Transport
        </span>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
          AGU 2025
        </span>
      </div>

      <AuthorBio
        author="Namritha R"
        bio="Second year PG Student at UCF"
      />

      <div className="space-y-8">
        <div ref={articleRef} className="prose prose-lg max-w-none">
          <header className="text-center mb-10">
            <p className="text-md sm:text-lg text-gray-600 mt-4">
              Seagrass meadows are quiet engineers: they slow waves, trap sediment,
              and buffer coastlines. This AGU 2025 study asks how much protection a
              growing meadow actually provides as its canopy thickens over a
              season.
            </p>
          </header>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-10 dark:bg-indigo-950/40 dark:border-indigo-800">
            <p className="text-base sm:text-lg font-semibold text-indigo-800 dark:text-indigo-100">
              Presented at AGU 2025 Conference, New Orleans.
            </p>
          </div>

          <div className="mb-10">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
              alt="Waves rolling over coastal waters"
              className="w-full h-64 sm:h-80 object-cover rounded-lg shadow-lg"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/1200x400/0ea5e9/ffffff?text=Coastal+Resilience";
              }}
            />
            <p className="text-sm text-gray-500 text-center mt-2">
              Photo by{" "}
              <a
                href="https://unsplash.com/@jeremybishop"
                className="underline hover:text-gray-700"
              >
                Jeremy Bishop
              </a>{" "}
              on{" "}
              <a href="https://unsplash.com" className="underline hover:text-gray-700">
                Unsplash
              </a>
            </p>
          </div>

          <section className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-green-700 mb-6 border-b-2 border-green-200 pb-2">
              Why this matters
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Sea level rise is accelerating, and coastal systems are under
              pressure from erosion, flooding, and nutrient loading. Seagrasses,
              marshes, and mangroves are natural defenses that adjust to change
              instead of resisting it. But in places like Florida&apos;s Indian River
              Lagoon, eutrophication and harmful algal blooms have driven
              devastating seagrass loss. Understanding how a meadow performs as it
              recovers is crucial for restoration and resilience planning.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-6 border-b-2 border-blue-200 pb-2">
              Research focus
            </h2>
            <ul className="list-disc list-inside text-base sm:text-lg leading-relaxed mb-6">
              <li>
                Measure wave characteristics and wave energy attenuation inside a
                seagrass meadow.
              </li>
              <li>
                Compare suspended sediment concentration (SSC) between vegetated
                and bare sites.
              </li>
              <li>
                Link seasonal canopy density to functional outcomes.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-teal-700 mb-6 border-b-2 border-teal-200 pb-2">
              Site and methods
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              The study took place in Mosquito Lagoon (Indian River Lagoon, FL),
              using paired sensor deployments in vegetated and bare areas at the
              same depth. The lagoon is a low-energy, fetch-limited system with a
              reference wave climate around H80 of 6.2–6.9 cm and an average wave
              period of 1.22 s.
            </p>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Wave data came from pressure sensors, processed with spectral
              analysis. Turbidity data was collected with a Seapoint turbidity
              sensor (with anti-fouling wipers), quality controlled, and converted
              to SSC using a site-specific calibration curve. Canopy density was
              tracked using a 1 m2 quadrat divided into 100 cells, repeated in
              April, July, and September to capture the meadow&apos;s seasonal growth.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-6 border-b-2 border-emerald-200 pb-2">
              Sensors in the field
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Two instruments carried the story. Pressure sensors logged the tiny
              changes in water pressure caused by wind waves. The raw series was
              converted with RBR&apos;s Ruskin software into wave height and period
              metrics, which then fed the attenuation calculations. In parallel,
              a Seapoint turbidity sensor measured the cloudiness of the water.
              Those readings were cleaned, calibrated, and translated into
              suspended sediment concentration so the team could compare bare
              bottom to vegetated canopy conditions.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 dark:bg-emerald-950/40 dark:border-emerald-800">
              <p className="text-base sm:text-lg text-emerald-800 dark:text-emerald-100">
                Context: pressure sensors turn wave motion into physics-friendly
                numbers, while turbidity sensors turn water clarity into sediment
                loads. Together they connect hydrodynamics to ecosystem function.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-emerald-700 mb-6 border-b-2 border-emerald-200 pb-2">
              What the data says
            </h2>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-8 dark:bg-emerald-950/40 dark:border-emerald-800">
              <h3 className="text-lg font-semibold mb-3 text-emerald-800 dark:text-emerald-100">
                Key results at a glance
              </h3>
              <ul className="list-disc list-inside text-emerald-700 dark:text-emerald-100">
                <li>Wave energy attenuated by 18% overall across the meadow.</li>
                <li>Attenuation increased with wave energy: 13.6% (low), 17.2%
                (medium), 18.2% (high).</li>
                <li>
                  SSC 80th percentile: 27.43 mg/L (vegetated) vs 32.51 mg/L (bare).
                </li>
                <li>Dense canopy improved wave attenuation from 5.3% to 8.1%.</li>
                <li>
                  Mature canopy reduced SSC80 by 65.2% compared to the bare site.
                </li>
              </ul>
            </div>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Early in the season the meadow was sparse. By July and September,
              density increased sharply, with near-sensor cover rising from 40% to
              76–80%. That growth mattered: the dense canopy consistently reduced
              suspended sediment, especially during high-energy events.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-6 border-b-2 border-indigo-200 pb-2">
              Interpretation
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              The meadow acts like a flexible brake. Blades add friction above the
              bed, while roots stabilize sediment below. As canopy density matures,
              the system crosses a threshold where it meaningfully dampens waves
              and traps sediment. Sparse meadows still help, but they can also
              allow more sediment to stay suspended during energetic periods.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-sky-700 mb-6 border-b-2 border-sky-200 pb-2">
              What comes next
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6">
              Future work targets bed shear stress and a minimum functional density
              threshold. Those metrics can guide restoration: how much seagrass is
              enough to deliver measurable resilience benefits, and how long does
              a recovering meadow need before it starts shielding the coast?
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">
              Closing note
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              Seagrass is not just habitat—it is infrastructure that grows. This
              study shows that as the canopy thickens, the lagoon gets quieter and
              clearer. That is exactly the kind of quiet protection that coastal
              resilience plans should preserve.
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default Agu2025SeagrassWaveClimates;
