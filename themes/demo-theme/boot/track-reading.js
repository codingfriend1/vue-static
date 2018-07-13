/**
 * Tracks if a user read the post or simply scanned it and send those analytics to google as metrics and dimensions
 */

const Vue = require('vue')
if(!Vue.prototype.$isServer) {
    // Debug flag
    const debugMode = false;


    function get_text(el) {
        var ret = "";
        var length = el.childNodes.length;
        for(var i = 0; i < length; i++) {
            var node = el.childNodes[i];
            if(node.nodeType != 8) {
                ret += node.nodeType != 1 ? node.nodeValue : get_text(node);
            }
        }
        return ret;
    }

    function getDocHeight() {
        var D = document;
        return Math.max(
            D.body.scrollHeight, D.documentElement.scrollHeight,
            D.body.offsetHeight, D.documentElement.offsetHeight,
            D.body.clientHeight, D.documentElement.clientHeight
        );
    }

    let bottom, height, currentTime, timeToScroll, contentScrollEnd, timeToContentEnd, end

    // # px before tracking a reader
    let readerLocation = 150;
    let scroller = false;    
    let endContent = false;
    let didComplete = false;
    let scrollStart = 0;

    // Set some time variables to calculate reading time
    let startTime = new Date();
    let beginning = startTime.getTime();
    let time_spend_reading = 0;
    let postBodyEl
    let bodyHeight
    let makeEvent
    let gaSet
    // Check the location and track user
    let trackLocation = () => {
        bottom = (windowHeight * 0.85) + window.pageYOffset;
        height = getDocHeight()

        // If user starts to scroll send an event
        if (bottom > readerLocation && !scroller) {
            currentTime = new Date();
            scrollStart = currentTime.getTime();
            timeToScroll = Math.round((scrollStart - beginning) / 1000);
            if (!debugMode) {
                makeEvent('Reading', 'StartReading', timeToScroll);
            } else {
                alert('started reading ' + timeToScroll);
            }
            scroller = true;
        }

        let bottom_of_content = postBodyEl.scrollTop + bodyHeight + (windowHeight * 0.5);

        // If user has hit the bottom of the content send an makeEvent
        if (bottom >= bottom_of_content && !endContent) {
            currentTime = new Date();
            contentScrollEnd = currentTime.getTime();
            timeToContentEnd = Math.round((contentScrollEnd - scrollStart) / 1000);
            if (!debugMode) {
                makeEvent('Reading', 'ContentBottom', timeToContentEnd);
            } else {
                alert('Finished the article in :'+ timeToContentEnd + ' seconds.');
            }
            endContent = true;
        }

        // If user has hit the bottom of page send an makeEvent
        if (bottom >= bottom_of_content && !didComplete) {

            currentTime = new Date();
            end = currentTime.getTime();
            time_spend_reading = Math.round((end - scrollStart) / 1000);


            if (!debugMode) {
                if (time_spend_reading < predicted_reading_time) {
                    gaSet('dimension1', 'Scanner');
                    gaSet('metric2', 1);
                    makeEvent('Reading', 'Scanner', time_spend_reading);
                } else {
                    gaSet('dimension1', 'Reader');
                    gaSet('metric1', 1);
                    makeEvent('Reading', 'Reader', time_spend_reading);
                }                
            } else {
                if (time_spend_reading < predicted_reading_time) {
                    alert(`You scanned the article. Predicted reading time: ${predicted_reading_time}, your reading time: ${time_spend_reading}`, );

                } else {
                    alert(`You read the article!`);
                }
            }
            didComplete = true;
        }

        if (bottom >= height) {
          makeEvent('Reading', 'CommentsBottom', time_spend_reading);
        }
    }

    // Set some flags for tracking & execution
    let timer = 0;
    // Default time delay before checking location
    const callBackTime = 100;

    let predicted_reading_time
    let windowHeight = window.innerHeight

    const scrollListener = () => {
        if (timer) {
            clearTimeout(timer);
        }
        // Use a buffer so we don't call trackLocation too often.
        timer = setTimeout(trackLocation, callBackTime);
    }

    window.trackReading = function(el, event, fileTitle, set) {
        gaSet = set
        makeEvent = event
        window.removeEventListener('scroll', scrollListener)
        const words_per_minute = 275;
        const inital_scan_rate_words_per_second = 225
        const percent_of_article_to_read_before_becoming_reader = 0.4;

        /**
         * Number of words
         */

        Vue.prototype.$nextTick(() => {
            postBodyEl = el
            bodyHeight = postBodyEl.clientHeight

            windowHeight = window.innerHeight

            if(postBodyEl) {
                const words_only = get_text(postBodyEl);
                const word_count = words_only.split(' ').length;

                const orientation_seconds = 4

                let initialScanTimeInSeconds = (word_count / inital_scan_rate_words_per_second) + orientation_seconds

                /**
                 * Article slow reading time estimate
                 */
                const slow_reading_time_in_minutes = Math.round(word_count / words_per_minute);

                const readingTimeEl = document.getElementById('reading-time')
                if(readingTimeEl) {
                  readingTimeEl.innerHTML = slow_reading_time_in_minutes + ' min read';
                }


                /**
                 * Article fast reading time estimate
                 */

                const quick_reading_time_in_minutes = (word_count / words_per_minute) * percent_of_article_to_read_before_becoming_reader;

                predicted_reading_time = parseInt(quick_reading_time_in_minutes * 60);

                // Track the aticle load
                if (!debugMode) {
                    makeEvent('Reading', 'ArticleLoaded');
                } else {
                    alert(`${fileTitle} has loaded. Estimated read time: ${predicted_reading_time} seconds, or ${slow_reading_time_in_minutes} minutes.`);    
                }
                // Track the scrolling and track location
                setTimeout(() => {   
                  window.addEventListener('scroll', scrollListener);   
                }, initialScanTimeInSeconds * 1000);
            }
        });
        
    }
}