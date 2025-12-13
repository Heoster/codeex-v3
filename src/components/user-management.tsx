'use client';

import { useState } from 'react';
import { User, Settings, HelpCircle, FileText, Shield, Mail, ExternalLink, Download, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { getPWAStatus, showPWAInstallPrompt } from '@/lib/pwa-utils';

interface MenuItem {
  icon: LucideIcon;
  title: string;
  description: string;
  badge: string | null;
  href?: string;
  action?: string | null;
}

interface UserManagementProps {
  onClose?: () => void;
}

export function UserManagement({ onClose }: UserManagementProps) {
  const { user, signOut } = useAuth();
  const [pwaStatus] = useState(getPWAStatus());

  const handleInstallPWA = async () => {
    const installed = await showPWAInstallPrompt();
    if (installed) {
      // Refresh PWA status after installation
      window.location.reload();
    }
  };

  const menuItems: Array<{category: string; items: MenuItem[]}> = [
    {
      category: 'Account',
      items: [
        {
          icon: User,
          title: 'Profile Settings',
          description: 'Manage your account information',
          href: '/profile',
          badge: user ? 'Signed In' : 'Guest'
        },
        {
          icon: Settings,
          title: 'App Settings',
          description: 'Customize your AI experience',
          action: 'settings',
          badge: null
        }
      ]
    },
    {
      category: 'Help & Support',
      items: [
        {
          icon: HelpCircle,
          title: 'FAQ',
          description: 'Frequently asked questions',
          href: '/faq',
          badge: 'New'
        },
        {
          icon: FileText,
          title: 'Documentation',
          description: 'Complete user guide and API docs',
          href: '/documentation',
          badge: null
        },
        {
          icon: Mail,
          title: 'Contact Support',
          description: 'Get help from our team',
          href: '/contact',
          badge: null
        }
      ]
    },
    {
      category: 'Legal & Privacy',
      items: [
        {
          icon: Shield,
          title: 'Privacy Policy',
          description: 'How we protect your data',
          href: '/privacy',
          badge: null
        },
        {
          icon: FileText,
          title: 'Terms of Service',
          description: 'Terms and conditions',
          href: '/terms',
          badge: null
        }
      ]
    },
    {
      category: 'App Features',
      items: [
        {
          icon: Download,
          title: 'Install as App',
          description: pwaStatus.isInstalled 
            ? 'Already installed as PWA' 
            : 'Install CODEEX AI on your device',
          action: pwaStatus.isInstalled ? null : 'install-pwa',
          badge: pwaStatus.isInstalled ? 'Installed' : 'Available'
        },
        {
          icon: ExternalLink,
          title: 'Features Overview',
          description: 'Learn about all AI capabilities',
          href: '/features',
          badge: null
        }
      ]
    }
  ];

  const handleAction = (action: string) => {
    switch (action) {
      case 'settings':
        // Open settings dialog (you'll need to implement this)
        console.log('Open settings dialog');
        break;
      case 'install-pwa':
        handleInstallPWA();
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Account & Settings</h2>
        <p className="text-muted-foreground">
          Manage your CODEEX AI experience
        </p>
      </div>

      {/* User Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  {user ? user.displayName || user.email : 'Guest User'}
                </CardTitle>
                <CardDescription>
                  {user ? user.email : 'Using CODEEX AI without an account'}
                </CardDescription>
              </div>
            </div>
            <Badge variant={user ? 'default' : 'secondary'}>
              {user ? 'Registered' : 'Guest'}
            </Badge>
          </div>
        </CardHeader>
        {!user && (
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create an account to save your conversations and access additional features.
            </p>
            <div className="flex gap-2">
              <Button size="sm" asChild>
                <a href="/login">Sign In</a>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href="/register">Create Account</a>
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Menu Categories */}
      {menuItems.map((category, categoryIndex) => (
        <div key={categoryIndex}>
          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
            {category.category}
          </h3>
          <div className="space-y-2">
            {category.items.map((item, itemIndex) => (
              <Card key={itemIndex} className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <Badge 
                          variant={
                            item.badge === 'New' ? 'default' :
                            item.badge === 'Installed' ? 'secondary' :
                            item.badge === 'Available' ? 'outline' :
                            'secondary'
                          }
                          className="text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {item.href ? (
                        <Button size="sm" variant="ghost" asChild>
                          <a href={item.href}>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      ) : item.action ? (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleAction(item.action!)}
                          disabled={item.action === 'install-pwa' && pwaStatus.isInstalled}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {categoryIndex < menuItems.length - 1 && <Separator className="my-6" />}
        </div>
      ))}

      {/* Sign Out */}
      {user && (
        <>
          <Separator />
          <div className="flex justify-center">
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </>
      )}

      {/* Close Button */}
      {onClose && (
        <div className="flex justify-center pt-4">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      )}
    </div>
  );
}