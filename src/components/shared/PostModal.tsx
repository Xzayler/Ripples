export default function PostModal() {
  return (
    <div class="fixed left-0 top-0 w-full h-full bg-foreground bg-opacity-80 ">
      <div class="relative top-[5%] bg-background rounded-2xl min-w-[600px] max-h-[90dvh] max-w-[80dvw] p-2">
        <div>
          <button class="text-foreground">X</button>
        </div>
        <form method="post" action="" class=" p-4 ">
          <div>
            <div>
              <div class="h-10 w-10 bg-gray rounded-full"></div>
            </div>
            <textarea
              name="content"
              id=""
              cols="30"
              rows="10"
              placeholder="Write Something"
            ></textarea>
          </div>
          <div>
            <div class="px-4 cursor-pointer bg-accent transition hover:opacity-90 rounded-full text-white font-bold">
              <div class="flex items-center justify-center h-[50px]">
                <span class="text-lg">Post</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
