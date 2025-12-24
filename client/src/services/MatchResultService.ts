import { NotificationService } from './NotificationService';

interface MatchResult {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'scheduled' | 'live' | 'halftime' | 'finished';
  venue: string;
  highlights?: string[];
}

const FOLLOWED_TEAMS_KEY = 'followed_teams';
const NOTIFIED_RESULTS_KEY = 'notified_match_results';

export function getFollowedTeams(): string[] {
  try {
    const stored = localStorage.getItem(FOLLOWED_TEAMS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function followTeam(teamCode: string): void {
  const teams = getFollowedTeams();
  if (!teams.includes(teamCode)) {
    teams.push(teamCode);
    localStorage.setItem(FOLLOWED_TEAMS_KEY, JSON.stringify(teams));
  }
}

export function unfollowTeam(teamCode: string): void {
  const teams = getFollowedTeams().filter(t => t !== teamCode);
  localStorage.setItem(FOLLOWED_TEAMS_KEY, JSON.stringify(teams));
}

export function isTeamFollowed(teamCode: string): boolean {
  return getFollowedTeams().includes(teamCode);
}

function getNotifiedResults(): Set<number> {
  try {
    const stored = localStorage.getItem(NOTIFIED_RESULTS_KEY);
    return new Set(stored ? JSON.parse(stored) : []);
  } catch {
    return new Set();
  }
}

function markResultNotified(matchId: number): void {
  const notified = getNotifiedResults();
  notified.add(matchId);
  const arr = Array.from(notified).slice(-100);
  localStorage.setItem(NOTIFIED_RESULTS_KEY, JSON.stringify(arr));
}

export async function checkMatchResults(): Promise<void> {
  const followedTeams = getFollowedTeams();
  if (followedTeams.length === 0) return;

  try {
    const response = await fetch('/api/matches/results');
    if (!response.ok) return;
    
    const results: MatchResult[] = await response.json();
    const notified = getNotifiedResults();

    for (const result of results) {
      if (result.status !== 'finished') continue;
      if (notified.has(result.matchId)) continue;

      const homeCode = getTeamCode(result.homeTeam);
      const awayCode = getTeamCode(result.awayTeam);

      const followedHome = followedTeams.includes(homeCode);
      const followedAway = followedTeams.includes(awayCode);

      if (!followedHome && !followedAway) continue;

      triggerResultNotification(result, followedHome ? homeCode : awayCode);
      markResultNotified(result.matchId);
    }
  } catch (error) {
    console.error('Failed to check match results:', error);
  }
}

function getTeamCode(teamName: string): string {
  const codeMap: Record<string, string> = {
    'United States': 'USA',
    'Mexico': 'MEX',
    'Canada': 'CAN',
    'Brazil': 'BRA',
    'Argentina': 'ARG',
    'England': 'ENG',
    'France': 'FRA',
    'Germany': 'GER',
    'Spain': 'ESP',
    'Portugal': 'POR',
    'Netherlands': 'NED',
    'Belgium': 'BEL',
    'Italy': 'ITA',
    'Croatia': 'CRO',
    'Morocco': 'MAR',
    'Japan': 'JPN',
    'South Korea': 'KOR',
    'Australia': 'AUS',
    'Saudi Arabia': 'KSA',
    'Qatar': 'QAT',
    'Iran': 'IRN',
    'Uruguay': 'URU',
    'Colombia': 'COL',
    'Ecuador': 'ECU',
    'Chile': 'CHI',
    'Peru': 'PER',
    'Paraguay': 'PAR',
    'Venezuela': 'VEN',
    'Bolivia': 'BOL',
    'Senegal': 'SEN',
    'Ghana': 'GHA',
    'Cameroon': 'CMR',
    'Nigeria': 'NGA',
    'Egypt': 'EGY',
    'Tunisia': 'TUN',
    'Algeria': 'ALG',
    'South Africa': 'RSA',
    'Poland': 'POL',
    'Denmark': 'DEN',
    'Switzerland': 'SUI',
    'Austria': 'AUT',
    'Serbia': 'SRB',
    'Ukraine': 'UKR',
    'Czech Republic': 'CZE',
    'Sweden': 'SWE',
    'Norway': 'NOR',
    'Scotland': 'SCO',
    'Wales': 'WAL',
    'Republic of Ireland': 'IRL',
    'Costa Rica': 'CRC',
    'Panama': 'PAN',
    'Honduras': 'HON',
    'Jamaica': 'JAM',
    'New Zealand': 'NZL',
  };
  return codeMap[teamName] || teamName.substring(0, 3).toUpperCase();
}

function triggerResultNotification(result: MatchResult, followedTeamCode: string): void {
  const homeCode = getTeamCode(result.homeTeam);
  const awayCode = getTeamCode(result.awayTeam);
  
  const followedIsHome = homeCode === followedTeamCode;
  const followedScore = followedIsHome ? result.homeScore : result.awayScore;
  const opponentScore = followedIsHome ? result.awayScore : result.homeScore;
  const opponentName = followedIsHome ? result.awayTeam : result.homeTeam;

  let icon: string;
  let title: string;
  let message: string;

  if (followedScore > opponentScore) {
    icon = '🎉';
    title = `Victory! ${followedTeamCode} Wins!`;
    message = `${result.homeTeam} ${result.homeScore} - ${result.awayScore} ${result.awayTeam}. Your team advances!`;
  } else if (followedScore < opponentScore) {
    icon = '😔';
    title = `${followedTeamCode} Lost`;
    message = `${result.homeTeam} ${result.homeScore} - ${result.awayScore} ${result.awayTeam}. Better luck next time.`;
  } else {
    icon = '🤝';
    title = `Draw: ${followedTeamCode} vs ${getTeamCode(opponentName)}`;
    message = `${result.homeTeam} ${result.homeScore} - ${result.awayScore} ${result.awayTeam}. The match ended in a draw.`;
  }

  NotificationService.addNotification({
    type: 'matchResult',
    title,
    message,
    icon,
    priority: 'high',
  });
}

export function simulateMatchResult(
  homeTeam: string, 
  awayTeam: string, 
  homeScore: number, 
  awayScore: number
): void {
  const result: MatchResult = {
    matchId: Date.now(),
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    status: 'finished',
    venue: 'Test Stadium',
  };

  const followedTeams = getFollowedTeams();
  const homeCode = getTeamCode(homeTeam);
  const awayCode = getTeamCode(awayTeam);

  if (followedTeams.includes(homeCode)) {
    triggerResultNotification(result, homeCode);
  } else if (followedTeams.includes(awayCode)) {
    triggerResultNotification(result, awayCode);
  }
}

export { getTeamCode };
