#!/bin/bash

# Local Playlist Creator
# This script creates a modified version of an HLS playlist to use local TS files
# 
# Requirements:
# - A playlist file named playlist.m3u8 in the current directory
# - sed command (available on most Unix/Linux systems and macOS)
#
# Usage:
# bash create-local-playlist.sh [input_playlist] [output_playlist]
#
# If input/output filenames are not provided, defaults are "playlist.m3u8" and "playlist_local.m3u8"

# Set script to exit on error
set -e

# Function to display usage information
usage() {
    echo "Usage: $0 [input_playlist] [output_playlist]"
    echo "If input/output filenames are not provided, defaults are:"
    echo "  - Input: playlist.m3u8"
    echo "  - Output: playlist_local.m3u8"
    exit 1
}

# Function to check if input playlist file exists
check_input_file() {
    local input_file=$1
    if [ ! -f "$input_file" ]; then
        echo "Error: Input playlist file '$input_file' not found in the current directory"
        exit 1
    fi
}

# Main function to create local playlist
create_local_playlist() {
    local input_file=$1
    local output_file=$2
    
    echo "===========================================" 
    echo "Creating local playlist" 
    echo "===========================================" 
    echo "Input: $input_file" 
    echo "Output: $output_file" 
    echo "===========================================" 
    
    # Create backup of original file
    cp "$input_file" "${input_file}.backup"
    echo "Backup of original file created: ${input_file}.backup"
    
    # Create local playlist by:
    # 1. Replacing remote URL patterns with local filenames
    # 2. Removing query parameters from TS file references
    
    # The exact sed command will depend on the format of your playlist
    # This is a generic one that handles many common cases
    sed 's|^https\?://[^/]*/\([^?]*\)\.ts.*$|\1.ts|; s|^.*/\([^/]*\.ts\).*$|\1|' "$input_file" > "$output_file"
    
    echo "Local playlist created successfully!"
    echo "You can now use the combine-ts-files.sh script to create an MP4 file."
}

# Main script execution

# Get input/output filenames from command line arguments or use defaults
INPUT_FILE="playlist.m3u8"
OUTPUT_FILE="playlist_local.m3u8"

if [ $# -ge 1 ]; then
    INPUT_FILE="$1"
fi

if [ $# -ge 2 ]; then
    OUTPUT_FILE="$2"
fi

# Check if input file exists
check_input_file "$INPUT_FILE"

# Create local playlist
create_local_playlist "$INPUT_FILE" "$OUTPUT_FILE"

exit 0 