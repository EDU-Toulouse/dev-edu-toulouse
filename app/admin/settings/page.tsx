// @/app/admin/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Save,
  RefreshCw,
  AlertTriangle,
  Moon,
  Sun,
  Globe,
  Database,
  BellRing,
  ToggleLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Define settings interface
interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  maintenanceMode: boolean;
  userRegistration: boolean;
  theme: "light" | "dark" | "system";
  language: string;
  analyticsEnabled: boolean;
  emailNotifications: boolean;
  backupFrequency: "daily" | "weekly" | "monthly";
  maxUploadSize: number;
  socialLinks: {
    twitter: string;
    facebook: string;
    instagram: string;
  };
}

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "Gaming Events Platform",
    siteDescription: "A platform for organizing and managing gaming events",
    contactEmail: "contact@gamingevents.com",
    maintenanceMode: false,
    userRegistration: true,
    theme: "system",
    language: "en",
    analyticsEnabled: true,
    emailNotifications: true,
    backupFrequency: "daily",
    maxUploadSize: 5,
    socialLinks: {
      twitter: "https://twitter.com/gamingevents",
      facebook: "https://facebook.com/gamingevents",
      instagram: "https://instagram.com/gamingevents",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Simulate fetching settings from API
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch("/api/settings");
        // const data = await response.json();
        // setSettings(data);

        // Simulating API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Using default settings for now
        setHasChanges(false);
      } catch {
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
    setHasChanges(true);
  };

  const handleSocialLinkChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    platform: keyof SiteSettings["socialLinks"]
  ) => {
    setSettings({
      ...settings,
      socialLinks: {
        ...settings.socialLinks,
        [platform]: e.target.value,
      },
    });
    setHasChanges(true);
  };

  const handleSwitchChange = (checked: boolean, name: keyof SiteSettings) => {
    setSettings({ ...settings, [name]: checked });
    setHasChanges(true);
  };

  const handleSelectChange = (value: string, name: keyof SiteSettings) => {
    setSettings({ ...settings, [name]: value });
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // In a real app, you would send to your API
      // await fetch("/api/settings", {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(settings),
      // });

      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Settings saved successfully");
      setHasChanges(false);
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetSettings = () => {
    // Show confirmation toast with action
    toast("Are you sure you want to reset all settings?", {
      action: {
        label: "Reset",
        onClick: () => {
          // In a real app, you would fetch default settings from API
          setSettings({
            siteName: "Gaming Events Platform",
            siteDescription:
              "A platform for organizing and managing gaming events",
            contactEmail: "contact@gamingevents.com",
            maintenanceMode: false,
            userRegistration: true,
            theme: "system",
            language: "en",
            analyticsEnabled: true,
            emailNotifications: true,
            backupFrequency: "daily",
            maxUploadSize: 5,
            socialLinks: {
              twitter: "https://twitter.com/gamingevents",
              facebook: "https://facebook.com/gamingevents",
              instagram: "https://instagram.com/gamingevents",
            },
          });
          toast.success("Settings reset to defaults");
          setHasChanges(false);
        },
      },
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Configure your application settings
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleResetSettings}
            disabled={isLoading || isSaving}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button
            onClick={handleSaveSettings}
            disabled={!hasChanges || isLoading || isSaving}
          >
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {settings.maintenanceMode && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="flex items-start space-x-4 pt-6">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">
                Maintenance Mode Active
              </h3>
              <p className="text-sm text-amber-700">
                Your site is currently in maintenance mode. Only administrators
                can access the site.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>
                Basic information about your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleInputChange}
                  placeholder="Enter site name"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  name="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleInputChange}
                  placeholder="Enter site description"
                  rows={3}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={handleInputChange}
                  placeholder="Enter contact email"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Connect your social media accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={settings.socialLinks.twitter}
                  onChange={(e) => handleSocialLinkChange(e, "twitter")}
                  placeholder="https://twitter.com/youraccount"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={settings.socialLinks.facebook}
                  onChange={(e) => handleSocialLinkChange(e, "facebook")}
                  placeholder="https://facebook.com/youraccount"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={settings.socialLinks.instagram}
                  onChange={(e) => handleSocialLinkChange(e, "instagram")}
                  placeholder="https://instagram.com/youraccount"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Access Settings</CardTitle>
              <CardDescription>
                Control who can access your site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Put your site in maintenance mode
                  </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, "maintenanceMode")
                  }
                  disabled={isLoading}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="userRegistration">User Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to register
                  </p>
                </div>
                <Switch
                  id="userRegistration"
                  checked={settings.userRegistration}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, "userRegistration")
                  }
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value) => handleSelectChange(value, "theme")}
                  disabled={isLoading}
                >
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center">
                        <Sun className="mr-2 h-4 w-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center">
                        <Moon className="mr-2 h-4 w-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center">
                        <ToggleLeft className="mr-2 h-4 w-4" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) =>
                    handleSelectChange(value, "language")
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">
                      <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4" />
                        English
                      </div>
                    </SelectItem>
                    <SelectItem value="fr">
                      <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4" />
                        French
                      </div>
                    </SelectItem>
                    <SelectItem value="es">
                      <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4" />
                        Spanish
                      </div>
                    </SelectItem>
                    <SelectItem value="de">
                      <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4" />
                        German
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure email notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable email notifications for system events
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, "emailNotifications")
                  }
                  disabled={isLoading}
                />
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Notification Types</h3>
                <div className="space-y-2">
                  {settings.emailNotifications ? (
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="new-user">
                        <AccordionTrigger className="text-sm">
                          New User Registration
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex items-center justify-between py-2">
                            <span className="text-sm">Admin notification</span>
                            <Switch defaultChecked disabled={isLoading} />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <span className="text-sm">
                              Welcome email to user
                            </span>
                            <Switch defaultChecked disabled={isLoading} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="event-reminder">
                        <AccordionTrigger className="text-sm">
                          Event Reminders
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex items-center justify-between py-2">
                            <span className="text-sm">
                              24 hours before event
                            </span>
                            <Switch defaultChecked disabled={isLoading} />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <span className="text-sm">1 hour before event</span>
                            <Switch defaultChecked disabled={isLoading} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <div className="py-4 text-sm text-muted-foreground">
                      Enable email notifications to configure notification types
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>
                Configure browser push notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable browser push notifications
                  </p>
                </div>
                <Switch
                  id="pushNotifications"
                  defaultChecked={true}
                  disabled={isLoading}
                />
              </div>
              <div className="pt-2">
                <Button variant="outline" size="sm">
                  <BellRing className="mr-2 h-4 w-4" />
                  Test Notification
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Settings</CardTitle>
              <CardDescription>
                Configure database backup and maintenance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="backupFrequency">Backup Frequency</Label>
                <Select
                  value={settings.backupFrequency}
                  onValueChange={(value) =>
                    handleSelectChange(value, "backupFrequency")
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger id="backupFrequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">
                      <div className="flex items-center">
                        <Database className="mr-2 h-4 w-4" />
                        Daily
                      </div>
                    </SelectItem>
                    <SelectItem value="weekly">
                      <div className="flex items-center">
                        <Database className="mr-2 h-4 w-4" />
                        Weekly
                      </div>
                    </SelectItem>
                    <SelectItem value="monthly">
                      <div className="flex items-center">
                        <Database className="mr-2 h-4 w-4" />
                        Monthly
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2">
                <Button variant="outline" size="sm">
                  <Database className="mr-2 h-4 w-4" />
                  Backup Now
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security and privacy options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="analyticsEnabled">Analytics Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable analytics to track user behavior
                  </p>
                </div>
                <Switch
                  id="analyticsEnabled"
                  checked={settings.analyticsEnabled}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(checked, "analyticsEnabled")
                  }
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2 pt-4">
                <Label htmlFor="maxUploadSize">Max Upload Size (MB)</Label>
                <Input
                  id="maxUploadSize"
                  name="maxUploadSize"
                  type="number"
                  value={settings.maxUploadSize}
                  onChange={handleInputChange}
                  min={1}
                  max={50}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-red-200 p-4">
                <h3 className="font-medium text-red-600">Reset Application</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  This will reset all application data to default values. All
                  user data, events, and settings will be permanently deleted.
                </p>
                <Button variant="destructive" size="sm">
                  Reset Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Toaster richColors closeButton />
    </div>
  );
};

export default AdminSettingsPage;
