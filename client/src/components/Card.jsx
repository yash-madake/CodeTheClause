const Card = ({ children, className = '' }) => {
  const classes = `bg-white shadow-md rounded-lg p-6 ${className}`;

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Card;
