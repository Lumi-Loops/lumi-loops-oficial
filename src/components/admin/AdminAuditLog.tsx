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
import { Download } from "lucide-react";

interface AuditLogEntry {
  id: string;
  admin_id: string;
  action: string;
  target_type: string;
  target_id: string;
  changes: Record<string, any>;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

const actionColors: Record<string, string> = {
  create: "bg-green-100 text-green-800",
  update: "bg-blue-100 text-blue-800",
  delete: "bg-red-100 text-red-800",
  assign: "bg-purple-100 text-purple-800",
};

export function AdminAuditLog() {
  const supabase = createClient();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterAdminId, setFilterAdminId] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("admin_audit_log")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      if (filterAction !== "all") {
        query = query.eq("action", filterAction);
      }

      if (filterAdminId) {
        query = query.eq("admin_id", filterAdminId);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query.range(from, to);

      if (error) {
        console.error("Supabase error:", error.message || error);
        throw error;
      }
      setLogs(data || []);
      setTotalCount(count || 0);
    } catch (error: any) {
      console.error("Error fetching audit logs:", error?.message || error);
      setLogs([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [filterAction, filterAdminId]);

  useEffect(() => {
    fetchLogs();
  }, [page, filterAction, filterAdminId]);

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Admin ID",
      "Action",
      "Target Type",
      "Target ID",
      "Changes",
      "IP Address",
      "User Agent",
      "Created At",
    ];

    const rows = logs.map((log) => [
      log.id,
      log.admin_id,
      log.action,
      log.target_type,
      log.target_id,
      JSON.stringify(log.changes),
      log.ip_address,
      log.user_agent,
      new Date(log.created_at).toISOString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Registro de Auditoría</CardTitle>
              <CardDescription>
                Todas las acciones administrativas
              </CardDescription>
            </div>
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Filtrar por Admin ID..."
              value={filterAdminId}
              onChange={(e) => setFilterAdminId(e.target.value)}
            />
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las acciones</SelectItem>
                <SelectItem value="create">Crear</SelectItem>
                <SelectItem value="update">Actualizar</SelectItem>
                <SelectItem value="delete">Eliminar</SelectItem>
                <SelectItem value="assign">Asignar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Objetivo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Detalles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Cargando...
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No hay registros
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        {log.admin_id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            actionColors[log.action] ||
                            "bg-gray-100 text-gray-800"
                          }
                        >
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{log.target_type}</div>
                          <div className="text-gray-500 font-mono text-xs">
                            {log.target_id.substring(0, 12)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(log.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedLog(log);
                            setShowDetails(true);
                          }}
                        >
                          Ver
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
              Mostrando {(page - 1) * pageSize + 1} -{" "}
              {Math.min(page * pageSize, totalCount)} de {totalCount} registros
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedLog && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalles del Registro</DialogTitle>
              <DialogDescription>
                Información completa de la acción realizada
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Admin ID
                  </div>
                  <div className="font-mono text-sm">
                    {selectedLog.admin_id}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Acción
                  </div>
                  <Badge className={actionColors[selectedLog.action]}>
                    {selectedLog.action}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    Objetivo
                  </div>
                  <div className="text-sm">{selectedLog.target_type}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    ID del Objetivo
                  </div>
                  <div className="font-mono text-sm">
                    {selectedLog.target_id}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">
                  Cambios
                </div>
                <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto max-h-40">
                  {JSON.stringify(selectedLog.changes, null, 2)}
                </pre>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-600">
                    IP Address
                  </div>
                  <div className="text-sm">{selectedLog.ip_address}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Fecha</div>
                  <div className="text-sm">
                    {new Date(selectedLog.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">
                  User Agent
                </div>
                <div className="text-xs bg-gray-50 p-2 rounded overflow-auto">
                  {selectedLog.user_agent}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
