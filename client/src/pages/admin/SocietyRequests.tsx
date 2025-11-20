import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Building2, Trash2, Loader2 } from "lucide-react";
import type { SocietyRequest } from "@shared/schema";
import AdminLayout from "@/components/AdminLayout";

export default function SocietyRequests() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery<SocietyRequest[]>({
    queryKey: ["/api/admin/society-requests"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/society-requests/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete request");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/society-requests"] });
      toast({ title: "Request deleted successfully" });
    },
    onError: () => {
      toast({
        title: "Failed to delete request",
        variant: "destructive",
      });
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building2 className="w-8 h-8 text-primary" />
              New Society Requests
            </h1>
            <p className="text-muted-foreground mt-1">
              Review customer requests for delivery to new societies
            </p>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          </div>
        ) : requests && requests.length > 0 ? (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Society Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Date Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.name}</TableCell>
                    <TableCell>{request.societyName}</TableCell>
                    <TableCell>{request.phone}</TableCell>
                    <TableCell>
                      {request.createdAt
                        ? new Date(request.createdAt).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this request?")) {
                            deleteMutation.mutate(request.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No society requests found
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
