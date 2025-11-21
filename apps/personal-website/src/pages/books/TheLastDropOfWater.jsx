import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import BookPageContainer from '../../components/BookPageContainer';

function TheLastDropOfWater() {
  return (
    <BookPageContainer>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Link 
          to="/books" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          ← Back to Books
        </Link>

      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          The Last Drop of Water, oh no
        </h1>
        <h2 className="text-2xl text-gray-600 mb-4">
          A True Story of Compassion and Reflection
        </h2>
        <p className="text-xl font-semibold text-gray-800">By Kumar.A</p>
        
        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <img
            loading="lazy"
            decoding="async"
            src="https://img.shields.io/badge/Genre-Memoir-blue"
            alt="Memoir badge"
          />
          <img
            loading="lazy"
            decoding="async"
            src="https://img.shields.io/badge/Philosophy-Compassion-purple"
            alt="Philosophy badge"
          />
          <img
            loading="lazy"
            decoding="async"
            src="https://img.shields.io/badge/Natural%20History-Ecology-green"
            alt="Natural History badge"
          />
          <img
            loading="lazy"
            decoding="async"
            src="https://img.shields.io/badge/Reading%20Time-2--3%20minutes-orange"
            alt="Reading time badge"
          />
          <img
            loading="lazy"
            decoding="async"
            src="https://img.shields.io/badge/Words-487-lightgrey"
            alt="Word count badge"
          />
        </div>
      </header>

      <div className="prose prose-lg max-w-none">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
          <p className="text-sm text-gray-700 text-center mb-2">
            <strong>Copyright © 2025 Kumar.A. All rights reserved.</strong>
          </p>
          <p className="text-sm text-gray-600 text-center">
            This is a work of creative non-fiction based on true events. The story recounts a personal experience of the author and reflects his philosophical observations on life, compassion, and mortality.
          </p>
        </div>

        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">DEDICATION</h3>
          <p className="italic text-center text-gray-700">
            To all who have shown kindness to the smallest among us, and to those who have taught us that compassion knows no boundaries.
          </p>
        </section>

        <section className="mb-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">TABLE OF CONTENTS</h3>
          <ul className="list-none space-y-2">
            <li><a href="#chapter1" className="text-blue-600 hover:text-blue-800">Chapter One: A Sunday Morning</a></li>
            <li><a href="#chapter2" className="text-blue-600 hover:text-blue-800">Chapter Two: The Last Breath</a></li>
            <li><a href="#chapter3" className="text-blue-600 hover:text-blue-800">Chapter Three: Reflections on Life and Death</a></li>
            <li><a href="#beetle-info" className="text-blue-600 hover:text-blue-800">About the Darkling Beetle (கருப்பு வண்டு)</a></li>
            <li><a href="#author" className="text-blue-600 hover:text-blue-800">About the Author</a></li>
            <li><a href="#publisher-note" className="text-blue-600 hover:text-blue-800">Publisher's Note</a></li>
          </ul>
        </section>

        <section id="chapter1" className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">CHAPTER ONE: A SUNDAY MORNING</h3>
          <p className="mb-4">
            Sunday morning, I went outside to get some sunlight into my body because I had been down with a high fever the previous night.
          </p>
          
          <p className="mb-4">
            As I stepped into the fresh air, I noticed a darkling beetle (<span className="text-red-600 font-semibold">கருப்பு வண்டு</span>), just turning in an inverted position and kicking its legs, trying to very hard to get in its feet. Something moved me to help. I took a piece of stick and gently helped it into its normal position. I felt so happy, and it started to walk from the spot very gingerly. It looked like a bloated, mature beetle—one that had lived through several months/ years of our Vadavalli seasons, its dark brown shell weathered by time and the tropical climate of Coimbatore. These typically feed on dead and decaying plant material, fallen leaves and organic debris, fungus and mold especially of coconut trees.
          </p>

          <div className="text-center my-8 p-6 bg-gray-100 rounded-lg border border-gray-300">
            <img 
              src="/media/darkling-beetle.jpg" 
              alt="The darkling beetle in its final moments" 
              className="max-w-full h-auto rounded-lg shadow-md mx-auto"
            />
            <p className="italic text-sm text-gray-600 mt-4">
              The darkling beetle (<span className="text-red-600 font-semibold">கருப்பு வண்டு</span>) in its final moments - a photograph taken during this encounter in Vadavalli, Coimbatore
            </p>
          </div>

          <p className="mb-4">
            It walked around a bit, testing its restored mobility. Then I went to the gate, got the milk packets, and kept them in the fridge. When I came back and looked at it, it was literally struggling to walk and only had a few steps left in it as it was literally on its last legs. So I gave it a little bit of water from the bottle wife uses to feed the cactus and tulsi plant in the verandah. It drank the water and then it seemed like it was gone as it became completely motionless. I thought it was dead, and gone.
          </p>
        </section>

        <section id="chapter2" className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">CHAPTER TWO: THE LAST BREATH</h3>
          <p className="mb-4">
            I couldn't control my feelings and I started crying uncontrollably having just watched the beetle die in front of me. I thought, well, what I gave was the last gasp, the last drop of water that it was longing for, and it breathed its last in front of me.
          </p>
          
          <p className="mb-4">
            It upset me deeply. I went inside and then came back after some time, and I noticed it had started to move a bit, so I gave it a little bit more water and it sipped that water - i could hear that minute slurping sound. It extended its tentacles and sipped the all water it could, and then it felt better i think. It is still alive, and it made me so happy and made me really think.
          </p>
        </section>

        <section id="chapter3" className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">CHAPTER THREE: REFLECTIONS ON LIFE AND DEATH</h3>
          <p className="mb-4">
            It was a very profound experience for me. Here was this darkling beetle, a creature that typically lives for several months in our Vadavalli climate, reaching the end of its natural lifespan. Will I have enough goodwill in the room I leave behind? Will someone I love, a family member or a friend or whoever it is—give me the last sip or last gulp of that water and then I exit the world, the exit button as they call it?
          </p>
          
          <p className="mb-4">
            I'm not afraid because after all this reading of philosophical books, I have learned there's no pain in Death, right? I didn't know when I was born, and not going to know when I am going to be dead. So there's no pain. But in between this time span is what is all that I go through - is all my health issues, sufferings, pains due to what? I think I just have to face the music and can't question anything, NO WAY OUT! Wish that THIS TOO SHALL PASS Mind you at this time I didnt even have an inkling of loads of sufferings and further loss of part part - what is going to unfold in the next 20 days
          </p>
          
          <p className="mb-4">
            This is a reflection of a true story, and I just want to share it. Something in me teels me that beetle was my thatha (granddad) who came to check on me that early morning, that day
          </p>
          
          <p className="mb-4">
            Thank you so much.
          </p>
        </section>

        <section id="beetle-info" className="mb-8 bg-green-50 p-6 rounded-lg border border-green-200">
          <h4 className="text-xl font-bold text-green-800 mb-4">About the Darkling Beetle (<span className="text-red-600">கருப்பு வண்டு</span>)</h4>
          
          <div className="bg-blue-50 p-5 rounded-lg mb-4 border-l-4 border-blue-500">
            <h4 className="text-lg font-bold text-blue-800 mb-2">Scientific Information</h4>
            <p className="mb-2">
              <strong>Scientific Name:</strong> Family Tenebrionidae<br />
              <strong>Tamil Name:</strong> <span className="text-red-600 font-semibold">கருப்பு வண்டு</span> (karuppu vaṇṭu)<br />
              <strong>Habitat in Coimbatore:</strong> These beetles are commonly found in Vadavalli and throughout Coimbatore, typically dwelling under stones, in garden soil, and near decomposing plant matter.
            </p>
          </div>

          <h4 className="text-lg font-bold text-green-800 mb-2">Feeding Habits</h4>
          <p className="mb-2">Darkling beetles are nature's recyclers. They feed on:</p>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Dead and decaying plant material</li>
            <li>Fallen leaves and organic debris</li>
            <li>Fungi and mold</li>
            <li>Occasionally, stored grains (in some species)</li>
          </ul>

          <h4 className="text-lg font-bold text-green-800 mb-2">Life Cycle in Coimbatore's Climate</h4>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li><strong>Adult lifespan:</strong> 2-6 months in the tropical climate of Coimbatore</li>
            <li><strong>Total life cycle:</strong> 3-12 months (egg → larva → pupa → adult)</li>
            <li><strong>Activity:</strong> Primarily nocturnal, especially during the hot months</li>
          </ul>

          <h4 className="text-lg font-bold text-green-800 mb-2">Ecological Importance</h4>
          <p>
            These beetles play a crucial role in Vadavalli's ecosystem by breaking down organic matter and enriching the soil, supporting the growth of coconut trees, mango trees, and other vegetation common in our region.
          </p>
        </section>

        <section id="author" className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">ABOUT THE AUTHOR</h3>
          <p className="mb-4">
            Kumar.A is a tech fanatic, writer and philosopher who finds meaning in the smallest moments of life. Through simple observations of nature and human compassion, he explores themes of mortality, kindness, and the interconnectedness of all living things.
          </p>
          
          <p className="mb-4">
            This story was originally recorded as an audio reflection and transcribed to preserve its authentic, conversational tone—a moment of genuine human emotion captured in its rawest form.
          </p>

          <p className="mb-4">
            I published it in Amazon Kindle as a short story called "The Last Drop of Water, oh no" but inspite of all my best efforts it didnt work well. Folks couldnt read the full book or download it. So i thought of publishing it here as a blog post.
          </p>
        </section>

        <section id="publisher-note" className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">PUBLISHER'S NOTE</h3>
          <p className="mb-4">
            This story was transcribed from an original audio recording using advanced speech recognition technology, preserving the authentic voice and emotional resonance of the original telling. Minor grammatical adjustments were made for readability while maintaining the story's natural flow and personal character.
          </p>
          
          <p className="mb-4">
            The narrative explores universal themes of compassion, mortality, and the human capacity for empathy, making it a meaningful read for anyone who has ever paused to help a creature in need or pondered life's deeper questions.
          </p>
        </section>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
          <p className="font-bold mb-2">Book Details:</p>
          <p className="text-sm text-gray-700 mb-1">Word Count: 487 words | Reading Time: 2-3 minutes | Genre: Memoir, Philosophy, Short Story, Natural History</p>
          <p className="text-sm text-gray-700 mb-1">Themes: Compassion, Mortality, Reflection, Kindness, Ecology</p>
          <p className="text-sm text-gray-700 mb-1">Location: Vadavalli, Coimbatore, Tamil Nadu, India</p>
          <p className="text-sm text-gray-700">Language: English with Tamil names (<span className="text-red-600 font-semibold">கருப்பு வண்டு</span>)</p>
        </div>
      </motion.article>
    </BookPageContainer>
  );
}

export default TheLastDropOfWater;
