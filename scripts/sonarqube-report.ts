#!/usr/bin/env tsx
/**
 * @module scripts/sonarqube-report
 * @file SonarQube report fetcher with configurable output formats and detail
 *   levels. Fetches project analysis data, issues, metrics, and quality gate
 *   status.
 */

import { writeFileSync } from "fs";

/** SonarQube API configuration */
interface SonarQubeConfig {
  baseUrl: string;
  token: string;
  projectKey: string;
}

/** Report detail level */
type DetailLevel = "brief" | "detailed" | "full";

/** Output format */
type OutputFormat = "json" | "yaml" | "markdown" | "text" | "html";

/** CLI options */
interface ReportOptions {
  detail: DetailLevel;
  format: OutputFormat;
  output?: string;
  projectKey?: string;
  baseUrl?: string;
  metrics?: string[];
  issues?: boolean;
  qualityGate?: boolean;
}

/** SonarQube API client */
class SonarQubeClient {
  private baseUrl: string;
  private token: string;
  private headers: Record<string, string>;

  constructor(config: SonarQubeConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.token = config.token;
    this.headers = {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  /** Fetch data from SonarQube API */
  private async fetch<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`;
    const response = await fetch(url, { headers: this.headers });

    if (!response.ok) {
      throw new Error(
        `SonarQube API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json() as Promise<T>;
  }

  /** Get project details */
  async getProject(projectKey: string) {
    return this.fetch(`/components/show?component=${projectKey}`);
  }

  /** Get project measures (metrics) */
  async getMeasures(projectKey: string, metricKeys: string[]) {
    const metrics = metricKeys.join(",");
    return this.fetch(
      `/measures/component?component=${projectKey}&metricKeys=${metrics}`
    );
  }

  /** Get project issues */
  async getIssues(
    projectKey: string,
    params: { severities?: string[]; types?: string[]; pageSize?: number } = {}
  ) {
    const { severities, types, pageSize = 500 } = params;
    let endpoint = `/issues/search?componentKeys=${projectKey}&ps=${pageSize}`;

    if (severities?.length) {
      endpoint += `&severities=${severities.join(",")}`;
    }
    if (types?.length) {
      endpoint += `&types=${types.join(",")}`;
    }

    return this.fetch(endpoint);
  }

  /** Get quality gate status */
  async getQualityGateStatus(projectKey: string) {
    return this.fetch(`/qualitygates/project_status?projectKey=${projectKey}`);
  }

  /** Get available metrics */
  async getMetrics() {
    return this.fetch(`/metrics/search?ps=500`);
  }
}

/** Default metrics to fetch */
const DEFAULT_METRICS = {
  brief: [
    "alert_status",
    "bugs",
    "vulnerabilities",
    "code_smells",
    "coverage",
    "duplicated_lines_density",
  ],
  detailed: [
    "alert_status",
    "bugs",
    "vulnerabilities",
    "code_smells",
    "security_hotspots",
    "coverage",
    "duplicated_lines_density",
    "ncloc",
    "complexity",
    "cognitive_complexity",
    "sqale_index",
    "sqale_rating",
    "reliability_rating",
    "security_rating",
    "maintainability_rating",
  ],
  full: [
    "alert_status",
    "bugs",
    "vulnerabilities",
    "code_smells",
    "security_hotspots",
    "coverage",
    "line_coverage",
    "branch_coverage",
    "duplicated_lines_density",
    "duplicated_blocks",
    "ncloc",
    "ncloc_language_distribution",
    "lines",
    "statements",
    "functions",
    "classes",
    "files",
    "directories",
    "complexity",
    "cognitive_complexity",
    "sqale_index",
    "sqale_rating",
    "reliability_rating",
    "security_rating",
    "maintainability_rating",
    "reliability_remediation_effort",
    "security_remediation_effort",
    "sqale_debt_ratio",
  ],
};

/** Format report data */
class ReportFormatter {
  /** Format as JSON */
  static json(data: Record<string, unknown>): string {
    return JSON.stringify(data, null, 2);
  }

  /** Format as YAML */
  static yaml(data: Record<string, unknown>): string {
    const formatValue = (value: unknown, indent = 0): string[] => {
      const prefix = "  ".repeat(indent);
      if (Array.isArray(value)) {
        return value.flatMap((item) => [
          `${prefix}- ${typeof item === "object" ? "" : item}`,
          ...(typeof item === "object" ? formatValue(item, indent + 1) : []),
        ]);
      }
      if (typeof value === "object" && value !== null) {
        return Object.entries(value).flatMap(([k, v]) => [
          `${prefix}${k}:${typeof v === "object" ? "" : ` ${v}`}`,
          ...(typeof v === "object" ? formatValue(v, indent + 1) : []),
        ]);
      }
      return [`${prefix}${value}`];
    };

    return formatValue(data).join("\n");
  }

  /** Format as Markdown */
  static markdown(data: Record<string, unknown>): string {
    const lines: string[] = [];
    lines.push(`# SonarQube Report`);
    lines.push(`\nGenerated: ${new Date().toISOString()}\n`);

    if (data.project) {
      lines.push(`## Project: ${data.project.name}`);
      lines.push(`- **Key:** ${data.project.key}`);
      lines.push(`- **Version:** ${data.project.version || "N/A"}\n`);
    }

    if (data.qualityGate) {
      const status = data.qualityGate.projectStatus.status;
      const emoji = status === "OK" ? "✅" : status === "WARN" ? "⚠️" : "❌";
      lines.push(`## Quality Gate: ${emoji} ${status}\n`);
    }

    if (data.metrics) {
      lines.push(`## Metrics\n`);
      lines.push(`| Metric | Value |`);
      lines.push(`|--------|-------|`);
      for (const measure of data.metrics.component.measures) {
        lines.push(`| ${measure.metric} | ${measure.value} |`);
      }
      lines.push("");
    }

    if (data.issues) {
      lines.push(`## Issues Summary\n`);
      lines.push(`- **Total:** ${data.issues.total}`);
      const bySeverity = data.issues.issues.reduce(
        (acc: Record<string, number>, issue: { severity: string }) => {
          acc[issue.severity] = (acc[issue.severity] || 0) + 1;
          return acc;
        },
        {}
      );
      for (const [severity, count] of Object.entries(bySeverity)) {
        lines.push(`- **${severity}:** ${count}`);
      }
      lines.push("");
    }

    return lines.join("\n");
  }

  /** Format as plain text */
  static text(data: Record<string, unknown>): string {
    const lines: string[] = [];
    lines.push("=".repeat(60));
    lines.push("SONARQUBE REPORT");
    lines.push("=".repeat(60));
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push("");

    if (data.project) {
      lines.push(`PROJECT: ${data.project.name}`);
      lines.push(`Key: ${data.project.key}`);
      lines.push(`Version: ${data.project.version || "N/A"}`);
      lines.push("");
    }

    if (data.qualityGate) {
      const status = data.qualityGate.projectStatus.status;
      lines.push(`QUALITY GATE: ${status}`);
      lines.push("");
    }

    if (data.metrics) {
      lines.push("METRICS:");
      lines.push("-".repeat(60));
      for (const measure of data.metrics.component.measures) {
        lines.push(`  ${measure.metric.padEnd(30)} : ${measure.value}`);
      }
      lines.push("");
    }

    if (data.issues) {
      lines.push(`ISSUES: ${data.issues.total} total`);
      lines.push("-".repeat(60));
      const bySeverity = data.issues.issues.reduce(
        (acc: Record<string, number>, issue: { severity: string }) => {
          acc[issue.severity] = (acc[issue.severity] || 0) + 1;
          return acc;
        },
        {}
      );
      for (const [severity, count] of Object.entries(bySeverity)) {
        lines.push(`  ${severity.padEnd(20)} : ${count}`);
      }
      lines.push("");
    }

    lines.push("=".repeat(60));
    return lines.join("\n");
  }

  /** Format as HTML */
  static html(data: Record<string, unknown>): string {
    const lines: string[] = [];
    lines.push(`<!DOCTYPE html>`);
    lines.push(`<html lang="en">`);
    lines.push(`<head>`);
    lines.push(`  <meta charset="UTF-8">`);
    lines.push(
      `  <meta name="viewport" content="width=device-width, initial-scale=1.0">`
    );
    lines.push(`  <title>SonarQube Report</title>`);
    lines.push(`  <style>`);
    lines.push(
      `    body { font-family: system-ui, sans-serif; max-width: 1200px; margin: 2rem auto; padding: 0 1rem; }`
    );
    lines.push(
      `    h1 { color: #333; border-bottom: 3px solid #4c9aff; padding-bottom: 0.5rem; }`
    );
    lines.push(`    h2 { color: #555; margin-top: 2rem; }`);
    lines.push(
      `    table { width: 100%; border-collapse: collapse; margin: 1rem 0; }`
    );
    lines.push(
      `    th, td { text-align: left; padding: 0.75rem; border: 1px solid #ddd; }`
    );
    lines.push(`    th { background: #f5f5f5; font-weight: 600; }`);
    lines.push(`    .status-ok { color: #22c55e; font-weight: bold; }`);
    lines.push(`    .status-error { color: #ef4444; font-weight: bold; }`);
    lines.push(`    .status-warn { color: #f59e0b; font-weight: bold; }`);
    lines.push(`    .meta { color: #666; font-size: 0.9rem; }`);
    lines.push(`  </style>`);
    lines.push(`</head>`);
    lines.push(`<body>`);
    lines.push(`  <h1>SonarQube Report</h1>`);
    lines.push(`  <p class="meta">Generated: ${new Date().toISOString()}</p>`);

    if (data.project) {
      lines.push(`  <h2>Project: ${data.project.name}</h2>`);
      lines.push(`  <p><strong>Key:</strong> ${data.project.key}</p>`);
      lines.push(
        `  <p><strong>Version:</strong> ${data.project.version || "N/A"}</p>`
      );
    }

    if (data.qualityGate) {
      const status = data.qualityGate.projectStatus.status;
      const statusClass =
        status === "OK"
          ? "status-ok"
          : status === "WARN"
            ? "status-warn"
            : "status-error";
      lines.push(
        `  <h2>Quality Gate: <span class="${statusClass}">${status}</span></h2>`
      );
    }

    if (data.metrics) {
      lines.push(`  <h2>Metrics</h2>`);
      lines.push(`  <table>`);
      lines.push(`    <thead><tr><th>Metric</th><th>Value</th></tr></thead>`);
      lines.push(`    <tbody>`);
      for (const measure of data.metrics.component.measures) {
        lines.push(
          `      <tr><td>${measure.metric}</td><td>${measure.value}</td></tr>`
        );
      }
      lines.push(`    </tbody>`);
      lines.push(`  </table>`);
    }

    if (data.issues) {
      lines.push(`  <h2>Issues Summary</h2>`);
      lines.push(`  <p><strong>Total:</strong> ${data.issues.total}</p>`);
      lines.push(`  <table>`);
      lines.push(`    <thead><tr><th>Severity</th><th>Count</th></tr></thead>`);
      lines.push(`    <tbody>`);
      const bySeverity = data.issues.issues.reduce(
        (acc: Record<string, number>, issue: { severity: string }) => {
          acc[issue.severity] = (acc[issue.severity] || 0) + 1;
          return acc;
        },
        {}
      );
      for (const [severity, count] of Object.entries(bySeverity)) {
        lines.push(`      <tr><td>${severity}</td><td>${count}</td></tr>`);
      }
      lines.push(`    </tbody>`);
      lines.push(`  </table>`);
    }

    lines.push(`</body>`);
    lines.push(`</html>`);
    return lines.join("\n");
  }
}

/** Generate report */
async function generateReport(
  client: SonarQubeClient,
  projectKey: string,
  options: ReportOptions
): Promise<Record<string, unknown>> {
  const report: Record<string, unknown> = {};

  // Get project info
  const project = await client.getProject(projectKey);
  report.project = project.component;

  // Get metrics
  const metricKeys = options.metrics || DEFAULT_METRICS[options.detail];
  const metrics = await client.getMeasures(projectKey, metricKeys);
  report.metrics = metrics;

  // Get quality gate status
  if (options.qualityGate !== false) {
    const qualityGate = await client.getQualityGateStatus(projectKey);
    report.qualityGate = qualityGate;
  }

  // Get issues
  if (options.issues !== false) {
    const issues = await client.getIssues(projectKey, {
      pageSize: options.detail === "full" ? 500 : 100,
    });
    report.issues = issues;
  }

  return report;
}

/** Main CLI function */
async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  const options: ReportOptions = {
    detail: "detailed",
    format: "json",
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--detail":
      case "-d":
        options.detail = args[++i] as DetailLevel;
        break;
      case "--format":
      case "-f":
        options.format = args[++i] as OutputFormat;
        break;
      case "--output":
      case "-o":
        options.output = args[++i];
        break;
      case "--project":
      case "-p":
        options.projectKey = args[++i];
        break;
      case "--url":
      case "-u":
        options.baseUrl = args[++i];
        break;
      case "--metrics":
      case "-m":
        options.metrics = args[++i].split(",");
        break;
      case "--no-issues":
        options.issues = false;
        break;
      case "--no-quality-gate":
        options.qualityGate = false;
        break;
      case "--help":
      case "-h":
        console.log(`
SonarQube Report Fetcher

Usage:
  pnpm sonar:report [options]

Options:
  -d, --detail <level>        Detail level: brief, detailed, full (default: detailed)
  -f, --format <format>       Output format: json, yaml, markdown, text, html (default: json)
  -o, --output <file>         Write output to file (default: stdout)
  -p, --project <key>         Project key (default: from SONAR_PROJECT_KEY env)
  -u, --url <url>             SonarQube base URL (default: from SONAR_URL env)
  -m, --metrics <metrics>     Comma-separated list of metric keys
  --no-issues                 Skip fetching issues
  --no-quality-gate           Skip fetching quality gate status
  -h, --help                  Show this help message

Environment Variables:
  SONAR_TOKEN                 SonarQube API token (required)
  SONAR_URL                   SonarQube base URL (required if not using --url)
  SONAR_PROJECT_KEY           Project key (required if not using --project)

Examples:
  # Basic usage (JSON output)
  pnpm sonar:report

  # Brief markdown report
  pnpm sonar:report --detail brief --format markdown

  # Full HTML report to file
  pnpm sonar:report --detail full --format html --output report.html

  # Custom metrics as YAML
  pnpm sonar:report --metrics bugs,vulnerabilities,coverage --format yaml

  # Text report without issues
  pnpm sonar:report --format text --no-issues
        `);
        process.exit(0);
    }
  }

  // Validate required config
  const token =
    process.env.SONAR_TOKEN || "a94d24c73c1c12306062c3b3f9d86811687fd5ab";
  const baseUrl = options.baseUrl || process.env.SONAR_URL;
  const projectKey = options.projectKey || process.env.SONAR_PROJECT_KEY;

  if (!token) {
    console.error("Error: SONAR_TOKEN environment variable not set");
    process.exit(1);
  }

  if (!baseUrl) {
    console.error(
      "Error: SONAR_URL environment variable not set or --url not provided"
    );
    process.exit(1);
  }

  if (!projectKey) {
    console.error(
      "Error: SONAR_PROJECT_KEY environment variable not set or --project not provided"
    );
    process.exit(1);
  }

  try {
    // Create client and generate report
    const client = new SonarQubeClient({ baseUrl, token, projectKey });
    const reportData = await generateReport(client, projectKey, options);

    // Format output
    const formatters: Record<
      OutputFormat,
      (data: Record<string, unknown>) => string
    > = {
      json: ReportFormatter.json,
      yaml: ReportFormatter.yaml,
      markdown: ReportFormatter.markdown,
      text: ReportFormatter.text,
      html: ReportFormatter.html,
    };

    const formatter = formatters[options.format];
    const output = formatter(reportData);

    // Write output
    if (options.output) {
      writeFileSync(options.output, output, "utf-8");
      console.log(`Report written to: ${options.output}`);
    } else {
      console.log(output);
    }
  } catch (error) {
    console.error("Error generating report:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}
