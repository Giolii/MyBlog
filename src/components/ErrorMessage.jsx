const ErrorMessage = ({ message }) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error: {message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
