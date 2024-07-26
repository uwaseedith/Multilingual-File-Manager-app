document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error('Error:', error));
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error('Error:', error));
});

document.getElementById('createFileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const filename = document.getElementById('filename').value;
    const content = document.getElementById('fileContent').value;

    fetch('/files', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename, content })
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error('Error:', error));
});

document.getElementById('readFileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const filename = document.getElementById('readFilename').value;

    fetch(`/files/${filename}`, {
        method: 'GET'
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error('Error:', error));
});

document.getElementById('updateFileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const filename = document.getElementById('updateFilename').value;
    const content = document.getElementById('updateContent').value;

    fetch('/files', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename, content })
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error('Error:', error));
});

document.getElementById('deleteFileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const filename = document.getElementById('deleteFilename').value;

    fetch(`/files/${filename}`, {
        method: 'DELETE'
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error('Error:', error));
});

document.getElementById('fetchFiles').addEventListener('click', function() {
    fetch('/list')
    .then(response => response.json())
    .then(files => {
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';
        files.forEach(file => {
            const div = document.createElement('div');
            div.textContent = `Filename: ${file.filename}, Path: ${file.path}`;
            fileList.appendChild(div);
        });
    })
    .catch(error => console.error('Error:', error));
});
