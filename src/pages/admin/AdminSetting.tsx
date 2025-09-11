import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Mail, Shield, Key, Globe } from "lucide-react";
import { useState, useEffect } from "react";

const AdminSetting = () => {
  const [settings, setSettings] = useState(null);
  const Settingapi = "http://127.0.0.1:8100";

  // Fetch settings on mount
  useEffect(() => {
    fetch(Settingapi + "/admin/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((err) => console.error("Failed to fetch settings:", err));
  }, []);

  // Save function for each section
  const saveSettings = (section) => {
    fetch(Settingapi + "/admin/settings/" + section, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings[section]),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(section + " settings updated!");
      })
      .catch((err) => console.error("Failed to save:", err));
  };

  if (!settings) {
    return <p>Loading settings...</p>;
  }

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

        {/* General Settings */}
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
                  value={settings.general["Platform Name"]}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: {
                        ...settings.general,
                        ["Platform Name"]: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Default Language</label>
                <Input
                  value={settings.general.language}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: {
                        ...settings.general,
                        language: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Time Zone</label>
                <Input
                  value={settings.general.time_zone}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: {
                        ...settings.general,
                        time_zone: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Support Email</label>
                <Input
                  value={settings.general.support_email}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: {
                        ...settings.general,
                        support_email: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <Button className="mt-4" onClick={() => saveSettings("general")}>
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
              {/* Minimum Password Length */}
              <div>
                <label className="text-sm font-medium">
                  Min Password Length
                </label>
                <Input
                  type="number"
                  value={settings.security.password_policy.min_length}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        password_policy: {
                          ...settings.security.password_policy,
                          min_length: parseInt(e.target.value),
                        },
                      },
                    })
                  }
                />
              </div>

              {/* Require Numbers */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="require-numbers"
                  checked={settings.security.password_policy.require_numbers}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        password_policy: {
                          ...settings.security.password_policy,
                          require_numbers: e.target.checked,
                        },
                      },
                    })
                  }
                />
                <label
                  htmlFor="require-numbers"
                  className="text-sm font-medium"
                >
                  Require Numbers
                </label>
              </div>

              {/* Require Special Characters */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="require-special"
                  checked={
                    settings.security.password_policy.require_special_char
                  }
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        password_policy: {
                          ...settings.security.password_policy,
                          require_special_char: e.target.checked,
                        },
                      },
                    })
                  }
                />
                <label
                  htmlFor="require-special"
                  className="text-sm font-medium"
                >
                  Require Special Characters
                </label>
              </div>

              {/* Session Timeout */}
              <div>
                <label className="text-sm font-medium">
                  Session Timeout (minutes)
                </label>
                <Input
                  type="number"
                  value={settings.security.session_timeout_minutes}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        session_timeout_minutes: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>

              {/* Max Login Attempts */}
              <div>
                <label className="text-sm font-medium">
                  Max Login Attempts
                </label>
                <Input
                  type="number"
                  value={settings.security.max_login_attempts}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        max_login_attempts: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>

              {/* Two-Factor */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="two-factor"
                  checked={settings.security.two_factor_auth}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        two_factor_auth: e.target.checked,
                      },
                    })
                  }
                />
                <label htmlFor="two-factor" className="text-sm font-medium">
                  Require Two-Factor Authentication
                </label>
              </div>

              <Button className="mt-4" onClick={() => saveSettings("security")}>
                <Save className="w-4 h-4 mr-2" />
                Save Security Settings
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Mail className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Notification Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">SMTP Server</label>
                <Input
                  value={settings.notifications.smtp_server}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        smtp_server: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">SMTP Port</label>
                <Input
                  type="number"
                  value={settings.notifications.smtp_port}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        smtp_port: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">From Email</label>
                <Input
                  value={settings.notifications.admin_email}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        admin_email: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <Button
                className="mt-4"
                onClick={() => saveSettings("notifications")}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Notification Settings
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* API Settings */}
        <TabsContent value="api">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Key className="w-5 h-5" />
              <h3 className="text-lg font-semibold">API Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Rate Limit</label>
                <Input
                  type="number"
                  value={settings.api.rate_limit_per_minute}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      api: {
                        ...settings.api,
                        rate_limit_per_minute: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">API Version</label>
                <Input
                  value={settings.api.api_version}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      api: { ...settings.api, api_version: e.target.value },
                    })
                  }
                />
              </div>
              <Button className="mt-4" onClick={() => saveSettings("api")}>
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
