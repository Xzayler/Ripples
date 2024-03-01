function TrendEntry() {
  return (
    <div class="px-4 py-3 hover:bg-highlightextra ">
      <div class="flex flex-col">
        <div class=" text-faint text-sm  ">1 · Trending</div>
        <div class=" text-foreground text-md font-bold mt-[1px]">#webdev</div>
        <div class="text-faint text-sm mt-1">12.1K posts</div>
      </div>
    </div>
  );
}

export default function Trending() {
  return (
    <div>
      <h2 class=" px-4 py-3 text-foreground text-xl font-extrabold ">
        Trending
      </h2>
      <TrendEntry />
      <TrendEntry />
      <TrendEntry />
      <TrendEntry />
      <TrendEntry />
      <TrendEntry />
    </div>
  );
}
