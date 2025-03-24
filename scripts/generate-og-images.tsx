/// <reference types="bun-types" />

import { join, dirname } from "path";
import { ImageResponse } from "next/og";
import seoConfig from "../seo.config";
import React from "react";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const outputDir = join(rootDir, "public/og-images");

// Define brand colors and theme
const BRAND_COLORS = {
  dark: "#17172E", // Deep purple background
  muted: "hsl(250, 20%, 85%)", // Lighter muted text for better contrast
};

async function loadFont(fontPath: string): Promise<Buffer> {
  try {
    return await fs.promises.readFile(join(rootDir, fontPath));
  } catch (error) {
    console.error(`Error loading font from ${fontPath}:`, error);
    throw new Error(`Failed to load font: ${fontPath}`);
  }
}

async function generateOGImage(
  title: string,
  description: string,
  path: string,
  outputPath: string
) {
  // Read the logo file
  const logoPath = join(rootDir, "public", "img", "logo.svg");
  const logo = await fs.promises.readFile(logoPath);
  const logoBase64 = `data:image/svg+xml;base64,${logo.toString("base64")}`;

  // Read the pattern file
  const patternPath = join(rootDir, "public", "img", "pattern.png");
  const pattern = await fs.promises.readFile(patternPath);
  const patternBase64 = `data:image/png;base64,${pattern.toString("base64")}`;

  // Load fonts
  const interBold = await loadFont("public/fonts/Inter-Bold.ttf");
  const interRegular = await loadFont("public/fonts/Inter-Regular.ttf");

  if (!interBold || !interRegular) {
    throw new Error("Failed to load required fonts");
  }

  const image = new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: BRAND_COLORS.dark,
          padding: "64px",
          position: "relative",
        }}
      >
        {/* Background Pattern */}
        <img
          src={patternBase64}
          style={{
            position: "absolute",
            top: "0",
            right: "0",
            width: "732px",
            height: "610px",
            opacity: 0.5,
          }}
        />

        {/* Main Content Wrapper */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            zIndex: 1,
          }}
        >
          {/* Logo */}
          <div style={{ marginBottom: "48px", display: "flex" }}>
            <img
              src={logoBase64}
              alt="Logo"
              style={{
                height: "32px",
                width: "auto",
              }}
            />
          </div>

          {/* Content Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              gap: "24px",
            }}
          >
            {/* Title */}
            <h1
              style={{
                color: "white",
                fontSize: "88px",
                fontFamily: "Inter",
                fontWeight: 700,
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              {title}
            </h1>

            {/* Description */}
            <p
              style={{
                color: BRAND_COLORS.muted,
                fontSize: "44px",
                fontFamily: "Inter",
                fontWeight: 400,
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              {description}
            </p>
          </div>
        </div>

        {/* Neon Line */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "6px",
            background: "linear-gradient(90deg, rgba(221, 242, 24, 1) 0%, rgba(221, 242, 24, 0.8) 100%)",
            boxShadow: "0 0 20px rgba(221, 242, 24, 0.7)",
            zIndex: 2,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: interBold,
          weight: 700,
          style: "normal",
        },
        {
          name: "Inter",
          data: interRegular,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );

  const buffer = Buffer.from(await image.arrayBuffer());
  await Bun.write(outputPath, buffer);
  console.log(`Generated OG image: ${outputPath}`);
}

async function generateAllOGImages() {
  console.log("Starting OG image generation...");

  try {
    // Ensure output directory exists
    await fs.promises.mkdir(outputDir, { recursive: true });

    // Generate OG images for each route in parallel using Promise.all
    await Promise.all(
      Object.entries(seoConfig).map(([route, config]) => {
        const outputPath = join(
          outputDir,
          `${route === "index" ? "home" : route}.png`
        );

        return generateOGImage(
          config.ogImage.title,
          config.ogImage.description,
          route,
          outputPath
        );
      })
    );

    console.log("OG image generation complete!");
  } catch (error) {
    console.error("Error generating OG images:", error);
    process.exit(1);
  }
}

generateAllOGImages();
