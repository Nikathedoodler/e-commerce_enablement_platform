"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, Check, Plus, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type InviteCode = {
  code: string;
  max_uses: number;
  current_uses: number;
  expires_at: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  used_by: string | null;
  used_at: string | null;
};

export default function AdminPage() {
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form state
  const [maxUses, setMaxUses] = useState("1");
  const [expiresInDays, setExpiresInDays] = useState("30");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadInviteCodes();
  }, []);

  const loadInviteCodes = async () => {
    try {
      const response = await fetch("/api/invite-codes/list?limit=50");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load invite codes");
      }

      setInviteCodes(data.inviteCodes || []);
    } catch (error) {
      console.error("Error loading invite codes:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load invite codes"
      );
    } finally {
      setLoading(false);
    }
  };

  const generateInviteCode = async () => {
    setGenerating(true);
    try {
      const response = await fetch("/api/invite-codes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maxUses: parseInt(maxUses) || 1,
          expiresInDays: expiresInDays ? parseInt(expiresInDays) : null,
          notes: notes || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate invite code");
      }

      toast.success("Invite code generated successfully!");
      setMaxUses("1");
      setExpiresInDays("30");
      setNotes("");
      loadInviteCodes();
    } catch (error) {
      console.error("Error generating invite code:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate invite code"
      );
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const isUsedUp = (currentUses: number, maxUses: number) => {
    return currentUses >= maxUses;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground">
          Manage invite codes for user registration
        </p>
      </div>

      {/* Generate New Invite Code */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Invite Code</CardTitle>
          <CardDescription>
            Create a new invite code for user registration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxUses">Max Uses</Label>
              <Input
                id="maxUses"
                type="number"
                min="1"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                placeholder="1"
              />
              <p className="text-xs text-muted-foreground">
                How many times this code can be used
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiresInDays">Expires In (Days)</Label>
              <Input
                id="expiresInDays"
                type="number"
                min="1"
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(e.target.value)}
                placeholder="30"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty for no expiration
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Beta tester invite"
              />
              <p className="text-xs text-muted-foreground">
                Internal notes about this code
              </p>
            </div>
          </div>
          <Button onClick={generateInviteCode} disabled={generating}>
            {generating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Generate Invite Code
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Invite Codes List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Invite Codes</CardTitle>
              <CardDescription>
                View and manage all invite codes
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadInviteCodes}
              disabled={loading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading invite codes...
            </div>
          ) : inviteCodes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No invite codes found. Generate your first one above!
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uses</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inviteCodes.map((code) => {
                    const expired = isExpired(code.expires_at);
                    const usedUp = isUsedUp(code.current_uses, code.max_uses);
                    const inactive = !code.is_active || expired || usedUp;

                    return (
                      <TableRow key={code.code}>
                        <TableCell className="font-mono font-semibold">
                          {code.code}
                        </TableCell>
                        <TableCell>
                          {inactive ? (
                            <Badge variant="secondary">Inactive</Badge>
                          ) : (
                            <Badge variant="default">Active</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {code.current_uses} / {code.max_uses}
                        </TableCell>
                        <TableCell>
                          {code.expires_at ? (
                            <span
                              className={
                                expired ? "text-destructive" : "text-muted-foreground"
                              }
                            >
                              {formatDate(code.expires_at)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Never</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {code.notes || "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(code.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(code.code)}
                          >
                            {copiedCode === code.code ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
