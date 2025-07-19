import { motion } from 'framer-motion'

const About = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-8">About Me</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <p className="text-lg text-gray-600">
            I'm a passionate person who is inclined to try the new advancements in AI, Model Context Protocol and how to use Agents to automate tasks.
            My background is in Telecom Test & Measuring Instruments, Wireless and IP Networking.
          </p>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Skills</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-blue-500 mr-2"></span>
                <span>React</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-blue-500 mr-2"></span>
                <span>JavaScript</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-blue-500 mr-2"></span>
                <span>Node.js</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-blue-500 mr-2"></span>
                <span>Tailwind CSS</span>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Experience</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Senior Developer</h3>
              <p className="text-sm text-gray-500">Tech Company | 2022 - Present</p>
            </div>
            <div>
              <h3 className="font-medium">Junior Developer</h3>
              <p className="text-sm text-gray-500">Startup | 2020 - 2022</p>
            </div>
          </div>
        </div> */}
      </div>
    </motion.div>
  )
}

export default About
