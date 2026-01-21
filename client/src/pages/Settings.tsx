import { GearLoader } from "@/components/ui/gear-loader";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  Save,
  Upload,
  User,
  Building2,
  LogOut,
  Mail,
  Bell,
  Link2,
  HelpCircle,
  Cookie,
  Download,
  FileJson,
  Users,
  FileText,
  Package,
  Receipt,
  Shield,
  FileArchive,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Navigation } from "@/components/Navigation";
import { QuickBooksSettings } from "@/components/QuickBooksSettings";

import { EmailTemplateEditor } from "@/components/EmailTemplateEditor";
import { DeleteAccountDialog } from "@/components/DeleteAccountDialog";
import { AvatarSelector } from "@/components/AvatarSelector";
import { useConsent } from "@/contexts/CookieConsentContext";
import { Link } from "wouter";

export default function Settings() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const {
    preferences: cookiePrefs,
    setPreferences: setCookiePrefs,
    resetConsent,
  } = useConsent();

  // Export format state
  const [exportFormat, setExportFormat] = useState<"json" | "csv">("json");

  // Data export mutation
  const exportAllData = trpc.user.exportAllData.useMutation({
    onSuccess: data => {
      // Trigger download
      const link = document.createElement("a");
      link.href = data.url;
      const ext = data.format === "csv" ? "zip" : "json";
      link.download = `sleek-invoices-data-export-${new Date().toISOString().split("T")[0]}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(
        data.format === "csv"
          ? "Your CSV export (ZIP) is ready and downloading!"
          : "Your JSON export is ready and downloading!"
      );
    },
    onError: error => {
      toast.error(error.message || "Failed to export data. Please try again.");
    },
  });

  // Profile state
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [taxId, setTaxId] = useState("");

  // Logo state
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Reminder settings state
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderIntervals, setReminderIntervals] = useState<number[]>([
    3, 7, 14,
  ]);
  const [reminderSubject, setReminderSubject] = useState("");
  const [reminderTemplate, setReminderTemplate] = useState("");
  const [reminderCcEmail, setReminderCcEmail] = useState("");

  // Fetch reminder settings
  const { data: reminderSettings } = trpc.reminders.getSettings.useQuery();
  const updateReminderSettings = trpc.reminders.updateSettings.useMutation({
    onSuccess: () => {
      toast.success("Reminder settings saved successfully");
      utils.reminders.getSettings.invalidate();
    },
    onError: error => {
      toast.error(error.message || "Failed to save reminder settings");
    },
  });

  // Populate form when user data loads
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setCompanyName(user.companyName || "");
      setCompanyAddress(user.companyAddress || "");
      setCompanyPhone(user.companyPhone || "");
      setTaxId((user as any).taxId || "");
      setLogoPreview(user.logoUrl || null);
    }
  }, [user]);

  // Populate reminder settings when they load
  useEffect(() => {
    if (reminderSettings) {
      setReminderEnabled(reminderSettings.enabled);
      setReminderIntervals(reminderSettings.intervals);
      setReminderSubject(reminderSettings.emailSubject || "");
      setReminderTemplate(reminderSettings.emailTemplate || "");
      setReminderCcEmail(reminderSettings.ccEmail || "");
    }
  }, [reminderSettings]);

  const utils = trpc.useUtils();

  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully");
      utils.auth.me.invalidate();
    },
    onError: error => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const uploadLogo = trpc.user.uploadLogo.useMutation({
    onSuccess: () => {
      toast.success("Logo uploaded successfully");
      utils.auth.me.invalidate();
      setLogoFile(null);
    },
    onError: error => {
      toast.error(error.message || "Failed to upload logo");
    },
  });

  const handleReminderIntervalToggle = (day: number) => {
    if (reminderIntervals.includes(day)) {
      setReminderIntervals(reminderIntervals.filter(d => d !== day));
    } else {
      setReminderIntervals([...reminderIntervals, day].sort((a, b) => a - b));
    }
  };

  const handleSaveReminderSettings = () => {
    updateReminderSettings.mutate({
      enabled: reminderEnabled,
      intervals: reminderIntervals,
      emailSubject: reminderSubject || undefined,
      emailTemplate: reminderTemplate || undefined,
      ccEmail: reminderCcEmail || null,
    });
  };

  const handleSaveProfile = () => {
    updateProfile.mutate({
      name,
      companyName,
      companyAddress,
      companyPhone,
      taxId: taxId || undefined,
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Logo must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      setLogoFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadLogo = async () => {
    if (!logoFile) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(",")[1];
      uploadLogo.mutate({
        base64Data,
        mimeType: logoFile.type,
      });
    };
    reader.readAsDataURL(logoFile);
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="opacity-70">
          <GearLoader size="md" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  return (
    <div className="page-wrapper">
      <Navigation />

      {/* Main Content */}
      <div className="page-content page-transition">
        <div className="page-header">
          <h1 className="page-header-title">Settings</h1>
          <p className="page-header-subtitle">
            Manage your account, company, and integrations
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4 hidden sm:block" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="company" className="gap-2">
              <Building2 className="h-4 w-4 hidden sm:block" />
              Company
            </TabsTrigger>
            <TabsTrigger value="reminders" className="gap-2">
              <Bell className="h-4 w-4 hidden sm:block" />
              Reminders
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2">
              <Link2 className="h-4 w-4 hidden sm:block" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="support" className="gap-2">
              <HelpCircle className="h-4 w-4 hidden sm:block" />
              Support
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            {/* Avatar Section */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Avatar</CardTitle>
                <CardDescription>
                  Choose how you want to be represented in the app
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AvatarSelector
                  currentAvatarUrl={user?.avatarUrl}
                  currentAvatarType={user?.avatarType || "initials"}
                  userName={user?.name || ""}
                  userEmail={user?.email || ""}
                  onSelect={async (avatarUrl, avatarType) => {
                    await updateProfile.mutateAsync({ avatarUrl, avatarType });
                  }}
                  onUpload={async file => {
                    const reader = new FileReader();
                    return new Promise((resolve, reject) => {
                      reader.onloadend = async () => {
                        try {
                          const base64Data = (reader.result as string).split(
                            ","
                          )[1];
                          const response = await fetch("/api/upload/avatar", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              file: base64Data,
                              userId: user?.id,
                              filename: file.name,
                            }),
                          });
                          const data = await response.json();
                          if (!response.ok) throw new Error(data.error);
                          resolve(data.url);
                        } catch (error) {
                          reject(error);
                        }
                      };
                      reader.onerror = reject;
                      reader.readAsDataURL(file);
                    });
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Your personal details and account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={updateProfile.isPending}
                  >
                    {updateProfile.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>Manage your account</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DeleteAccountDialog />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Tab */}
          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Details that appear on your invoices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="Acme Inc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Company Address</Label>
                  <Textarea
                    id="companyAddress"
                    value={companyAddress}
                    onChange={e => setCompanyAddress(e.target.value)}
                    placeholder="123 Main St, City, State, ZIP"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Company Phone</Label>
                  <Input
                    id="companyPhone"
                    value={companyPhone}
                    onChange={e => setCompanyPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxId">VAT / Tax ID</Label>
                  <Input
                    id="taxId"
                    value={taxId}
                    onChange={e => setTaxId(e.target.value)}
                    placeholder="e.g., DE123456789 or EIN: 12-3456789"
                  />
                  <p className="text-sm text-muted-foreground">
                    Your VAT number or Tax ID will appear on invoices
                  </p>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={updateProfile.isPending}
                  >
                    {updateProfile.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Company Logo */}
            <Card>
              <CardHeader>
                <CardTitle>Company Logo</CardTitle>
                <CardDescription>
                  Upload your company logo to appear on invoices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/50">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Company Logo"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">No logo</p>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="cursor-pointer"
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        Recommended: Square image, max 5MB
                      </p>
                    </div>

                    {logoFile && (
                      <Button
                        onClick={handleUploadLogo}
                        disabled={uploadLogo.isPending}
                      >
                        {uploadLogo.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Logo
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reminders Tab */}
          <TabsContent value="reminders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Reminder Settings</CardTitle>
                <CardDescription>
                  Automatically send payment reminders to clients with overdue
                  invoices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Enable/Disable */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reminderEnabled">
                      Enable Automated Reminders
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Send automatic email reminders for overdue invoices
                    </p>
                  </div>
                  <Switch
                    id="reminderEnabled"
                    checked={reminderEnabled}
                    onCheckedChange={setReminderEnabled}
                  />
                </div>

                {/* Reminder Intervals */}
                <div className="space-y-3">
                  <Label>Reminder Intervals</Label>
                  <p className="text-sm text-muted-foreground">
                    Send reminders at these intervals after the due date
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {[3, 7, 14, 30].map(day => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={`interval-${day}`}
                          checked={reminderIntervals.includes(day)}
                          onCheckedChange={() =>
                            handleReminderIntervalToggle(day)
                          }
                          disabled={!reminderEnabled}
                        />
                        <label
                          htmlFor={`interval-${day}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {day} days
                        </label>
                      </div>
                    ))}
                  </div>
                  {reminderIntervals.length === 0 && reminderEnabled && (
                    <p className="text-sm text-destructive">
                      Please select at least one reminder interval
                    </p>
                  )}
                </div>

                {/* CC Email */}
                <div className="space-y-2">
                  <Label htmlFor="reminderCcEmail">
                    CC Email Address (Optional)
                  </Label>
                  <Input
                    id="reminderCcEmail"
                    type="email"
                    placeholder="accounting@yourcompany.com"
                    value={reminderCcEmail}
                    onChange={e => setReminderCcEmail(e.target.value)}
                    disabled={!reminderEnabled}
                  />
                  <p className="text-sm text-muted-foreground">
                    Receive a copy of all reminder emails sent to clients
                  </p>
                </div>

                {/* Email Template - New Visual Editor */}
                <EmailTemplateEditor
                  label="Email Template"
                  value={reminderTemplate}
                  onChange={setReminderTemplate}
                  subject={reminderSubject}
                  onSubjectChange={setReminderSubject}
                  disabled={!reminderEnabled}
                  description="Customize the reminder email sent to clients. Choose a template to get started, then personalize it."
                />

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSaveReminderSettings}
                    disabled={
                      updateReminderSettings.isPending ||
                      (reminderEnabled && reminderIntervals.length === 0)
                    }
                  >
                    {updateReminderSettings.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Reminder Settings
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <QuickBooksSettings />
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>
                  Need help? Our support team is here to assist you with any
                  questions or issues.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* General Inquiries */}
                <div className="flex items-start gap-4 p-4 border border-border rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-foreground mb-1">
                      General Inquiries
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Questions about features, billing, or general information
                    </p>
                    <a
                      href="mailto:hello@sleekinvoices.com"
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      hello@sleekinvoices.com
                    </a>
                  </div>
                </div>

                {/* Technical Support */}
                <div className="flex items-start gap-4 p-4 border border-border rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    <HelpCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-foreground mb-1">
                      Technical Support
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Get help with technical issues, bugs, or account problems
                    </p>
                    <a
                      href="mailto:support@sleekinvoices.com"
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      support@sleekinvoices.com
                    </a>
                  </div>
                </div>

                {/* Support Information */}
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Response Time
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    We typically respond to support requests within 24 hours
                    during business days. For urgent issues, please mark your
                    email as "URGENT" in the subject line.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Download My Data Card - GDPR Compliance */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                    <Download className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <CardTitle>Download My Data</CardTitle>
                    <CardDescription>
                      Export all your personal data (GDPR compliant)
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Under GDPR and other privacy regulations, you have the right
                  to receive a copy of all your personal data. Choose your
                  preferred format and download a complete export of your data.
                </p>

                {/* Format Selector */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Export Format</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setExportFormat("json")}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                        exportFormat === "json"
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-border bg-accent/5 hover:border-muted-foreground/30"
                      }`}
                    >
                      <FileJson
                        className={`h-5 w-5 ${exportFormat === "json" ? "text-emerald-500" : "text-muted-foreground"}`}
                      />
                      <div className="text-left">
                        <p
                          className={`text-sm font-medium ${exportFormat === "json" ? "text-emerald-500" : "text-foreground"}`}
                        >
                          JSON
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Single file, nested data
                        </p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setExportFormat("csv")}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                        exportFormat === "csv"
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-border bg-accent/5 hover:border-muted-foreground/30"
                      }`}
                    >
                      <FileArchive
                        className={`h-5 w-5 ${exportFormat === "csv" ? "text-emerald-500" : "text-muted-foreground"}`}
                      />
                      <div className="text-left">
                        <p
                          className={`text-sm font-medium ${exportFormat === "csv" ? "text-emerald-500" : "text-foreground"}`}
                        >
                          CSV (ZIP)
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Spreadsheet-ready
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Data Categories */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-accent/5">
                    <div className="p-1.5 rounded-md bg-muted/60">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium">Profile</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-accent/5">
                    <div className="p-1.5 rounded-md bg-muted/60">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium">Invoices</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-accent/5">
                    <div className="p-1.5 rounded-md bg-muted/60">
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium">Clients</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-accent/5">
                    <div className="p-1.5 rounded-md bg-muted/60">
                      <Receipt className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium">Expenses</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-accent/5">
                    <div className="p-1.5 rounded-md bg-muted/60">
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium">Products</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-accent/5">
                    <div className="p-1.5 rounded-md bg-muted/60">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium">Email Logs</span>
                  </div>
                </div>

                {/* Download Button */}
                <div className="pt-2">
                  <Button
                    onClick={() =>
                      exportAllData.mutate({ format: exportFormat })
                    }
                    disabled={exportAllData.isPending}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700"
                  >
                    {exportAllData.isPending ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Preparing Export...
                      </>
                    ) : (
                      <>
                        {exportFormat === "csv" ? (
                          <FileArchive className="h-4 w-4 mr-2" />
                        ) : (
                          <FileJson className="h-4 w-4 mr-2" />
                        )}
                        Download My Data (
                        {exportFormat === "csv" ? "CSV ZIP" : "JSON"})
                      </>
                    )}
                  </Button>
                </div>

                {/* Info Note */}
                <div className="rounded-lg bg-muted/50 p-4 flex items-start gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">
                      Your data, your rights
                    </p>
                    <p>
                      {exportFormat === "csv"
                        ? "CSV export creates a ZIP file with separate spreadsheets for each data category (profile, invoices, clients, etc.). Perfect for Excel or Google Sheets."
                        : "JSON export creates a single file with all your data in a structured format. Ideal for developers or data portability."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cookie Preferences Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Cookie className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Cookie Preferences</CardTitle>
                    <CardDescription>
                      Manage your cookie and tracking preferences
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Essential Cookies */}
                <div className="flex items-start gap-4 p-4 rounded-lg border border-border bg-accent/5">
                  <Switch
                    checked={true}
                    disabled
                    className="mt-1"
                    aria-label="Essential cookies (required)"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-foreground">
                        Essential Cookies
                      </h4>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        Required
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Required for authentication, security, and core
                      functionality. These cannot be disabled.
                    </p>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="flex items-start gap-4 p-4 rounded-lg border border-border bg-accent/5">
                  <Switch
                    checked={true}
                    disabled
                    className="mt-1"
                    aria-label="Functional cookies (required)"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-foreground">
                        Functional Cookies
                      </h4>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        Required
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Remember your preferences like theme and onboarding
                      progress. These improve your experience.
                    </p>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors">
                  <Switch
                    checked={cookiePrefs.analytics}
                    onCheckedChange={checked => {
                      setCookiePrefs({ analytics: checked });
                      toast.success(
                        checked
                          ? "Analytics enabled - helping us improve SleekInvoices"
                          : "Analytics disabled - your privacy is respected"
                      );
                    }}
                    className="mt-1"
                    aria-label="Analytics cookies"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-foreground">
                        Analytics Cookies
                      </h4>
                      <Badge variant="info">Optional</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Help us understand how you use SleekInvoices with
                      privacy-respecting analytics. Only anonymized usage
                      patterns - no personal data.
                    </p>
                  </div>
                </div>

                {/* Marketing Cookies - Currently None */}
                <div className="flex items-start gap-4 p-4 rounded-lg border border-dashed border-border bg-muted/30 opacity-60">
                  <Switch
                    checked={false}
                    disabled
                    className="mt-1"
                    aria-label="Marketing cookies (not used)"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-foreground">
                        Marketing Cookies
                      </h4>
                      <Badge variant="neutral">Not Used</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We don't use any marketing or advertising cookies.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetConsent();
                      toast.info(
                        "Cookie preferences reset. The consent banner will appear on next page load."
                      );
                    }}
                    className="w-full sm:w-auto"
                  >
                    <Cookie className="h-4 w-4 mr-2" />
                    Reset Consent Preferences
                  </Button>
                  <div className="flex-1" />
                  <Link href="/privacy">
                    <Button variant="ghost" className="w-full sm:w-auto">
                      View Privacy Policy
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
