import { cn } from '@/lib/utils';

export function SidebarLogo({
  className,
}: {
  className?: string;
  forceDark?: boolean;
}) {
  return (
    <svg
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 180 178"
      xmlSpace="preserve"
      className={cn('w-24 h-auto', className)}
    >
      <g>
        <path
          fill="hsl(var(--sidebar-foreground))"
          d="M79.4,54.5c1.9-3,3.9-6,6.7-8.2c2.8-2.2,6.6-3.4,10-2.4c4.8,1.4,7.3,6.5,9.2,11.2c4.6,11.3,8.5,22.8,11.8,34.5 c2.2,7.6-1.8,16.9-11.2,12.2c-4.2-2.1-6.6-6.2-8.6-10.2c-1.5-2.9-2.8-7.7-6.5-8.4c-8.4-1.7-14,13-19,17.4 c-2.7,2.4-7.9,4.1-11.1,1.7c-4.9-3.6-1.5-9.4,0.3-13.6C66.3,76.7,72.6,65.4,79.4,54.5z"
        />
        <path
          fill="hsl(var(--sidebar-primary))"
          d="M102.9,80.3c-1.7,1.4-3.5,2.8-6.1,3.8c-13.3,5.3-18.9-3.5-21.1-14.6c-0.4-1.8-0.1-4.5,1.7-4.6 c2.2-0.2,3.3,4.4,4.5,5.8c4.8,5.5,12.6-0.6,16.7-4c3.3-2.7,7-5.9,11-7.7c2.5-1.1,7.1-1.9,10-0.8c4.4,1.7,1.4,4.4-0.3,6.3 C114.8,69.9,109.1,75.2,102.9,80.3z"
        />
      </g>
    </svg>
  );
}
