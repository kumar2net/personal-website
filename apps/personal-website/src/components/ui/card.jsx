const baseClass = 'rounded-xl border border-gray-200 bg-white shadow-sm';

const joinClasses = (className) => {
  return [baseClass, className].filter(Boolean).join(' ');
};

export function Card({ className = '', children, ...props }) {
  return (
    <div className={joinClasses(className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className = '', children, ...props }) {
  return (
    <div className={['p-4', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
}
