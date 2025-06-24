// src/components/common/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingSpinner = ({
  size = "md",
  className = "",
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin`}
        style={{
          borderWidth: size === "sm" ? "2px" : size === "md" ? "3px" : "4px",
        }}
      />
    </div>
  );
};

export default LoadingSpinner;
