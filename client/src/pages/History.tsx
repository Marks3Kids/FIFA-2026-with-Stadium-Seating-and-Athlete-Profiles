import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useTranslation } from "react-i18next";
import { Trophy, TrendingUp, Users, Star, Globe, ChevronRight, Medal, X } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";

interface Tournament {
  year: number;
  host: string;
  hostFlag: string;
  winner: string;
  winnerFlag: string;
  runnerUp: string;
  runnerUpFlag: string;
  goals: number;
  matches: number;
  attendance: number;
  topScorer: string;
  topScorerGoals: number;
  teams: number;
}

const tournamentHistory: Tournament[] = [
  { year: 1930, host: "Uruguay", hostFlag: "uy", winner: "Uruguay", winnerFlag: "uy", runnerUp: "Argentina", runnerUpFlag: "ar", goals: 70, matches: 18, attendance: 590549, topScorer: "Guillermo Stábile", topScorerGoals: 8, teams: 13 },
  { year: 1934, host: "Italy", hostFlag: "it", winner: "Italy", winnerFlag: "it", runnerUp: "Czechoslovakia", runnerUpFlag: "cz", goals: 70, matches: 17, attendance: 363000, topScorer: "Oldřich Nejedlý", topScorerGoals: 5, teams: 16 },
  { year: 1938, host: "France", hostFlag: "fr", winner: "Italy", winnerFlag: "it", runnerUp: "Hungary", runnerUpFlag: "hu", goals: 84, matches: 18, attendance: 375700, topScorer: "Leônidas", topScorerGoals: 7, teams: 15 },
  { year: 1950, host: "Brazil", hostFlag: "br", winner: "Uruguay", winnerFlag: "uy", runnerUp: "Brazil", runnerUpFlag: "br", goals: 88, matches: 22, attendance: 1045246, topScorer: "Ademir", topScorerGoals: 9, teams: 13 },
  { year: 1954, host: "Switzerland", hostFlag: "ch", winner: "West Germany", winnerFlag: "de", runnerUp: "Hungary", runnerUpFlag: "hu", goals: 140, matches: 26, attendance: 768607, topScorer: "Sándor Kocsis", topScorerGoals: 11, teams: 16 },
  { year: 1958, host: "Sweden", hostFlag: "se", winner: "Brazil", winnerFlag: "br", runnerUp: "Sweden", runnerUpFlag: "se", goals: 126, matches: 35, attendance: 819810, topScorer: "Just Fontaine", topScorerGoals: 13, teams: 16 },
  { year: 1962, host: "Chile", hostFlag: "cl", winner: "Brazil", winnerFlag: "br", runnerUp: "Czechoslovakia", runnerUpFlag: "cz", goals: 89, matches: 32, attendance: 893172, topScorer: "Multiple (6 players)", topScorerGoals: 4, teams: 16 },
  { year: 1966, host: "England", hostFlag: "gb-eng", winner: "England", winnerFlag: "gb-eng", runnerUp: "West Germany", runnerUpFlag: "de", goals: 89, matches: 32, attendance: 1563135, topScorer: "Eusébio", topScorerGoals: 9, teams: 16 },
  { year: 1970, host: "Mexico", hostFlag: "mx", winner: "Brazil", winnerFlag: "br", runnerUp: "Italy", runnerUpFlag: "it", goals: 95, matches: 32, attendance: 1603975, topScorer: "Gerd Müller", topScorerGoals: 10, teams: 16 },
  { year: 1974, host: "West Germany", hostFlag: "de", winner: "West Germany", winnerFlag: "de", runnerUp: "Netherlands", runnerUpFlag: "nl", goals: 97, matches: 38, attendance: 1865753, topScorer: "Grzegorz Lato", topScorerGoals: 7, teams: 16 },
  { year: 1978, host: "Argentina", hostFlag: "ar", winner: "Argentina", winnerFlag: "ar", runnerUp: "Netherlands", runnerUpFlag: "nl", goals: 102, matches: 38, attendance: 1545791, topScorer: "Mario Kempes", topScorerGoals: 6, teams: 16 },
  { year: 1982, host: "Spain", hostFlag: "es", winner: "Italy", winnerFlag: "it", runnerUp: "West Germany", runnerUpFlag: "de", goals: 146, matches: 52, attendance: 2109723, topScorer: "Paolo Rossi", topScorerGoals: 6, teams: 24 },
  { year: 1986, host: "Mexico", hostFlag: "mx", winner: "Argentina", winnerFlag: "ar", runnerUp: "West Germany", runnerUpFlag: "de", goals: 132, matches: 52, attendance: 2394031, topScorer: "Gary Lineker", topScorerGoals: 6, teams: 24 },
  { year: 1990, host: "Italy", hostFlag: "it", winner: "West Germany", winnerFlag: "de", runnerUp: "Argentina", runnerUpFlag: "ar", goals: 115, matches: 52, attendance: 2516215, topScorer: "Salvatore Schillaci", topScorerGoals: 6, teams: 24 },
  { year: 1994, host: "USA", hostFlag: "us", winner: "Brazil", winnerFlag: "br", runnerUp: "Italy", runnerUpFlag: "it", goals: 141, matches: 52, attendance: 3587538, topScorer: "Hristo Stoichkov & Oleg Salenko", topScorerGoals: 6, teams: 24 },
  { year: 1998, host: "France", hostFlag: "fr", winner: "France", winnerFlag: "fr", runnerUp: "Brazil", runnerUpFlag: "br", goals: 171, matches: 64, attendance: 2785100, topScorer: "Davor Šuker", topScorerGoals: 6, teams: 32 },
  { year: 2002, host: "South Korea/Japan", hostFlag: "kr", winner: "Brazil", winnerFlag: "br", runnerUp: "Germany", runnerUpFlag: "de", goals: 161, matches: 64, attendance: 2705197, topScorer: "Ronaldo", topScorerGoals: 8, teams: 32 },
  { year: 2006, host: "Germany", hostFlag: "de", winner: "Italy", winnerFlag: "it", runnerUp: "France", runnerUpFlag: "fr", goals: 147, matches: 64, attendance: 3359439, topScorer: "Miroslav Klose", topScorerGoals: 5, teams: 32 },
  { year: 2010, host: "South Africa", hostFlag: "za", winner: "Spain", winnerFlag: "es", runnerUp: "Netherlands", runnerUpFlag: "nl", goals: 145, matches: 64, attendance: 3178856, topScorer: "Thomas Müller & David Villa & Wesley Sneijder & Diego Forlán", topScorerGoals: 5, teams: 32 },
  { year: 2014, host: "Brazil", hostFlag: "br", winner: "Germany", winnerFlag: "de", runnerUp: "Argentina", runnerUpFlag: "ar", goals: 171, matches: 64, attendance: 3429873, topScorer: "James Rodríguez", topScorerGoals: 6, teams: 32 },
  { year: 2018, host: "Russia", hostFlag: "ru", winner: "France", winnerFlag: "fr", runnerUp: "Croatia", runnerUpFlag: "hr", goals: 169, matches: 64, attendance: 3031768, topScorer: "Harry Kane", topScorerGoals: 6, teams: 32 },
  { year: 2022, host: "Qatar", hostFlag: "qa", winner: "Argentina", winnerFlag: "ar", runnerUp: "France", runnerUpFlag: "fr", goals: 172, matches: 64, attendance: 3404252, topScorer: "Kylian Mbappé", topScorerGoals: 8, teams: 32 },
];

const titlesByCountry = [
  { country: "Brazil", flag: "br", titles: 5, years: "1958, 1962, 1970, 1994, 2002", color: "#009C3B" },
  { country: "Germany", flag: "de", titles: 4, years: "1954, 1974, 1990, 2014", color: "#FFCE00" },
  { country: "Italy", flag: "it", titles: 4, years: "1934, 1938, 1982, 2006", color: "#FFFFFF" },
  { country: "Argentina", flag: "ar", titles: 3, years: "1978, 1986, 2022", color: "#74ACDF" },
  { country: "France", flag: "fr", titles: 2, years: "1998, 2018", color: "#0055A4" },
  { country: "Uruguay", flag: "uy", titles: 2, years: "1930, 1950", color: "#5E2D79" },
  { country: "England", flag: "gb-eng", titles: 1, years: "1966", color: "#E8112D" },
  { country: "Spain", flag: "es", titles: 1, years: "2010", color: "#AA151B" },
];

interface WinningCampaign {
  year: number;
  host: string;
  matches: { round: string; opponent: string; opponentFlag: string; score: string }[];
  highlight: string;
}

interface CountryWins {
  [country: string]: WinningCampaign[];
}

const winningCampaigns: CountryWins = {
  "Brazil": [
    {
      year: 1958,
      host: "Sweden",
      matches: [
        { round: "Group", opponent: "Austria", opponentFlag: "at", score: "3-0" },
        { round: "Group", opponent: "England", opponentFlag: "gb-eng", score: "0-0" },
        { round: "Group", opponent: "USSR", opponentFlag: "ru", score: "2-0" },
        { round: "Quarter", opponent: "Wales", opponentFlag: "gb-wls", score: "1-0" },
        { round: "Semi", opponent: "France", opponentFlag: "fr", score: "5-2" },
        { round: "Final", opponent: "Sweden", opponentFlag: "se", score: "5-2" },
      ],
      highlight: "A 17-year-old Pelé announced himself to the world, scoring 6 goals including 2 in the final. Brazil's first World Cup triumph introduced 'jogo bonito' (the beautiful game) to global audiences.",
    },
    {
      year: 1962,
      host: "Chile",
      matches: [
        { round: "Group", opponent: "Mexico", opponentFlag: "mx", score: "2-0" },
        { round: "Group", opponent: "Czechoslovakia", opponentFlag: "cz", score: "0-0" },
        { round: "Group", opponent: "Spain", opponentFlag: "es", score: "2-1" },
        { round: "Quarter", opponent: "England", opponentFlag: "gb-eng", score: "3-1" },
        { round: "Semi", opponent: "Chile", opponentFlag: "cl", score: "4-2" },
        { round: "Final", opponent: "Czechoslovakia", opponentFlag: "cz", score: "3-1" },
      ],
      highlight: "Despite losing Pelé to injury in the group stage, Garrincha stepped up brilliantly. His dribbling wizardry and 4 goals carried Brazil to back-to-back titles.",
    },
    {
      year: 1970,
      host: "Mexico",
      matches: [
        { round: "Group", opponent: "Czechoslovakia", opponentFlag: "cz", score: "4-1" },
        { round: "Group", opponent: "England", opponentFlag: "gb-eng", score: "1-0" },
        { round: "Group", opponent: "Romania", opponentFlag: "ro", score: "3-2" },
        { round: "Quarter", opponent: "Peru", opponentFlag: "pe", score: "4-2" },
        { round: "Semi", opponent: "Uruguay", opponentFlag: "uy", score: "3-1" },
        { round: "Final", opponent: "Italy", opponentFlag: "it", score: "4-1" },
      ],
      highlight: "Widely considered the greatest World Cup team ever. Pelé, Jairzinho, Tostão, Gérson, and Rivelino played breathtaking football. Brazil won all 6 matches and kept the Jules Rimet trophy permanently.",
    },
    {
      year: 1994,
      host: "USA",
      matches: [
        { round: "Group", opponent: "Russia", opponentFlag: "ru", score: "2-0" },
        { round: "Group", opponent: "Cameroon", opponentFlag: "cm", score: "3-0" },
        { round: "Group", opponent: "Sweden", opponentFlag: "se", score: "1-1" },
        { round: "R16", opponent: "USA", opponentFlag: "us", score: "1-0" },
        { round: "Quarter", opponent: "Netherlands", opponentFlag: "nl", score: "3-2" },
        { round: "Semi", opponent: "Sweden", opponentFlag: "se", score: "1-0" },
        { round: "Final", opponent: "Italy", opponentFlag: "it", score: "0-0 (3-2p)" },
      ],
      highlight: "After 24 years, Brazil returned to glory. Romário was the star with 5 goals. The final against Italy was decided on penalties after a 0-0 draw, with Roberto Baggio's famous miss.",
    },
    {
      year: 2002,
      host: "South Korea/Japan",
      matches: [
        { round: "Group", opponent: "Turkey", opponentFlag: "tr", score: "2-1" },
        { round: "Group", opponent: "China", opponentFlag: "cn", score: "4-0" },
        { round: "Group", opponent: "Costa Rica", opponentFlag: "cr", score: "5-2" },
        { round: "R16", opponent: "Belgium", opponentFlag: "be", score: "2-0" },
        { round: "Quarter", opponent: "England", opponentFlag: "gb-eng", score: "2-1" },
        { round: "Semi", opponent: "Turkey", opponentFlag: "tr", score: "1-0" },
        { round: "Final", opponent: "Germany", opponentFlag: "de", score: "2-0" },
      ],
      highlight: "The 'Three Rs' - Ronaldo, Rivaldo, and Ronaldinho - led Brazil to their 5th title. Ronaldo scored 8 goals including both in the final, completing his redemption after 1998.",
    },
  ],
  "Germany": [
    {
      year: 1954,
      host: "Switzerland",
      matches: [
        { round: "Group", opponent: "Turkey", opponentFlag: "tr", score: "4-1" },
        { round: "Group", opponent: "Hungary", opponentFlag: "hu", score: "3-8" },
        { round: "Group PO", opponent: "Turkey", opponentFlag: "tr", score: "7-2" },
        { round: "Quarter", opponent: "Yugoslavia", opponentFlag: "rs", score: "2-0" },
        { round: "Semi", opponent: "Austria", opponentFlag: "at", score: "6-1" },
        { round: "Final", opponent: "Hungary", opponentFlag: "hu", score: "3-2" },
      ],
      highlight: "The 'Miracle of Bern'. West Germany defeated the mighty Hungarians who had beaten them 8-3 in the group stage. Helmut Rahn scored the winning goal in a stunning 3-2 comeback victory.",
    },
    {
      year: 1974,
      host: "West Germany",
      matches: [
        { round: "Group", opponent: "Chile", opponentFlag: "cl", score: "1-0" },
        { round: "Group", opponent: "Australia", opponentFlag: "au", score: "3-0" },
        { round: "Group", opponent: "East Germany", opponentFlag: "de", score: "0-1" },
        { round: "2nd Group", opponent: "Yugoslavia", opponentFlag: "rs", score: "2-0" },
        { round: "2nd Group", opponent: "Sweden", opponentFlag: "se", score: "4-2" },
        { round: "2nd Group", opponent: "Poland", opponentFlag: "pl", score: "1-0" },
        { round: "Final", opponent: "Netherlands", opponentFlag: "nl", score: "2-1" },
      ],
      highlight: "Franz Beckenbauer's 'Der Kaiser' era. Despite going behind to a Cruyff-inspired Dutch penalty, Gerd Müller's winning goal secured the title on home soil.",
    },
    {
      year: 1990,
      host: "Italy",
      matches: [
        { round: "Group", opponent: "Yugoslavia", opponentFlag: "rs", score: "4-1" },
        { round: "Group", opponent: "UAE", opponentFlag: "ae", score: "5-1" },
        { round: "Group", opponent: "Colombia", opponentFlag: "co", score: "1-1" },
        { round: "R16", opponent: "Netherlands", opponentFlag: "nl", score: "2-1" },
        { round: "Quarter", opponent: "Czechoslovakia", opponentFlag: "cz", score: "1-0" },
        { round: "Semi", opponent: "England", opponentFlag: "gb-eng", score: "1-1 (4-3p)" },
        { round: "Final", opponent: "Argentina", opponentFlag: "ar", score: "1-0" },
      ],
      highlight: "Redemption for 1986. Andreas Brehme's late penalty defeated Maradona's Argentina in a rematch of the previous final. Lothar Matthäus was the driving force.",
    },
    {
      year: 2014,
      host: "Brazil",
      matches: [
        { round: "Group", opponent: "Portugal", opponentFlag: "pt", score: "4-0" },
        { round: "Group", opponent: "Ghana", opponentFlag: "gh", score: "2-2" },
        { round: "Group", opponent: "USA", opponentFlag: "us", score: "1-0" },
        { round: "R16", opponent: "Algeria", opponentFlag: "dz", score: "2-1 (aet)" },
        { round: "Quarter", opponent: "France", opponentFlag: "fr", score: "1-0" },
        { round: "Semi", opponent: "Brazil", opponentFlag: "br", score: "7-1" },
        { round: "Final", opponent: "Argentina", opponentFlag: "ar", score: "1-0 (aet)" },
      ],
      highlight: "The historic 7-1 demolition of Brazil in Belo Horizonte stunned the world. Mario Götze's extra-time winner in the final secured Germany's 4th title.",
    },
  ],
  "Italy": [
    {
      year: 1934,
      host: "Italy",
      matches: [
        { round: "R16", opponent: "USA", opponentFlag: "us", score: "7-1" },
        { round: "Quarter", opponent: "Spain", opponentFlag: "es", score: "1-1, 1-0" },
        { round: "Semi", opponent: "Austria", opponentFlag: "at", score: "1-0" },
        { round: "Final", opponent: "Czechoslovakia", opponentFlag: "cz", score: "2-1 (aet)" },
      ],
      highlight: "Italy's first World Cup on home soil. Coach Vittorio Pozzo's team came from behind in the final, with Angelo Schiavio scoring the winner in extra time.",
    },
    {
      year: 1938,
      host: "France",
      matches: [
        { round: "R16", opponent: "Norway", opponentFlag: "no", score: "2-1 (aet)" },
        { round: "Quarter", opponent: "France", opponentFlag: "fr", score: "3-1" },
        { round: "Semi", opponent: "Brazil", opponentFlag: "br", score: "2-1" },
        { round: "Final", opponent: "Hungary", opponentFlag: "hu", score: "4-2" },
      ],
      highlight: "Back-to-back titles under Pozzo. Silvio Piola starred with 5 goals as Italy became the first nation to successfully defend the World Cup.",
    },
    {
      year: 1982,
      host: "Spain",
      matches: [
        { round: "Group", opponent: "Poland", opponentFlag: "pl", score: "0-0" },
        { round: "Group", opponent: "Peru", opponentFlag: "pe", score: "1-1" },
        { round: "Group", opponent: "Cameroon", opponentFlag: "cm", score: "1-1" },
        { round: "2nd Group", opponent: "Argentina", opponentFlag: "ar", score: "2-1" },
        { round: "2nd Group", opponent: "Brazil", opponentFlag: "br", score: "3-2" },
        { round: "Semi", opponent: "Poland", opponentFlag: "pl", score: "2-0" },
        { round: "Final", opponent: "West Germany", opponentFlag: "de", score: "3-1" },
      ],
      highlight: "Paolo Rossi's redemption after a match-fixing ban. His hat-trick against Brazil and 6 tournament goals led Italy to glory. Marco Tardelli's iconic celebration in the final.",
    },
    {
      year: 2006,
      host: "Germany",
      matches: [
        { round: "Group", opponent: "Ghana", opponentFlag: "gh", score: "2-0" },
        { round: "Group", opponent: "USA", opponentFlag: "us", score: "1-1" },
        { round: "Group", opponent: "Czech Republic", opponentFlag: "cz", score: "2-0" },
        { round: "R16", opponent: "Australia", opponentFlag: "au", score: "1-0" },
        { round: "Quarter", opponent: "Ukraine", opponentFlag: "ua", score: "3-0" },
        { round: "Semi", opponent: "Germany", opponentFlag: "de", score: "2-0 (aet)" },
        { round: "Final", opponent: "France", opponentFlag: "fr", score: "1-1 (5-3p)" },
      ],
      highlight: "Gianluigi Buffon and the Italian defense were nearly impenetrable. The final is remembered for Zidane's headbutt. Fabio Grosso scored the winning penalty.",
    },
  ],
  "Argentina": [
    {
      year: 1978,
      host: "Argentina",
      matches: [
        { round: "Group", opponent: "Hungary", opponentFlag: "hu", score: "2-1" },
        { round: "Group", opponent: "France", opponentFlag: "fr", score: "2-1" },
        { round: "Group", opponent: "Italy", opponentFlag: "it", score: "0-1" },
        { round: "2nd Group", opponent: "Poland", opponentFlag: "pl", score: "2-0" },
        { round: "2nd Group", opponent: "Brazil", opponentFlag: "br", score: "0-0" },
        { round: "2nd Group", opponent: "Peru", opponentFlag: "pe", score: "6-0" },
        { round: "Final", opponent: "Netherlands", opponentFlag: "nl", score: "3-1 (aet)" },
      ],
      highlight: "Argentina's first World Cup on home soil amid political controversy. Mario Kempes was the star with 6 goals including 2 in the final against the Netherlands.",
    },
    {
      year: 1986,
      host: "Mexico",
      matches: [
        { round: "Group", opponent: "South Korea", opponentFlag: "kr", score: "3-1" },
        { round: "Group", opponent: "Italy", opponentFlag: "it", score: "1-1" },
        { round: "Group", opponent: "Bulgaria", opponentFlag: "bg", score: "2-0" },
        { round: "R16", opponent: "Uruguay", opponentFlag: "uy", score: "1-0" },
        { round: "Quarter", opponent: "England", opponentFlag: "gb-eng", score: "2-1" },
        { round: "Semi", opponent: "Belgium", opponentFlag: "be", score: "2-0" },
        { round: "Final", opponent: "West Germany", opponentFlag: "de", score: "3-2" },
      ],
      highlight: "Diego Maradona's tournament. His 'Hand of God' and 'Goal of the Century' against England defined the competition. He dragged Argentina to glory almost single-handedly.",
    },
    {
      year: 2022,
      host: "Qatar",
      matches: [
        { round: "Group", opponent: "Saudi Arabia", opponentFlag: "sa", score: "1-2" },
        { round: "Group", opponent: "Mexico", opponentFlag: "mx", score: "2-0" },
        { round: "Group", opponent: "Poland", opponentFlag: "pl", score: "2-0" },
        { round: "R16", opponent: "Australia", opponentFlag: "au", score: "2-1" },
        { round: "Quarter", opponent: "Netherlands", opponentFlag: "nl", score: "2-2 (4-3p)" },
        { round: "Semi", opponent: "Croatia", opponentFlag: "hr", score: "3-0" },
        { round: "Final", opponent: "France", opponentFlag: "fr", score: "3-3 (4-2p)" },
      ],
      highlight: "Lionel Messi's crowning glory. After a shock opening loss to Saudi Arabia, Argentina recovered brilliantly. The final against France is considered the greatest ever, with Messi finally lifting the trophy.",
    },
  ],
  "France": [
    {
      year: 1998,
      host: "France",
      matches: [
        { round: "Group", opponent: "South Africa", opponentFlag: "za", score: "3-0" },
        { round: "Group", opponent: "Saudi Arabia", opponentFlag: "sa", score: "4-0" },
        { round: "Group", opponent: "Denmark", opponentFlag: "dk", score: "2-1" },
        { round: "R16", opponent: "Paraguay", opponentFlag: "py", score: "1-0 (aet)" },
        { round: "Quarter", opponent: "Italy", opponentFlag: "it", score: "0-0 (4-3p)" },
        { round: "Semi", opponent: "Croatia", opponentFlag: "hr", score: "2-1" },
        { round: "Final", opponent: "Brazil", opponentFlag: "br", score: "3-0" },
      ],
      highlight: "France's first World Cup on home soil. Zinedine Zidane's two headers in the final crushed Brazil. The multiethnic squad united the nation under 'Black-Blanc-Beur'.",
    },
    {
      year: 2018,
      host: "Russia",
      matches: [
        { round: "Group", opponent: "Australia", opponentFlag: "au", score: "2-1" },
        { round: "Group", opponent: "Peru", opponentFlag: "pe", score: "1-0" },
        { round: "Group", opponent: "Denmark", opponentFlag: "dk", score: "0-0" },
        { round: "R16", opponent: "Argentina", opponentFlag: "ar", score: "4-3" },
        { round: "Quarter", opponent: "Uruguay", opponentFlag: "uy", score: "2-0" },
        { round: "Semi", opponent: "Belgium", opponentFlag: "be", score: "1-0" },
        { round: "Final", opponent: "Croatia", opponentFlag: "hr", score: "4-2" },
      ],
      highlight: "A young, talented squad led by 19-year-old Kylian Mbappé. Antoine Griezmann and Paul Pogba starred as France claimed their second title with dominant attacking play.",
    },
  ],
  "Uruguay": [
    {
      year: 1930,
      host: "Uruguay",
      matches: [
        { round: "Group", opponent: "Peru", opponentFlag: "pe", score: "1-0" },
        { round: "Group", opponent: "Romania", opponentFlag: "ro", score: "4-0" },
        { round: "Semi", opponent: "Yugoslavia", opponentFlag: "rs", score: "6-1" },
        { round: "Final", opponent: "Argentina", opponentFlag: "ar", score: "4-2" },
      ],
      highlight: "The first ever World Cup, hosted to celebrate Uruguay's centenary. Despite trailing 2-1 at halftime, Uruguay stormed back to beat rivals Argentina in the inaugural final.",
    },
    {
      year: 1950,
      host: "Brazil",
      matches: [
        { round: "Group", opponent: "Bolivia", opponentFlag: "bo", score: "8-0" },
        { round: "Final Round", opponent: "Spain", opponentFlag: "es", score: "2-2" },
        { round: "Final Round", opponent: "Sweden", opponentFlag: "se", score: "3-2" },
        { round: "Final Round", opponent: "Brazil", opponentFlag: "br", score: "2-1" },
      ],
      highlight: "The 'Maracanazo'. Uruguay silenced 200,000 fans in Rio's Maracanã, coming from behind to beat Brazil 2-1 in the deciding match. One of football's greatest upsets.",
    },
  ],
  "England": [
    {
      year: 1966,
      host: "England",
      matches: [
        { round: "Group", opponent: "Uruguay", opponentFlag: "uy", score: "0-0" },
        { round: "Group", opponent: "Mexico", opponentFlag: "mx", score: "2-0" },
        { round: "Group", opponent: "France", opponentFlag: "fr", score: "2-0" },
        { round: "Quarter", opponent: "Argentina", opponentFlag: "ar", score: "1-0" },
        { round: "Semi", opponent: "Portugal", opponentFlag: "pt", score: "2-1" },
        { round: "Final", opponent: "West Germany", opponentFlag: "de", score: "4-2 (aet)" },
      ],
      highlight: "England's only World Cup. Geoff Hurst's hat-trick in the final, including the controversial 'Wembley Goal', secured victory. Bobby Moore lifted the Jules Rimet trophy.",
    },
  ],
  "Spain": [
    {
      year: 2010,
      host: "South Africa",
      matches: [
        { round: "Group", opponent: "Switzerland", opponentFlag: "ch", score: "0-1" },
        { round: "Group", opponent: "Honduras", opponentFlag: "hn", score: "2-0" },
        { round: "Group", opponent: "Chile", opponentFlag: "cl", score: "2-1" },
        { round: "R16", opponent: "Portugal", opponentFlag: "pt", score: "1-0" },
        { round: "Quarter", opponent: "Paraguay", opponentFlag: "py", score: "1-0" },
        { round: "Semi", opponent: "Germany", opponentFlag: "de", score: "1-0" },
        { round: "Final", opponent: "Netherlands", opponentFlag: "nl", score: "1-0 (aet)" },
      ],
      highlight: "Tiki-taka perfection. Despite losing the opener, Spain's possession-based football prevailed. Andrés Iniesta's extra-time winner against Netherlands completed their 2008-2012 dominance.",
    },
  ],
};

const CHART_COLORS = ["#22C55E", "#FACC15", "#3B82F6", "#F97316", "#8B5CF6", "#EC4899", "#14B8A6", "#EF4444"];

type TabType = "overview" | "goals" | "attendance" | "winners";

export default function History() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [activePieIndex, setActivePieIndex] = useState<number | null>(null);

  const getCountryKey = (country: string): string => {
    const keyMap: { [key: string]: string } = {
      "Brazil": "Brazil",
      "Germany": "Germany", 
      "Italy": "Italy",
      "Argentina": "Argentina",
      "France": "France",
      "Uruguay": "Uruguay",
      "England": "England",
      "Spain": "Spain",
      "Sweden": "Sweden",
      "Chile": "Chile",
      "Mexico": "Mexico",
      "USA": "USA",
      "South Korea/Japan": "SouthKoreaJapan",
      "Switzerland": "Switzerland",
      "West Germany": "WestGermany",
      "Qatar": "Qatar",
      "Russia": "Russia",
      "South Africa": "SouthAfrica"
    };
    return keyMap[country] || country;
  };

  const getRoundKey = (round: string): string => {
    const keyMap: { [key: string]: string } = {
      "Group": "Group",
      "Group PO": "GroupPO",
      "2nd Group": "2ndGroup",
      "R16": "R16",
      "Quarter": "Quarter",
      "Semi": "Semi",
      "Final": "Final",
      "Final Round": "FinalRound"
    };
    return keyMap[round] || round;
  };

  const getHighlightKey = (country: string, year: number): string => {
    return `${country}${year}`;
  };

  const goalsData = tournamentHistory.map((t) => ({
    year: t.year.toString(),
    goals: t.goals,
    goalsPerMatch: (t.goals / t.matches).toFixed(2),
  }));

  const attendanceData = tournamentHistory.map((t) => ({
    year: t.year.toString(),
    attendance: t.attendance,
    avgPerMatch: Math.round(t.attendance / t.matches),
  }));

  const titlesData = titlesByCountry.map((c) => ({
    name: c.country,
    value: c.titles,
    color: c.color,
    flag: c.flag,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-white/10 rounded-lg p-3 shadow-xl">
          <p className="text-white font-bold mb-1">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} className="text-sm text-muted-foreground">
              {p.name}: <span className="text-primary font-medium">{p.value.toLocaleString()}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-white/5 rounded-xl p-4" data-testid="stat-tournaments">
          <Trophy className="w-8 h-8 text-primary mb-2" />
          <p className="text-2xl font-display font-bold text-white">22</p>
          <p className="text-sm text-muted-foreground">{t("history.tournaments")}</p>
        </div>
        <div className="bg-card border border-white/5 rounded-xl p-4" data-testid="stat-goals">
          <TrendingUp className="w-8 h-8 text-yellow-400 mb-2" />
          <p className="text-2xl font-display font-bold text-white">2,720</p>
          <p className="text-sm text-muted-foreground">{t("history.totalGoals")}</p>
        </div>
        <div className="bg-card border border-white/5 rounded-xl p-4" data-testid="stat-attendance">
          <Users className="w-8 h-8 text-blue-400 mb-2" />
          <p className="text-2xl font-display font-bold text-white">44M+</p>
          <p className="text-sm text-muted-foreground">{t("history.totalAttendance")}</p>
        </div>
        <div className="bg-card border border-white/5 rounded-xl p-4" data-testid="stat-countries">
          <Globe className="w-8 h-8 text-purple-400 mb-2" />
          <p className="text-2xl font-display font-bold text-white">17</p>
          <p className="text-sm text-muted-foreground">{t("history.hostCountries")}</p>
        </div>
      </div>

      <div className="bg-card border border-white/5 rounded-xl p-4">
        <h3 className="text-lg font-display font-bold text-white mb-4">{t("history.titlesByCountry")}</h3>
        <p className="text-xs text-muted-foreground mb-2">{t("history.tapToSee")}</p>
        <div className="h-80 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={titlesData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                onClick={(data, index) => {
                  setSelectedCountry(data.name);
                  setActivePieIndex(index);
                }}
                style={{ cursor: 'pointer' }}
                label={({ cx, cy, midAngle, outerRadius, index }) => {
                  const RADIAN = Math.PI / 180;
                  const baseRadius = outerRadius + 40;
                  const entry = titlesData[index];
                  
                  // Custom positioning adjustments to prevent overlap
                  let radiusOffset = 0;
                  let yOffset = 0;
                  if (entry.name === "England") {
                    yOffset = 12; // Move England down
                  } else if (entry.name === "Spain") {
                    yOffset = -5; // Move Spain up slightly
                  }
                  
                  const radius = baseRadius + radiusOffset;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN) + yOffset;
                  
                  return (
                    <g 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCountry(entry.name);
                        setActivePieIndex(index);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <image
                        href={`https://flagcdn.com/w40/${entry.flag}.png`}
                        x={x - 12}
                        y={y - 18}
                        width={24}
                        height={16}
                        style={{ borderRadius: 2 }}
                      />
                      <text
                        x={x}
                        y={y + 6}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-white text-[10px] font-medium"
                      >
                        {t(`history.countries.${getCountryKey(entry.name)}`, entry.name)}
                      </text>
                      <text
                        x={x}
                        y={y + 18}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-muted-foreground text-[9px]"
                      >
                        ({entry.value})
                      </text>
                    </g>
                  );
                }}
                labelLine={false}
              >
                {titlesData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke={activePieIndex === index ? "#22C55E" : "rgba(255,255,255,0.1)"}
                    strokeWidth={activePieIndex === index ? 3 : 1}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {selectedCountry && winningCampaigns[selectedCountry] && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200">
          <div className="bg-card w-full max-h-[85vh] rounded-t-3xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="sticky top-0 bg-card border-b border-white/5 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30">
                  <img
                    src={`https://flagcdn.com/w80/${titlesByCountry.find(c => c.country === selectedCountry)?.flag}.png`}
                    alt={selectedCountry}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white">{t(`history.countries.${getCountryKey(selectedCountry)}`, selectedCountry)}</h3>
                  <p className="text-sm text-muted-foreground">
                    {winningCampaigns[selectedCountry].length} {t("history.worldCupTitle", { count: winningCampaigns[selectedCountry].length })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedCountry(null);
                  setActivePieIndex(null);
                }}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                data-testid="button-close-modal"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-4 space-y-6 pb-safe">
              {winningCampaigns[selectedCountry].map((campaign) => (
                <div key={campaign.year} className="bg-background rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                      <Trophy className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-display font-bold text-white">{campaign.year}</h4>
                      <p className="text-sm text-muted-foreground">{t("history.hostedBy")} {t(`history.countries.${getCountryKey(campaign.host)}`, campaign.host)}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-white mb-2">{t("history.matchResults")}</h5>
                    <div className="space-y-2">
                      {campaign.matches.map((match, idx) => (
                        <div 
                          key={idx} 
                          className={`flex items-center justify-between p-2 rounded-lg ${
                            match.round === 'Final' 
                              ? 'bg-yellow-500/10 border border-yellow-500/20' 
                              : 'bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              match.round === 'Final' 
                                ? 'bg-yellow-500/20 text-yellow-400' 
                                : 'bg-white/10 text-muted-foreground'
                            }`}>
                              {t(`history.rounds.${getRoundKey(match.round)}`, match.round)}
                            </span>
                            <img
                              src={`https://flagcdn.com/w40/${match.opponentFlag}.png`}
                              alt={match.opponent}
                              className="w-5 h-3.5 object-cover rounded"
                            />
                            <span className="text-white text-sm">{match.opponent}</span>
                          </div>
                          <span className={`font-display font-bold ${
                            match.round === 'Final' ? 'text-yellow-400' : 'text-primary'
                          }`}>
                            {match.score}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                    <h5 className="text-sm font-medium text-primary mb-1">{t("history.tournamentHighlight")}</h5>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(`history.highlights.${getHighlightKey(selectedCountry, campaign.year)}`, campaign.highlight)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-card border border-white/5 rounded-xl p-4">
        <h3 className="text-lg font-display font-bold text-white mb-4">{t("history.allTimeWinners")}</h3>
        <div className="space-y-3">
          {titlesByCountry.map((country, i) => (
            <div
              key={country.country}
              className="flex items-center justify-between p-3 bg-background rounded-lg"
              data-testid={`winner-${country.flag}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                  <img
                    src={`https://flagcdn.com/w80/${country.flag}.png`}
                    alt={country.country}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-white font-medium">{country.country}</p>
                  <p className="text-xs text-muted-foreground">{country.years}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(country.titles)].map((_, j) => (
                  <Trophy key={j} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-6">
      <div className="bg-card border border-white/5 rounded-xl p-4">
        <h3 className="text-lg font-display font-bold text-white mb-4">{t("history.goalsPerTournament")}</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={goalsData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="year"
                tick={{ fill: "#9CA3AF", fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="goals" fill="#22C55E" radius={[4, 4, 0, 0]} name={t("history.goals")} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-white/5 rounded-xl p-4">
        <h3 className="text-lg font-display font-bold text-white mb-4">{t("history.goalsPerMatch")}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={goalsData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="year"
                tick={{ fill: "#9CA3AF", fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 10 }} domain={[2, 6]} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="goalsPerMatch"
                stroke="#FACC15"
                strokeWidth={2}
                dot={{ fill: "#FACC15", strokeWidth: 2 }}
                name={t("history.avgGoalsPerMatch")}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-white/5 rounded-xl p-4">
        <h3 className="text-lg font-display font-bold text-white mb-4">{t("history.topScorers")}</h3>
        <div className="space-y-3">
          {[
            { name: "Miroslav Klose", country: "Germany", flag: "de", goals: 16, tournaments: "2002-2014" },
            { name: "Ronaldo", country: "Brazil", flag: "br", goals: 15, tournaments: "1998-2006" },
            { name: "Gerd Müller", country: "Germany", flag: "de", goals: 14, tournaments: "1970-1974" },
            { name: "Just Fontaine", country: "France", flag: "fr", goals: 13, tournaments: "1958" },
            { name: "Pelé", country: "Brazil", flag: "br", goals: 12, tournaments: "1958-1970" },
            { name: "Kylian Mbappé", country: "France", flag: "fr", goals: 12, tournaments: "2018-2022" },
          ].map((scorer, i) => (
            <div
              key={scorer.name}
              className="flex items-center justify-between p-3 bg-background rounded-lg"
              data-testid={`scorer-${i}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {i + 1}
                </div>
                <div>
                  <p className="text-white font-medium">{scorer.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <img
                      src={`https://flagcdn.com/w40/${scorer.flag}.png`}
                      alt={scorer.country}
                      className="w-4 h-3 object-cover rounded"
                    />
                    <span className="text-xs text-muted-foreground">{scorer.country}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{scorer.tournaments}</span>
                  </div>
                </div>
              </div>
              <div className="text-primary font-display font-bold text-xl">{scorer.goals}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-6">
      <div className="bg-card border border-white/5 rounded-xl p-4">
        <h3 className="text-lg font-display font-bold text-white mb-4">{t("history.attendanceTrend")}</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <defs>
                <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="year"
                tick={{ fill: "#9CA3AF", fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fill: "#9CA3AF", fontSize: 10 }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="attendance"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#attendanceGradient)"
                name={t("history.totalAttendance")}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-white/5 rounded-xl p-4">
        <h3 className="text-lg font-display font-bold text-white mb-4">{t("history.recordAttendance")}</h3>
        <div className="space-y-3">
          {[...tournamentHistory]
            .sort((a, b) => b.year - a.year)
            .slice(0, 10)
            .map((tourney, i) => (
              <div
                key={tourney.year}
                className="flex items-center justify-between p-3 bg-background rounded-lg"
                data-testid={`attendance-${tourney.year}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                    {i + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      src={`https://flagcdn.com/w40/${tourney.hostFlag}.png`}
                      alt={tourney.host}
                      className="w-5 h-4 object-cover rounded"
                    />
                    <div>
                      <p className="text-white font-medium">{tourney.year} - {tourney.host}</p>
                      <p className="text-xs text-muted-foreground">{tourney.matches} {t("history.matches")}</p>
                    </div>
                  </div>
                </div>
                <div className="text-blue-400 font-display font-bold">
                  {(tourney.attendance / 1000000).toFixed(2)}M
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderWinners = () => (
    <div className="space-y-4">
      {[...tournamentHistory].reverse().map((tournament) => (
        <button
          key={tournament.year}
          onClick={() => setSelectedTournament(selectedTournament?.year === tournament.year ? null : tournament)}
          className="w-full bg-card border border-white/5 rounded-xl p-4 text-left hover:border-primary/30 transition-colors"
          data-testid={`tournament-${tournament.year}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                <img
                  src={`https://flagcdn.com/w80/${tournament.winnerFlag}.png`}
                  alt={tournament.winner}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-white font-display font-bold">{tournament.year}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <img
                    src={`https://flagcdn.com/w20/${tournament.hostFlag}.png`}
                    alt={tournament.host}
                    className="w-4 h-3 object-cover rounded"
                  />
                  {tournament.host}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">{tournament.winner}</span>
              <ChevronRight
                className={`w-5 h-5 text-muted-foreground transition-transform ${
                  selectedTournament?.year === tournament.year ? "rotate-90" : ""
                }`}
              />
            </div>
          </div>

          {selectedTournament?.year === tournament.year && (
            <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("history.winner")}</p>
                <div className="flex items-center gap-2">
                  <img
                    src={`https://flagcdn.com/w40/${tournament.winnerFlag}.png`}
                    alt={tournament.winner}
                    className="w-6 h-4 object-cover rounded"
                  />
                  <span className="text-white font-medium">{tournament.winner}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("history.runnerUp")}</p>
                <div className="flex items-center gap-2">
                  <img
                    src={`https://flagcdn.com/w40/${tournament.runnerUpFlag}.png`}
                    alt={tournament.runnerUp}
                    className="w-6 h-4 object-cover rounded"
                  />
                  <span className="text-white">{tournament.runnerUp}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("history.goals")}</p>
                <p className="text-white font-medium">{tournament.goals}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("history.matches")}</p>
                <p className="text-white font-medium">{tournament.matches}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("history.topScorer")}</p>
                <p className="text-white font-medium text-sm">
                  {tournament.topScorer} ({tournament.topScorerGoals})
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("history.attendance")}</p>
                <p className="text-white font-medium">{tournament.attendance.toLocaleString()}</p>
              </div>
            </div>
          )}
        </button>
      ))}
    </div>
  );

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: t("history.tabs.overview"), icon: <Trophy className="w-4 h-4" /> },
    { id: "goals", label: t("history.tabs.goals"), icon: <TrendingUp className="w-4 h-4" /> },
    { id: "attendance", label: t("history.tabs.attendance"), icon: <Users className="w-4 h-4" /> },
    { id: "winners", label: t("history.tabs.winners"), icon: <Medal className="w-4 h-4" /> },
  ];

  return (
    <Layout pageTitle="nav.history">
      <div className="pt-6 px-6 pb-24">
        <div className="bg-gradient-to-br from-yellow-500/20 to-primary/10 border border-yellow-500/20 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center flex-shrink-0">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white mb-1" data-testid="text-page-title">
                {t("history.title")}
              </h1>
              <p className="text-yellow-400/80 text-sm">{t("history.subtitle")}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-white/5 text-muted-foreground hover:text-white"
              }`}
              data-testid={`tab-${tab.id}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && renderOverview()}
        {activeTab === "goals" && renderGoals()}
        {activeTab === "attendance" && renderAttendance()}
        {activeTab === "winners" && renderWinners()}
      </div>
    </Layout>
  );
}
