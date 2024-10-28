# OpenAI-JS
Here's a breakdown of each part of the JavaScript code for handling a search query and displaying results in a web application:

1. **Event Listener for Search Button**
   ```javascript
   document.getElementById('search-button').addEventListener('click', async () => {
   ```
   - Adds an event listener to the `search-button` element. When clicked, it triggers an asynchronous function to handle the search process.

2. **Retrieving Input Values**
   ```javascript
   const query = document.getElementById('query').value;
   const department = document.getElementById('department').value;
   ```
   - Grabs the values of `query` and `department` from the input fields on the page.

3. **Input Validation**
   ```javascript
   if (query.trim() === '') {
       Swal.fire('Please enter a search query.');
       return;
   }
   ```
   - If `query` is empty, shows an alert using `Swal.fire` from SweetAlert and stops further execution.

4. **Show Loading Spinner**
   ```javascript
   const loadingSpinner = document.getElementById('loading-spinner');
   loadingSpinner.style.display = 'block';
   ```
   - Displays a loading spinner by setting its CSS `display` property to `block` to indicate that a request is in progress.

5. **Sending POST Request to API**
   ```javascript
   const response = await fetch("http://localhost:7071/api/http_trigger", {
       method: "POST",
       headers: {
           "Content-Type": "application/json"
       },
       body: JSON.stringify({ query: query, department: department })
   });
   ```
   - Sends an asynchronous POST request to the API endpoint `http://localhost:7071/api/http_trigger` with `query` and `department` as JSON in the request body.

6. **Handling Response Status**
   ```javascript
   console.log('Response status:', response.status);
   ```
   - Logs the HTTP response status for debugging purposes.

7. **Processing Successful Response**
   ```javascript
   if (response.status === 200) {
       const data = await response.json();
       console.log('Received data:', data);
       displayResults(data.documents);
       displayContent(data.response);

       // Show content and results sections
       document.getElementById('content-section').style.display = 'block';
       document.getElementById('results-section').style.display = 'block';
   }
   ```
   - If the response status is 200, parses the JSON response and logs the received data. Calls `displayResults` and `displayContent` to display the search results and generated content, and makes the content and results sections visible.

8. **Handling Errors**
   ```javascript
   else {
       console.error('Error fetching data:', response.status);
       const errorText = await response.text();
       console.error('Error details:', errorText);
       Swal.fire('Error fetching data. Please try again.');
   }
   ```
   - If the status code isn’t 200, logs the error status and details, and displays an error message.

9. **Catching Request Errors**
   ```javascript
   } catch (error) {
       console.error('Error:', error);
       Swal.fire('An error occurred. Please try again.');
   }
   ```
   - If an error occurs during the fetch, logs it and shows an error message using SweetAlert.

10. **Hide Loading Spinner**
    ```javascript
    } finally {
        loadingSpinner.style.display = 'none';
    }
    ```
    - Once the request completes, whether successful or not, hides the loading spinner.

11. **Download Function**
    ```javascript
    function download(url) {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = '';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }
    ```
    - Creates an anchor (`<a>`) element with `href` set to the URL, simulating a click on it to trigger the download, and then removes the anchor from the DOM.

12. **Display Results Function**
    ```javascript
    function displayResults(files) {
        if (!files) {
            Swal.fire('No information available regarding the query.');
            return;
        } else {
            const fileList = document.getElementById('fileList');
            fileList.innerHTML = '';
    ```
    - Defines `displayResults` to show each file’s details. If `files` is null, displays a SweetAlert message. Otherwise, clears any previous content in `fileList`.

13. **Handling No Results**
    ```javascript
    if (files && files.length === 0) {
        fileList.innerHTML = '<p>No results found.</p>';
    }
    ```
    - If `files` is an empty array, displays "No results found" within `fileList`.

14. **Rendering Each File as a Card**
    ```javascript
    files.forEach(file => {
        const card = document.createElement('div');
        card.className = 'card';
    ```
    - Iterates through `files` to create and style each result as a `card`.

15. **Creating and Populating Card Content**
    ```javascript
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
    ```
    - Adds a title (`<h3>`), a download button, and a description paragraph to `cardContent`. The download button calls the `download` function when clicked.

16. **Appending Card to File List**
    ```javascript
    cardContent.appendChild(title);
    cardContent.appendChild(description);
    cardContent.appendChild(downloadButton);
    card.appendChild(cardContent);
    fileList.appendChild(card);
    ```
    - Appends the `title`, `description`, and `downloadButton` to `cardContent`, then `cardContent` to `card`, and finally `card` to `fileList`.

17. **Display Generated Content Function**
    ```javascript
    function displayContent(content) {
        const contentElement = document.getElementById('content');
        contentElement.innerText = content || 'No content generated.';
    }
    ```
    - Sets the text of the `content` element to the generated content, or a default message if no content is available.
