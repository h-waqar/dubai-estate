// users/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  MoreVertical,
  UserCog,
  Calendar,
} from "lucide-react";
// import { handleServerError } from "@/lib/handleServerError";
import { handleClientError } from "@/lib/handleClientError";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
}

const ROLES = [
  "ALL",
  "SUPER_ADMIN",
  "ADMIN",
  "EDITOR",
  "WRITER",
  "MANAGER",
  "SUPPORT",
  "USER",
];

const ITEMS_PER_PAGE = 10;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    axios
      .get<User[]>("/api/admin/users")
      .then((res) => {
        setUsers(res.data);
        setFilteredUsers(res.data);
      })
      .catch((err: unknown) => {
        const error = handleClientError(err);
        console.error("Failed to load users:", error.message);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = users;

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by role
    if (selectedRole !== "ALL") {
      result = result.filter((u) => u.role === selectedRole);
    }

    // Filter by date range
    if (dateFrom) {
      result = result.filter(
        (u) => new Date(u.createdAt) >= new Date(dateFrom)
      );
    }
    if (dateTo) {
      result = result.filter((u) => new Date(u.createdAt) <= new Date(dateTo));
    }

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [searchQuery, selectedRole, dateFrom, dateTo, users]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "destructive";
      case "ADMIN":
        return "default";
      case "EDITOR":
      case "MANAGER":
        return "secondary";
      default:
        return "outline";
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedRole("ALL");
    setDateFrom("");
    setDateTo("");
  };

  const hasActiveFilters =
    searchQuery || selectedRole !== "ALL" || dateFrom || dateTo;

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await axios.patch(`/api/admin/users/${userId}`, { role: newRole });
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (error: unknown) {
      console.error("Failed to update user role", error);
      // Optionally, set an error state to display a message to the user
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  return (
    <div className="min-h-screen p-3 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Users
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and view all users in the system
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <Card className="p-3 sm:p-4">
            <div className="text-xs sm:text-sm font-medium text-muted-foreground">
              Total Users
            </div>
            <div className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold">
              {users.length}
            </div>
          </Card>
          <Card className="p-3 sm:p-4">
            <div className="text-xs sm:text-sm font-medium text-muted-foreground">
              Admins
            </div>
            <div className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold">
              {
                users.filter(
                  (u) => u.role === "ADMIN" || u.role === "SUPER_ADMIN"
                ).length
              }
            </div>
          </Card>
          <Card className="p-3 sm:p-4">
            <div className="text-xs sm:text-sm font-medium text-muted-foreground">
              Filtered
            </div>
            <div className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold">
              {filteredUsers.length}
            </div>
          </Card>
          <Card className="p-3 sm:p-4">
            <div className="text-xs sm:text-sm font-medium text-muted-foreground">
              This Month
            </div>
            <div className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold">
              {
                users.filter((u) => {
                  const date = new Date(u.createdAt);
                  const now = new Date();
                  return (
                    date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear()
                  );
                }).length
              }
            </div>
          </Card>
        </div>

        {/* Filters Section */}
        <Card className="p-4">
          <div className="space-y-4">
            {/* Mobile Filter Toggle */}
            <div className="flex items-center justify-between sm:hidden">
              <h2 className="text-sm font-semibold">Filters</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {/* Filter Controls */}
            <div
              className={`space-y-3 ${
                showFilters ? "block" : "hidden"
              } sm:block`}
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {/* Search */}
                <div className="relative sm:col-span-2">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Role Filter */}
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Date Range Toggle */}
                <Button
                  variant="outline"
                  onClick={() => {
                    const dateFilters = document.getElementById("date-filters");
                    if (dateFilters) {
                      dateFilters.classList.toggle("hidden");
                    }
                  }}
                  className="w-full"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Date Range
                </Button>
              </div>

              {/* Date Range Filters */}
              <div
                id="date-filters"
                className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="date-from" className="text-xs">
                    From Date
                  </Label>
                  <Input
                    id="date-from"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-to" className="text-xs">
                    To Date
                  </Label>
                  <Input
                    id="date-to"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="w-full sm:w-auto"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Users Table */}
        <Card className="overflow-hidden">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Loading users...
                </p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-medium">No users found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {hasActiveFilters
                    ? "Try adjusting your filters"
                    : "No users available"}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">
                          {u.name ?? "N/A"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {u.email}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(u.role)}>
                            {u.role.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewUser(u)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                  Change Role
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {ROLES.filter((r) => r !== "ALL").map(
                                  (role) => (
                                    <DropdownMenuItem
                                      key={role}
                                      onClick={() =>
                                        handleRoleChange(u.id, role)
                                      }
                                      disabled={u.role === role}
                                    >
                                      <UserCog className="mr-2 h-4 w-4" />
                                      {role.replace(/_/g, " ")}
                                    </DropdownMenuItem>
                                  )
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="divide-y sm:hidden">
                {paginatedUsers.map((u) => (
                  <div key={u.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {u.name ?? "N/A"}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground truncate">
                          {u.email}
                        </div>
                      </div>
                      <Badge
                        variant={getRoleBadgeVariant(u.role)}
                        className="shrink-0"
                      >
                        {u.role.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Joined {new Date(u.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewUser(u)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {ROLES.filter((r) => r !== "ALL").map((role) => (
                              <DropdownMenuItem
                                key={role}
                                onClick={() => handleRoleChange(u.id, role)}
                                disabled={u.role === role}
                              >
                                <UserCog className="mr-2 h-4 w-4" />
                                {role.replace(/_/g, " ")}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t bg-muted/50 px-4 py-3 sm:px-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing{" "}
                      <span className="font-medium">{startIndex + 1}</span> to{" "}
                      <span className="font-medium">
                        {Math.min(endIndex, filteredUsers.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {filteredUsers.length}
                      </span>{" "}
                      users
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Previous</span>
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            return (
                              <Button
                                key={i}
                                variant={
                                  currentPage === pageNum
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className="h-8 w-8 p-0"
                              >
                                {pageNum}
                              </Button>
                            );
                          }
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>

      {/* View User Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete information about this user
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 text-sm font-medium text-muted-foreground">
                  Name
                </div>
                <div className="col-span-2 text-sm">
                  {selectedUser.name ?? "Not provided"}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 text-sm font-medium text-muted-foreground">
                  Email
                </div>
                <div className="col-span-2 text-sm break-all">
                  {selectedUser.email}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 text-sm font-medium text-muted-foreground">
                  Role
                </div>
                <div className="col-span-2">
                  <Badge variant={getRoleBadgeVariant(selectedUser.role)}>
                    {selectedUser.role.replace(/_/g, " ")}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 text-sm font-medium text-muted-foreground">
                  User ID
                </div>
                <div className="col-span-2 text-sm font-mono ">
                  {selectedUser.id}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 text-sm font-medium text-muted-foreground">
                  Created At
                </div>
                <div className="col-span-2 text-sm">
                  {new Date(selectedUser.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
