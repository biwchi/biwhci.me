import type { MDXComponents } from "mdx/types";
import AppLink from "./components/AppLink";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: (args) => <AppLink {...args}>{args.children}</AppLink>,
    ...components,
  };
}
