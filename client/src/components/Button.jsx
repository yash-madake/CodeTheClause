const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '' }) => {
  const baseClasses = 'px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
};

export default Button;
