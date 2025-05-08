/**
 * HLS Playlist Extractor
 * 
 * This script helps extract HLS (HTTP Live Streaming) playlist URLs from media players
 * in web browsers. Run this script in the browser console while on a page with video content.
 * 
 * How to use:
 * 1. Open the web page containing the video
 * 2. Open browser dev tools (F12 or right-click > Inspect)
 * 3. Paste this script into the console tab
 * 4. The script will search for and display any HLS playlist URLs found
 */

(function() {
    // Store found playlist URLs
    const foundPlaylists = new Set();
    
    // Look for m3u8 URLs in the network requests
    function checkNetworkRequests() {
        console.log('Checking network requests for HLS playlists...');
        const entries = performance.getEntriesByType('resource');
        
        entries.forEach(entry => {
            if (entry.name.includes('.m3u8')) {
                foundPlaylists.add(entry.name);
                console.log('Found HLS playlist:', entry.name);
            }
        });
    }
    
    // Look for video elements with HLS sources
    function checkVideoElements() {
        console.log('Checking video elements for HLS sources...');
        const videoElements = document.querySelectorAll('video');
        
        videoElements.forEach(video => {
            // Check video source elements
            const sources = video.querySelectorAll('source');
            sources.forEach(source => {
                if (source.src && source.src.includes('.m3u8')) {
                    foundPlaylists.add(source.src);
                    console.log('Found HLS source:', source.src);
                }
            });
            
            // Check video src attribute
            if (video.src && video.src.includes('.m3u8')) {
                foundPlaylists.add(video.src);
                console.log('Found HLS video src:', video.src);
            }
        });
    }
    
    // Look for HLS.js instances
    function checkHlsInstances() {
        console.log('Checking for HLS.js instances...');
        // HLS.js often stores the URL in a config object
        if (window.Hls && window.Hls.instances) {
            window.Hls.instances.forEach(instance => {
                if (instance.url && instance.url.includes('.m3u8')) {
                    foundPlaylists.add(instance.url);
                    console.log('Found HLS.js URL:', instance.url);
                }
            });
        }
    }
    
    // Look for media source extension objects
    function checkMediaSources() {
        console.log('Checking MediaSource objects...');
        const videoElements = document.querySelectorAll('video');
        
        videoElements.forEach(video => {
            if (video.src && video.src.startsWith('blob:')) {
                console.log('Found blob URL in video element:', video.src);
                console.log('This indicates the website is using MediaSource Extensions (MSE)');
                console.log('You\'ll need to check Network tab for .m3u8 requests');
            }
        });
    }
    
    // Main function
    function findHlsPlaylists() {
        console.log('==========================================');
        console.log('HLS Playlist Extractor');
        console.log('==========================================');
        
        checkNetworkRequests();
        checkVideoElements();
        checkHlsInstances();
        checkMediaSources();
        
        console.log('==========================================');
        
        if (foundPlaylists.size > 0) {
            console.log('Found HLS playlists:');
            foundPlaylists.forEach(url => {
                console.log(url);
            });
            
            console.log('\nCopy the URL and save it to a file named "playlist.m3u8"');
            console.log('You can then use the download-ts-files.js script to download the segments');
        } else {
            console.log('No HLS playlists found directly.');
            console.log('Try looking in the Network tab of your browser\'s developer tools');
            console.log('Filter by "m3u8" to find playlist files');
        }
        
        console.log('==========================================');
    }
    
    // Run the main function
    findHlsPlaylists();
})(); 