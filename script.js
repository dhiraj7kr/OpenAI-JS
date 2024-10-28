document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('query').value;
    const department = document.getElementById('department').value;

    if (query.trim() === '') {
        Swal.fire('Please enter a search query.');
        return;
    }

    // Show loading spinner
    const loadingSpinner = document.getElementById('loading-spinner');
    loadingSpinner.style.display = 'block';

    try {
        const response = await fetch("http://localhost:7071/api/http_trigger", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query: query, department: department })
        });

        console.log('Response status:', response.status);

        if (response.status === 200) {
            const data = await response.json();
            console.log('Received data:', data);
            displayResults(data.documents);
            displayContent(data.response);

            // Show content and results sections
            document.getElementById('content-section').style.display = 'block';
            document.getElementById('results-section').style.display = 'block';
        } else {
            console.error('Error fetching data:', response.status);
            const errorText = await response.text();
            console.error('Error details:', errorText);
            Swal.fire('Error fetching data. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire('An error occurred. Please try again.');
    } finally {
        // Hide loading spinner
        loadingSpinner.style.display = 'none';
    }
});

function download(url) {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = '';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

function displayResults(files) {
    if (!files) {
        Swal.fire('No information available regarding the query.');
        return;
    } else {
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';

        if (files && files.length === 0) {
            fileList.innerHTML = '<p>No results found.</p>';
        } else {
            files.forEach(file => {
                const card = document.createElement('div');
                card.className = 'card';

                const cardContent = document.createElement('div');
                cardContent.className = 'card-content';

                const title = document.createElement('h3');
                title.textContent = file.file_name;

                const downloadButton = document.createElement('a');
                downloadButton.href = '#';
                downloadButton.textContent = 'Download';
                downloadButton.className = 'btn';
                downloadButton.onclick = (e) => {
                    e.preventDefault();
                    download(file.file_download_url);
                };

                const description = document.createElement('p');
                description.textContent = file.summary;

                cardContent.appendChild(title);
                cardContent.appendChild(description);
                cardContent.appendChild(downloadButton);
                card.appendChild(cardContent);
                fileList.appendChild(card);
            });
        }
    }
}

function displayContent(content) {
    const contentElement = document.getElementById('content');
    contentElement.innerText = content || 'No content generated.';
}
