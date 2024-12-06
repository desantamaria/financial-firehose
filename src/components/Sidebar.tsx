"use client";

import { History, Plus, PlusIcon, Zap } from "lucide-react";
import { CodebaseSelectionDialog } from "./NewConversationDialog";

import { useQuery } from "convex/react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { api } from "../../convex/_generated/api";

// Menu items.
const items = [
  {
    title: "Current Conversation",
    url: "#",
    icon: Zap,
  },
  {
    title: "New Conversation",
    url: "#",
    icon: Plus,
  },
  {
    title: "Past Conversations",
    url: "#",
    icon: History,
  },
];

export function AppSidebar() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentNamespace, setCurrentNamespace] = useState("");

  const codebases = useQuery(api.functions.codebases.list);

  const handleNewConversation = () => {
    setIsDialogOpen(true);
  };

  const handleCodebaseSelect = (gitUrl: string) => {
    if (gitUrl) {
      setCurrentNamespace(gitUrl);
      console.log("Selected codebase: ", gitUrl);
    }
    setIsDialogOpen(false);
  };

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4 text-xl font-bold">Financial Analysis</div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* <SidebarMenuItem>
                <SidebarMenuButton onClick={handleNewConversation}>
                  <PlusIcon />
                  <span>New Conversation</span>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <CodebaseSelectionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSelect={handleCodebaseSelect}
      />
    </Sidebar>
  );
}
