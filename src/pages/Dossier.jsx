import { motion } from 'framer-motion';
import { Brain, Activity, TrendingUp, BookOpen, Calendar, Users, Target, Zap } from 'lucide-react';

const DossierPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Brain className="h-10 w-10 text-blue-600 mr-3" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Weekly Neurosurgical Dossier</h1>
        </div>
        <div className="flex items-center justify-center text-gray-600 mb-2">
          <Calendar className="h-4 w-4 mr-2" />
          <span className="text-sm">August 17-23, 2025 | Week 33</span>
        </div>
        <p className="text-sm text-gray-500">For Senior Neurosurgeons • 3-minute clinical intelligence briefing • 44 papers analyzed</p>
      </div>

      {/* Executive Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-500 mb-8"
      >
        <div className="flex items-center mb-4">
          <Activity className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">Executive Summary</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          This week's research highlights breakthroughs in <strong>Deep Brain Stimulation (DBS) programming optimization</strong>, 
          <strong>advanced neuromodulation techniques</strong>, and <strong>Artificial Intelligence (AI)-enhanced brain-computer interfaces</strong>. 
          Key clinical implications focus on personalized DBS protocols, real-time neural monitoring, and emerging non-invasive therapeutic modalities.
        </p>
      </motion.div>

      {/* Immediate Clinical Relevance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex items-center mb-6">
          <Target className="h-6 w-6 text-red-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Immediate Clinical Relevance</h2>
        </div>

        {/* DBS Programming Revolution */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Deep Brain Stimulation (DBS) Programming Revolution</h3>
          
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Local Field Potential (LFP)-Guided Contact Selection</h4>
              <p className="text-sm text-gray-600 mb-2"><em>Muller et al., Brain Stimulation 2025</em></p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li><strong>Breakthrough:</strong> Local field potential recording for optimal contact selection</li>
                <li><strong>Clinical Impact:</strong> Reduces programming time and improves symptom control</li>
                <li><strong>Application:</strong> Subthalamic Nucleus (STN)-DBS optimization in Parkinson's patients</li>
                <li><strong>Status:</strong> Ready for clinical implementation</li>
                <li><strong>PMID:</strong> 40803531</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Nucleus Basalis of Meynert (NBM)-DBS Parameter Refinement</h4>
              <p className="text-sm text-gray-600 mb-2"><em>Kumbhare et al., Behavioral Neuroscience 2025</em></p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li><strong>Key Finding:</strong> Burst stimulation superior to tonic mode for dementia</li>
                <li><strong>Clinical Impact:</strong> 5-hour daily stimulation optimal (24-hour shows diminished returns)</li>
                <li><strong>Application:</strong> Consider NBM targeting for dementia patients</li>
                <li><strong>Implementation:</strong> Protocol refinement needed for human trials</li>
                <li><strong>PMID:</strong> 40489147</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Brain-Computer Interfaces & AI */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-8"
      >
        <div className="flex items-center mb-6">
          <Zap className="h-6 w-6 text-purple-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Brain-Computer Interfaces & AI</h2>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Advanced Motor Imagery Decoding</h3>
            <p className="text-sm text-gray-600 mb-3"><em>Yang & Zhu, Cognitive Neurodynamics 2025</em></p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li><strong>Innovation:</strong> MIFNet - MamBa-based Interactive Frequency Convolutional Neural Network (CNN)</li>
              <li><strong>Performance:</strong> 12.3% improvement over EEGNet, 8.3% over Filter Bank Common Spatial Pattern (FBCNet)</li>
              <li><strong>Technology:</strong> Hybrid CNN with state-space models for Electroencephalography (EEG) decoding</li>
              <li><strong>Clinical Value:</strong> Real-time Brain-Computer Interface (BCI) applications for motor rehabilitation</li>
              <li><strong>Status:</strong> Ready for clinical trials</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Brain-Muscle Synergy Analysis</h3>
            <p className="text-sm text-gray-600 mb-3"><em>Samadi et al., Cognitive Neurodynamics 2025</em></p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li><strong>Approach:</strong> Graph theory-based Electromyography (EMG)-Electroencephalography (EEG) signal integration</li>
              <li><strong>Accuracy:</strong> 99.8% correlation with maximum Mean Square Error (MSE) of 0.0084</li>
              <li><strong>Application:</strong> Rehabilitation methods and brain-computer interfaces</li>
              <li><strong>Innovation:</strong> Neural network-based synergy estimation</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Neuromodulation Advances */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center mb-6">
          <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Neuromodulation Advances</h2>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Transcranial Focused Ultrasound (tFUS)</h3>
            <p className="text-sm text-gray-600 mb-3"><em>Alsamri et al., Journal of Neuroscience Methods 2025</em></p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li><strong>Advantage:</strong> Superior spatial precision vs. conventional methods</li>
              <li><strong>Innovation:</strong> Longitudinal Electroencephalography (EEG)-based neuroplasticity assessment</li>
              <li><strong>Application:</strong> Real-time adaptive modulation strategies</li>
              <li><strong>Clinical Impact:</strong> Therapeutic brain activity modulation</li>
              <li><strong>Status:</strong> Requires standardized protocols</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Advanced Spinal Cord Neuromodulation</h3>
            <p className="text-sm text-gray-600 mb-3"><em>Parker et al., Journal of Neural Engineering 2025</em></p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li><strong>Technology:</strong> High-density epidural paddle arrays</li>
              <li><strong>Innovation:</strong> Active electronic stimulation patterns</li>
              <li><strong>Target Indication:</strong> Chronic spinal cord injuries</li>
              <li><strong>Implementation:</strong> Ready for clinical trials</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Neuroimaging & Diagnostics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center mb-6">
          <BookOpen className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Neuroimaging & Diagnostics</h2>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Emotion Recognition in Electroencephalography (EEG)</h3>
            <p className="text-sm text-gray-600 mb-3"><em>Al-Hadithy et al., Computers in Biology and Medicine 2025</em></p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li><strong>Challenge:</strong> Subject-specific EEG signal analysis</li>
              <li><strong>Solution:</strong> Deep learning with Convolutional Neural Network (CNN), Recurrent Neural Network (RNN), and Vision Transformer (ViT) architectures</li>
              <li><strong>Application:</strong> Brain-machine interaction enhancement</li>
              <li><strong>Clinical Value:</strong> Brain health assessment systems</li>
              <li><strong>Status:</strong> Addressing model robustness and interpretability</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Non-Suicidal Self-Injury (NSSI) Prediction with Neural Circuits</h3>
            <p className="text-sm text-gray-600 mb-3"><em>Wu et al., Annals of Medicine 2025</em></p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li><strong>Innovation:</strong> Interpretable graph neural networks</li>
              <li><strong>Focus:</strong> Pain-processing neural circuits in NSSI</li>
              <li><strong>Technology:</strong> Multimodal data integration</li>
              <li><strong>Clinical Impact:</strong> Risk prediction and intervention strategies</li>
              <li><strong>Approach:</strong> Graph-based connectivity analysis</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Surgical AI & Robotics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center mb-6">
          <Users className="h-6 w-6 text-teal-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Surgical AI & Robotics</h2>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-teal-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Robotic Spine Surgery - First 40 Cases</h3>
            <p className="text-sm text-gray-600 mb-3"><em>Rodríguez-Domínguez et al., Neurocirugia 2025</em></p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li><strong>Technique:</strong> Transpedicular screw placement via robotic navigation</li>
              <li><strong>Population:</strong> Aging demographics driving increased spinal pathology</li>
              <li><strong>Outcome Metrics:</strong> Enhanced precision vs. traditional methods</li>
              <li><strong>Learning Curve:</strong> Case volume recommendations for proficiency</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-teal-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Automated Finite Element Modeling</h3>
            <p className="text-sm text-gray-600 mb-3"><em>Ahmadi et al., World Neurosurgery 2025</em></p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li><strong>Innovation:</strong> Deep learning-based lumbar spine segmentation</li>
              <li><strong>Advantage:</strong> Automated FEA for biomechanical analysis</li>
              <li><strong>Application:</strong> Spinal load distribution and stress analysis</li>
              <li><strong>Clinical Value:</strong> Improved surgical planning and outcomes</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Research Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mb-8"
      >
        <div className="flex items-center mb-6">
          <Activity className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Research Analytics</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">This Week's Distribution:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Neuroimaging</span>
                <span className="font-semibold">43 papers (98%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Diagnosis Prediction</span>
                <span className="font-semibold">23 papers (52%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Neuromodulation</span>
                <span className="font-semibold">8 papers (18%)</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Brain Connectivity</span>
                <span className="font-semibold">5 papers (11%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Neural Implants</span>
                <span className="font-semibold">2 papers (5%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Surgical AI</span>
                <span className="font-semibold">1 paper (2%)</span>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Artificial Intelligence (AI) Models:</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Vision Transformers (ViT)</span>
              <span className="font-semibold">17 papers - Leading medical imaging</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Convolutional Neural Networks (CNNs)</span>
              <span className="font-semibold">11 papers - Dominant in neuroimaging analysis</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Transformers</span>
              <span className="font-semibold">11 papers - Neural signal processing</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Recurrent Neural Networks (RNNs)</span>
              <span className="font-semibold">5 papers - Temporal pattern recognition</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Multimodal AI</span>
              <span className="font-semibold">4 papers - Cross-modal data integration</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Emerging Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mb-8"
      >
        <div className="flex items-center mb-6">
          <TrendingUp className="h-6 w-6 text-yellow-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Emerging Trends</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Personalized Neuromodulation</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Real-time biomarker integration</li>
              <li>• Adaptive stimulation protocols</li>
              <li>• Individual-specific parameter optimization</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Artificial Intelligence (AI)-Enhanced Surgical Planning</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Automated segmentation and modeling</li>
              <li>• Predictive outcome analysis</li>
              <li>• Robotic assistance integration</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Non-Invasive Therapeutic Modalities</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Transcranial focused ultrasound</li>
              <li>• Advanced Electroencephalography (EEG)-based monitoring</li>
              <li>• Brain-Computer Interface (BCI) applications</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Recommended Deep Dives */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="mb-8"
      >
        <div className="flex items-center mb-6">
          <BookOpen className="h-6 w-6 text-purple-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Recommended Deep Dives</h2>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border-l-4 border-purple-500">
          <ol className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="font-semibold text-purple-600 mr-2">1.</span>
              <span><strong>Local Field Potential (LFP)-Guided Deep Brain Stimulation (DBS) Programming</strong> - Implement for Parkinson's patients</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-purple-600 mr-2">2.</span>
              <span><strong>MIFNet Brain-Computer Interface (BCI) Technology</strong> - Evaluate for motor rehabilitation</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-purple-600 mr-2">3.</span>
              <span><strong>Transcranial Focused Ultrasound (tFUS) Protocols</strong> - Develop standardized treatment protocols</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-purple-600 mr-2">4.</span>
              <span><strong>Robotic Spine Outcomes</strong> - Consider implementation timeline</span>
            </li>
          </ol>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
        className="text-center text-sm text-gray-500 border-t pt-6"
      >
        <p>Next Update: August 24, 2025 | Generated: August 17, 2025 05:03 IST</p>
        <p className="mt-1">Questions: contact research@neurofrontiers.ai</p>
      </motion.div>
    </motion.div>
  );
};

export default DossierPage;
