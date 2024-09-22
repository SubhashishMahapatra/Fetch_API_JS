let isEditMode = false;
let editPostId = null; // Track the post being edited

// To Fetch data
async function fetchPosts() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
       
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        const postsTable = document.getElementById('postsTable');
        postsTable.innerHTML = '';

        data.forEach((post) => {
            createPostRow(post.id, post.userId, post.title, post.body);
        });

        // Update the record count
        document.getElementById('recordCount').textContent = data.length;
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Function to create a post row in the table
function createPostRow(postId, userId, title, body) {
    const postsTable = document.getElementById('postsTable');
    const newRow = postsTable.insertRow();

    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);
    const cell5 = newRow.insertCell(4);
    const cell6 = newRow.insertCell(5);

    cell1.innerHTML = postId;
    cell2.innerHTML = userId;
    cell3.innerHTML = title;
    cell4.innerHTML = body;

    // Add Update Button
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.className = 'btn btn-warning btn-sm';
    updateButton.addEventListener('click', () => loadPostForEdit(postId, userId, title, body));
    cell5.appendChild(updateButton);

    // Add Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'btn btn-danger btn-sm';
    deleteButton.addEventListener('click', () => deletePost(newRow, postId));
    cell6.appendChild(deleteButton);
}

// Function to delete a post (locally for demo purposes)
function deletePost(row, postId) {
    const postsTable = document.getElementById('postsTable');
    postsTable.deleteRow(row.rowIndex - 1); // Remove the row from the table
    document.getElementById('recordCount').textContent = postsTable.rows.length; // Update record count
    alert('Post with ID ' + postId + ' has been deleted!');
}

// Function to load post data into form for editing
function loadPostForEdit(postId, userId, title, body) {
    document.getElementById('userId').value = userId;
    document.getElementById('title').value = title;
    document.getElementById('body').value = body;

    isEditMode = true;  // Indicate that we are in edit mode
    editPostId = postId;  // Store the ID of the post being edited

    // Change the button text to "Update Post"
    document.querySelector('button[type="submit"]').textContent = 'Update Post';
}

// Handle form submission (add or update)
document.getElementById('postForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const userId = document.getElementById('userId').value;
    const title = document.getElementById('title').value;
    const body = document.getElementById('body').value;

    if (isEditMode) {
        // Update existing post
        const rowToUpdate = [...document.getElementById('postsTable').rows].find(row => row.cells[0].innerHTML == editPostId);
        
        if (rowToUpdate) {
            rowToUpdate.cells[1].innerHTML = userId;
            rowToUpdate.cells[2].innerHTML = title;
            rowToUpdate.cells[3].innerHTML = body;
        }

        // Reset form back to normal "add new post" mode
        isEditMode = false;
        editPostId = null;
        document.querySelector('button[type="submit"]').textContent = 'Submit';  // Change the button text back
    } else {
        // Add new post
        const newId = document.getElementById('postsTable').rows.length + 1;
        createPostRow(newId, userId, title, body);
    }

    // Update record count
    document.getElementById('recordCount').textContent = document.getElementById('postsTable').rows.length;

    // Clear the form
    document.getElementById('postForm').reset();
});

// Call fetchPosts on page load to display all posts
window.onload = fetchPosts;
