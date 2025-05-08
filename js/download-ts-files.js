/**
 * HLS TS File Downloader
 * 
 * This script downloads .ts files referenced in an HLS playlist.
 * It's designed to run in a modern browser environment.
 * 
 * How to use:
 * 1. Have your playlist.m3u8 file loaded
 * 2. Open browser developer tools and paste this script
 * 3. The script will parse the playlist and download all TS segments
 * 4. After downloading, use the provided FFmpeg command to combine them
 */

(function() {
    // Configuration
    const playlistUrl = 'playlist.m3u8'; // Local or remote URL to the playlist
    const downloadDelay = 500; // Delay between downloads in milliseconds (adjust as needed)
    
    // State tracking
    let tsFiles = [];
    let baseUrl = '';
    let downloadedCount = 0;
    let totalFiles = 0;
    
    /**
     * Download a file from URL
     * @param {string} url - URL of the file to download
     * @param {string} filename - Name to save the file as
     */
    async function downloadFile(url, filename) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
            }
            
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            URL.revokeObjectURL(link.href);
            
            return true;
        } catch (error) {
            console.error(`Error downloading ${url}:`, error);
            return false;
        }
    }
    
    /**
     * Parse the M3U8 playlist to extract TS file URLs
     * @param {string} content - Content of the playlist file
     * @returns {string[]} Array of TS file URLs
     */
    function parsePlaylist(content) {
        const lines = content.split('\n');
        const tsFiles = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Skip comments and directives
            if (line.startsWith('#') || line === '') {
                continue;
            }
            
            // Found a TS file
            if (line.endsWith('.ts') || line.includes('.ts?')) {
                tsFiles.push(line);
            }
        }
        
        return tsFiles;
    }
    
    /**
     * Extract base URL from the playlist URL
     * @param {string} url - Playlist URL
     * @returns {string} Base URL
     */
    function getBaseUrl(url) {
        const lastSlashIndex = url.lastIndexOf('/');
        return lastSlashIndex !== -1 ? url.substring(0, lastSlashIndex + 1) : '';
    }
    
    /**
     * Download all TS files with a delay between each
     */
    async function downloadTsFiles() {
        if (tsFiles.length === 0) {
            console.log('No TS files found in the playlist');
            return;
        }
        
        console.log(`Starting download of ${tsFiles.length} TS files...`);
        totalFiles = tsFiles.length;
        
        for (let i = 0; i < tsFiles.length; i++) {
            const tsUrl = tsFiles[i];
            let fullUrl = tsUrl;
            
            // If it's not an absolute URL, combine with base URL
            if (!tsUrl.startsWith('http')) {
                fullUrl = baseUrl + tsUrl;
            }
            
            // Extract filename from URL
            let filename = tsUrl.split('/').pop().split('?')[0];
            
            console.log(`Downloading (${i+1}/${tsFiles.length}): ${filename}`);
            const success = await downloadFile(fullUrl, filename);
            
            if (success) {
                downloadedCount++;
                console.log(`Progress: ${downloadedCount}/${totalFiles} (${Math.round(downloadedCount/totalFiles*100)}%)`);
            }
            
            // Add delay to avoid overwhelming the browser
            await new Promise(resolve => setTimeout(resolve, downloadDelay));
        }
        
        console.log('Download completed!');
        console.log(`Successfully downloaded ${downloadedCount} out of ${totalFiles} files`);
        console.log('\nNext steps:');
        console.log('1. Create a local playlist file (see documentation)');
        console.log('2. Run FFmpeg command to combine files:');
        console.log('   ffmpeg -protocol_whitelist file,http,https,tcp,tls,crypto -i playlist_local.m3u8 -c copy output.mp4');
    }
    
    /**
     * Main function to start the process
     */
    async function main() {
        console.log('==========================================');
        console.log('HLS TS File Downloader');
        console.log('==========================================');
        
        try {
            console.log(`Fetching playlist: ${playlistUrl}`);
            
            // Get the base URL from the playlist URL
            baseUrl = getBaseUrl(playlistUrl);
            
            // Fetch the playlist content
            const response = await fetch(playlistUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch playlist: ${response.status} ${response.statusText}`);
            }
            
            const content = await response.text();
            console.log('Playlist fetched successfully');
            
            // Parse the playlist to get TS files
            tsFiles = parsePlaylist(content);
            console.log(`Found ${tsFiles.length} TS files in the playlist`);
            
            // Download all TS files
            await downloadTsFiles();
            
        } catch (error) {
            console.error('Error:', error);
            console.log('\nTroubleshooting:');
            console.log('- Make sure the playlist URL is correct');
            console.log('- Check if the playlist is accessible (CORS issues may prevent access)');
            console.log('- If getting CORS errors, try downloading the playlist first and serving it locally');
        }
        
        console.log('==========================================');
    }
    
    // Start the process
    main();
})(); 