// ==UserScript==
// @name         zyBooks Code Editor Persistent Resizable Handle
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a persistent blue triangle resizable handle to the zyBooks code editor, even after jumping levels
// @author       Grok
// @match        *://learn.zybooks.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add resizable functionality to the code editor
    function makeEditorResizable($editorContainer) {
        const $editor = $editorContainer.find('div.ace-editor');

        if ($editor.length) {
            // Apply jQuery UI resizable if not already applied
            if (!$editorContainer.hasClass('ui-resizable')) {
                $editorContainer.resizable({
                    handles: 'se', // Southeast handle
                    minHeight: 200,
                    minWidth: 300,
                    resize: function(event, ui) {
                        // Update the Ace editor's dimensions during resize
                        $editor.css({
                            width: ui.size.width + 'px',
                            height: ui.size.height + 'px'
                        });
                        // Force Ace editor to update its layout
                        if (window.ace) {
                            const editorInstance = ace.edit($editor[0]);
                            if (editorInstance) {
                                editorInstance.resize();
                            }
                        }
                    }
                });

                // Style the resizable handle to be a blue triangle
                const $handle = $editorContainer.find('.ui-resizable-se');
                $handle.css({
                    background: 'none',
                    width: '16px',
                    height: '16px',
                    'border-style': 'solid',
                    'border-width': '0 0 16px 16px',
                    'border-color': 'transparent transparent #00BFFF transparent',
                    cursor: 'se-resize',
                    'z-index': 1000
                });

                console.log('Resizable handle added to code editor:', $editorContainer[0]);
            }
        } else {
            console.error('Ace editor not found inside container:', $editorContainer[0]);
        }
    }

    // Function to check and apply resizable functionality to all editor containers
    function applyResizableToEditors() {
        const $editorContainers = $('div.ace-editor-container');
        $editorContainers.each(function() {
            const $container = $(this);
            makeEditorResizable($container);
        });
    }

    // Function to observe DOM changes and reapply resizable functionality
    function observeDOM() {
        const observer = new MutationObserver((mutations) => {
            // Check if an ace-editor-container was added or modified
            let editorContainerChanged = false;
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if ($(node).hasClass('ace-editor-container') || $(node).find('div.ace-editor-container').length) {
                                editorContainerChanged = true;
                            }
                        }
                    });
                }
            });

            if (editorContainerChanged) {
                console.log('Editor container changed, reapplying resizable handle...');
                applyResizableToEditors();
            }
        });

        // Observe the entire document for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Function to monitor button clicks and reapply resizable handle
    function monitorButtonClicks() {
        $(document).on('click', 'button.zb-button.raised.grey, button.zb-button.secondary.raised', function() {
            console.log('Jump button clicked, scheduling reapplication of resizable handle...');
            // Delay reapplication to ensure DOM updates are complete
            setTimeout(() => {
                applyResizableToEditors();
            }, 1000); // Adjust delay as needed
        });
    }

    // Initialize the script
    window.addEventListener('load', () => {
        console.log('Page loaded, initializing resizable handle...');
        applyResizableToEditors();
        observeDOM();
        monitorButtonClicks();
    });
})();
