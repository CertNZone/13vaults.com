import { remToPx } from "@/lib/remToPx";
import useInitialValue from "@/lib/useInitialValue";
import clsx from "clsx";
import { AnimatePresence, useIsPresent, motion } from "framer-motion";
import Link from "next/link";
import { ReactNode, useEffect } from "react";
import { useSectionStore } from "./section-provider";

function NavLink({
  href,
  active = false,
  children,
}: {
  href: string;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={clsx(
        "flex justify-between gap-2 py-1 pr-3 text-sm transition",
        "pl-3",
        "text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white"
      )}
    >
      <span className="truncate">{children}</span>
    </Link>
  );
}

function VisibleSectionHighlight() {
  let [sections, visibleSections] = useInitialValue(
    [
      useSectionStore((s: any) => s.sections),
      useSectionStore((s: any) => s.visibleSections),
    ],
    false
  );

  let isPresent = useIsPresent();
  let firstVisibleSectionIndex = Math.max(
    0,
    [{ id: "_top" }, ...sections].findIndex(
      (section) => section.id === visibleSections[0]
    )
  );
  let itemHeight = remToPx(1.75);
  let height = isPresent
    ? Math.max(1, visibleSections.length) * itemHeight
    : itemHeight;
  let top = 16 + firstVisibleSectionIndex * itemHeight;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 1 }}
      className="hidden xl:block absolute inset-x-1 top-0 bg-black/5 will-change-transform dark:bg-white/5 z-[-1]"
      style={{ borderRadius: 3, height, top }}
    />
  );
}

function NavigationGroup({ section }: any) {
  return (
    <li>
      <NavLink href={`#${section.id}`}>{section.title}</NavLink>
    </li>
  );
}

export default function CompendiumSideNav({
  primaryLabel,
}: {
  primaryLabel: string;
}): JSX.Element | null {
  const sections = useSectionStore((store: any) => store.sections);

  return (
    <motion.div layout="position">
      <AnimatePresence initial={false}>
        <VisibleSectionHighlight />
      </AnimatePresence>
      <p className="font-medium font-display text-xl m-2">{primaryLabel}</p>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.1 } }}
          role="list"
          className="flex flex-col"
        >
          {sections.map((section: any) => (
            <NavigationGroup key={section.id} section={section} />
          ))}
        </motion.ul>
      </AnimatePresence>
    </motion.div>
  );
}
