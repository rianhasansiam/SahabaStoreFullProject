import PropTypes from 'prop-types';

const LoadingPage = ({ type = 'skeleton', fullScreen = false, message = 'Loading...', className = '' }) => {
  // Spinner variant
  if (type === 'spinner') {
    return (
      <div className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : 'min-h-[300px]'} ${className}`}>
        <div className="relative">
          <div className="w-12 h-12 rounded-full absolute border-4 border-gray-300"></div>
          <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-blue-500 border-t-transparent"></div>
        </div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    );
  }

  // Skeleton variant (default)
  return (
    <div className={`animate-pulse ${fullScreen ? 'min-h-screen p-8' : 'p-4'} ${className}`}>
      {/* Header skeleton */}
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
      
      {/* Content area skeleton */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid grid-cols-12 gap-4">
            <div className="h-4 bg-gray-200 rounded col-span-2"></div>
            <div className="h-4 bg-gray-200 rounded col-span-3"></div>
            <div className="h-4 bg-gray-200 rounded col-span-4"></div>
            <div className="h-4 bg-gray-200 rounded col-span-3"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

LoadingPage.propTypes = {
  type: PropTypes.oneOf(['skeleton', 'spinner']),
  fullScreen: PropTypes.bool,
  message: PropTypes.string,
  className: PropTypes.string,
};

export default LoadingPage;