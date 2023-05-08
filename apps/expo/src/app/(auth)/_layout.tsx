import React from "react";
import { Link, Tabs, usePathname } from "expo-router";
import {
  Cog,
  Dumbbell,
  History,
  LineChart,
  type LucideIcon,
} from "lucide-react-native";
import { MotiView } from "moti";
import { MotiPressable } from "moti/interactions";

import { cn } from "~/utils/cn";

const TAB_BAR_ITEM_WIDTH = 64;

type NavItem = {
  href: string;
  icon: LucideIcon;
  pathname: string;
};

type TabItemProps = NavItem;

function TabItem(props: TabItemProps) {
  const { icon: Icon, href, pathname } = props;
  const active = pathname.includes(href);
  return (
    <Link href={href} asChild>
      <MotiPressable style={{ width: TAB_BAR_ITEM_WIDTH }}>
        <Icon className={cn(active ? "text-pink-200" : "text-slate-500")} />
      </MotiPressable>
    </Link>
  );
}

type BottomTabBarProps = Parameters<
  Exclude<React.ComponentProps<typeof Tabs>["tabBar"], undefined>
>[0] & { pathname: string };

function TabBar(props: BottomTabBarProps) {
  const { pathname, state } = props;
  return (
    <MotiView className="relative flex-row space-x-4 bg-slate-900 px-4 py-6">
      <MotiView
        animate={{ translateX: state.index * TAB_BAR_ITEM_WIDTH }}
        className="absolute left-2 top-0 h-[2px] w-8 rounded-full bg-pink-200"
      />
      {navItems.map((item) => (
        <TabItem key={item.href} {...item} pathname={pathname} />
      ))}
    </MotiView>
  );
}

export default function Layout() {
  const pathname = usePathname();
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} pathname={pathname} />}
      screenOptions={{ headerShown: false }}
    >
      {navItems.map(({ href }) => (
        <Tabs.Screen key={`tab-scren-${href}`} name={href.slice(1)} />
      ))}
    </Tabs>
  );
}

const navItems = [
  {
    href: "/history",
    icon: History,
  },
  {
    href: "/workout",
    icon: Dumbbell,
  },
  {
    href: "/statistics",
    icon: LineChart,
  },
  {
    href: "/settings",
    icon: Cog,
  },
] satisfies Partial<NavItem>[];
