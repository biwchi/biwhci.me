import type { MDXComponents } from "mdx/types";

import AppLink from "./components/AppLink";
import Image, { ImageProps } from "next/image";
import Paragraph from "./components/Paragraph";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: (args) => (
      <AppLink
        {...args}
        className="text-text font-semibold hover:underline hover:underline-offset-2"
      >
        {args.children}
      </AppLink>
    ),
    hr: () => <hr className="my-4 border-t opacity-25 border-text-80" />,
    h2: (args) => (
      <h2 className="text-2xl leading-none font-bold mb-4">{args.children}</h2>
    ),
    p: (args) => <Paragraph>{args.children}</Paragraph>,
    img: (args) => (
      <Image
        {...(args as ImageProps)}
        sizes="100vw"
        width={100}
        height={100}
        style={{ width: "100%", height: "auto" }}
        alt={args.alt ?? ""}
        className="my-5"
      />
    ),
    wrapper(props) {
      return <div className="mdx-container mt-8 mb-2">{props.children}</div>;
    },

    ...components,
  };
}
