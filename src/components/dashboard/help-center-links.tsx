import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Package, Warehouse, ArrowDownToLine, Truck, Store } from "lucide-react";
import Link from "next/link";

const guides = [
  {
    title: "Getting Started",
    description: "Learn the basics of using the platform",
    icon: BookOpen,
    href: "/docs/user-guides/getting-started",
  },
  {
    title: "Managing Orders",
    description: "How to create, view, and manage orders",
    icon: Package,
    href: "/docs/user-guides/managing-orders",
  },
  {
    title: "Inventory Management",
    description: "Track and manage your inventory items",
    icon: Warehouse,
    href: "/docs/user-guides/inventory-management",
  },
  {
    title: "Receiving Workflow",
    description: "How to log incoming inventory",
    icon: ArrowDownToLine,
    href: "/docs/user-guides/receiving-workflow",
  },
  {
    title: "Shipping Labels",
    description: "Generate and manage shipping labels",
    icon: Truck,
    href: "/docs/user-guides/shipping-labels",
  },
  {
    title: "Shopify Integration",
    description: "Connect and sync with your Shopify store",
    icon: Store,
    href: "/docs/user-guides/shopify-integration",
  },
];

export function HelpCenterLinks() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {guides.map((guide) => {
        const Icon = guide.icon;
        return (
          <Card key={guide.title} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">{guide.title}</CardTitle>
              </div>
              <CardDescription>{guide.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href={guide.href} target="_blank" rel="noopener noreferrer">
                  View Guide
                </Link>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
