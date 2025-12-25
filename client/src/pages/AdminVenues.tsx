import { Layout } from "@/components/Layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, XCircle, Clock, MapPin, User, Mail, ExternalLink, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface WatchHubSubmission {
  id: number;
  countryCode: string;
  countryName: string;
  city: string;
  venueName: string;
  venueType: string;
  address: string | null;
  capacity: string | null;
  mapsUrl: string | null;
  website: string | null;
  phone: string | null;
  description: string | null;
  isHostCity: number;
  hostCityKey: string | null;
  submitterName: string;
  submitterEmail: string;
  status: string;
  reviewedAt: string | null;
  reviewNotes: string | null;
  createdAt: string;
}

export default function AdminVenues() {
  const queryClient = useQueryClient();
  const [showAll, setShowAll] = useState(false);
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [rejectNotes, setRejectNotes] = useState("");

  const { data: submissions = [], isLoading } = useQuery<WatchHubSubmission[]>({
    queryKey: ["/api/watch-hubs/submissions", showAll],
    queryFn: async () => {
      const url = showAll ? "/api/watch-hubs/submissions?status=all" : "/api/watch-hubs/submissions";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch submissions");
      return res.json();
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/watch-hubs/submissions/${id}/approve`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to approve");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watch-hubs/submissions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/watch-hubs/venues"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: number; notes: string }) => {
      const res = await fetch(`/api/watch-hubs/submissions/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (!res.ok) throw new Error("Failed to reject");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watch-hubs/submissions"] });
      setRejectDialog({ open: false, id: null });
      setRejectNotes("");
    },
  });

  const handleReject = () => {
    if (rejectDialog.id) {
      rejectMutation.mutate({ id: rejectDialog.id, notes: rejectNotes });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="flex items-center gap-1 text-yellow-500"><Clock className="w-4 h-4" /> Pending</span>;
      case "approved":
        return <span className="flex items-center gap-1 text-green-500"><CheckCircle className="w-4 h-4" /> Approved</span>;
      case "rejected":
        return <span className="flex items-center gap-1 text-red-500"><XCircle className="w-4 h-4" /> Rejected</span>;
      default:
        return status;
    }
  };

  const venueTypeLabels: Record<string, string> = {
    bar: "Sports Bar",
    fan_zone: "Fan Zone / Festival",
    stadium: "Stadium / Arena",
    restaurant: "Restaurant",
    public_space: "Public Viewing Space",
  };

  return (
    <Layout pageTitle="Admin: Venue Submissions">
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white">Venue Submissions</h1>
              <p className="text-sm text-muted-foreground">Review and approve user-submitted watch party venues</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={!showAll ? "default" : "outline"}
            onClick={() => setShowAll(false)}
            size="sm"
          >
            Pending Only
          </Button>
          <Button
            variant={showAll ? "default" : "outline"}
            onClick={() => setShowAll(true)}
            size="sm"
          >
            Show All
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading submissions...</div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No {showAll ? "" : "pending "}submissions yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => (
              <div key={sub.id} className="bg-card border border-white/10 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white text-lg">{sub.venueName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {sub.city}, {sub.isHostCity ? `Host City: ${sub.hostCityKey}` : sub.countryName}
                    </p>
                  </div>
                  <div className="text-sm">
                    {getStatusBadge(sub.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-2 text-white">{venueTypeLabels[sub.venueType] || sub.venueType}</span>
                  </div>
                  {sub.capacity && (
                    <div>
                      <span className="text-muted-foreground">Capacity:</span>
                      <span className="ml-2 text-white">{sub.capacity}</span>
                    </div>
                  )}
                  {sub.address && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Address:</span>
                      <span className="ml-2 text-white">{sub.address}</span>
                    </div>
                  )}
                  {sub.description && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Description:</span>
                      <span className="ml-2 text-white">{sub.description}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" /> {sub.submitterName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {sub.submitterEmail}
                  </span>
                  <span>Submitted: {new Date(sub.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-2">
                  {sub.mapsUrl && (
                    <a
                      href={sub.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary flex items-center gap-1 hover:underline"
                    >
                      <MapPin className="w-3 h-3" /> View on Maps
                    </a>
                  )}
                  {sub.website && (
                    <a
                      href={sub.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary flex items-center gap-1 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" /> Website
                    </a>
                  )}
                </div>

                {sub.status === "pending" && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                    <Button
                      onClick={() => approveMutation.mutate(sub.id)}
                      disabled={approveMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => setRejectDialog({ open: true, id: sub.id })}
                      variant="destructive"
                      size="sm"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}

                {sub.status === "rejected" && sub.reviewNotes && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-muted-foreground">Rejection Notes:</p>
                    <p className="text-sm text-red-400">{sub.reviewNotes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <Dialog open={rejectDialog.open} onOpenChange={(open) => setRejectDialog({ open, id: open ? rejectDialog.id : null })}>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle className="text-white">Reject Submission</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Optionally provide a reason for rejection:</p>
                <Textarea
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  placeholder="Reason for rejection..."
                  className="bg-background border-white/10"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setRejectDialog({ open: false, id: null })}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={rejectMutation.isPending}
                >
                  {rejectMutation.isPending ? "Rejecting..." : "Reject"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
