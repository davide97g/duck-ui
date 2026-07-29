import { components, componentsByCategory, guides } from "@/lib/registry-docs";
import { legalNav } from "@/lib/site";

export interface DocRoute {
  href: string;
  title: string;
  summary: string;
}

/** Sidebar groups, in reading order. */
export const sidebarGroups: { title: string; items: DocRoute[] }[] = [
  ...guides.map((section) => ({ title: section.title, items: [...section.items] })),
  ...componentsByCategory.map((group) => ({
    title: group.category,
    items: group.items.map((item) => ({
      href: `/docs/components/${item.slug}`,
      title: item.title,
      summary: item.summary,
    })),
  })),
];

/** Flat order, used by the previous / next pager. */
export const flatRoutes: DocRoute[] = sidebarGroups.flatMap((group) => group.items);

export function getPager(pathname: string) {
  const index = flatRoutes.findIndex((route) => route.href === pathname);
  if (index < 0) return { previous: undefined, next: undefined };
  return {
    previous: index > 0 ? flatRoutes[index - 1] : undefined,
    next: index < flatRoutes.length - 1 ? flatRoutes[index + 1] : undefined,
  };
}

export const allDocRoutes: DocRoute[] = [
  ...guides.flatMap((section) => section.items),
  ...components.map((item) => ({
    href: `/docs/components/${item.slug}`,
    title: item.title,
    summary: item.summary,
  })),
];

/**
 * Every path that resolves to a real page. Some URL segments are grouping-only
 * — /docs/components and /legal have no index page — so breadcrumbs have to
 * check membership here before turning a segment into a link. Structured data
 * pointing at a 404 is worse than a shorter trail.
 */
const realPaths = new Set<string>([
  "/",
  "/create",
  "/docs",
  ...allDocRoutes.map((route) => route.href),
  ...legalNav.map((item) => item.href),
]);

export function routeExists(path: string) {
  return realPaths.has(path);
}
