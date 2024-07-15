import Link from "next/link";
import { AnchorHTMLAttributes } from "react";

type Props = {
  to?: string;
  children: React.ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export default function AppLink({ to, children, href, ...props }: Props) {
  const link = to ?? href;
  const isExternal = link?.startsWith("http");

  if (!link) {
    return;
  }

  if (isExternal) {
    return (
      <a target="_blank" href={link} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={link} {...props}>
      {children}
    </Link>
  );
}
