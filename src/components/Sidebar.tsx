"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { useState } from "react";

export function AppSidebar() {
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = async () => {
    fetch(`/api/py/perform_scrape`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        setIsLoading(false);
      });
  };

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4 text-xl font-bold">Financial Analysis</div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="flex justify-center items-center">
                <Button onClick={handleClick} variant="outline">
                  Scrape News Articles
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
