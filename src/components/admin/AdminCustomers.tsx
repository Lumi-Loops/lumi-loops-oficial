"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Customer {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

interface CustomerDetails extends Customer {
  appointment_count?: number;
  payment_count?: number;
  download_count?: number;
  last_activity?: string;
}

export function AdminCustomers() {
  const supabase = createClient();
  const [customers, setCustomers] = useState<CustomerDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerDetails | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      if (filterRole !== "all") {
        query = query.eq("role", filterRole);
      } else {
        query = query.neq("role", "admin");
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query.range(from, to);

      if (error) {
        console.error("Supabase error:", error.message || error);
        throw error;
      }

      // Fetch additional activity data
      const enrichedData = await Promise.all(
        (data || []).map(async (customer: Customer) => {
          const { data: activity } = await supabase
            .from("user_activity_cache")
            .select("*")
            .eq("user_id", customer.id)
            .single();

          return {
            ...customer,
            appointment_count: activity?.total_appointments || 0,
            payment_count: activity?.total_payments || 0,
            download_count: activity?.total_downloads || 0,
            last_activity: activity?.last_login || null,
          };
        })
      );

      setCustomers(enrichedData);
      setTotalCount(count || 0);
    } catch (error: any) {
      console.error("Error fetching customers:", error?.message || error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [filterRole, searchTerm]);

  useEffect(() => {
    fetchCustomers();
  }, [page, filterRole]);

  const filteredCustomers = customers.filter((c) => {
    const searchOk =
      !searchTerm ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    return searchOk;
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>
            View and manage registered customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="client">Clients</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Appointments</TableHead>
                  <TableHead>Payments</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Loading customers...
                    </TableCell>
                  </TableRow>
                ) : filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No customers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-mono text-sm">
                        {customer.email}
                      </TableCell>
                      <TableCell>{customer.full_name || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {customer.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {customer.appointment_count}
                      </TableCell>
                      <TableCell className="text-center">
                        {customer.payment_count}
                      </TableCell>
                      <TableCell className="text-center">
                        {customer.download_count}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setShowDetails(true);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {(page - 1) * pageSize + 1} -{" "}
              {Math.min(page * pageSize, totalCount)} of {totalCount} customers
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedCustomer && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
              <DialogDescription>
                Full information for {selectedCustomer.email}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-600">Email</div>
                  <div className="text-sm font-mono">
                    {selectedCustomer.email}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Full Name
                  </div>
                  <div className="text-sm">
                    {selectedCustomer.full_name || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Role</div>
                  <Badge variant="outline" className="capitalize">
                    {selectedCustomer.role}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Account ID
                  </div>
                  <div className="text-xs font-mono break-all">
                    {selectedCustomer.id}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="text-sm font-medium mb-3">Activity Summary</div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-3 rounded">
                    <div className="text-xs text-blue-600 font-medium">
                      Total Appointments
                    </div>
                    <div className="text-2xl font-bold text-blue-900">
                      {selectedCustomer.appointment_count}
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <div className="text-xs text-green-600 font-medium">
                      Total Payments
                    </div>
                    <div className="text-2xl font-bold text-green-900">
                      {selectedCustomer.payment_count}
                    </div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <div className="text-xs text-purple-600 font-medium">
                      Total Downloads
                    </div>
                    <div className="text-2xl font-bold text-purple-900">
                      {selectedCustomer.download_count}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="text-sm font-medium mb-3">Account Timeline</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Created</span>
                    <span>
                      {new Date(selectedCustomer.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated</span>
                    <span>
                      {new Date(selectedCustomer.updated_at).toLocaleString()}
                    </span>
                  </div>
                  {selectedCustomer.last_activity && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Activity</span>
                      <span>
                        {new Date(
                          selectedCustomer.last_activity
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
