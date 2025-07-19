"use client";

import {
  SidebarHeader,
  SidebarContent as Content,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '../shared/logo';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { BarChart, BrainCircuit, LayoutDashboard, LogOut, Map, Settings } from 'lucide-react';
import { AICorrelator } from './ai-correlator';
import LocationSearch from './location-search';
import { LanguageSwitcher } from '../shared/language-switcher';

export default function SidebarContent() {
  return (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <Logo />
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <Content>
        <SidebarGroup>
          <SidebarGroupLabel>Analysis Tools</SidebarGroupLabel>
          <LocationSearch />
        </SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton href="#" isActive>
              <LayoutDashboard />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#">
              <Map />
              <span>Map Layers</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#">
              <BarChart />
              <span>Reports</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <AICorrelator>
              <SidebarMenuButton>
                <BrainCircuit />
                <span>AI Correlation</span>
              </SidebarMenuButton>
            </AICorrelator>
          </SidebarMenuItem>
        </SidebarMenu>
      </Content>
      <SidebarFooter>
        <div className="flex items-center gap-2">
           <Avatar className="h-8 w-8">
            <AvatarImage src="https://placehold.co/40x40.png" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm group-data-[collapsible=icon]:hidden">
            <span className="font-semibold text-foreground">User Name</span>
            <span className="text-muted-foreground">user@email.com</span>
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <LogOut className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          <LanguageSwitcher/>
        </div>
      </SidebarFooter>
    </>
  );
}
