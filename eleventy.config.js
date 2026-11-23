// Eleventy build for amarrazzaq.com
//   src/     pages and articles (templates), plus shared layout and data
//   public/  files copied unchanged to the same address on the site
//   _site/   build output (never edit; deployed by GitHub Actions)

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ public: '/' });

  // Copy public/ into _site/ during preview too, so the preview serves exactly what is deployed.
  eleventyConfig.setServerPassthroughCopyBehavior('copy');
  eleventyConfig.addWatchTarget('public/');
}

export const config = {
  dir: {
    input: 'src',
    includes: '_includes',
    data: '_data',
    output: '_site',
  },
  templateFormats: ['njk', 'md'],
  htmlTemplateEngine: 'njk',
  markdownTemplateEngine: 'njk',
};
