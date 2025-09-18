import { cn } from '@/lib/utils';

export function Logo({
  className,
  forceDark = false,
}: {
  className?: string;
  forceDark?: boolean;
}) {
  return (
    <>
      <svg
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="40 40 100 100"
        xmlSpace="preserve"
        className={cn('w-24 h-24', forceDark ? 'hidden' : 'dark:hidden', className)}
      >
        <g>
          <path
            fill="#2B2BD6"
            d="M79.2,54c1.9-3,3.9-6,6.7-8.2c2.8-2.2,6.6-3.4,10-2.4c4.8,1.4,7.3,6.5,9.2,11.2c4.6,11.3,8.5,22.8,11.8,34.5 c2.2,7.6-1.8,16.9-11.2,12.2c-4.2-2.1-6.6-6.2-8.6-10.2c-1.5-2.9-2.8-7.7-6.5-8.4c-8.4-1.7-14,13-19,17.4 c-2.7,2.4-7.9,4.1-11.1,1.7c-4.9-3.6-1.5-9.4,0.3-13.6C66.1,76.3,72.4,65,79.2,54z"
          />
          <path
            fill="#A4FCC4"
            d="M102.7,65.9c-1.7,1.4-3.5,2.8-6.1,3.8C83.3,75,77.7,66.2,75.6,55c-0.4-1.8-0.1-4.5,1.7-4.6 c2.2-0.2,3.3,4.4,4.5,5.8c4.8,5.5,12.6-0.6,16.7-4c3.3-2.7,7-5.9,11-7.7c2.5-1.1,7.1-1.9,10-0.8c4.4,1.7,1.4,4.4-0.3,6.3 C114.6,55.5,108.9,60.8,102.7,65.9z"
          />
        </g>
        <text
          transform="matrix(1 0 0 1 20 120)"
          fill="#2B2BD6"
          fontFamily="Outfit, sans-serif"
          fontWeight="bold"
          fontSize="18px"
        >
          AGAINST ME
        </text>
      </svg>
      <svg
        version="1.1"
        id="Capa_1_dark"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="40 40 100 100"
        xmlSpace="preserve"
        className={cn(
          'w-24 h-24',
          forceDark ? 'block' : 'hidden dark:block',
          className
        )}
      >
        <g>
          <path
            fill="#FFFFFF"
            d="M79.2,54c1.9-3,3.9-6,6.7-8.2c2.8-2.2,6.6-3.4,10-2.4c4.8,1.4,7.3,6.5,9.2,11.2c4.6,11.3,8.5,22.8,11.8,34.5 c2.2,7.6-1.8,16.9-11.2,12.2c-4.2-2.1-6.6-6.2-8.6-10.2c-1.5-2.9-2.8-7.7-6.5-8.4c-8.4-1.7-14,13-19,17.4 c-2.7,2.4-7.9,4.1-11.1,1.7c-4.9-3.6-1.5-9.4,0.3-13.6C66.1,76.3,72.4,65,79.2,54z"
          />
          <path
            fill="#A4FCC4"
            d="M102.7,65.9c-1.7,1.4-3.5,2.8-6.1,3.8C83.3,75,77.7,66.2,75.6,55c-0.4-1.8-0.1-4.5,1.7-4.6 c2.2-0.2,3.3,4.4,4.5,5.8c4.8,5.5,12.6-0.6,16.7-4c3.3-2.7,7-5.9,11-7.7c2.5-1.1,7.1-1.9,10-0.8c4.4,1.7,1.4,4.4-0.3,6.3 C114.6,55.5,108.9,60.8,102.7,65.9z"
          />
        </g>
        <text
          transform="matrix(1 0 0 1 20 120)"
          fill="#FFFFFF"
          fontFamily="Outfit, sans-serif"
          fontWeight="bold"
          fontSize="18px"
        >
          AGAINST ME
        </text>
      </svg>
    </>
  );
}
