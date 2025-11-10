const baseClass =
  'inline-flex items-center rounded-full border border-transparent bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700';

export function Badge({ className = '', children, ...props }) {
  return (
    <span className={[baseClass, className].filter(Boolean).join(' ')} {...props}>
      {children}
    </span>
  );
}
