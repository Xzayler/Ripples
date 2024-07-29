import { action, redirect } from '@solidjs/router';
import { RouterResponseInit } from '@solidjs/router/dist/data/response';

export default function SearchBar() {
  const resp: RouterResponseInit = { revalidate: 'true' };

  // const [searchType, setSearchType]

  return (
    <form
      method="post"
      action={action(async (formData: FormData) => {
        'use server';
        return redirect(
          `/search?searchType=${formData.get('searchType')}&q=${formData.get(
            'searchQuery',
          )}`,
        );
      }, 'search')}
      class="flex bg-background mb-3 w-full sticky top-0 h-[53px] items-center "
    >
      <div class="flex h-11 w-full bg-highlight rounded-full outline-[3px] outline-accent/60 focus-within:outline ">
        <select
          name="searchType"
          id="type"
          class="appearance-none outline-none cursor-pointer bg-highlightextra pl-3 pr-1 rounded-l-full text-foreground"
        >
          <option value="hashtag"># :</option>
          <option value="user">@ :</option>
        </select>
        <input
          type="search"
          name="searchQuery"
          class="h-11 w-full bg-highlight outline-none"
        />
        <button
          type="submit"
          class="hover:bg-highlightextra pl-2 pr-3 rounded-r-full "
        >
          O
        </button>
      </div>
    </form>
  );
}
