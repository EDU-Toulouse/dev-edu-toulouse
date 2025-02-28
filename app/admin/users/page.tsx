// @/app/admin/users/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
  User,
  Mail,
  Calendar,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

// Import User interface
import { User as UserType, Role } from "@/types/user";

const UsersAdminPage = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<UserType>>({
    name: "",
    email: "",
    role: Role.USER,
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users");
      const result = await response.json();

      if (response.status === 200) {
        setUsers(result.data);
      } else {
        toast.error("Error fetching users");
      }
    } catch {
      toast.error("Failed to fetch users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, role: value as Role });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: Role.USER,
    });
  };

  const handleEditClick = (user: UserType) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || "",
      email: user.email,
      role: user.role,
    });
    setShowEditDialog(true);
  };

  const handleDeleteClick = (user: UserType) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const handleCreateUser = async () => {
    try {
      if (!formData.name || !formData.email) {
        toast.error("Name and email are required");
        return;
      }

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.status === 201) {
        toast.success("User created successfully");
        fetchUsers();
        setShowCreateDialog(false);
        resetForm();
      } else {
        toast.error(result.message || "Failed to create user");
      }
    } catch {
      toast.error("Failed to create user. Please try again.");
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      if (!formData.name && !formData.email) {
        toast.error("At least one field (name or email) must be provided");
        return;
      }

      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        cache: "no-cache",
      });

      const result = await response.json();

      if (response.status === 200) {
        toast.success("User updated successfully");
        fetchUsers();
        setShowEditDialog(false);
      } else {
        toast.error(result.message || "Failed to update user");
      }
    } catch {
      toast.error("Failed to update user. Please try again.");
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.status === 200) {
        toast.success("User deleted successfully");
        fetchUsers();
        setShowDeleteDialog(false);
      } else {
        toast.error(result.message || "Failed to delete user");
      }
    } catch {
      toast.error("Failed to delete user. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage your users from this dashboard
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowCreateDialog(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Create User
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="admin">Admins</TabsTrigger>
          <TabsTrigger value="user">Regular Users</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <UserGrid
            users={users}
            isLoading={isLoading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </TabsContent>
        <TabsContent value="admin">
          <UserGrid
            users={users.filter((u) => u.role === Role.ADMIN)}
            isLoading={isLoading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </TabsContent>
        <TabsContent value="user">
          <UserGrid
            users={users.filter((u) => u.role === Role.USER)}
            isLoading={isLoading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </TabsContent>
      </Tabs>

      {/* Create User Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new user.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData?.name ? formData?.name : ""}
                onChange={handleInputChange}
                placeholder="Enter user name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter user email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role?.toString()}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Role.USER.toString()}>User</SelectItem>
                  <SelectItem value={Role.ADMIN.toString()}>Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the details of this user.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData?.name ? formData?.name : ""}
                onChange={handleInputChange}
                placeholder="Enter user name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter user email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={formData.role?.toString()}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Role.USER.toString()}>User</SelectItem>
                  <SelectItem value={Role.ADMIN.toString()}>Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>Update User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the user &quot;
              {selectedUser?.name || selectedUser?.email}&quot;? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster richColors closeButton />
    </div>
  );
};

// User Grid Component
const UserGrid = ({
  users,
  isLoading,
  onEdit,
  onDelete,
}: {
  users: UserType[];
  isLoading: boolean;
  onEdit: (user: UserType) => void;
  onDelete: (user: UserType) => void;
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="h-[220px] animate-pulse">
            <div className="h-20 bg-gray-200 rounded-t-lg"></div>
            <CardContent className="pt-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No users found</p>
      </div>
    );
  }

  return (
    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <Card
          key={user.id}
          className="overflow-hidden hover:shadow-md transition-all duration-500 hover:scale-105"
        >
          <div className="relative h-32 bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
            <div className="absolute top-2 right-2">
              <Badge
                className={
                  user.role === Role.ADMIN
                    ? "bg-purple-100 text-primary"
                    : "bg-blue-100 text-background"
                }
              >
                {user.role}
              </Badge>
            </div>
            <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              ) : (
                <User className="h-10 w-10 text-gray-400" />
              )}
            </div>
          </div>

          <CardHeader className="pb-2">
            <CardTitle className="line-clamp-1">
              {user.name || "Unnamed User"}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 truncate">
              <Mail className="h-3 w-3" />
              {user.email}
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-2">
            <div className="flex items-center text-xs text-gray-500 mb-1">
              <Calendar className="h-3 w-3 mr-1" />
              <span>
                Joined:{" "}
                {user.createdAt
                  ? format(new Date(user.createdAt), "MMM d, yyyy")
                  : "Unknown"}
              </span>
            </div>
            {user.role === Role.ADMIN && (
              <div className="flex items-center text-xs text-primary mt-1">
                <Shield className="h-3 w-3 mr-1" />
                <span>Administrator privileges</span>
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-0 flex justify-between">
            <Button variant="ghost" size="sm" onClick={() => onEdit(user)}>
              <Pencil className="h-4 w-4 mr-1" /> Edit
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onEdit(user)}>
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => onDelete(user)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default UsersAdminPage;
