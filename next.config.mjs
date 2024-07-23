import Icons from "unplugin-icons/webpack";
import createMdx from "@next/mdx";
import { parse } from "acorn";

import rehypeToc from "@stefanprobst/rehype-extract-toc";
import rehypeExportToc from "@stefanprobst/rehype-extract-toc/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  webpack(config) {
    config.plugins.push(
      Icons({
        compiler: "jsx",
        jsx: "react",
      })
    );

    return config;
  },
};

/** @type {import('unified').Plugin<[Options]>} */
function createNextStaticProps(map) {
  return function transformer(tree) {
    tree.children.push({
      type: "mdxjsEsm",
      data: {
        estree: parse(
          `
          export const getStaticProps = () => ({
            props: ${map},
          })
          `,
          {
            sourceType: "module",
          }
        ),
      },
    });
  };
}

const withMDX = createMdx({
  options: {
    rehypePlugins: [
      rehypeExportToc,
      rehypeToc,
      [
        createNextStaticProps,
        `
        {
          meta,
          tableOfContents,
        }
        `,
      ],
    ],
  },
});

export default withMDX(nextConfig);
