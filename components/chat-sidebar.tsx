"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Plus, Search, Library, Settings, User, MessageSquare } from "lucide-react"

export function ChatSidebar() {
  const router = useRouter()

  const handleNewChat = () => {
    const chatId = Date.now().toString()
    router.push(`/chat/${chatId}`)
  }

  const recentChats = [
    "Odd sum handling fix",
    "Perfect Sum Issue",
    "NextAuth Redirect Loop Fix",
    "OrderSlice and Cart API",
    "TLE Fix with Memoization",
    "Verification Status Filtering",
  ]

  return (
    <Sidebar className="border-r border-gray-700 bg-gray-800">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">ChatGPT</h2>
          <SidebarTrigger className="text-gray-400 hover:text-white" />
        </div>

        <Button
          onClick={handleNewChat}
          className="w-full justify-start gap-2 bg-gray-700 hover:bg-gray-600 text-white border-gray-600 mt-4"
        >
          <Plus className="h-4 w-4" />
          New chat
        </Button>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start gap-2 text-gray-300 hover:bg-gray-700">
              <Search className="h-4 w-4" />
              Search chats
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start gap-2 text-gray-300 hover:bg-gray-700">
              <Library className="h-4 w-4" />
              Library
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="mt-8">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 px-2">Chats</h3>
          <SidebarMenu>
            {recentChats.map((chat, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton className="w-full justify-start text-sm text-gray-300 hover:bg-gray-700 h-8">
                  <MessageSquare className="h-3 w-3 mr-2 flex-shrink-0" />
                  <span className="truncate">{chat}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-700">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="w-full justify-start gap-2 text-gray-300 hover:bg-gray-700">
                <Settings className="h-4 w-4" />
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton className="w-full justify-start gap-2 text-gray-300 hover:bg-gray-700">
                <User className="h-4 w-4" />
                Upgrade plan
                <span className="ml-auto text-xs bg-yellow-600 px-2 py-1 rounded">Plus</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
