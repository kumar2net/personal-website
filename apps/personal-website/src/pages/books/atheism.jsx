import { Link } from 'react-router-dom';
import BookPageContainer from '../../components/BookPageContainer';

function Atheism() {
  return (
    <BookPageContainer>
      <div className="mb-8">
        <Link
          to="/books"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to Books
        </Link>
        <h1 className="text-4xl font-bold mb-4">
          Atheism: A Wonderful World Without Religion
        </h1>
        <p className="text-gray-600 text-lg mb-2">By Tom Miles</p>
        <p className="text-gray-600 text-sm mb-6">
          A philosophical exploration of atheism and its implications
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
            Philosophy
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            Atheism
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Worldview
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
            Religion
          </span>
        </div>
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <p className="text-yellow-800">
            <strong>Note:</strong> my notes on this book by Tom Miles.
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p className="mb-4">
            Throughout human history religions have been a staggeringly powerful
            force in the hearts and minds of their adherents and in society as a
            whole. It has moved men and women to inspiring acts of bravery and
            spurred the creation of some of the most sublime works of art, and
            arguably has been pivotal in the creation of stable societies and
            the social order we see today. At the same time, though, it has also
            been responsible for some of the most heinous atrocities ever
            committed.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            The Nature of Religious Belief
          </h2>
          <p className="mb-4">
            Through revelation is the greater part of belief conceived, though
            it is also believed that all human beings are capable of
            experiencing the supernatural – all it takes is to "open one's mind"
            to it. As soon as the beliefs world religions have held for
            thousands of years come under scrutiny, though, they begin to show
            their imperfections.
          </p>
          <p className="mb-4">
            Everything that happened was in some way caused by, or a
            manifestation of their will – they became what we today call gods.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Memory and Reality</h2>
          <p className="mb-4">
            When we recall something, we are not actually recalling the event
            itself but the last time we recalled the event.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Science and Religion</h2>
          <p className="mb-4">
            To date, not a single claim of faith healing, paranormal activity,
            or even many of the historical claims made by world religions have
            been stood the test of this undeniably powerful and useful system.
            Even though science has refuted many of the claims of religion, many
            still cling to belief in God by arguing that there is still so much
            we do not know at the periphery of human knowledge.
          </p>
          <p className="mb-4">
            But holding out on belief based on what we do not know is an uneasy
            position. As the known continues to encroach into the unknown, it is
            inevitably not God that we find.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Morality and Evolution
          </h2>
          <p className="mb-4">
            Morality has a simple Darwinian imperative behind it: a species of
            animals that help each other and treat each other better are more
            likely to survive, due to the simple fact that they can better
            weather the difficulties of survival by forming co-operative
            societies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Death and Meaning</h2>
          <p className="mb-4">
            The first approach to dealing with death is purely pragmatic – death
            is inevitable, and we have no indication that there is something
            beyond it, so it is pointless to try to make something up. The
            reason we can know that death is not something to be greatly feared
            is that we have all experienced it before.
          </p>
          <div className="bg-gray-50 border-l-4 border-blue-500 p-4 mb-4">
            <p className="italic text-gray-700">
              As the Greek philosopher Epicurus said: "Death is nothing to us.
              When we exist, death is not; and when death exists, we are not.
              All sensation and consciousness ends with death and therefore in
              death there is neither pleasure nor pain. The fear of death arises
              from the belief that in death, there is awareness."
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Human Connection</h2>
          <p className="mb-4">
            "A stranger is just a friend you haven't met" – the saying seems
            platitudinous and cliché, but it is said so much for a reason. One
            of the greatest delights is to get to know another person so
            completely as to become inextricably linked in their life's story.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">The Beauty of Science</h2>
          <p className="mb-4">
            There is no fable or myth put forward by any religion more beautiful
            and transcendent than that fact: we are literally made of stardust.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">The Future of Atheism</h2>
          <p className="mb-4">
            It is the dream of every atheist to reach a stage in society never
            to have to call themselves such, for it to simply be taken for
            granted that there is no need for a god hypothesis. Religion has
            shown itself time and again to be a severely limiting force in both
            the lives of individuals and in society as a whole.
          </p>
          <p className="mb-4">
            Barring the communist oddity that is China, the societies with the
            highest non-religious populations tend to be those with the highest
            standard of living and median income, while those with the lowest
            are the most religious. It is not entirely clear whether lower
            levels of religiosity create a higher quality of life or if it's the
            other way around, but the simple fact that they correlate makes
            lowering the prevalence of religious faith a worthwhile undertaking.
          </p>
          <p className="mb-4">
            There is so much more to life than blindly following the dictates of
            the past. The profusion of awe and beauty that awaits us when we
            finally shrug it off is well worth the loss of any benefits faith
            ever pretended to offer us. And so, while there is still religion
            there will always be atheists, people who actively work to expose
            the intellectual and moral paucity of this force that belongs firmly
            in the infancy of our species.
          </p>
        </section>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="font-semibold text-blue-800 mb-2">About the Author</h3>
          <p className="text-blue-700 text-sm mb-4">
            Tom Miles is the author of "Atheism: A Wonderful World Without
            Religion," which explores the philosophical foundations and
            practical implications of atheism in modern society.
          </p>
        </div>
      </div>
    </BookPageContainer>
  );
}

export default Atheism;
