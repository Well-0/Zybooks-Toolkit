// ==UserScript==
// @name         Zybooks Auto Close Modal
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Automatically press "Done" on Zybooks modal
// @author       Claude
// @match        *://learn.zybooks.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function clickDoneButton() {
        // Find any "Done" button inside modals
        let doneButtons = document.querySelectorAll('.zb-modal-content button');

        doneButtons.forEach(button => {
            if (button.innerText.trim() === 'Done') {
                console.log('Clicking Done button...');
                button.click();
            }
        });
    }

    // Observe changes to detect when the modal appears
    let observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                clickDoneButton();
            }
        }
    });

    // Start observing changes in the document body
    observer.observe(document.body, { childList: true, subtree: true });

    // Try clicking the button immediately in case it's already there
    clickDoneButton();
})();
