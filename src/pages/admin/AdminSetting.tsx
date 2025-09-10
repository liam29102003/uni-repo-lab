import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Mail, Shield, Key, Globe } from "lucide-react";

const AdminSetting = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure platform settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5" />
              <h3 className="text-lg font-semibold">General Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Platform Name</label>
                <Input
                  defaultValue="Academic Collaboration Platform"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Default Language</label>
                <Input defaultValue="English" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Time Zone</label>
                <Input defaultValue="UTC" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Support Email</label>
                <Input defaultValue="support@platform.edu" className="mt-1" />
              </div>
              <Button className="mt-4">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Security Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Password Requirements
                </label>
                <Input
                  defaultValue="Minimum 8 characters, 1 uppercase, 1 number"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Session Timeout (minutes)
                </label>
                <Input defaultValue="60" type="number" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Max Login Attempts
                </label>
                <Input defaultValue="5" type="number" className="mt-1" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="two-factor" defaultChecked />
                <label htmlFor="two-factor" className="text-sm font-medium">
                  Require Two-Factor Authentication
                </label>
              </div>
              <Button className="mt-4">
                <Save className="w-4 h-4 mr-2" />
                Save Security Settings
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Mail className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Notification Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">SMTP Server</label>
                <Input defaultValue="smtp.platform.edu" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">SMTP Port</label>
                <Input defaultValue="587" type="number" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">From Email</label>
                <Input defaultValue="noreply@platform.edu" className="mt-1" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="registration-emails"
                    defaultChecked
                  />
                  <label htmlFor="registration-emails" className="text-sm">
                    Send registration confirmation emails
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="project-notifications"
                    defaultChecked
                  />
                  <label htmlFor="project-notifications" className="text-sm">
                    Send project update notifications
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="admin-alerts" defaultChecked />
                  <label htmlFor="admin-alerts" className="text-sm">
                    Send admin alerts
                  </label>
                </div>
              </div>
              <Button className="mt-4">
                <Save className="w-4 h-4 mr-2" />
                Save Notification Settings
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Key className="w-5 h-5" />
              <h3 className="text-lg font-semibold">API Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  API Rate Limit (requests/hour)
                </label>
                <Input defaultValue="1000" type="number" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">API Version</label>
                <Input defaultValue="v1" className="mt-1" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="api-logging" defaultChecked />
                <label htmlFor="api-logging" className="text-sm font-medium">
                  Enable API Request Logging
                </label>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">API Keys</h4>
                <div className="bg-accent/20 p-3 rounded border">
                  <code className="text-sm">prod_key_12345...</code>
                  <Button variant="outline" size="sm" className="ml-2">
                    Revoke
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  Generate New API Key
                </Button>
              </div>
              <Button className="mt-4">
                <Save className="w-4 h-4 mr-2" />
                Save API Settings
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSetting;
