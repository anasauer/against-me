import { cn } from '@/lib/utils';

export function Logo({
  className,
  forceDark = false,
}: {
  className?: string;
  forceDark?: boolean;
}) {
  const lightLogo = (
    <svg
      viewBox="0 0 164 120"
      className={cn('w-24 h-auto', forceDark ? 'hidden' : 'dark:hidden', className)}
      aria-hidden="true"
    >
      <path
        d="M62.6154 58.3846L36 85L27.6923 72.3077L46.1538 53.8462L27.6923 35.3846L36 27.6923L62.6154 54.3077C63.5321 55.2244 64 56.4615 64 57.6923C64 58.9231 63.5321 60.1603 62.6154 60.8462"
        fill="#2B2BD6"
      />
      <path
        d="M72 0L116 85H96L72 45L48 85H28L72 0Z"
        fill="#2B2BD6"
      />
      <path
        d="M102 36L129 0L137 9L116 36H102Z"
        fill="#A4FCC4"
      />
      <path
        d="M116 36L164 11L155 45L116 36Z"
        fill="#A4FCC4"
      />
      <text
        x="50%"
        y="110"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#2B2BD6"
        fontFamily="monospace"
        fontSize="24"
        fontWeight="bold"
      >
        AGAINST ME
      </text>
    </svg>
  );

  const darkLogo = (
    <svg
      viewBox="0 0 164 120"
      className={cn('w-24 h-auto', forceDark ? 'block' : 'hidden dark:block', className)}
      aria-hidden="true"
    >
       <path
        d="M72 0L116 85H96L72 45L48 85H28L72 0Z"
        fill="white"
      />
      <path
        d="M102 36L129 0L137 9L116 36H102Z"
        fill="#A4FCC4"
      />
      <path
        d="M116 36L164 11L155 45L116 36Z"
        fill="#A4FCC4"
      />
      <text
        x="50%"
        y="110"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="white"
        fontFamily="monospace"
        fontSize="24"
        fontWeight="bold"
      >
        AGAINST ME
      </text>
    </svg>
  );

  return (
    <>
      {lightLogo}
      {darkLogo}
    </>
  );
}
