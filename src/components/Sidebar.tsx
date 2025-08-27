import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  Users, 
  User, 
  UserCheck, 
  Clock, 
  XCircle, 
  ArrowRightLeft, 
  RotateCcw,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  leadCounts: {
    all: number;
    my: number;
    assigned: number;
    nextFollowUp: number;
    closed: number;
    transferredFromSM: number;
    reopened: number;
  };
}



export default function Sidebar({ currentFilter, onFilterChange, leadCounts }: SidebarProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const navigationItems = [
    {
      id: 'all',
      label: t('sidebar.allLeads'),
      icon: Users,
      count: 'all'
    },
    {
      id: 'my',
      label: t('sidebar.myLeads'), 
      icon: User,
      count: 'my'
    },
    {
      id: 'assigned',
      label: t('sidebar.assignedLeads'),
      icon: UserCheck,
      count: 'assigned'
    },
    {
      id: 'nextFollowUp',
      label: t('sidebar.nextFollowUp'),
      icon: Clock,
      count: 'nextFollowUp'
    },
    {
      id: 'closed',
      label: t('sidebar.closedLeads'),
      icon: XCircle,
      count: 'closed'
    },
    {
      id: 'transferredFromSM',
      label: t('sidebar.transferredFromSM'),
      icon: ArrowRightLeft,
      count: 'transferredFromSM'
    },
    {
      id: 'reopened',
      label: t('sidebar.reopenedLeads'),
      icon: RotateCcw,
      count: 'reopened'
    }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Lead Categories</h2>
        <p className="text-sm text-gray-500 mt-1">Filter leads by category</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentFilter === item.id;
            const count = leadCounts[item.count as keyof typeof leadCounts];
            
            return (
              <li key={item.id}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start h-auto p-3 ${
                    isActive 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => {
                    onFilterChange(item.id);
                    setIsOpen(false);
                  }}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={isActive ? "secondary" : "outline"}
                      className={isActive ? "bg-white/20 text-white border-white/30" : ""}
                    >
                      {count}
                    </Badge>
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 md:z-50">
        <div className="bg-white border-r border-gray-200 flex-1 flex flex-col min-h-0">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}