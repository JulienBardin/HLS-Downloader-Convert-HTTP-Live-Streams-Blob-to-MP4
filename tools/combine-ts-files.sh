#!/bin/bash

# HLS to MP4 Converter
# This script combines downloaded TS files into a single MP4 file using FFmpeg
# 
# Requirements:
# - FFmpeg must be installed (https://ffmpeg.org/)
# - A local playlist file named playlist_local.m3u8
# - All TS files referenced in the playlist must be in the current directory
#
# Usage:
# bash combine-ts-files.sh [output_filename]
#
# If output filename is not provided, default is "output.mp4"

# Set script to exit on error
set -e

# Function to display usage information
usage() {
    echo "Usage: $0 [output_filename]"
    echo "If output filename is not provided, default is 'output.mp4'"
    exit 1
}

# Function to check if FFmpeg is installed
check_ffmpeg() {
    if ! command -v ffmpeg &> /dev/null; then
        echo "Error: FFmpeg is not installed or not in your PATH"
        echo "Please install FFmpeg from https://ffmpeg.org/"
        exit 1
    fi
}

# Function to check if playlist file exists
check_playlist() {
    if [ ! -f "playlist_local.m3u8" ]; then
        echo "Error: playlist_local.m3u8 file not found in the current directory"
        echo "Please create a local playlist file following the instructions in the documentation"
        exit 1
    fi
}

# Main function to combine TS files into MP4
combine_files() {
    local output_file=$1
    echo "===========================================" 
    echo "Starting conversion process" 
    echo "===========================================" 
    echo "Input playlist: playlist_local.m3u8" 
    echo "Output file: $output_file" 
    echo "===========================================" 
    
    # Run FFmpeg command to combine files
    ffmpeg -protocol_whitelist file,http,https,tcp,tls,crypto -i playlist_local.m3u8 -c copy "$output_file"
    
    echo "===========================================" 
    echo "Conversion completed successfully!" 
    echo "Output saved to: $output_file" 
    echo "===========================================" 
}

# Main script execution

# Get output filename from command line argument or use default
OUTPUT_FILE="output.mp4"
if [ $# -eq 1 ]; then
    OUTPUT_FILE="$1"
fi

# Check for FFmpeg and playlist file
check_ffmpeg
check_playlist

# Combine files
combine_files "$OUTPUT_FILE"

exit 0 