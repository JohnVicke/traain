import React, { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, Tabs, usePathname, useSegments } from "expo-router";
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

const TAB_BAR_ITEM_WIDTH = 72;
const TAB_BAR_INSET = TAB_BAR_ITEM_WIDTH + 4;

// Include full segment path
const HIDE_ON_SCREENS = ["(auth)/workout/[id]"];

type NavItem = {
  href: string;
  icon: LucideIcon;
  pathname: string;
  name: string;
};

type TabItemProps = NavItem;

function TabItem(props: TabItemProps) {
  const [deg, setDeg] = useState(0);
  const { icon: Icon, href, pathname, name } = props;
  const active = pathname.includes(href);

  useEffect(() => {
    if (active) setDeg(deg + 360);
  }, [active]);

  return (
    <Link href={href} asChild>
      <MotiPressable
        style={{
          width: TAB_BAR_ITEM_WIDTH,
          alignItems: "center",
        }}
      >
        <MotiView
          animate={{ scale: active ? 1.2 : 1, rotateZ: `${deg}deg` }}
          key={`tab-icon-${name}`}
        >
          <Icon className={cn(active ? "text-pink-200" : "text-slate-500")} />
        </MotiView>
      </MotiPressable>
    </Link>
  );
}

type BottomTabBarProps = Parameters<
  Exclude<React.ComponentProps<typeof Tabs>["tabBar"], undefined>
>[0] & { pathname: string };

function TabBar(props: BottomTabBarProps) {
  const { pathname, state } = props;
  const insets = useSafeAreaInsets();

  return (
    <View className="absolute bottom-0 w-full">
      <SafeAreaView
        style={{
          height: insets.bottom + 80,
        }}
        className="relative z-50 flex-row items-center justify-center space-x-4 bg-slate-950 px-4"
      >
        <MotiView
          transition={{
            type: "spring",
            damping: 15,
          }}
          style={{
            bottom: insets.bottom + 8,
          }}
          animate={{
            translateX: TAB_BAR_INSET + state.index * TAB_BAR_ITEM_WIDTH,
          }}
          className="absolute bottom-0 left-2 h-[2px] w-1 rounded-full bg-pink-200"
        />
        {navItems.map((item) => (
          <TabItem key={item.href} {...item} pathname={pathname} />
        ))}
      </SafeAreaView>
    </View>
  );
}

export default function Layout() {
  const pathname = usePathname();
  const segments = useSegments();
  const hidden = HIDE_ON_SCREENS.includes(segments.join("/"));
  return (
    <Tabs
      tabBar={(props) => !hidden && <TabBar {...props} pathname={pathname} />}
      screenOptions={{ headerShown: false }}
      sceneContainerStyle={{ backgroundColor: "#0f172a" }}
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
    name: "History",
    icon: History,
  },
  {
    href: "/workout",
    name: "Workout",
    icon: Dumbbell,
  },
  {
    href: "/statistics",
    name: "Statistics",
    icon: LineChart,
  },
  {
    href: "/settings",
    name: "Settings",
    icon: Cog,
  },
] satisfies Partial<NavItem>[];
