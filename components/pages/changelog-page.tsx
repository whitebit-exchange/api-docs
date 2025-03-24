import Link from "next/link";
import { toast } from "sonner";
import {
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Info,
  Download,
  AlertTriangle,
  ExternalLink,
  Link as LinkIcon,
} from "lucide-react";
import changelogData from "@/data/changelog.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

interface ChangelogVersion {
  version: string;
  date: string;
  isLatest?: boolean;
  changes: ChangelogChange[];
}

interface ChangelogItem {
  title: string;
  timeframe: string;
  status: string;
  changes: ChangelogChange[];
}

interface ChangelogData {
  upcomingChanges: ChangelogItem[];
  previousChanges: {
    [key: string]: ChangelogVersion[];
  };
}

// Helper function to render the appropriate icon based on change type
const renderChangeTypeIcon = (type: string) => {
  switch (type) {
    case "feature":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "improvement":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "bugfix":
      return <Info className="h-5 w-5 text-amber-500" />;
    case "deprecation":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case "security":
      return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    case "planned":
      return <Clock className="h-5 w-5 text-blue-500" />;
    case "roadmap":
      return <AlertCircle className="h-5 w-5 text-purple-500" />;
    default:
      return <Info className="h-5 w-5 text-gray-500" />;
  }
};

// Helper function to render change links
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

// Helper function to create a slug from version or title
const createSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

// Helper function to copy link to clipboard
const copyLinkToClipboard = (slug: string) => {
  const url = `${window.location.origin}${window.location.pathname}#${slug}`;
  navigator.clipboard.writeText(url);
  toast.success("Link copied to clipboard");
};

export default function ChangelogPage() {
  const typedChangelogData = changelogData as ChangelogData;

  return (
    <div className="py-6 max-w-[1200px] mx-auto px-4">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-4  text-foreground">
          WhiteBIT API Changelog
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Track all updates, improvements, and fixes to the WhiteBIT API
          Platform. This page documents both upcoming and previous changes to
          help you stay informed about our platform's evolution.
        </p>
      </div>
      {typedChangelogData.upcomingChanges.length > 0 ? (
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-primary ">
              Upcoming Changes
            </h2>
            <div className="h-px bg-border flex-grow"></div>
          </div>
          {typedChangelogData.upcomingChanges.map((item, index) => {
            const slug = createSlug(item.title);
            return (
              <Card key={index} className="mb-6" id={slug}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-2">
                      <div>
                        <CardTitle className="text-xl font-semibold">
                          {item.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.timeframe}
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
                      <div key={changeIndex} className="flex gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {renderChangeTypeIcon(change.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-semibold  text-foreground">
                            {change.title}
                          </h4>
                          <p className="text-sm leading-relaxed text-muted-foreground mt-2">
                            {change.description}
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
      ) : null}

      {Object.keys(typedChangelogData.previousChanges).length > 0 ? (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold">Previous Changes</h2>
            <div className="h-px bg-border flex-grow"></div>
          </div>

          {Object.entries(typedChangelogData.previousChanges)
            .sort(
              ([yearA], [yearB]) =>
                Number.parseInt(yearB) - Number.parseInt(yearA)
            )
            .map(([year, versions]) => (
              <div key={year} className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-bold ">{year}</h3>
                  <div className="h-px bg-border flex-grow"></div>
                </div>

                {versions.map((version, vIndex) => {
                  const slug = createSlug(version.version);
                  return (
                    <Card key={vIndex} className="mb-6" id={slug}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-start gap-2">
                            <div>
                              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                {version.version}
                                {version.isLatest && (
                                  <Badge
                                    variant="default"
                                    className="text-xs font-medium"
                                  >
                                    Latest
                                  </Badge>
                                )}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                {version.date}
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
                          {version.changes.map((change, changeIndex) => (
                            <div key={changeIndex} className="flex gap-4">
                              <div className="flex-shrink-0 mt-1">
                                {renderChangeTypeIcon(change.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="text-base font-semibold  text-foreground">
                                  {change.title}
                                </h5>
                                <p className="text-sm leading-relaxed text-muted-foreground mt-2">
                                  {change.description}
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
            ))}
        </div>
      ) : null}
    </div>
  );
}
