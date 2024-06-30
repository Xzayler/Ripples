// Processing of post content like images, links and hastags.

export function processPost(content: string) {
  // Regexes
  const hashtagReg = /#\w+/g;

  let hashtags: string[] = [];
  for (const match of content.matchAll(hashtagReg)) {
    hashtags.push(match[0].slice(1));
  }
  console.log(hashtags);
  return { hashtags };
}
