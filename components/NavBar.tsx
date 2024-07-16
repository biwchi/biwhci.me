import RiHome3Fill from "~icons/ri/home-3-fill";
import RiFolder2Fill from "~icons/ri/folder-2-fill";
import RiBriefcase4Fill from "~icons/ri/briefcase-4-fill";
import RiGithubFill from "~icons/ri/github-fill";
import RiSunFill from "~icons/ri/sun-fill";
import RiMoonFill from "~icons/ri/moon-fill";
import RiTelegram2Fill from "~icons/ri/telegram-2-fill";

import AppLink from "@components/AppLink";

type LinkItem = {
  title?: string;
  path: string;
  icon: React.ReactNode;
};

export default function NavBar() {
  const links: LinkItem[] = [
    { title: "Home", icon: <RiHome3Fill />, path: "/" },
    { title: "Work", icon: <RiBriefcase4Fill />, path: "/work" },
    { title: "Projects", icon: <RiFolder2Fill />, path: "/projects" },
    { icon: <RiGithubFill />, path: "https://github.com/biwchi" },
    { icon: <RiTelegram2Fill />, path: "https://t.me/biwhci" },
  ];

  return (
    <div className="w-full p-10">
      <ul className="flex justify-end space-x-6">
        {links.map((link) => (
          <AppLink key={link.title} to={link.path}>
            <NavBarItem {...link} />
          </AppLink>
        ))}

        <button>
          <NavBarItem icon={<RiSunFill />} />
        </button>
      </ul>
    </div>
  );
}

function NavBarItem(props: Omit<LinkItem, "path">) {
  const { icon, title } = props;

  return (
    <div className="flex gap-1 h-full relative items-center group opacity-70 transition hover:opacity-100">
      <div className="absolute opacity-0 group-hover:opacity-20 w-full transition-opacity h-[calc(100%-1rem)] left-0 top-1/2 -translate-y-1/2 bg-text rounded-full blur-lg -z-10"></div>

      <span className={title ? "" : "text-xl"}>{icon}</span>
      {title}
    </div>
  );
}
