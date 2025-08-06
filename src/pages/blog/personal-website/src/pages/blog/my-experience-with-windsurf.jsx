import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'

const MyExperienceWithWindsurfPost = () => {
  const location = useLocation()
  const navigate = useNavigate()

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
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </button>
      </div>
      <h1 className="text-4xl font-bold mb-6">My Experience with Windsurf</h1>
      <div className="flex items-center text-gray-600 mb-8">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>June 04, 2025</span>
      </div>

      <div className="space-y-8">
        <div className="prose prose-lg max-w-none">
          <h2>Introduction</h2>
          <p>
            I faced a lot of freezing & hanging issues in Cursor.            
            After quite a bit of troubleshooting figured out that my laptop CPU, IO and HDD
            utilisation was very minimal.
            Tried with --disable-extensions and that didnt help either.
          </p>  
          
          <h2>Installed Windsurf</h2>
          <p>It seems to be working fine so far.</p>

          <h3 className="text-xl font-semibold mt-4 mb-2">Version Details</h3>
          <p>Here are the specifics of the Windsurf version I'm currently running:</p>
          <ul className="list-disc list-inside space-y-1 my-2 bg-gray-50 p-4 rounded-md">
            <li><strong>Windsurf Version:</strong> <code>1.9.2</code></li>
            <li><strong>Windsurf Extension Version:</strong> <code>1.46.2</code></li>
            <li><strong>Windsurf Commit:</strong> <code>8cb7f313303c8b35844a56b6fe0f76e508261569</code></li>
            <li><strong>VSCode OSS Version:</strong> <code>1.99.1</code></li>
            <li><strong>Commit (VSCode):</strong> <code>8cb7f313303c8b35844a56b6fe0f76e508261569</code></li>
            <li><strong>Date:</strong> <code>2025-05-22T08:00:34.629Z</code></li>
            <li><strong>Electron:</strong> <code>34.3.2</code></li>
            <li><strong>ElectronBuildId:</strong> <code>undefined</code></li>
            <li><strong>Chromium:</strong> <code>132.0.6834.210</code></li>
            <li><strong>Node.js:</strong> <code>20.18.3</code></li>
            <li><strong>V8:</strong> <code>13.2.152.41-electron.0</code></li>
            <li><strong>OS:</strong> <code>Linux x64 6.8.0-60-generic</code></li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Installation on Linux (Ubuntu)</h3>
          <p>
            Installing Windsurf on my Ubuntu system was straightforward. Here are the general steps I followed:
          </p>
          <ol className="list-decimal list-inside space-y-1 my-2 bg-gray-50 p-4 rounded-md">
            <li>Download the <code>.deb</code> package from the official Windsurf website.</li>
            <li>Open a terminal and navigate to the directory where you downloaded the file.</li>
            <li>Execute the command: <code>sudo dpkg -i windsurf_amd64.deb</code> (replace <code>windsurf_amd64.deb</code> with the actual downloaded file name).</li>
            <li>If prompted for dependencies, run: <code>sudo apt-get install -f</code>.</li>
            <li>Once installed, Windsurf can be launched from the application menu.</li>
          </ol>
          <p className="mt-2 italic text-sm">
            Note: Always refer to the official Windsurf documentation for the latest and most detailed installation instructions.
          </p>

          <h2>Key Features I Liked</h2>
          <p>Windsurf has the same look and feel as Cursor, as it is also a VS Code fork.</p>


          <h2>Conclusion</h2>
          <p>
            I will use it for a week and see if it is a good fit for me. Cheers.
          </p>
        </div>

        <div className="border-t pt-8">
          <h3 className="text-xl font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Windsurf
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              AI Coding
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Developer Tools
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              VS Code
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Cursor
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Productivity
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default MyExperienceWithWindsurfPost
