import { cn } from "@/lib/utils";
import { BRAND } from '@/config/appConfig';

interface TappLogoProps {
  className?: string;
  iconClassName?: string;
  variant?: 'default' | 'white';
}

export function TappLogo({ className, iconClassName, variant = 'default' }: TappLogoProps) {
  return (
    <div className={cn(
      "relative flex items-center justify-center overflow-hidden shrink-0 transition-transform active:scale-95",
      variant === 'default' ? "bg-primary" : "bg-white",
      className
    )}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className={cn("w-[70%] h-[70%]", iconClassName)}
        role="img"
        aria-label={`${BRAND.name} logo`}
      >
        {/* Modern Radio-style disc logo representing the brand */}
        <circle 
          cx="50" 
          cy="50" 
          r="40" 
          stroke={variant === 'default' ? "white" : "hsl(var(--primary))"} 
          strokeWidth="8" 
        />
        <circle 
          cx="50" 
          cy="50" 
          r="18" 
          fill={variant === 'default' ? "white" : "hsl(var(--primary))"} 
        />
      </svg>
    </div>
  );
}
