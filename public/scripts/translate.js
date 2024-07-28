document.addEventListener("DOMContentLoaded", function () {
    const languageMap = {
        "en": "English",
        "fr": "French"
    };

    const defaultLanguage = "en";

    async function loadTranslations(language) {
        const mappedLanguage = languageMap[language] || defaultLanguage;
        console.log(`Loading translations for language: ${mappedLanguage}`);
        const response = await fetch(`/locales/${mappedLanguage}/translation.json`);
        if (response.ok) {
            return response.json();
        } else {
            console.error(`Failed to load translations for language: ${mappedLanguage}`);
            return {};
        }
    }

    function updateTranslations(translations) {
        console.log('Updating translations:', translations);

        const pageTitleElement = document.getElementById('title');
        if (pageTitleElement) {
            pageTitleElement.textContent = translations.file_manager?.title || 'File Manager';
        }

        const uploadTextElement = document.getElementById('upload_text');
        if (uploadTextElement) {
            uploadTextElement.textContent = translations.file_manager?.upload_text || 'Upload File';
        }

        const filesElement = document.getElementById('files');
        if (filesElement) {
            filesElement.textContent = translations.file_manager?.files || 'Files';
        }

        const navHomeElement = document.getElementById('nav-home');
        if (navHomeElement) {
            navHomeElement.textContent = translations.navbar?.home || 'Home';
        }

        const navFileListElement = document.getElementById('nav-file-list');
        if (navFileListElement) {
            navFileListElement.textContent = translations.navbar?.file_list || 'File List';
        }

        const navLogoutElement = document.getElementById('nav-logout');
        if (navLogoutElement) {
            navLogoutElement.textContent = translations.navbar?.logout || 'Logout';
        }

        const welcomeElement = document.getElementById('welcome');
        if (welcomeElement) {
            welcomeElement.textContent = translations.home_page?.welcome || 'Welcome!';
        }

        const messageElement = document.getElementById('message');
        if (messageElement) {
            messageElement.textContent = translations.home_page?.message || 'Welcome to you file manager app, an easy way to store and manage your files!';
        }

    }

    function changeLanguage(language) {
        loadTranslations(language).then(updateTranslations).catch(error => {
            console.error('Error updating translations:', error);
            changeLanguage(defaultLanguage); 
        });
    }

    const savedLanguage = localStorage.getItem('selectedLanguage') || (navigator.language || 'en').split('-')[0];
    changeLanguage(savedLanguage);

    const selectedLanguageFullName = languageMap[savedLanguage] || languageMap[defaultLanguage];
    document.getElementById('languageDropdown').textContent = selectedLanguageFullName;

    document.querySelectorAll('#language-dropdown .dropdown-item').forEach(item => {
        item.addEventListener('click', function (event) {
            const selectedLanguage = event.target.getAttribute('data-lang');
            console.log(`Selected language: ${selectedLanguage}`);
            localStorage.setItem('selectedLanguage', selectedLanguage);
            changeLanguage(selectedLanguage);
            document.getElementById('languageDropdown').textContent = languageMap[selectedLanguage] || languageMap[defaultLanguage];
        });
    });
});
