'use client';

import Link from "next/link";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Info,
  ExternalLink,
  Link as LinkIcon,
  CreditCard,
  Zap,
  TrendingUp,
  Shield,
  Database,
  Wallet,
  Settings,
  BarChart3,
  Network,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ChangelogLink {
  title: string;
  url: string;
}

interface ChangelogChange {
  title: string;
  description: string;
  type: string;
  links?: ChangelogLink[];
}

interface ChangelogItem {
  title: string;
  timeframe: string;
  changes: ChangelogChange[];
}

interface RawChangelogData {
  changes: ChangelogItem[];
}

interface ProcessedChangelogData {
  upcomingChanges: ChangelogItem[];
  previousChanges: ChangelogItem[];
}

const renderChangeTypeIcon = (type: string) => {
  switch (type) {
    case "feature":
      return <Zap className="h-5 w-5 text-blue-500" />;
    case "improvement":
      return <TrendingUp className="h-5 w-5 text-green-500" />;
    case "bugfix":
      return <CheckCircle2 className="h-5 w-5 text-amber-500" />;
    case "deprecation":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case "security":
      return <Shield className="h-5 w-5 text-orange-500" />;
    case "planned":
      return <Clock className="h-5 w-5 text-purple-500" />;
    case "roadmap":
      return <BarChart3 className="h-5 w-5 text-indigo-500" />;
    case "fiat":
      return <CreditCard className="h-5 w-5 text-emerald-500" />;
    case "websocket":
      return <Network className="h-5 w-5 text-cyan-500" />;
    case "trading":
      return <BarChart3 className="h-5 w-5 text-blue-600" />;
    case "regulatory":
      return <FileText className="h-5 w-5 text-orange-600" />;
    case "performance":
      return <Zap className="h-5 w-5 text-yellow-500" />;
    case "api":
      return <Settings className="h-5 w-5 text-gray-600" />;
    case "withdrawal":
      return <Wallet className="h-5 w-5 text-green-600" />;
    case "deposit":
      return <Wallet className="h-5 w-5 text-blue-600" />;
    case "data":
      return <Database className="h-5 w-5 text-purple-600" />;
    case "compliance":
      return <Shield className="h-5 w-5 text-red-600" />;
    default:
      return <Info className="h-5 w-5 text-gray-500" />;
  }
};

const renderChangeLinks = (links?: ChangelogLink[]) => {
  if (!links?.length) return null;

  return (
    <div className="flex flex-wrap gap-4 mt-3">
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.url}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors hover:underline"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          {link.title}
        </Link>
      ))}
    </div>
  );
};

const createSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const copyLinkToClipboard = (slug: string) => {
  const url = `${window.location.origin}${window.location.pathname}#${slug}`;
  navigator.clipboard.writeText(url);
  toast.success("Link copied to clipboard");
};

const renderTextWithCodeBlocks = (text: string) => {
  // Split text by code blocks (text wrapped in backticks)
  const parts = text.split(/(`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      // This is a code block, remove the backticks and render as code
      const code = part.slice(1, -1);
      return (
        <code
          key={index}
          className="inline-block px-1.5 py-0.5 bg-muted text-foreground rounded text-xs font-mono"
        >
          {code}
        </code>
      );
    }
    // Regular text
    return part;
  });
};

async function fetchChangelogData(): Promise<RawChangelogData> {
  const response = await fetch("/data/changelog.json");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

function ChangelogCardSkeleton() {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-start gap-2 w-full">
            <div className="w-full">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-8 w-8 rounded-md flex-shrink-0" />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

function ChangelogLoadingSkeleton() {
  return (
    <>
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-px bg-border flex-grow" />
        </div>
        <ChangelogCardSkeleton />
        <ChangelogCardSkeleton />
      </div>
      <div>
        <div className="flex items-center gap-3 mb-6">
           <Skeleton className="h-7 w-48" />
          <Skeleton className="h-px bg-border flex-grow" />
        </div>
        <ChangelogCardSkeleton />
        <ChangelogCardSkeleton />
      </div>
    </>
  );
}

export default function ChangelogPage() {
  const { data, isLoading, isError, error } = useQuery<RawChangelogData, Error, ProcessedChangelogData>({
    queryKey: ['changelogData'],
    queryFn: fetchChangelogData,
    select: (rawData) => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const upcoming: ChangelogItem[] = [];
      const previous: ChangelogItem[] = [];

      rawData.changes.forEach((item) => {
        try {
          const itemDate = new Date(item.timeframe);
          itemDate.setHours(0, 0, 0, 0);

          if (itemDate > now) {
            upcoming.push(item);
          } else {
            previous.push(item);
          }
        } catch (e) {
          console.error(`Invalid date format for item: ${item.title}`, e);
        }
      });

      upcoming.sort(
        (a, b) => new Date(a.timeframe).getTime() - new Date(b.timeframe).getTime()
      );

      previous.sort(
        (a, b) => new Date(b.timeframe).getTime() - new Date(a.timeframe).getTime()
      );

      return {
        upcomingChanges: upcoming,
        previousChanges: previous
      }
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
  });

  function renderContent() {
    if (isLoading) {
      return <ChangelogLoadingSkeleton />;
    }

    if (isError) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return (
        <div className="text-center text-red-500">
          Error loading changelog: {errorMessage}
        </div>
      );
    }

    if (data) {
      const { upcomingChanges, previousChanges } = data;
      const hasUpcoming = upcomingChanges.length > 0;
      const hasPrevious = previousChanges.length > 0;

      if (!hasUpcoming && !hasPrevious) {
        return (
          <div className="text-center text-muted-foreground">
            No changelog entries found.
          </div>
        );
      }

      return (
        <>
          {hasUpcoming && (
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-primary ">
                  Upcoming Changes
                </h2>
                <div className="h-px bg-border flex-grow"></div>
              </div>
              {upcomingChanges.map((item, index) => {
                const slug = createSlug(item.title);
                return (
                  <Card key={`upcoming-${index}`} className="mb-6" id={slug}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-start gap-2">
                          <div>
                            <CardTitle className="text-xl font-semibold">
                              {item.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(item.timeframe).toLocaleDateString(
                                undefined,
                                { year: "numeric", month: "long", day: "numeric" }
                              )}
                            </p>
                          </div>
                          <button
                            onClick={() => copyLinkToClipboard(slug)}
                            className="p-2 hover:bg-accent rounded-md transition-colors"
                            aria-label="Copy link to section"
                          >
                            <LinkIcon className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {item.changes.map((change, changeIndex) => (
                          <div key={`upcoming-change-${changeIndex}`} className="flex gap-4">
                            <div className="flex-shrink-0 mt-1">
                              {renderChangeTypeIcon(change.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-base font-semibold text-foreground">
                                {change.title}
                              </h4>
                              <p className="text-sm leading-relaxed text-muted-foreground mt-2">
                                {renderTextWithCodeBlocks(change.description)}
                              </p>
                              {renderChangeLinks(change.links)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {hasPrevious && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold">Previous Changes</h2>
                <div className="h-px bg-border flex-grow"></div>
              </div>
              {previousChanges.map((item, index) => {
                const slug = createSlug(item.title);
                return (
                  <Card key={`previous-${index}`} className="mb-6" id={slug}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-start gap-2">
                          <div>
                            <CardTitle className="text-xl font-semibold">
                              {item.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(item.timeframe).toLocaleDateString(
                                undefined,
                                { year: "numeric", month: "long", day: "numeric" }
                              )}
                            </p>
                          </div>
                          <button
                            onClick={() => copyLinkToClipboard(slug)}
                            className="p-2 hover:bg-accent rounded-md transition-colors"
                            aria-label="Copy link to section"
                          >
                            <LinkIcon className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {item.changes.map((change, changeIndex) => (
                          <div key={`previous-change-${changeIndex}`} className="flex gap-4">
                            <div className="flex-shrink-0 mt-1">
                              {renderChangeTypeIcon(change.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-base font-semibold text-foreground">
                                {change.title}
                              </h5>
                              <p className="text-sm leading-relaxed text-muted-foreground mt-2">
                                {renderTextWithCodeBlocks(change.description)}
                              </p>
                              {renderChangeLinks(change.links)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      );
    }

    return (
      <div className="text-center text-muted-foreground">
        No changelog data available.
      </div>
    );
  }

  return (
    <div className="py-6 max-w-[1200px] mx-auto px-4">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4 text-foreground">
          WhiteBIT API Changelog
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Track all updates, improvements, and fixes to the WhiteBIT API
          Platform. This page documents both upcoming and previous changes to
          help you stay informed about our platform&apos;s evolution.
        </p>
      </div>
      <div className="changelog-content">
        {renderContent()}
      </div>
    </div>
  );
}
