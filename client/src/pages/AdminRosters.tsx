/**
 * Admin page for pasting in a team's player roster.
 *
 * Use case: When FIFA publishes the official 26-man rosters around June 1,
 * Mark can replace any team's roster by selecting it and pasting the
 * official list. Each paste fully replaces that team's existing players
 * (which is what you want — late roster changes are the whole point).
 *
 * The parser is forgiving: it handles comma- or pipe-separated lines,
 * skips blank lines, and treats lines like "Goalkeepers:" as a position
 * hint for the following entries (matches FIFA's roster page format).
 */
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { apiUrl } from "@/lib/apiConfig";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "wouter";

interface Team {
  id: number;
  name: string;
  groupStage?: string | null;
}

interface Player {
  id: number;
  teamId: number;
  name: string;
  position: string;
  number: number | null;
  currentClub: string | null;
}

const SAMPLE_FORMAT = `Goalkeepers:
Mike Maignan, Goalkeeper, 16, AC Milan
Brice Samba, Goalkeeper, 23, Lens
Lucas Chevalier, Goalkeeper, 1, Lille

Defenders:
Theo Hernandez, Defender, 22, AC Milan
Jules Koundé, Defender, 5, Barcelona

Midfielders:
N'Golo Kanté, Midfielder, 13, Al-Ittihad
Warren Zaïre-Emery, Midfielder, 18, PSG

Forwards:
Kylian Mbappé, Forward, 10, Real Madrid
Ousmane Dembélé, Forward, 11, PSG`;

export default function AdminRosters() {
  const queryClient = useQueryClient();
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [rosterText, setRosterText] = useState("");
  const [showSample, setShowSample] = useState(false);

  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
    queryFn: async () => {
      const res = await fetch(apiUrl("/api/teams"));
      if (!res.ok) throw new Error("Failed to load teams");
      return res.json();
    },
  });

  const { data: allPlayers = [] } = useQuery<Player[]>({
    queryKey: ["/api/players"],
    queryFn: async () => {
      const res = await fetch(apiUrl("/api/players"));
      if (!res.ok) throw new Error("Failed to load players");
      return res.json();
    },
  });

  const sortedTeams = useMemo(
    () => [...teams].sort((a, b) => a.name.localeCompare(b.name)),
    [teams],
  );

  const currentRoster = useMemo(
    () => allPlayers.filter((p) => p.teamId === selectedTeamId),
    [allPlayers, selectedTeamId],
  );

  const selectedTeam = teams.find((t) => t.id === selectedTeamId) || null;

  const replaceMutation = useMutation({
    mutationFn: async () => {
      const password = sessionStorage.getItem("admin_password") || "admin2026cc";
      const res = await apiRequest("POST", "/api/admin/players/replace-team-roster", {
        password,
        teamId: selectedTeamId,
        rosterText,
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Failed");
      return body;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      setRosterText("");
    },
  });

  return (
    <Layout pageTitle="Admin: Player Rosters">
      <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="-ml-2 mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/20 rounded-xl">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-white">Paste Team Roster</h2>
            <p className="text-sm text-muted-foreground">
              Replace a team's roster from a pasted text block. Used when FIFA publishes the official 26-man squad and the auto-sync hasn't caught up.
            </p>
          </div>
        </div>

        <Card className="bg-card border-white/10">
          <CardHeader>
            <CardTitle className="text-base">1. Pick a team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {sortedTeams.map((team) => {
                const rosterSize = allPlayers.filter((p) => p.teamId === team.id).length;
                const isSparse = rosterSize < 20;
                const isSelected = team.id === selectedTeamId;
                return (
                  <button
                    key={team.id}
                    onClick={() => setSelectedTeamId(team.id)}
                    className={`px-3 py-2 rounded-lg text-xs text-left transition-all border ${
                      isSelected
                        ? "bg-primary/20 border-primary text-white"
                        : isSparse
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-200 hover:bg-amber-500/20"
                        : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                    }`}
                  >
                    <div className="font-medium truncate">{team.name}</div>
                    <div className="text-[10px] opacity-70">{rosterSize} players</div>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              Amber-highlighted teams have fewer than 20 players in the database (likely incomplete — prioritize these).
            </p>
          </CardContent>
        </Card>

        {selectedTeam && (
          <>
            <Card className="bg-card border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">
                  2. Current roster for {selectedTeam.name} ({currentRoster.length} players)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentRoster.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No players in the database for this team yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                    {currentRoster
                      .sort((a, b) => (a.position || "").localeCompare(b.position || "") || a.name.localeCompare(b.name))
                      .map((p) => (
                        <div key={p.id} className="flex items-center justify-between border-b border-white/5 py-1">
                          <span className="text-white">{p.name}</span>
                          <span className="text-xs text-muted-foreground">{p.position}{p.number ? ` · #${p.number}` : ""}</span>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-white/10">
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>3. Paste new roster</span>
                  <button
                    type="button"
                    onClick={() => setShowSample(!showSample)}
                    className="text-xs text-primary hover:underline"
                  >
                    {showSample ? "Hide example" : "Show example format"}
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {showSample && (
                  <pre className="text-xs bg-black/40 border border-white/10 rounded-lg p-3 overflow-x-auto text-muted-foreground whitespace-pre-wrap">
                    {SAMPLE_FORMAT}
                  </pre>
                )}
                <Textarea
                  value={rosterText}
                  onChange={(e) => setRosterText(e.target.value)}
                  rows={14}
                  placeholder={
                    "One player per line. Comma or pipe separated:\n" +
                    "Name, Position, Number, Club\n\n" +
                    'You can also paste FIFA-style rosters with "Goalkeepers:", "Defenders:" etc. headers.\n' +
                    "Number and Club are optional."
                  }
                  className="font-mono text-xs"
                />
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    Submitting will <strong className="text-amber-400">REPLACE</strong> the current {currentRoster.length}-player roster for {selectedTeam.name}.
                  </p>
                  <Button
                    onClick={() => replaceMutation.mutate()}
                    disabled={replaceMutation.isPending || !rosterText.trim()}
                  >
                    {replaceMutation.isPending ? (
                      <><RefreshCw className="w-3 h-3 mr-2 animate-spin" />Saving…</>
                    ) : (
                      "Replace Roster"
                    )}
                  </Button>
                </div>
                {replaceMutation.isSuccess && (
                  <div className="flex items-center gap-2 text-sm text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Replaced {selectedTeam.name} roster with {(replaceMutation.data as any)?.inserted} players.
                  </div>
                )}
                {replaceMutation.isError && (
                  <div className="flex items-center gap-2 text-sm text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    {(replaceMutation.error as Error)?.message || "Save failed."}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
