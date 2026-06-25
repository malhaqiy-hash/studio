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
        className={cn("w-[60%] h-[60%]", iconClassName)}
      >
        <path 
          d="M28 45C28 45 28 62 38 72C42 62 65 28 78 18" 
          stroke={variant === 'default' ? "white" : "#0047BB"} 
          strokeWidth="10" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <path d="M42 82L75 42" stroke={variant === 'default' ? "white" : "#0047BB"} strokeWidth="10" strokeLinecap="round" />
        <path d="M55 88L88 48" stroke={variant === 'default' ? "white" : "#0047BB"} strokeWidth="10" strokeLinecap="round" />
        <path d="M68 94L98 54" stroke={variant === 'default' ? "white" : "#0047BB"} strokeWidth="10" strokeLinecap="round" />
      </svg>
    </div>
  );
}
