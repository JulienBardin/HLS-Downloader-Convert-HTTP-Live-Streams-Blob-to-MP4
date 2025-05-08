# HLS to MP4 Converter

This repository provides tools to download HTTP Live Streaming (HLS) content and convert it to MP4 format for offline viewing.

## Table of Contents

- [Overview](#overview)
- [Important Concepts](#important-concepts)
  - [What is HLS?](#what-is-hls)
  - [What is a Blob URL?](#what-is-a-blob-url)
  - [CORS Policy and Security](#cors-policy-and-security)
- [Workflow](#workflow)
- [Tools Included](#tools-included)
- [Step-by-Step Usage Guide](#step-by-step-usage-guide)
- [Troubleshooting](#troubleshooting)
- [Requirements](#requirements)
- [License](#license)

## Overview

HTTP Live Streaming (HLS) is a widely used protocol for streaming video content over the internet. However, sometimes you might want to save this content for offline viewing. This repository provides a set of tools to:

1. Extract HLS playlist URLs from websites
2. Download TS segment files
3. Combine these segments into a single MP4 file

## Important Concepts

### What is HLS?

HTTP Live Streaming (HLS) is a streaming protocol developed by Apple that breaks video content into small segments (usually 10 seconds each) and delivers them via HTTP. Key features include:

- **M3U8 Playlist Files**: These text files contain metadata and URLs for the video segments
- **TS Files**: Transport Stream (TS) files are the actual video segments
- **Adaptive Bitrate**: HLS can adjust quality based on the viewer's bandwidth

### What is a Blob URL?

A Blob URL (Binary Large Object URL) is a URL created by the browser to reference binary data stored in memory. In the context of video streaming:

- Websites often use blob URLs to prevent easy downloading of content
- When you see a video element with a source like `blob:https://example.com/1a2b3c...`, it means the browser is using the Media Source Extensions (MSE) API
- The actual video data isn't directly accessible through this URL; it's loaded into memory from elsewhere (like an HLS playlist)

### CORS Policy and Security

Cross-Origin Resource Sharing (CORS) is a security mechanism that restricts web pages from making requests to a different domain than the one that served the page. This affects our HLS download process:

- Browsers enforce CORS policies to prevent malicious websites from accessing data across domains
- When trying to fetch HLS playlists or segments from a console script, you might encounter CORS errors
- This is why our workflow involves:
  1. Finding the original HLS playlist URL in the Network tab
  2. Downloading the playlist and TS files individually (browser allows this despite CORS)
  3. Combining them locally with FFmpeg (outside the browser environment)

## Workflow

The general workflow for this project is:

1. **Find the HLS Stream**: Use the browser's developer tools to find the M3U8 playlist URL
2. **Download TS Segments**: Use our JavaScript tools to download all video segments
3. **Create Local Playlist**: Modify the playlist to reference local files
4. **Combine into MP4**: Use FFmpeg to combine segments into a single MP4 file

## Tools Included

This repository includes:

- **`js/extract-hls-playlist.js`**: JavaScript to help find HLS playlist URLs in web pages
- **`js/download-ts-files.js`**: JavaScript to download TS segments from a playlist
- **`tools/create-local-playlist.sh`**: Shell script to prepare a local playlist file
- **`tools/combine-ts-files.sh`**: Shell script to combine TS files into an MP4

## Step-by-Step Usage Guide

### 1. Finding the HLS Playlist

1. Open the web page containing the video you want to download
2. Open browser developer tools (F12 or right-click > Inspect)
3. Go to the Network tab
4. Filter results by "m3u8" (the extension for HLS playlists)
5. Play the video and look for playlist file requests
6. Alternative: Paste the `extract-hls-playlist.js` script in the console tab

When you find the playlist URL, save it or its content to a file named `playlist.m3u8`.

### 2. Downloading TS Segments

There are two ways to download the segments:

#### Option A: Using the Browser Console

1. Create a local HTML file that references the playlist URL or save the playlist locally
2. Open that file in your browser
3. Open the developer console
4. Paste the content of `js/download-ts-files.js` into the console
5. The script will download each TS file individually

#### Option B: Using a Download Tool

You can also use tools like `youtube-dl`, `ffmpeg`, or custom scripts to download the segments.

### 3. Creating a Local Playlist

Run the `create-local-playlist.sh` script to modify the playlist to use local files:

```bash
cd /path/to/downloaded/files
bash create-local-playlist.sh
```

This will create a `playlist_local.m3u8` file that references the local TS files.

### 4. Combining into MP4

Use the `combine-ts-files.sh` script to combine the segments into a single MP4 file:

```bash
bash combine-ts-files.sh [output_filename.mp4]
```

If you don't specify an output filename, it will default to `output.mp4`.

## Troubleshooting

### CORS Errors

If you see CORS errors when running the JavaScript:
- Download the playlist file manually first
- Try using the Network tab "Copy as cURL" feature and run the command in your terminal
- Consider using a browser extension that disables CORS for testing (use with caution)

### FFmpeg Issues

If you encounter FFmpeg errors:
- Make sure FFmpeg is properly installed
- Check if all TS files referenced in the playlist are available locally
- Try running FFmpeg manually with verbose output for more detailed error messages

## Requirements

- A modern web browser (Chrome, Firefox, Safari, Edge)
- FFmpeg installed on your system
- Basic knowledge of using developer tools
- Bash shell environment (for the shell scripts)

## License

This project is released under the MIT License. See the LICENSE file for details.

**Note**: This tool is provided for educational purposes. Always respect copyright laws and terms of service for content you access. 