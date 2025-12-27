import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  text: string;
}

export function InfoTooltip({ text }: InfoTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help text-muted-foreground hover:text-primary transition-colors ml-1 inline-flex">
          <Info className="w-3.5 h-3.5" />
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-[200px] text-xs">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}
