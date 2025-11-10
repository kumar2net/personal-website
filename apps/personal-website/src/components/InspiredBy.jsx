import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const InspiredBy = ({
  person = "Our Youngest Boy",
  description = "A living example of 'Sharing is Caring'",
  icon = "💝",
  theme = "blue",
  className = ""
}) => {
  const themeClasses = {
    blue: {
      background: "bg-gradient-to-r from-blue-50 to-indigo-50",
      border: "border-blue-200",
      text: "text-blue-800",
      accent: "text-blue-600"
    },
    green: {
      background: "bg-gradient-to-r from-green-50 to-emerald-50",
      border: "border-green-200",
      text: "text-green-800",
      accent: "text-green-600"
    },
    purple: {
      background: "bg-gradient-to-r from-purple-50 to-pink-50",
      border: "border-purple-200",
      text: "text-purple-800",
      accent: "text-purple-600"
    },
    orange: {
      background: "bg-gradient-to-r from-orange-50 to-amber-50",
      border: "border-orange-200",
      text: "text-orange-800",
      accent: "text-orange-600"
    }
  };

  const currentTheme = themeClasses[theme] || themeClasses.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${currentTheme.background} ${currentTheme.border} border rounded-xl p-6 my-8 shadow-sm ${className}`}
    >
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <span className="text-3xl" role="img" aria-label="inspiration">
            {icon}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className={`text-sm font-medium ${currentTheme.accent} uppercase tracking-wide`}>
              Inspired by
            </h3>
            <div className={`h-px flex-1 ${currentTheme.border.replace('border-', 'bg-')}`}></div>
          </div>

          <div className={`${currentTheme.text}`}>
            <p className="font-semibold text-lg mb-1">
              {person}
            </p>
            <p className="text-sm leading-relaxed opacity-90">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Decorative element */}
      <div className="mt-4 flex justify-end">
        <div className={`w-8 h-1 ${currentTheme.border.replace('border-', 'bg-')} rounded-full opacity-30`}></div>
      </div>
    </motion.div>
  );
};

InspiredBy.propTypes = {
  person: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.string,
  theme: PropTypes.oneOf(['blue', 'green', 'purple', 'orange']),
  className: PropTypes.string
};

export default InspiredBy;
