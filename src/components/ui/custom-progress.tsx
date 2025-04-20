
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
      className={cn("bg-blue-100", className)} 
      indicatorClassName={cn("bg-indigo-600", indicatorClassName)}
      {...props} 
    />
  );
}
