
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CustomProgressProps extends React.ComponentProps<typeof Progress> {
  indicatorClassName?: string;
}

export function CustomProgress({ 
  className, 
  indicatorClassName,
  ...props 
}: CustomProgressProps) {
  return (
    <Progress 
      className={cn("bg-accent h-2 rounded-full", className)} 
      indicatorClassName={cn("gradient-bg rounded-full transition-all duration-500", indicatorClassName)}
      {...props} 
    />
  );
}
