import { Link } from 'react-router-dom';
import BookCover from '../components/BookCover';
import BooksDataGrid from '../components/BooksDataGrid';
import ContentBadge from '../components/ContentBadge';
import autoBooks from '../data/autoBooks.json';

const TAG_CLASSES = [
  'bg-blue-100 text-blue-800',
  'bg-purple-100 text-purple-800',
  'bg-emerald-100 text-emerald-800',
  'bg-amber-100 text-amber-800',
  'bg-rose-100 text-rose-800',
  'bg-sky-100 text-sky-800',
];

const FALLBACK_GRADIENT = 'from-indigo-100 via-purple-50 to-pink-100';
const CARD_CLASS =
  'group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg shadow hover:shadow-md dark:shadow-slate-900/40 transition-shadow p-3 sm:p-4 flex flex-col';
const SUMMARY_TEXT_CLASS = 'text-gray-600 dark:text-slate-300';
const BUTTON_CLASS =
  'inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-500/90';

function AutoBookCard({ book, index }) {
  const gradient = book?.heroGradient || FALLBACK_GRADIENT;
  const tags = Array.isArray(book?.tags) ? book.tags : [];
  const publishDate = book?.publishDate || 'Recently added';
  const lastModified = book?.lastModified || publishDate;
  const readingTime = book?.readingTime;
  const summary = book?.summary || book?.description;
  const coverImage = book?.coverImage;
  const coverAlt = book?.coverAlt || `${book?.title || 'Book'} cover art`;

  return (
    <Link
      to={`/books/${book.slug}`}
      aria-label={`Read ${book.title}`}
      className={CARD_CLASS}
    >
      <div
        className={`rounded-md h-40 sm:h-48 bg-gradient-to-br ${gradient} border overflow-hidden relative`}
      >
        {coverImage ? (
          <img
            src={coverImage}
            alt={coverAlt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <BookCover
            bookId={book.slug}
            title={book.title}
            author={book.author}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-5 transition-all duration-300"></div>
        <ContentBadge publishDate={publishDate} lastModified={lastModified} />
      </div>
      <div className="mt-3 sm:mt-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-slate-100 group-hover:underline">
            {book.title}
          </h2>
          {readingTime && (
            <span className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
              {readingTime}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          {book.author}
        </p>
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag, tagIndex) => (
              <span
                key={`${book.slug}-tag-${tag}`}
                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                  TAG_CLASSES[(index + tagIndex) % TAG_CLASSES.length]
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {summary && (
          <p className={`${SUMMARY_TEXT_CLASS} mt-3 text-sm sm:text-base`}>
            {summary}
          </p>
        )}
        <div className="mt-4">
          <span className={BUTTON_CLASS}>Read Book</span>
        </div>
      </div>
    </Link>
  );
}

function Books() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold">Books</h1>
        <p className="text-gray-600 dark:text-slate-200 mt-2">
          Reading notes and handbooks
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {autoBooks?.length > 0 &&
          autoBooks.map((book, index) => (
            <AutoBookCard
              key={book?.slug || `${book?.title || 'book'}-${index}`}
              book={book}
              index={index}
            />
          ))}
        <Link
          to="/books/the-last-drop-of-water"
          aria-label="Read The Last Drop of Water, oh no"
          className={CARD_CLASS}
        >
          <div className="rounded-md h-40 sm:h-48 bg-gradient-to-br from-blue-100 to-cyan-100 border overflow-hidden relative">
            <img
              src="/media/darkling-beetle.jpg"
              alt="The Last Drop of Water, oh no by Kumar.A - A darkling beetle"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
            <ContentBadge
              publishDate="October 20, 2025"
              lastModified="October 20, 2025"
            />
          </div>
          <div className="mt-3 sm:mt-4 flex-1 flex flex-col">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-slate-100 group-hover:underline">
              The Last Drop of Water, oh no
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
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
            </div>
            <p className={`${SUMMARY_TEXT_CLASS} mt-3 text-sm sm:text-base`}>
              A profound true story of compassion and reflection. When a dying darkling beetle crosses paths with the author on a Sunday morning in Vadavalli, Coimbatore, a simple act of kindness becomes a meditation on mortality, empathy, and the interconnectedness of all living things.
            </p>
            <div className="mt-4">
              <span className={BUTTON_CLASS}>Read Book</span>
            </div>
          </div>
        </Link>

        <Link
          to="/books/how-to-stop-caring"
          aria-label="Read How to STOP Caring What People Think of You!"
          className={CARD_CLASS}
        >
          <div className="rounded-md h-40 sm:h-48 bg-gradient-to-br from-pink-100 to-purple-100 border overflow-hidden relative">
            <img
              src="/media/how-to-stop-caring-cover.png"
              alt="How to STOP Caring What People Think of You! by Russell Jamieson"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
            <ContentBadge
              publishDate="January 16, 2025"
              lastModified="January 16, 2025"
            />
          </div>
          <div className="mt-3 sm:mt-4 flex-1 flex flex-col">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-slate-100 group-hover:underline">
              How to STOP Caring What People Think of You!
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <img
                loading="lazy"
                decoding="async"
                src="https://img.shields.io/badge/Self--Help-Personal%20Development-purple"
                alt="Self-Help badge"
              />
              <img
                loading="lazy"
                decoding="async"
                src="https://img.shields.io/badge/Confidence-Authenticity-green"
                alt="Confidence badge"
              />
              <img
                loading="lazy"
                decoding="async"
                src="https://img.shields.io/badge/Psychology-Mindset-orange"
                alt="Psychology badge"
              />
            </div>
            <p className={`${SUMMARY_TEXT_CLASS} mt-3 text-sm sm:text-base`}>
              A concise guide to breaking free from others' opinions and living authentically. Jamieson provides practical strategies for developing self-confidence and embracing your true self.
            </p>
            <div className="mt-4">
              <span className={BUTTON_CLASS}>Read Book</span>
            </div>
          </div>
        </Link>

        <Link
          to="/books/its-not-about-you"
          aria-label="Read It's Not About You: A Brief Guide to a Meaningful Life"
          className={CARD_CLASS}
        >
          <div className="rounded-md h-40 sm:h-48 bg-gradient-to-br from-teal-100 to-cyan-100 border overflow-hidden relative">
            <BookCover
              bookId="its-not-about-you"
              title="It's Not About You: A Brief Guide to a Meaningful Life"
              author="Tom Rath"
              className="w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
            <ContentBadge
              publishDate="September 13, 2025"
              lastModified="September 13, 2025"
            />
          </div>
          <div className="mt-3 sm:mt-4 flex-1 flex flex-col">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-slate-100 group-hover:underline">
              It's Not About You: A Brief Guide to a Meaningful Life
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <img
                loading="lazy"
                decoding="async"
                src="https://img.shields.io/badge/Self--Help-Personal%20Development-purple"
                alt="Self-Help badge"
              />
              <img
                loading="lazy"
                decoding="async"
                src="https://img.shields.io/badge/Philosophy-Meaning%20%26%20Purpose-blue"
                alt="Philosophy badge"
              />
              <img
                loading="lazy"
                decoding="async"
                src="https://img.shields.io/badge/Service-Contributing%20to%20Others-green"
                alt="Service badge"
              />
            </div>
            <p className={`${SUMMARY_TEXT_CLASS} mt-3 text-sm sm:text-base`}>
              A powerful guide on finding meaning through service to others rather than self-focused pursuits. Rath shares personal insights about living with a rare genetic condition while emphasizing how our contributions to others create lasting impact.
            </p>
            <div className="mt-4">
              <span className={BUTTON_CLASS}>Read Book</span>
            </div>
          </div>
        </Link>

        <Link
          to="/books/the-subtle-art"
          aria-label="Read The Subtle Art of Not Giving a F***"
          className={CARD_CLASS}
        >
          <div className="rounded-md h-40 sm:h-48 bg-gradient-to-br from-orange-100 to-red-100 border overflow-hidden relative">
            <BookCover
              bookId="the-subtle-art"
              title="The Subtle Art of Not Giving a F***"
              author="Mark Manson"
              className="w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
            <ContentBadge
              publishDate="January 16, 2025"
              lastModified="January 16, 2025"
            />
          </div>
          <div className="mt-3 sm:mt-4 flex-1 flex flex-col">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-slate-100 group-hover:underline">
              The Subtle Art of Not Giving a F***
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <img
                loading="lazy"
                decoding="async"
                src="https://img.shields.io/badge/Self--Help-Personal%20Development-green"
                alt="Self-help badge"
              />
              <img
                loading="lazy"
                decoding="async"
                src="https://img.shields.io/badge/Philosophy-Counterintuitive-blue"
                alt="Philosophy badge"
              />
            </div>
            <p className={`${SUMMARY_TEXT_CLASS} mt-3 text-sm sm:text-base`}>
              A generation-defining self-help guide that cuts through the crap to show us how to stop trying to be 'positive' all the time so that we can truly become better, happier people.
            </p>
            <div className="mt-4">
              <span className={BUTTON_CLASS}>Read Book</span>
            </div>
          </div>
        </Link>

        <Link
          to="/books/the-stoic-art-manual"
          aria-label="Read The Stoic Art Manual"
          className={CARD_CLASS}
        >
          <div className="rounded-md h-40 sm:h-48 bg-gradient-to-br from-yellow-100 to-amber-100 border overflow-hidden relative">
            <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <div className="text-center">
                <div className="text-6xl mb-2">📜</div>
                <div className="text-sm text-gray-600 dark:text-slate-300">Stoicism</div>
              </div>
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
            <ContentBadge
              publishDate={new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
              lastModified={new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            />
          </div>
          <div className="mt-3 sm:mt-4 flex-1 flex flex-col">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-slate-100 group-hover:underline">
              The Stoic Art of Living
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <img
                loading="lazy"
                decoding="async"
                src="https://img.shields.io/badge/Philosophy-Stoicism-brown"
                alt="Stoicism badge"
              />
              <img
                loading="lazy"
                decoding="async"
                src="https://img.shields.io/badge/Notes-Verbatim-blue"
                alt="Notes badge"
              />
            </div>
            <p className={`${SUMMARY_TEXT_CLASS} mt-3 text-sm sm:text-base`}>
              Your verbatim notes converted from PDF.
            </p>
            <div className="mt-4">
              <span className={BUTTON_CLASS}>Read Book</span>
            </div>
          </div>
        </Link>
        <Link
          to="/books/atheism"
          aria-label="Read Atheism: A Wonderful World Without Religion"
          className={CARD_CLASS}
        >
          <div className="rounded-md h-40 sm:h-48 bg-gradient-to-br from-red-100 to-orange-100 border overflow-hidden relative">
            <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <div className="text-center">
                <div className="text-6xl mb-2">🤔</div>
                <div className="text-sm text-gray-600 dark:text-slate-300">Philosophy</div>
              </div>
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
            <ContentBadge
              publishDate="July 15, 2025"
              lastModified="July 15, 2025"
            />
          </div>
          <div className="mt-3 sm:mt-4 flex-1 flex flex-col">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-slate-100 group-hover:underline">
              Atheism: A Wonderful World Without Religion
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <img
                loading="lazy"
                decoding="async"
                src="https://img.shields.io/badge/Philosophy-Atheism-purple"
                alt="Philosophy badge"
              />
              <img
                loading="lazy"
                decoding="async"
                src="https://img.shields.io/badge/Worldview-Secular-orange"
                alt="Worldview badge"
              />
            </div>
            <p className={`${SUMMARY_TEXT_CLASS} mt-3 text-sm sm:text-base`}>
              A comprehensive exploration of atheism, its philosophical
              foundations, and its implications for understanding the world and
              human existence.
            </p>
            <div className="mt-4">
              <span className={BUTTON_CLASS}>Read Book</span>
            </div>
          </div>
        </Link>

        <Link
          to="/books/the-brain-story"
          aria-label="Read The Brain: The Story of You"
          className={CARD_CLASS}
        >
          <div className="rounded-md h-40 sm:h-48 bg-gradient-to-br from-purple-100 to-blue-100 border overflow-hidden relative">
            <BookCover
              bookId="the-brain-story"
              title="The Brain: The Story of You"
              author="David Eagleman"
              className="w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
            <ContentBadge
              publishDate="July 10, 2025"
              lastModified="July 12, 2025"
            />
          </div>
          <div className="mt-3 sm:mt-4 flex-1 flex flex-col">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-slate-100 group-hover:underline">
              The Brain: The Story of You
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <img
                loading="lazy"
                decoding="async"
                src="https://img.shields.io/badge/Neuroscience-Brain%20Science-purple"
                alt="Neuroscience badge"
              />
              <img
                loading="lazy"
                decoding="async"
                src="https://img.shields.io/badge/AI%20%26%20Technology-Neural%20Implants-orange"
                alt="AI Technology badge"
              />
            </div>
            <p className={`${SUMMARY_TEXT_CLASS} mt-3 text-sm sm:text-base`}>
              One of the best books I have read in a while. Observing all the
              advances in AI and listening to gyan from my kin on neurology
              brain implants, wanted to dig deeper. As they say these days -
              learn from First Principles
            </p>
            <div className="mt-4">
              <span className={BUTTON_CLASS}>Read Book</span>
            </div>
          </div>
        </Link>

        <Link
          to="/books/applying-cornell-method"
          aria-label="Read Applying the Cornell Method"
          className={CARD_CLASS}
        >
          <div className="rounded-md h-40 sm:h-48 bg-gradient-to-br from-green-100 to-blue-100 border overflow-hidden relative">
            <BookCover
              bookId="cornell-method"
              title="Applying the Cornell Method"
              author="Study Method Guide"
              className="w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
            <ContentBadge
              publishDate="June 20, 2025"
              lastModified="June 20, 2025"
            />
          </div>
          <div className="mt-3 sm:mt-4 flex-1 flex flex-col">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-slate-100 group-hover:underline">
              Applying the Cornell Method
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <img
                loading="lazy"
                decoding="async"
                src="https://img.shields.io/badge/Note--Taking-Cornell%20Method-blue"
                alt="Cornell Method badge"
              />
              <img
                loading="lazy"
                decoding="async"
                src="https://img.shields.io/badge/Study%20Skills-Productivity-green"
                alt="Study skills badge"
              />
            </div>
            <p className={`${SUMMARY_TEXT_CLASS} mt-3 text-sm sm:text-base`}>
              Verbatim content embedded from the original document.
            </p>
            <div className="mt-4">
              <span className={BUTTON_CLASS}>Read more</span>
            </div>
          </div>
        </Link>
      </section>

      <section>
        <BooksDataGrid books={autoBooks} />
      </section>
    </div>
  );
}

export default Books;
