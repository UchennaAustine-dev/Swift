// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch";
// import { Separator } from "@/components/ui/separator";
// import {
//   AlertTriangle,
//   Shield,
//   Activity,
//   CheckCircle,
//   Edit,
//   Save,
//   X,
//   Camera,
//   Bell,
//   Lock,
//   Globe,
//   Smartphone,
//   Mail,
//   Calendar,
//   MapPin,
//   Clock,
//   User,
//   Settings,
//   Eye,
//   EyeOff,
//   Key,
// } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription,
// } from "@/components/ui/dialog";

// // Mock user data - replace with actual data from your auth system
// const mockAdminData = {
//   id: "admin_001",
//   username: "david.taiwo",
//   firstName: "David",
//   lastName: "Taiwo",
//   email: "david@swiftlify.com",
//   phone: "+234 816 123 4567",
//   role: "super_admin",
//   status: "active",
//   joinedAt: "2023-01-15T10:30:00Z",
//   lastLogin: "2024-01-20T14:22:00Z",
//   location: "Lagos, Nigeria",
//   timezone: "Africa/Lagos",
//   avatar: null,
//   bio: "Experienced fintech professional with a passion for building secure and scalable trading platforms.",
//   permissions: {
//     user_management: true,
//     system_maintenance: true,
//     financial_oversight: true,
//     security_admin: true,
//     audit_access: true,
//   },
//   preferences: {
//     notifications: {
//       email: true,
//       push: true,
//       sms: false,
//       marketing: false,
//     },
//     security: {
//       twoFactorEnabled: false,
//       sessionTimeout: 30,
//       ipRestriction: false,
//     },
//     display: {
//       theme: "system",
//       language: "en",
//       timezone: "Africa/Lagos",
//     },
//   },
//   activityStats: {
//     totalLogins: 1247,
//     averageSessionTime: "2.5h",
//     lastPasswordChange: "2023-12-01T09:15:00Z",
//     securityIncidents: 0,
//   },
// };

// export default function ProfilePage() {
//   const [adminData, setAdminData] = useState(mockAdminData);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
//   const [editFormData, setEditFormData] = useState({
//     firstName: adminData.firstName,
//     lastName: adminData.lastName,
//     email: adminData.email,
//     phone: adminData.phone,
//     bio: adminData.bio,
//     location: adminData.location,
//   });
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [showPasswords, setShowPasswords] = useState({
//     current: false,
//     new: false,
//     confirm: false,
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleEditToggle = () => {
//     if (isEditing) {
//       // Reset form data if canceling
//       setEditFormData({
//         firstName: adminData.firstName,
//         lastName: adminData.lastName,
//         email: adminData.email,
//         phone: adminData.phone,
//         bio: adminData.bio,
//         location: adminData.location,
//       });
//     }
//     setIsEditing(!isEditing);
//   };

//   const handleSaveProfile = async () => {
//     setIsSubmitting(true);

//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 1000));

//     // Update admin data
//     setAdminData(prev => ({
//       ...prev,
//       ...editFormData,
//     }));

//     setIsEditing(false);
//     setIsSubmitting(false);
//   };

//   const handlePasswordChange = async () => {
//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       alert("New passwords don't match!");
//       return;
//     }

//     setIsSubmitting(true);

//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 1000));

//     // Reset password form
//     setPasswordData({
//       currentPassword: "",
//       newPassword: "",
//       confirmPassword: "",
//     });

//     setIsPasswordModalOpen(false);
//     setIsSubmitting(false);
//     alert("Password changed successfully!");
//   };

//   const handlePreferenceChange = (category: string, key: string, value: any) => {
//     setAdminData(prev => ({
//       ...prev,
//       preferences: {
//         ...prev.preferences,
//         [category]: {
//           ...prev.preferences[category],
//           [key]: value,
//         },
//       },
//     }));
//   };

//   const getRoleColor = (role: string) => {
//     switch (role) {
//       case "super_admin":
//         return "bg-purple-500";
//       case "admin":
//         return "bg-blue-500";
//       case "moderator":
//         return "bg-green-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "active":
//         return "bg-green-500";
//       case "inactive":
//         return "bg-yellow-500";
//       case "suspended":
//         return "bg-red-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   return (
//     <div className="container mx-auto p-6 max-w-6xl">
//       {/* Header Section */}
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <Avatar className="h-20 w-20">
//               <AvatarImage src={adminData.avatar} />
//               <AvatarFallback className="bg-primary text-primary-foreground text-xl">
//                 {adminData.firstName[0]}{adminData.lastName[0]}
//               </AvatarFallback>
//             </Avatar>
//             <Button
//               size="sm"
//               variant="secondary"
//               className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0"
//             >
//               <Camera className="h-4 w-4" />
//             </Button>
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold">
//               {adminData.firstName} {adminData.lastName}
//             </h1>
//             <p className="text-muted-foreground">{adminData.username}</p>
//             <div className="flex items-center gap-2 mt-2">
//               <Badge
//                 variant="outline"
//                 className={`${getRoleColor(adminData.role)} text-white border-0`}
//               >
//                 <Shield className="h-3 w-3 mr-1" />
//                 {adminData.role.replace("_", " ").toUpperCase()}
//               </Badge>
//               <Badge
//                 variant="outline"
//                 className={`${getStatusColor(adminData.status)} text-white border-0`}
//               >
//                 {adminData.status.toUpperCase()}
//               </Badge>
//             </div>
//           </div>
//         </div>
//         <div className="flex gap-2">
//           {!isEditing ? (
//             <Button onClick={handleEditToggle}>
//               <Edit className="h-4 w-4 mr-2" />
//               Edit Profile
//             </Button>
//           ) : (
//             <div className="flex gap-2">
//               <Button variant="outline" onClick={handleEditToggle}>
//                 <X className="h-4 w-4 mr-2" />
//                 Cancel
//               </Button>
//               <Button onClick={handleSaveProfile} disabled={isSubmitting}>
//                 <Save className="h-4 w-4 mr-2" />
//                 {isSubmitting ? "Saving..." : "Save Changes"}
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Tabs Section */}
//       <Tabs defaultValue="overview" className="space-y-6">
//         <TabsList className="grid w-full grid-cols-5">
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="security">Security</TabsTrigger>
//           <TabsTrigger value="preferences">Preferences</TabsTrigger>
//           <TabsTrigger value="permissions">Permissions</TabsTrigger>
//           <TabsTrigger value="activity">Activity</TabsTrigger>
//         </TabsList>

//         {/* Overview Tab */}
//         <TabsContent value="overview" className="space-y-6">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Personal Information */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <User className="h-5 w-5" />
//                   Personal Information
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="firstName">First Name</Label>
//                     <Input
//                       id="firstName"
//                       value={editFormData.firstName}
//                       onChange={(e) =>
//                         setEditFormData({
//                           ...editFormData,
//                           firstName: e.target.value,
//                         })
//                       }
//                       disabled={!isEditing}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="lastName">Last Name</Label>
//                     <Input
//                       id="lastName"
//                       value={editFormData.lastName}
//                       onChange={(e) =>
//                         setEditFormData({
//                           ...editFormData,
//                           lastName: e.target.value,
//                         })
//                       }
//                       disabled={!isEditing}
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     value={editFormData.email}
//                     onChange={(e) =>
//                       setEditFormData({
//                         ...editFormData,
//                         email: e.target.value,
//                       })
//                     }
//                     disabled={!isEditing}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="phone">Phone</Label>
//                   <Input
//                     id="phone"
//                     value={editFormData.phone}
//                     onChange={(e) =>
//                       setEditFormData({
//                         ...editFormData,
//                         phone: e.target.value,
//                       })
//                     }
//                     disabled={!isEditing}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="location">Location</Label>
//                   <Input
//                     id="location"
//                     value={editFormData.location}
//                     onChange={(e) =>
//                       setEditFormData({
//                         ...editFormData,
//                         location: e.target.value,
//                       })
//                     }
//                     disabled={!isEditing}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="bio">Bio</Label>
//                   <Textarea
//                     id="bio"
//                     value={editFormData.bio}
//                     onChange={(e) =>
//                       setEditFormData({
//                         ...editFormData,
//                         bio: e.target.value,
//                       })
//                     }
//                     disabled={!isEditing}
//                     className="min-h-[80px]"
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Account Details */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Settings className="h-5 w-5" />
//                   Account Details
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-muted-foreground">User ID:</span>
//                   <span className="font-mono text-sm">{adminData.id}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-muted-foreground">Username:</span>
//                   <span className="text-sm">@{adminData.username}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-muted-foreground">Role:</span>
//                   <Badge variant="outline">
//                     {adminData.role.replace("_", " ")}
//                   </Badge>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-muted-foreground">Status:</span>
//                   <Badge
//                     variant="outline"
//                     className={`${getStatusColor(adminData.status)} text-white border-0`}
//                   >
//                     {adminData.status}
//                   </Badge>
//                 </div>
//                 <Separator />
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-muted-foreground">Joined:</span>
//                   <span className="text-sm">
//                     {new Date(adminData.joinedAt).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-muted-foreground">Last Login:</span>
//                   <span className="text-sm">
//                     {new Date(adminData.lastLogin).toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-muted-foreground">Timezone:</span>
//                   <span className="text-sm">{adminData.timezone}</span>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Activity Stats */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Activity className="h-5 w-5" />
//                 Activity Statistics
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
//                 <div>
//                   <div className="text-3xl font-bold text-blue-600">
//                     {adminData.activityStats.totalLogins.toLocaleString()}
//                   </div>
//                   <div className="text-sm text-muted-foreground">Total Logins</div>
//                 </div>
//                 <div>
//                   <div className="text-3xl font-bold text-green-600">
//                     {adminData.activityStats.averageSessionTime}
//                   </div>
//                   <div className="text-sm text-muted-foreground">Avg Session</div>
//                 </div>
//                 <div>
//                   <div className="text-3xl font-bold text-purple-600">
//                     {Math.floor((Date.now() - new Date(adminData.activityStats.lastPasswordChange).getTime()) / (1000 * 60 * 60 * 24))}d
//                   </div>
//                   <div className="text-sm text-muted-foreground">Since Password Change</div>
//                 </div>
//                 <div>
//                   <div className="text-3xl font-bold text-red-600">
//                     {adminData.activityStats.securityIncidents}
//                   </div>
//                   <div className="text-sm text-muted-foreground">Security Incidents</div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Security Tab */}
//         <TabsContent value="security" className="space-y-6">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Password & Authentication */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Lock className="h-5 w-5" />
//                   Password & Authentication
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <p className="font-medium">Password</p>
//                     <p className="text-sm text-muted-foreground">
//                       Last changed {Math.floor((Date.now() - new Date(adminData.activityStats.lastPasswordChange).getTime()) / (1000 * 60 * 60 * 24))} days ago
//                     </p>
//                   </div>
//                   <Button
//                     variant="outline"
//                     onClick={() => setIsPasswordModalOpen(true)}
//                   >
//                     <Key className="h-4 w-4 mr-2" />
//                     Change Password
//                   </Button>
//                 </div>
//                 <Separator />
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <p className="font-medium">Two-Factor Authentication</p>
//                     <p className="text-sm text-muted-foreground">
//                       Add an extra layer of security
//                     </p>
//                   </div>
//                   <Switch
//                     checked={adminData.preferences.security.twoFactorEnabled}
//                     onCheckedChange={(checked) =>
//                       handlePreferenceChange("security", "twoFactorEnabled", checked)
//                     }
//                   />
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <p className="font-medium">Session Timeout</p>
//                     <p className="text-sm text-muted-foreground">
//                       Auto-logout after inactivity
//                     </p>
//                   </div>
//                   <Select
//                     value={adminData.preferences.security.sessionTimeout.toString()}
//                     onValueChange={(value) =>
//                       handlePreferenceChange("security", "sessionTimeout", parseInt(value))
//                     }
//                   >
//                     <SelectTrigger className="w-32">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="15">15 minutes</SelectItem>
//                       <SelectItem value="30">30 minutes</SelectItem>
//                       <SelectItem value="60">1 hour</SelectItem>
//                       <SelectItem value="120">2 hours</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Security Information */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Shield className="h-5 w-5" />
//                   Security Information
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Last Login:</span>
//                   <span>{new Date(adminData.lastLogin).toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Failed Login Attempts:</span>
//                   <span>0</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Active Sessions:</span>
//                   <span>1</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">IP Restriction:</span>
//                   <Switch
//                     checked={adminData.preferences.security.ipRestriction}
//                     onCheckedChange={(checked) =>
//                       handlePreferenceChange("security", "ipRestriction", checked)
//                     }
//                   />
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Current IP:</span>
//                   <span className="font-mono text-sm">192.168.1.100</span>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         {/* Preferences Tab */}
//         <TabsContent value="preferences" className="space-y-6">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Notification Preferences */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Bell className="h-5 w-5" />
//                   Notification Preferences
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <p className="font-medium">Email Notifications</p>
//                     <p className="text-sm text-muted-foreground">
//                       Receive notifications via email
//                     </p>
//                   </div>
//                   <Switch
//                     checked={adminData.preferences.notifications.email}
//                     onCheckedChange={(checked) =>
//                       handlePreferenceChange("notifications", "email", checked)
//                     }
//                   />
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <p className="font-medium">Push Notifications</p>
//                     <p className="text-sm text-muted-foreground">
//                       Browser push notifications
//                     </p>
//                   </div>
//                   <Switch
//                     checked={adminData.preferences.notifications.push}
//                     onCheckedChange={(checked) =>
//                       handlePreferenceChange("notifications", "push", checked)
//                     }
//                   />
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <p className="font-medium">SMS Notifications</p>
//                     <p className="text-sm text-muted-foreground">
//                       Critical alerts via SMS
//                     </p>
//                   </div>
//                   <Switch
//                     checked={adminData.preferences.notifications.sms}
//                     onCheckedChange={(checked) =>
//                       handlePreferenceChange("notifications", "sms", checked)
//                     }
//                   />
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <p className="font-medium">Marketing Communications</p>
//                     <p className="text-sm text-muted-foreground">
//                       Product updates and news
//                     </p>
//                   </div>
//                   <Switch
//                     checked={adminData.preferences.notifications.marketing}
//                     onCheckedChange={(checked) =>
//                       handlePreferenceChange("notifications", "marketing", checked)
//                     }
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Display Preferences */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Globe className="h-5 w-5" />
//                   Display Preferences
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <Label>Theme</Label>
//                   <Select
//                     value={adminData.preferences.display.theme}
//                     onValueChange={(value) =>
//                       handlePreferenceChange("display", "theme", value)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="light">Light</SelectItem>
//                       <SelectItem value="dark">Dark</SelectItem>
//                       <SelectItem value="system">System</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Language</Label>
//                   <Select
//                     value={adminData.preferences.display.language}
//                     onValueChange={(value) =>
//                       handlePreferenceChange("display", "language", value)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="en">English</SelectItem>
//                       <SelectItem value="es">Spanish</SelectItem>
//                       <SelectItem value="fr">French</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Timezone</Label>
//                   <Select
//                     value={adminData.preferences.display.timezone}
//                     onValueChange={(value) =>
//                       handlePreferenceChange("display", "timezone", value)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Africa/Lagos">Lagos (GMT+1)</SelectItem>
//                       <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
//                       <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
//                       <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         {/* Permissions Tab */}
//         <TabsContent value="permissions" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Shield className="h-5 w-5" />
//                 Administrative Permissions
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {Object.entries(adminData.permissions).map(([key, value]) => (
//                   <div key={key} className="flex items-center justify-between p-3 rounded-lg border">
//                     <div>
//                       <p className="font-medium capitalize">
//                         {key.replace("_", " ")}
//                       </p>
//                       <p className="text-sm text-muted-foreground">
//                         {key === "user_management" && "Create, edit, and manage user accounts"}
//                         {key === "system_maintenance" && "Access maintenance mode and system controls"}
//                         {key === "financial_oversight" && "View financial reports and transaction data"}
//                         {key === "security_admin" && "Manage security settings and audit logs"}
//                         {key === "audit_access" && "Access system audit trails and logs"}
//                       </p>
//                     </div>
//                     <Badge
//                       variant={value ? "default" : "secondary"}
//                       className={value ? "bg-green-500" : ""}
//                     >
//                       {value ? "Granted" : "Denied"}
//                     </Badge>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Activity Tab */}
//         <TabsContent value="activity" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Activity className="h-5 w-5" />
//                 Recent Activity
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {[
//                   {
//                     action: "Profile Updated",
//                     description: "Changed email address",
//                     time: "2 hours ago",
//                     icon: User,
//                     color: "text-blue-600",
//                   },
//                   {
//                     action: "Security Settings Modified",
//                     description: "Enabled two-factor authentication",
//                     time: "1 day ago",
//                     icon: Shield,
//                     color: "text-green-600",
//                   },
//                   {
//                     action: "System Login",
//                     description: "Logged in from Lagos, Nigeria",
//                     time: "2 days ago",
//                     icon: Activity,
//                     color: "text-gray-600",
//                   },
//                   {
//                     action: "Password Changed",
//                     description: "Password updated successfully",
//                     time: "1 week ago",
//                     icon: Lock,
//                     color: "text-purple-600",
//                   },
//                   {
//                     action: "Maintenance Mode Enabled",
//                     description: "System maintenance performed",
//                     time: "2 weeks ago",
//                     icon: Settings,
//                     color: "text-orange-600",
//                   },
//                 ].map((activity, index) => (
//                   <div
//                     key={index}
//                     className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
//                   >
//                     <div className={`p-2 rounded-full bg-muted ${activity.color}`}>
//                       <activity.icon className="h-4 w-4" />
//                     </div>
//                     <div className="flex-1">
//                       <p className="font-medium">{activity.action}</p>
//                       <p className="text-sm text-muted-foreground">
//                         {activity.description}
//                       </p>
//                       <p className="text-xs text-muted-foreground mt-1">
//                         {activity.time}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {/* Password Change Modal */}
//       <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Key className="h-5 w-5" />
//               Change Password
//             </DialogTitle>
//             <DialogDescription>
//               Enter your current password and choose a new one.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="currentPassword">Current Password</Label>
//               <div className="relative">
//                 <Input
//                   id="currentPassword"
//                   type={showPasswords.current ? "text" : "password"}
//                   value={passwordData.currentPassword}
//                   onChange={(e) =>
//                     setPasswordData({
//                       ...passwordData,
//                       currentPassword: e.target.value,
//                     })
//                   }
//                   placeholder="Enter current password"
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                   onClick={() =>
//                     setShowPasswords({
//                       ...showPasswords,
//                       current: !showPasswords.current,
//                     })
//                   }
//                 >
//                   {showPasswords.current ? (
//                     <EyeOff className="h-4 w-4" />
//                   ) : (
//                     <Eye className="h-4 w-4" />
//                   )}
//                 </Button>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="newPassword">New Password</Label>
//               <div className="relative">
//                 <Input
//                   id="newPassword"
//                   type={showPasswords.new ? "text" : "password"}
//                   value={passwordData.newPassword}
//                   onChange={(e) =>
//                     setPasswordData({
//                       ...passwordData,
//                       newPassword: e.target.value,
//                     })
//                   }
//                   placeholder="Enter new password"
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                   onClick={() =>
//                     setShowPasswords({
//                       ...showPasswords,
//                       new: !showPasswords.new,
//                     })
//                   }
//                 >
//                   {showPasswords.new ? (
//                     <EyeOff className="h-4 w-4" />
//                   ) : (
//                     <Eye className="h-4 w-4" />
//                   )}
//                 </Button>
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="confirmPassword">Confirm New Password</Label>
//               <div className="relative">
//                 <Input
//                   id="confirmPassword"
//                   type={showPasswords.confirm ? "text" : "password"}
//                   value={passwordData.confirmPassword}
//                   onChange={(e) =>
//                     setPasswordData({
//                       ...passwordData,
//                       confirmPassword: e.target.value,
//                     })
//                   }
//                   placeholder="Confirm new password"
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                   onClick={() =>
//                     setShowPasswords({
//                       ...showPasswords,
//                       confirm: !showPasswords.confirm,
//                     })
//                   }
//                 >
//                   {showPasswords.confirm ? (
//                     <EyeOff className="h-4 w-4" />
//                   ) : (
//                     <Eye className="h-4 w-4" />
//                   )}
//                 </Button>
//               </div>
//             </div>

//             {/* Password Requirements */}
//             <div className="p-3 bg-muted rounded-lg">
//               <p className="text-sm font-medium mb-2">Password Requirements:</p>
//               <ul className="text-xs text-muted-foreground space-y-1">
//                 <li className="flex items-center gap-2">
//                   <CheckCircle className="h-3 w-3 text-green-500" />
//                   At least 8 characters long
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <CheckCircle className="h-3 w-3 text-green-500" />
//                   Contains uppercase and lowercase letters
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <CheckCircle className="h-3 w-3 text-green-500" />
//                   Contains at least one number
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <CheckCircle className="h-3 w-3 text-green-500" />
//                   Contains at least one special character
//                 </li>
//               </ul>
//             </div>
//           </div>
//           <DialogFooter className="gap-2">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setIsPasswordModalOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handlePasswordChange}
//               disabled={
//                 isSubmitting ||
//                 !passwordData.currentPassword ||
//                 !passwordData.newPassword ||
//                 !passwordData.confirmPassword ||
//                 passwordData.newPassword !== passwordData.confirmPassword
//               }
//             >
//               {isSubmitting ? "Changing..." : "Change Password"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// app/profile/page.tsx
// "use client";

// import { useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// import { mockAdminData } from "@/data/profileData";
// import { AdminUser, EditFormData, PasswordData, ShowPasswords, PreferenceCategory } from "@/types/profile";
// import { PasswordModal } from "@/components/profile/password-modal";
// import { ProfileHeader } from "@/components/profile/profile-header";
// import { OverviewTab } from "@/components/profile/tabs/overview-tab";

// export default function ProfilePage() {
//   const [adminData, setAdminData] = useState<AdminUser>(mockAdminData);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
//   const [editFormData, setEditFormData] = useState<EditFormData>({
//     firstName: adminData.firstName,
//     lastName: adminData.lastName,
//     email: adminData.email,
//     phone: adminData.phone,
//     bio: adminData.bio,
//     location: adminData.location,
//   });
//   const [passwordData, setPasswordData] = useState<PasswordData>({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [showPasswords, setShowPasswords] = useState<ShowPasswords>({
//     current: false,
//     new: false,
//     confirm: false,
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleEditToggle = () => {
//     if (isEditing) {
//       // Reset form data if canceling
//       setEditFormData({
//         firstName: adminData.firstName,
//         lastName: adminData.lastName,
//         email: adminData.email,
//         phone: adminData.phone,
//         bio: adminData.bio,
//         location: adminData.location,
//       });
//     }
//     setIsEditing(!isEditing);
//   };

//   const handleSaveProfile = async () => {
//     setIsSubmitting(true);

//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 1000));

//     // Update admin data
//     setAdminData(prev => ({
//       ...prev,
//       ...editFormData,
//     }));

//     setIsEditing(false);
//     setIsSubmitting(false);
//   };

//   const handlePasswordChange = async () => {
//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       alert("New passwords don't match!");
//       return;
//     }

//     setIsSubmitting(true);

//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 1000));

//     // Reset password form
//     setPasswordData({
//       currentPassword: "",
//       newPassword: "",
//       confirmPassword: "",
//     });

//     setIsPasswordModalOpen(false);
//     setIsSubmitting(false);
//     alert("Password changed successfully!");
//   };

//   const handlePreferenceChange = <T extends PreferenceCategory>(
//     category: T,
//     key: string,
//     value: any
//   ) => {
//     setAdminData(prev => ({
//       ...prev,
//       preferences: {
//         ...prev.preferences,
//         [category]: {
//           ...prev.preferences[category],
//           [key]: value,
//         },
//       },
//     }));
//   };

//   return (
//     <div className="container mx-auto p-6 max-w-6xl">
//       <ProfileHeader
//         adminData={adminData}
//         isEditing={isEditing}
//         isSubmitting={isSubmitting}
//         onEditToggle={handleEditToggle}
//         onSave={handleSaveProfile}
//       />

//       <Tabs defaultValue="overview" className="space-y-6">
//         <TabsList className="grid w-full grid-cols-5">
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="security">Security</TabsTrigger>
//           <TabsTrigger value="preferences">Preferences</TabsTrigger>
//           <TabsTrigger value="permissions">Permissions</TabsTrigger>
//           <TabsTrigger value="activity">Activity</TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview">
//           <OverviewTab
//             adminData={adminData}
//             editFormData={editFormData}
//             setEditFormData={setEditFormData}
//             isEditing={isEditing}
//           />
//         </TabsContent>

//         <TabsContent value="security">
//           <div className="text-center py-8 text-muted-foreground">
//             Security tab content coming soon...
//           </div>
//         </TabsContent>

//         <TabsContent value="preferences">
//           <div className="text-center py-8 text-muted-foreground">
//             Preferences tab content coming soon...
//           </div>
//         </TabsContent>

//         <TabsContent value="permissions">
//           <div className="text-center py-8 text-muted-foreground">
//             Permissions tab content coming soon...
//           </div>
//         </TabsContent>

//         <TabsContent value="activity">
//           <div className="text-center py-8 text-muted-foreground">
//             Activity tab content coming soon...
//           </div>
//         </TabsContent>
//       </Tabs>

//       <PasswordModal
//         isOpen={isPasswordModalOpen}
//         onClose={() => setIsPasswordModalOpen(false)}
//         passwordData={passwordData}
//         setPasswordData={setPasswordData}
//         showPasswords={showPasswords}
//         setShowPasswords={setShowPasswords}
//         onSubmit
