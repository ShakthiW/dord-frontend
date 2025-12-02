"use client";

import { Frame, GalleryVerticalEnd, Map, PieChart } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Standord DORD",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "General",
      url: "#",
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "",
        },
        {
          title: "Analytics",
          url: "analytics",
        },
      ],
    },
    {
      title: "Inventory",
      url: "/inventory",
      isActive: true,
      items: [
        {
          title: "Products",
          url: "/inventory/products",
        },
        {
          title: "Suppliers",
          url: "/inventory/suppliers",
        },
        {
          title: "Categories",
          url: "/inventory/categories",
        },
      ],
    },
    {
      title: "Orders & Fulfillment",
      url: "/orders",
      isActive: true,
      items: [
        {
          title: "Orders",
          url: "/orders",
        },
        {
          title: "Abandoned Carts",
          url: "/abandoned-carts",
        },
        {
          title: "Orders History",
          url: "/orders-history",
        },
        {
          title: "Conversations",
          url: "/conversations",
        },
      ],
    },
    {
      title: "Payments",
      url: "/payments",
      isActive: true,
      items: [
        {
          title: "Pending Payment",
          url: "/payments",
        },
        {
          title: "Verified Payments",
          url: "/payments/verified-payments",
        },
        {
          title: "Refunds/Chargebacks",
          url: "/payments/refunds",
        },
      ],
    },
    {
      title: "Customers",
      url: "/customers",
      isActive: true,
      items: [
        {
          title: "Customer List",
          url: "/customers",
        },
        {
          title: "Segments",
          url: "/customers/segments",
        },
      ],
    },
    {
      title: "Storefront & Channels",
      url: "/storefront",
      isActive: true,
      items: [
        {
          title: "Store Settings",
          url: "/storefront/store-settings",
        },
        {
          title: "Catalogue Design",
          url: "/storefront/catalogue-design",
        },
        {
          title: "Manage Channels",
          url: "/channels",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Agent Settings",
      url: "#",
      icon: Frame,
    },
    {
      name: "AI Sales Insights",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Test Automations",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({
  user,
  tenant,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: { name: string; email: string; avatar: string };
  tenant: { name: string; plan: string; logo: any; slug: string };
}) {
  const baseUrl = `/admin/dashboard/${tenant.slug}`;

  const transformUrl = (url: string) => {
    if (!url) return baseUrl;
    if (url === "#") return url;
    if (url.startsWith("/")) return `${baseUrl}${url}`;
    return `${baseUrl}/${url}`;
  };

  const dynamicData = {
    ...data,
    user: user,
    teams: [
      {
        name: tenant.name,
        logo: GalleryVerticalEnd, // Fallback or use tenant.logo if available and compatible
        plan: tenant.plan,
      },
    ],
    navMain: data.navMain.map((item) => ({
      ...item,
      items: item.items.map((subItem) => ({
        ...subItem,
        url: transformUrl(subItem.url),
      })),
    })),
    projects: data.projects.map((item) => ({
      ...item,
      url: transformUrl(item.url),
    })),
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={dynamicData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={dynamicData.navMain} />
        <NavProjects projects={dynamicData.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={dynamicData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
