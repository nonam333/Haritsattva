import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Mail, Phone, Calendar, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import type { ContactSubmission } from "@shared/schema";

export default function ContactSubmissions() {
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  const { data: submissionsData, isLoading } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/contact/submissions"],
    queryFn: async () => {
      const response = await fetch("/api/contact/submissions", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch submissions");
      return response.json();
    },
  });

  // Sort submissions by latest first
  const submissions = submissionsData?.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Descending order (latest first)
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Contact Submissions</h1>
          <p className="text-muted-foreground">View all customer inquiries</p>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Message Preview</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions?.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.name}</TableCell>
                  <TableCell>{submission.email}</TableCell>
                  <TableCell>{submission.phone || "—"}</TableCell>
                  <TableCell className="max-w-md truncate">{submission.message}</TableCell>
                  <TableCell>
                    {submission.createdAt
                      ? format(new Date(submission.createdAt), "MMM d, yyyy")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Contact Submission Details</DialogTitle>
                          <DialogDescription>
                            Full details for contact inquiry
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                          {/* Contact Information */}
                          <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Contact Information</h3>

                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                              <Mail className="w-5 h-5 text-primary mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm text-muted-foreground">Name</p>
                                <p className="font-medium">{submission.name}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                              <Mail className="w-5 h-5 text-primary mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm text-muted-foreground">Email Address</p>
                                <a
                                  href={`mailto:${submission.email}`}
                                  className="font-medium text-primary hover:underline"
                                >
                                  {submission.email}
                                </a>
                              </div>
                            </div>

                            {submission.phone && (
                              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                <Phone className="w-5 h-5 text-primary mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-sm text-muted-foreground">Phone Number</p>
                                  <a
                                    href={`tel:${submission.phone}`}
                                    className="font-medium text-primary hover:underline"
                                  >
                                    {submission.phone}
                                  </a>
                                </div>
                              </div>
                            )}

                            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                              <Calendar className="w-5 h-5 text-primary mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm text-muted-foreground">Submitted On</p>
                                <p className="font-medium">
                                  {submission.createdAt
                                    ? format(new Date(submission.createdAt), "PPP 'at' p")
                                    : "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Message */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-5 h-5 text-primary" />
                              <h3 className="font-semibold text-lg">Message</h3>
                            </div>
                            <div className="p-4 bg-muted/50 rounded-lg">
                              <p className="text-sm whitespace-pre-wrap">{submission.message}</p>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex gap-3 pt-4 border-t">
                            <Button
                              variant="default"
                              onClick={() => window.location.href = `mailto:${submission.email}`}
                              className="flex-1"
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Reply via Email
                            </Button>
                            {submission.phone && (
                              <Button
                                variant="outline"
                                onClick={() => window.location.href = `tel:${submission.phone}`}
                                className="flex-1"
                              >
                                <Phone className="w-4 h-4 mr-2" />
                                Call
                              </Button>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {submissions && submissions.length === 0 && (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">No contact submissions yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
