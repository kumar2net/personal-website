const baseClass =
  "rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100";

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
    <div className={['p-4 leading-relaxed text-inherit', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
}
