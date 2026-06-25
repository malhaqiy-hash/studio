import { cn } from "@/lib/utils";

interface TappLogoProps {
  className?: string;
  iconClassName?: string;
  variant?: 'default' | 'white';
}

export function TappLogo({ className, iconClassName, variant = 'default' }: TappLogoProps) {
  return (
    <div className={cn(
      "relative flex items-center justify-center overflow-hidden shrink-0",
      variant === 'default' ? "bg-[#0047BB]" : "bg-white",
      className
    )}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className={cn("w-[65%] h-[65%]", iconClassName)}
      >
        {/* A modern, geometric T that doubles as a verification checkmark */}
        <path 
          d="M20 40H80M50 40V75C50 75 50 85 65 85H80" 
          stroke={variant === 'default' ? "white" : "#0047BB"} 
          strokeWidth="14" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        {/* Accent dot symbolizing 'Tap' or connection point */}
        <circle 
          cx="80" 
          cy="40" 
          r="8" 
          fill={variant === 'default' ? "white" : "#0047BB"} 
        />
      </svg>
    </div>
  );
}
