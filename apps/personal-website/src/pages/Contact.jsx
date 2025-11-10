import { motion } from 'framer-motion';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if we're on localhost (development) or production
      const isDevelopment = window.location.hostname === 'localhost';

      if (isDevelopment) {
        // For local development, use a simple API or just log the data
        console.log('Development mode - Form data:', formData);

        // Simulate email sending for development
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setSubmitSuccess(true);
        setFormData({ name: '', email: '', message: '' });

        // You can also show the user that this is development mode
        alert(
          'Development Mode: Email would be sent in production. Check console for form data.'
        );
      } else {
        // For production, use Netlify Forms
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            'form-name': 'contact',
            name: formData.name,
            email: formData.email,
            message: formData.message,
          }).toString(),
        });

        if (response.ok) {
          setSubmitSuccess(true);
          setFormData({ name: '', email: '', message: '' });
        } else {
          throw new Error('Form submission failed');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(
        'Failed to send message. Please try again or contact me directly at kumar@yoursite.com'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-8">Contact Me</h1>
      <div className="max-w-2xl mx-auto">
        {submitSuccess ? (
          <div className="bg-green-100 p-6 rounded-lg mb-6 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-green-800 font-semibold text-xl mb-2">
              Message Sent Successfully!
            </h2>
            <p className="text-green-700 mb-4">
              I'll get back to you as soon as possible.
            </p>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            name="contact"
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
          >
            {/* Hidden fields for Netlify Forms */}
            <input type="hidden" name="form-name" value="contact" />
            <input type="hidden" name="bot-field" />

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
      <p className="max-w-2xl mx-auto mt-8 text-sm text-gray-600 italic">
        PS: This is a dummy page. Please send me an email to my Gmail ID or
        WhatsApp me.
      </p>
    </motion.div>
  );
};

export default Contact;
