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

interface SupportTicket {
  id: string;
  inquiry_id: string;
  status: "new" | "in_progress" | "resolved" | "closed";
  priority: "low" | "normal" | "high" | "urgent";
  assigned_to?: string;
  visitor_name: string;
  visitor_email: string;
  message: string;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, string> = {
  new: "bg-red-100 text-red-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
};

const priorityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-800",
  normal: "bg-gray-100 text-gray-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

export function AdminTicketsInbox() {
  const supabase = createClient();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("support_tickets")
        .select(
          `id, inquiry_id, status, priority, assigned_to, created_at, updated_at,
           visitor_inquiries:inquiry_id(name, email, message)`
        )
        .neq("status", "closed")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error.message || error);
        throw error;
      }

      const formatted = (data || []).map((t: any) => ({
        ...t,
        visitor_name: t.visitor_inquiries?.name || "Unknown",
        visitor_email: t.visitor_inquiries?.email || "Unknown",
        message: t.visitor_inquiries?.message || "",
      }));

      setTickets(formatted);
    } catch (error: any) {
      console.error("Error fetching tickets:", error?.message || error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 30000);
    return () => clearInterval(interval);
  }, []);

  const assignToMe = async (ticketId: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user.id) return;

      await supabase
        .from("support_tickets")
        .update({
          assigned_to: session.session.user.id,
          status: "in_progress",
          updated_at: new Date().toISOString(),
        })
        .eq("id", ticketId);

      fetchTickets();
    } catch (error) {
      console.error("Error assigning ticket:", error);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const statusOk = filterStatus === "all" || t.status === filterStatus;
    const priorityOk =
      filterPriority === "all" || t.priority === filterPriority;
    const searchOk =
      !searchTerm ||
      t.visitor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.visitor_email.toLowerCase().includes(searchTerm.toLowerCase());
    return statusOk && priorityOk && searchOk;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets de Soporte</CardTitle>
        <CardDescription>Gestiona consultas de visitantes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="new">Nuevo</SelectItem>
              <SelectItem value="in_progress">En Progreso</SelectItem>
              <SelectItem value="resolved">Resuelto</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="low">Baja</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Visitante</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No hay tickets
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono text-sm">
                      {t.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{t.visitor_name}</div>
                        <div className="text-sm text-gray-500">
                          {t.visitor_email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[t.status]}>
                        {t.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={priorityColors[t.priority]}
                        variant="outline"
                      >
                        {t.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(t.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {!t.assigned_to ? (
                        <Button size="sm" onClick={() => assignToMe(t.id)}>
                          Asignarme
                        </Button>
                      ) : (
                        <Button size="sm" variant="secondary" asChild>
                          <a href={`/admin/tickets/${t.id}`}>Detalles</a>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
