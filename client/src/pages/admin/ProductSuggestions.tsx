import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, Eye, Trash2, Loader2 } from "lucide-react";
import type { ProductSuggestion } from "@shared/schema";
import AdminLayout from "@/components/AdminLayout";

export default function ProductSuggestions() {
  const [selectedSuggestion, setSelectedSuggestion] = useState<ProductSuggestion | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: suggestions, isLoading } = useQuery<ProductSuggestion[]>({
    queryKey: ["/api/admin/product-suggestions"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(`/api/admin/product-suggestions/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/product-suggestions"] });
      toast({ title: "Status updated successfully" });
    },
  });

  const updateNotesMutation = useMutation({
    mutationFn: async ({ id, adminNotes }: { id: string; adminNotes: string }) => {
      const response = await fetch(`/api/admin/product-suggestions/${id}/notes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes }),
      });
      if (!response.ok) throw new Error("Failed to update notes");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/product-suggestions"] });
      toast({ title: "Notes updated successfully" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/product-suggestions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete suggestion");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/product-suggestions"] });
      setDetailModalOpen(false);
      toast({ title: "Suggestion deleted successfully" });
    },
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "reviewed":
        return "default";
      case "implemented":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const filteredSuggestions = suggestions?.filter(
    (s) => filterStatus === "all" || s.status === filterStatus
  ) || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Lightbulb className="w-8 h-8 text-primary" />
              Product Suggestions
            </h1>
            <p className="text-muted-foreground mt-1">
              Review and manage customer product suggestions
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Label htmlFor="status-filter">Filter by status:</Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]" id="status-filter">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="implemented">Implemented</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          </div>
        ) : filteredSuggestions.length > 0 ? (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>User Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuggestions.map((suggestion) => (
                  <TableRow key={suggestion.id}>
                    <TableCell className="font-medium">
                      {suggestion.suggestedProductName}
                    </TableCell>
                    <TableCell>{suggestion.suggestedCategory || "—"}</TableCell>
                    <TableCell>{suggestion.userEmail || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(suggestion.status || "pending")}>
                        {suggestion.status || "pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {suggestion.createdAt
                        ? new Date(suggestion.createdAt).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedSuggestion(suggestion);
                          setAdminNotes(suggestion.adminNotes || "");
                          setDetailModalOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No product suggestions found
          </div>
        )}

        {/* Detail Modal */}
        <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                Product Suggestion Details
              </DialogTitle>
              <DialogDescription>
                Review and manage this product suggestion
              </DialogDescription>
            </DialogHeader>

            {selectedSuggestion && (
              <div className="space-y-6">
                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <Label className="font-semibold">Product Name</Label>
                    <p className="text-lg mt-1">{selectedSuggestion.suggestedProductName}</p>
                  </div>

                  {selectedSuggestion.productDescription && (
                    <div>
                      <Label className="font-semibold">Description</Label>
                      <p className="mt-1 text-muted-foreground">
                        {selectedSuggestion.productDescription}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-semibold">Category</Label>
                      <p className="mt-1">{selectedSuggestion.suggestedCategory || "—"}</p>
                    </div>
                    <div>
                      <Label className="font-semibold">User Email</Label>
                      <p className="mt-1">{selectedSuggestion.userEmail || "—"}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="font-semibold">Submitted</Label>
                    <p className="mt-1">
                      {selectedSuggestion.createdAt
                        ? new Date(selectedSuggestion.createdAt).toLocaleString()
                        : "—"}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={selectedSuggestion.status || "pending"}
                    onValueChange={(value) =>
                      updateStatusMutation.mutate({ id: selectedSuggestion.id, status: value })
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="implemented">Implemented</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Admin Notes */}
                <div className="space-y-2">
                  <Label htmlFor="adminNotes">Admin Notes (Internal)</Label>
                  <Textarea
                    id="adminNotes"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add internal notes about this suggestion..."
                    rows={4}
                  />
                  <Button
                    onClick={() =>
                      updateNotesMutation.mutate({
                        id: selectedSuggestion.id,
                        adminNotes,
                      })
                    }
                    disabled={updateNotesMutation.isPending}
                  >
                    {updateNotesMutation.isPending ? "Saving..." : "Save Notes"}
                  </Button>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this suggestion?")) {
                        deleteMutation.mutate(selectedSuggestion.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                  <Button variant="outline" onClick={() => setDetailModalOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
