// ==UserScript==
// @name         Zybooks Codebase Exporter
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Exports the current code file displayed in Zybooks to a file with the correct filename, placed next to the markdown exporter button.
// @author       You
// @match        *://learn.zybooks.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

     // Function to create and download markdown file
     function createMarkdownFile(content, filename) {
        let blob = new Blob([content], { type: 'text/markdown' });
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }

    // Function to generate content and trigger file download
    function exportContent() {
        let contentToScan = document.querySelector('div.markdown-content-resource'); // Selecting by class name
        let contentToInclude = contentToScan ? contentToScan.querySelectorAll('div') : []; // Selecting child divs, with null check

        // Get the title text
        let titleElement = document.querySelector('h1.zybook-section-title');
        let titleText = titleElement?.textContent?.trim() || 'exported_content';

        if (contentToScan && contentToInclude.length > 0) {
            let markdownContent = '';

            contentToInclude.forEach(element => {
                markdownContent += element.innerHTML + '\n\n';
            });

            createMarkdownFile(markdownContent, `${titleText}.md`);
        } else {
            alert('Could not find the specified content to export.');
        }
    }

    // Function to create and download file
    function createFile(content, filename) {
        let blob = new Blob([content], { type: 'text/plain' });
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }

    // Function to export the code content
    function resizeEditorContainer() {
        let editorContainer = document.querySelector('div.ace-editor-container');
        if (editorContainer) {
            editorContainer.style.height = '900px';
        } else {
            alert('Could not find the editor container to resize.');
        }
    }

    function exportCode() {

        //resize the editor container to show all the code

        resizeEditorContainer();

        // Wait for the editor container to resize within function

        setTimeout(() => {
            // Get the filename from the dropdown
           let filenameElement = document.querySelector('.inline-editor-filename');
        let filenameText = filenameElement ? filenameElement.textContent.trim() : 'exported_code.cpp';

            // Get the code content by searching for the div with 'ace_text-layer' class inside the 'ace-editor-container' div
            let codeContentElement = document.querySelector('div.ace-editor-container div.ace_text-layer');
            let codeContent = '';

            if (codeContentElement) {
                let lines = codeContentElement.querySelectorAll('div.ace_line');
                lines.forEach(line => {
                    codeContent += line.textContent + '\n';
                });
                createFile(codeContent, filenameText);
            } else {
                alert('Could not find the code content to export.');
            }
        }, 600); // 1000 = 1 second

    }


    // Adding export buttons to the page
    function addExportButtons() {
        let markdownExportButton = document.createElement('button');
        markdownExportButton.innerHTML = 'Export to Markdown';
        markdownExportButton.style.position = 'fixed';
        markdownExportButton.style.bottom = '20px';
        markdownExportButton.style.right = '190px'; // Move slightly left
        markdownExportButton.style.zIndex = '1000';
        markdownExportButton.style.padding = '10px';

        markdownExportButton.style.backgroundColor = '#00BFFF';
        markdownExportButton.style.color = 'white';
        markdownExportButton.style.border = 'none';
        markdownExportButton.style.borderRadius = '5px';
        markdownExportButton.style.cursor = 'pointer';

        let codebaseExportButton = document.createElement('button');
        codebaseExportButton.innerHTML = 'Export Codebase';
        codebaseExportButton.style.position = 'fixed';
        codebaseExportButton.style.bottom = '20px';
        codebaseExportButton.style.right = '20px';
        codebaseExportButton.style.zIndex = '1000';
        codebaseExportButton.style.padding = '10px';

        codebaseExportButton.style.backgroundColor = '#800080';
        codebaseExportButton.style.color = 'white';
        codebaseExportButton.style.border = 'none';
        codebaseExportButton.style.borderRadius = '5px';
        codebaseExportButton.style.cursor = 'pointer';

        // Attach event listeners
        markdownExportButton.onclick = exportContent; // Assuming exportContent is defined elsewhere
        codebaseExportButton.onclick = exportCode;

        // Append buttons to the page
        document.body.appendChild(markdownExportButton);
        document.body.appendChild(codebaseExportButton);
    }

    // Run the script
    window.onload = function() {
        addExportButtons();
    };

})();

/*let filenameElement = document.querySelector('.dropdown-filename.text-ellipsis.overflow-hidden');
        let filenameText = filenameElement ? filenameElement.textContent.trim() : 'exported_code.cpp';

        // Get the code content by searching for the div with 'ace_text-layer' class inside the 'ace-editor-container' div
        let codeContentElement = document.querySelector('div.ace-editor-container div.ace_text-layer');
        let codeContent = '';

        if (codeContentElement) {
            let lines = codeContentElement.querySelectorAll('div.ace_line');
            lines.forEach(line => {
                codeContent += line.textContent + '\n';
            });
            createFile(codeContent, filenameText);
        } else {
            alert('Could not find the code content to export.');
        }*/