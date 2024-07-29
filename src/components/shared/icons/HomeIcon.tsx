export default function HomeIcon(props: { toFill: boolean }) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      stroke-width="100"
      fill-opacity={props.toFill ? '1' : '0'}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      style="overflow: visible; color: currentcolor;"
      height="100%"
      width="100%"
    >
      <path d="M946.5 505 534.6 93.4a31.93 31.93 0 0 0-45.2 0L77.5 505c-12 12-18.8 28.3-18.8 45.3 0 35.3 28.7 64 64 64h43.4V908c0 17.7 14.3 32 32 32H404V716h242v224h188.9c17.7 0 32-14.3 32-32V614.3h43.4c17 0 33.3-6.7 45.3-18.8 24.9-25 24.9-65.5-.1-90.5z"></path>
    </svg>
  );
}
