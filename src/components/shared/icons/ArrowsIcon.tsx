type Props = {
  stroke?: string;
  fill?: string;
};

export default function ArrowsIcon({ stroke, fill }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="120 -840 720 720"
    >
      <g class="fill-foreground">
        <path d="M402.232-480 218.848-664 261-706.153 487.153-480 261-253.847 218.848-296l183.384-184Zm253.999 0L472.847-664 515-706.153 741.152-480 515-253.847 472.847-296l183.384-184Z" />
      </g>
    </svg>
  );
}
