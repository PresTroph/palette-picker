import { v4 as uuidv4 } from 'uuid';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('palette-form');
    const palettesList = document.getElementById('palettes-list');

    // Function to set a value in local storage
    function setLocalStorageKey(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error setting local storage:', error);
        }
    }

    // Function to get a value from local storage
    function getLocalStorageKey(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Error getting local storage:', error);
            return null;
        }
    }

    // Function to get palettes from local storage
    function getPalettes() {
        return getLocalStorageKey('palettes') || [];
    }

    // Function to set palettes in local storage
    function setPalettes(newPalettes) {
        setLocalStorageKey('palettes', newPalettes);
    }

    // Function to initialize palettes if empty
    function initPalettesIfEmpty() {
        const palettes = getPalettes();

        if (palettes.length === 0) {
            setPalettes([
                {
                    "uuid": "5affd4e4-418d-4b62-beeb-1c0f7aaff753",
                    "title": "Marcy",
                    "colors": ["#c92929", "#2f5a8b", "#327a5f"],
                    "temperature": "neutral"
                },
                {
                    "uuid": "32521ef4-d64c-4906-b06d-f3d0d6b16e0f",
                    "title": "Sleek and Modern",
                    "colors": ["#3A5199", "#2F2E33", "#D5D6D2"],
                    "temperature": "cool"
                },
                {
                    "uuid": "8b144d62-faa7-4226-87e1-096d7c1bedc7",
                    "title": "Winter Reds",
                    "colors": ["#A10115", "#C0B2B5", "#600A0A"],
                    "temperature": "warm"
                }
            ]);
        }
    }

    // Function to add a palette
    function addPalette(newPalette) {
        const palettes = getPalettes();
        palettes.push(newPalette);
        setPalettes(palettes);
    }

    // Function to remove a palette
    function removePalette(paletteUuid) {
        const palettes = getPalettes().filter(palette => palette.uuid !== paletteUuid);
        setPalettes(palettes);
    }

    // Function to generate a palette card
    function createPaletteCard(palette) {
        const paletteCard = document.createElement('li');
        paletteCard.classList.add('palette-card');

        const colorsContainer = document.createElement('div');
        colorsContainer.classList.add('colors-container');

        palette.colors.forEach(color => {
            const colorBox = document.createElement('div');
            colorBox.classList.add('color-box');
            colorBox.style.backgroundColor = color;

            const hexCode = document.createElement('p');
            hexCode.classList.add('hex-code');
            hexCode.textContent = color;

            colorBox.appendChild(hexCode);
            colorsContainer.appendChild(colorBox);
        });

        const temperatureBanner = document.createElement('div');
        temperatureBanner.classList.add('temperature-banner');
        temperatureBanner.classList.add(`temperature-${palette.temperature}`);
        temperatureBanner.textContent = palette.temperature;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'Delete';

        paletteCard.appendChild(colorsContainer);
        paletteCard.appendChild(temperatureBanner);
        paletteCard.appendChild(deleteButton);

        palettesList.appendChild(paletteCard);

        // Event listener to handle delete button click
        deleteButton.addEventListener('click', () => {
            removePalette(palette.uuid);
            paletteCard.remove();
        });
    }

    // Event listener to handle form submission
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const paletteTitle = document.getElementById('palette-title').value;
        const color1 = document.getElementById('color1').value;
        const color2 = document.getElementById('color2').value;
        const color3 = document.getElementById('color3').value;
        const temperature = document.querySelector('input[name="temperature"]:checked').value;

        const newPalette = {
            uuid: uuidv4(),
            title: paletteTitle,
            colors: [color1, color2, color3],
            temperature: temperature
        };

        addPalette(newPalette);
        createPaletteCard(newPalette);

        form.reset();
    });

    // Event listener to handle copy button click
    palettesList.addEventListener('click', (event) => {
        if (event.target.classList.contains('color-box')) {
            const hexCode = event.target.querySelector('.hex-code').textContent;
            navigator.clipboard.writeText(hexCode);
            updateCopyButtonText(event.target);
        }
    });

    // Initialize palettes if empty
    initPalettesIfEmpty();

    // Load existing palettes from localStorage
