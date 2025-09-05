import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TnpdclAutomatedMeterReading = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      {/* Back button */}
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

      {/* Title */}
      <h1 className="text-4xl font-bold mb-2">
        Friction in India with government services — TNPDCL energy meter reading
      </h1>

      {/* Date */}
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
        <span>August 27, 2025</span>
      </div>

      {/* Shields.io badges */}
      <div className="flex flex-wrap gap-3 mb-6">
        <img
          src="https://img.shields.io/badge/India-FF9933?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="India"
        />
        <img
          src="https://img.shields.io/badge/Utilities-111827?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Utilities"
        />
        <img
          src="https://img.shields.io/badge/TNPDCL-1D4ED8?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="TNPDCL"
        />
        <img
          src="https://img.shields.io/badge/Smart_Metering-059669?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="Smart Metering"
        />
        <img
          src="https://img.shields.io/badge/AMR%2FAMI-7C3AED?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="AMR/AMI"
        />
        <img
          src="https://img.shields.io/badge/NFC-F97316?style=for-the-badge&labelColor=1F2937&logoColor=white"
          alt="NFC"
        />
      </div>

      <div className="space-y-8 prose prose-lg max-w-none">
        {/* Problem statement - verbatim */}
        <section>
          <h2 className="text-2xl font-bold">The Problem</h2>
          <p>
            TNPDCL — Tamil Nadu Power Distribution Company Limited (erstwhile
            Tamil Nadu Electricity Board (TNEB) / Tamil Nadu Generation and
            Distribution Corporation (TANGEDCO)) can not take energy meter
            reading on time - bimonthly because of shortage of manpower. When
            the time for reading comes up our elderly, retired folks get tensed.
            if the reading is not done on time, they are charged extra as the
            slab rate is higher. This matters so much to them.
          </p>
        </section>

        {/* Personal issue - verbatim (moved up) */}
        <section>
          <h2 className="text-2xl font-bold">What Triggered This Post</h2>
          <p>
            They keyed in some random 260 odd units — kWh (kilowatt-hour) — in
            my account during the last billing cycle. Multiple phone calls,
            emails, raising tickects in their mobile app, etc.doesnt help. i
            sent video of meter reading — kWh (kilowatt-hour), kVA
            (kilovolt-ampere) et... as they typically ask. it is 3 weeks since i
            have been trying to get this resolved and it is still not done. i
            set out to find the root cause.
          </p>
        </section>

        {/* Findings - verbatim (moved up) */}
        <section>
          <h2 className="text-2xl font-bold">What I know and reconfirmed it</h2>
          <p>
            we are still in archaic manual meter reading system where as the
            world has moved to automated meter reading system.
          </p>
        </section>

        {/* Advantages - heading and verbatim line (moved up) */}
        <section>
          <h2 className="text-2xl font-bold">
            Advantages of Automated Meter Reading System vs Manual Meter Reading
            System
          </h2>
        </section>

        {/* Executive summary and recommendations (cellular-only) */}
        <section>
          <h2 className="text-2xl font-bold">
            Executive Summary (Cellular-Only Approach)
          </h2>
          <p className="mb-4">
            Recommendation: leverage India’s existing mobile networks for
            Automated Meter Reading (AMR) / Advanced Metering Infrastructure
            (AMI) — prioritize 5G and Long-Term Evolution (LTE) (LTE Cat-M / LTE
            Cat-1 bis) with 4G (Fourth Generation) fallback. Do not deploy Radio
            Frequency (RF) mesh or Power Line Communication (PLC) in this plan.
            Use private Access Point Names (APNs) and Machine-to-Machine (M2M) /
            embedded Universal Integrated Circuit Card (eUICC) Subscriber
            Identity Modules (SIMs) for secure, reliable connectivity.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Technology</strong>: 5G and LTE (LTE Cat-M / LTE Cat-1
              bis) first; fallback to 4G where coverage is limited.
            </li>
            <li>
              <strong>Vendors</strong>: Retrofit existing Genus meters with
              communication modules or Meter Interface Units (MIUs); integrate
              with a Head-End System (HES) / Meter Data Management System
              (MDMS).
            </li>
            <li>
              <strong>Telecom partners</strong>: Evaluate coverage and
              Service-Level Agreements (SLAs) with Airtel, Jio, and BSNL.
            </li>
            <li>
              <strong>Security</strong>: Private Access Point Name (APN) /
              Virtual Private Network (VPN), device International Mobile
              Equipment Identity (IMEI) / Subscriber Identity Module (SIM)
              whitelisting, Transport Layer Security (TLS) to the HES, Device
              Language Message Specification (DLMS) / Companion Specification
              for Energy Metering (COSEM) profiles.
            </li>
            <li>
              <strong>Rollout</strong>: Phased, starting with high-loss and
              elderly/priority consumer clusters; scale feeder-by-feeder.
            </li>
          </ul>
        </section>

        {/* Retrofit options for Genus (cellular) */}
        <section>
          <h2 className="text-2xl font-bold">
            Retrofit Options: Genus Meters (Cellular)
          </h2>
          <p className="text-gray-700 mb-3">
            <strong>Why Genus?</strong> Genus is the currently deployed meter
            solution across TNPDCL/TANGEDCO service areas. Prioritizing Genus
            retrofit communication modules and Meter Interface Units (MIUs)
            leverages the existing installed base, reduces Capital Expenditure
            (CAPEX) and truck-roll time, and preserves metrology certifications
            while enabling Advanced Metering Infrastructure (AMI) features over
            cellular networks.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Genus Communication Module</strong>: field-replaceable
              module enabling two-way AMI over cellular/RF; supports
              on-demand/scheduled reads, remote connect/disconnect, events, and
              firmware updates. See product page:{' '}
              <a
                href="https://genuspower.com/product/communication-module/"
                target="_blank"
                rel="noopener noreferrer"
              >
                genuspower.com/product/communication-module/
              </a>
            </li>
            <li>
              <strong>Genus Meter Interface Unit (IntelliLog g-Setu)</strong>:
              external MIU for legacy meters to push reads over cellular/RF;
              tamper logging and data storage. Product:{' '}
              <a
                href="https://genuspower.com/product/meter-interface-unit-intellilog-g-setu/"
                target="_blank"
                rel="noopener noreferrer"
              >
                genuspower.com/product/meter-interface-unit-intellilog-g-setu/
              </a>
            </li>
          </ul>
          <p className="mt-2 text-gray-700">
            Select communication-capable SKUs for new installs; use MIUs to
            bridge older meters while replacing them during planned lifecycle
            upgrades.
          </p>
        </section>

        {/* CAPEX/OPEX and ROI model (indicative, cellular-only) */}
        <section>
          <h2 className="text-2xl font-bold">
            Indicative CAPEX, OPEX, and ROI (Cellular)
          </h2>
          <div className="bg-blue-50 p-4 rounded-lg space-y-2">
            <p>
              <strong>Scope</strong>: 100,000 service connections;
              retrofit-first with cellular modules/MIUs; HES+MDMS integration.
            </p>
            <p className="text-gray-700 text-sm">
              Note: figures are directional for planning; run an RFP to firm up
              pricing.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">CAPEX (one-time)</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Genus comm module or MIU per meter: ₹1,200–2,000</li>
                <li>Install, provisioning, testing per meter: ₹150–300</li>
                <li>HES/MDMS licenses and integration (lot): ₹2.0–3.5 crore</li>
                <li>Backhaul, VPN, security hardening: ₹0.3–0.6 crore</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">OPEX (annual)</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>M2M SIM, private APN: ₹8–20 per meter per month</li>
                <li>HES/MDMS support and cloud hosting: ₹0.8–1.5 crore</li>
                <li>Field maintenance and replacements: ₹0.3–0.6 crore</li>
              </ul>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg mt-4">
            <h3 className="text-lg font-semibold mb-2">ROI components</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Eliminate manual reading visits (bimonthly) → labor/logistics
                savings
              </li>
              <li>
                Aggregate Technical & Commercial (AT&amp;C) loss reduction via
                timely disconnection, tamper alerts, faster theft detection
                (1–3% targeted)
              </li>
              <li>
                Billing cycle compression → earlier cash collection (working
                capital interest saved)
              </li>
              <li>Customer dispute reduction → lower call center workload</li>
            </ul>
            <p className="mt-2 text-gray-700">
              Expected payback: 2–5 years depending on current loss profile and
              negotiated SIM/HES pricing. Prioritize feeders with high losses
              for faster payback.
            </p>
          </div>
        </section>

        {/* Cellular communications architecture */}
        <section>
          <h2 className="text-2xl font-bold">
            Communications Architecture (Mobile-Network Only)
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Device</strong>: Genus meter + communication module/MIU
              with LTE modem; Device Language Message Specification (DLMS) over
              Transport Layer Security (TLS) to the Head-End System (HES).
            </li>
            <li>
              <strong>SIM</strong>: embedded Universal Integrated Circuit Card
              (eUICC) Machine-to-Machine (M2M) SIMs; private Access Point Name
              (APN); International Mobile Equipment Identity (IMEI) / SIM lock;
              traffic restricted to HES IP ranges.
            </li>
            <li>
              <strong>Operator</strong>: Airtel/Jio/BSNL selected
              per-ward/feeder coverage survey; multi-International Mobile
              Subscriber Identity (IMSI) option to reduce outages.
            </li>
            <li>
              <strong>Backhaul</strong>: APN-to-Data Center (DC) via Internet
              Protocol Security (IPsec) / Virtual Private Network (VPN); HES in
              the DC or cloud; MDMS integrates with billing.
            </li>
            <li>
              <strong>Monitoring</strong>: SIM lifecycle management,
              connectivity Key Performance Indicators (KPIs), and meter
              heartbeat alerts.
            </li>
          </ul>
        </section>

        {/* Phased rollout plan */}
        <section>
          <h2 className="text-2xl font-bold">Phased Rollout Plan</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>Pilot (10–20k meters)</strong>: 2 urban divisions, 1
              rural; multi-operator SIM trials; baseline KPIs.
            </li>
            <li>
              <strong>Wave 1 (100k)</strong>: Top-loss feeders and
              elderly/priority consumer clusters; finalize tariffs/SLAs.
            </li>
            <li>
              <strong>Wave 2–n</strong>: Scale feeder-by-feeder; replace legacy
              meters during scheduled cycles with comm-capable SKUs.
            </li>
            <li>
              <strong>Operate</strong>: SOC/NOC playbooks, monthly loss
              analytics, targeted theft drives informed by AMI data.
            </li>
          </ol>
        </section>

        {/* References */}
        <section>
          <h2 className="text-2xl font-bold">References</h2>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>
              Genus Communication Module —{' '}
              <a
                href="https://genuspower.com/product/communication-module/"
                target="_blank"
                rel="noopener noreferrer"
              >
                genuspower.com/product/communication-module/
              </a>
            </li>
            <li>
              Genus Meter Interface Unit (IntelliLog g-Setu) —{' '}
              <a
                href="https://genuspower.com/product/meter-interface-unit-intellilog-g-setu/"
                target="_blank"
                rel="noopener noreferrer"
              >
                genuspower.com/product/meter-interface-unit-intellilog-g-setu/
              </a>
            </li>
            <li>Airtel | Jio | BSNL</li>
          </ul>
          <p className="text-gray-700 text-sm mt-2">
            Plan explicitly excludes RF mesh and PLC; only mobile network
            infrastructure is considered.
          </p>
        </section>

        {/* Research agenda - verbatim */}

        {/* Interim solution - verbatim */}
        <section>
          <h2 className="text-2xl font-bold">What to Do in the Interim</h2>
          <p>
            In mobile app-
            <a
              href="https://play.google.com/store/apps/details?id=com.tneb.tangedco"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              https://play.google.com/store/apps/details?id=com.tneb.tangedco
            </a>{' '}
            use Near Field Communication (NFC) to read data from the meter, get
            it verified by the customer and send it to billing system. Almost
            all our younsters can do this and it will help reduce the workload
            of the field staff. Taking video and sharing in WhatsApp is not a
            good idea.
          </p>
        </section>

        {/* Meter types comparison - rendered as table from CSV */}
        <section>
          <h2 className="text-2xl font-bold">
            The Types of Energy Meters Used in Few Countries
          </h2>
          <p>
            The types of energy meters used in few countries are in the
            @docs/enerymeter/enerfyMetercomp.csv - use it verbatim
          </p>
          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left font-semibold">
                    Feature
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">
                    CL200 240V 3W (USA)
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">
                    Itron A100 GEN5 230V 10(100)A (Singapore)
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">
                    Genus Saksham (India)
                  </th>
                  <th className="border border-gray-300 p-3 text-left font-semibold">
                    Genus Type-03B Trinergy (India)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">
                    Type
                  </td>
                  <td className="border border-gray-300 p-3">
                    Solid-state, 3-wire
                  </td>
                  <td className="border border-gray-300 p-3">
                    Single-phase, 2-wire
                  </td>
                  <td className="border border-gray-300 p-3">
                    Smart meter series, single & three-phase variants
                  </td>
                  <td className="border border-gray-300 p-3">
                    3 phase, 4 wire, static meter
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">
                    Voltage
                  </td>
                  <td className="border border-gray-300 p-3">240V</td>
                  <td className="border border-gray-300 p-3">230V</td>
                  <td className="border border-gray-300 p-3">230-240V</td>
                  <td className="border border-gray-300 p-3">3x240V</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">
                    Current
                  </td>
                  <td className="border border-gray-300 p-3">30A rated</td>
                  <td className="border border-gray-300 p-3">10(100)A</td>
                  <td className="border border-gray-300 p-3">
                    10-60 A (varies model)
                  </td>
                  <td className="border border-gray-300 p-3">3x (10-60) A</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">
                    Frequency
                  </td>
                  <td className="border border-gray-300 p-3">60Hz</td>
                  <td className="border border-gray-300 p-3">50Hz</td>
                  <td className="border border-gray-300 p-3">50Hz</td>
                  <td className="border border-gray-300 p-3">50Hz</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">
                    Accuracy Class
                  </td>
                  <td className="border border-gray-300 p-3">0.5</td>
                  <td className="border border-gray-300 p-3">
                    IEC Class 1 / 1.2
                  </td>
                  <td className="border border-gray-300 p-3">Class 1.0</td>
                  <td className="border border-gray-300 p-3">Class 1.0</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">
                    Meter Constant (Kh)
                  </td>
                  <td className="border border-gray-300 p-3">1.0 imp/kWh</td>
                  <td className="border border-gray-300 p-3">1000 imp/kWh</td>
                  <td className="border border-gray-300 p-3">1200 imp/kWh</td>
                  <td className="border border-gray-300 p-3">1200 imp/unit</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">
                    Energy Types
                  </td>
                  <td className="border border-gray-300 p-3">kWh (active)</td>
                  <td className="border border-gray-300 p-3">
                    kWh, kvarh (active/reactive)
                  </td>
                  <td className="border border-gray-300 p-3">
                    kWh, kVAh, kVArh
                  </td>
                  <td className="border border-gray-300 p-3">
                    kWh, kVArh, kVAh
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">
                    Communication
                  </td>
                  <td className="border border-gray-300 p-3">
                    OpenWay RF Mesh 900 MHz, PLC, Wi-Fi
                  </td>
                  <td className="border border-gray-300 p-3">
                    Gen5 RF/Cellular (sub-GHz)
                  </td>
                  <td className="border border-gray-300 p-3">
                    RF/Cellular/PLC options via AMI
                  </td>
                  <td className="border border-gray-300 p-3">
                    RS232, + other modules
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">
                    Communication Band
                  </td>
                  <td className="border border-gray-300 p-3">900 MHz</td>
                  <td className="border border-gray-300 p-3">
                    Sub-GHz bands (400-500 MHz), 2.4 GHz in some cases
                  </td>
                  <td className="border border-gray-300 p-3">
                    Sub-GHz, cellular
                  </td>
                  <td className="border border-gray-300 p-3">
                    RS232 wired interface
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">
                    Data Transmission
                  </td>
                  <td className="border border-gray-300 p-3">
                    Periodic/on-demand to data collectors
                  </td>
                  <td className="border border-gray-300 p-3">
                    Real-time via Gen5 AMI concentrators
                  </td>
                  <td className="border border-gray-300 p-3">
                    AMI periodic/on-demand wireless/cellular
                  </td>
                  <td className="border border-gray-300 p-3">
                    Via RS232 or manual data download
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">
                    Display
                  </td>
                  <td className="border border-gray-300 p-3">LCD</td>
                  <td className="border border-gray-300 p-3">LCD</td>
                  <td className="border border-gray-300 p-3">LCD</td>
                  <td className="border border-gray-300 p-3">LCD</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">
                    Smart Features
                  </td>
                  <td className="border border-gray-300 p-3">
                    Time-of-Use, tamper detection, remote control
                  </td>
                  <td className="border border-gray-300 p-3">
                    TOU, tamper detection, remote disconnect
                  </td>
                  <td className="border border-gray-300 p-3">
                    Load profiling, pre-paid options, tamper logs
                  </td>
                  <td className="border border-gray-300 p-3">
                    MD reset, DLMS Cat-C2
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">
                    Billing Integration
                  </td>
                  <td className="border border-gray-300 p-3">
                    Utility backend systems
                  </td>
                  <td className="border border-gray-300 p-3">
                    SP Group AMI system
                  </td>
                  <td className="border border-gray-300 p-3">
                    Indian utilities supporting R-APDRP
                  </td>
                  <td className="border border-gray-300 p-3">
                    TANGEDCO backend via DLMS/RS232
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-3 font-semibold">
                    Typical Cost (USD approx)
                  </td>
                  <td className="border border-gray-300 p-3">
                    $75-$150 (₹6,375–₹12,750)
                  </td>
                  <td className="border border-gray-300 p-3">
                    $110-$220 (₹9,350–₹18,700)
                  </td>
                  <td className="border border-gray-300 p-3">
                    $50-$70 (₹4,250–₹5,950)
                  </td>
                  <td className="border border-gray-300 p-3">
                    $50-$70 (₹4,250–₹5,950)
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">
                    Region of Use
                  </td>
                  <td className="border border-gray-300 p-3">USA</td>
                  <td className="border border-gray-300 p-3">Singapore</td>
                  <td className="border border-gray-300 p-3">India</td>
                  <td className="border border-gray-300 p-3">India</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Final takeaway */}
        <section>
          <h2 className="text-2xl font-bold">Final Takeaway</h2>
          <p>
            Hope and wish the management of TNPDCL take congnisance of this and
            initiate some action.
          </p>
        </section>
      </div>

      {/* Likes and Comments */}
    </motion.div>
  );
};

export default TnpdclAutomatedMeterReading;
