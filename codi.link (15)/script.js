document.addEventListener('DOMContentLoaded', function() {
    
    const API_KEY = 'vk-GKafmwoo2XV4k03DFfQlRpWdD2z9S3hV0F03RQ9lBRgD2Fj';
    const API_URL = 'https://api.vyro.ai/v2/image/generations';
    const imageResultElement = document.getElementById('imageResult');
    const imageContainer = document.getElementById('imageContainer');
    const imageLayer = document.querySelector('.image-container__layer');

    // Función para pantalla completa
    function botonFullScreen() {
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const imageResult = document.getElementById('imageResult');
        
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                const imageUrl = imageResult.src;
                window.open(imageUrl, '_blank');
            });
        }
    }

    // Función para generar imagen
    function generateImage() {
        const promptValue = document.getElementById('prompt').value.trim();
        const styleValue = document.getElementById('dropdowmStyle').value;
        const ratioValue = document.getElementById('dropdowmRatio').value;

        if(!promptValue) {
            alert('Please enter a Prompt');
            return;
        }

        if(!styleValue || styleValue === '' || styleValue === 'none') {
            alert('Please select a style');
            return;
        }

        setLoadingState(true);

        const requestBody = {
            prompt: promptValue,
            style: styleValue
        };
        
        if (ratioValue && ratioValue !== '' && ratioValue !== 'none') {
            requestBody.aspect_ratio = ratioValue;
        }
        
        const requestOptions = {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody),
            redirect: 'follow'
        };

        console.log('Enviando request con:', {
            prompt: promptValue,
            style: styleValue,
            aspect_ratio: ratioValue
        });

        fetch(API_URL, requestOptions)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        console.error('Error response:', text);
                        throw new Error(`HTTP error! status: ${response.status}`);
                    });
                }
                return response.blob();
            })
            .then(blob => {
                const imageUrl = URL.createObjectURL(blob);
                imageResultElement.src = imageUrl;
                setLoadingState(false);
            })
            .catch(error => {
                console.error('Error completo:', error);
                alert('There was an error generating the image. Please check the console for details.');
                setLoadingState(false);
            });
    }

    // Función para estado de carga
    function setLoadingState(isLoading) {
        const loadingContainer = document.querySelector('.image-container__loading-container');

        if (!imageResultElement) return;

        if (isLoading) {
            imageResultElement.style.opacity = '0';
            setTimeout(() => {
                imageResultElement.style.display = 'none';
                imageContainer.classList.add('loading');
                if (imageLayer) imageLayer.classList.add('loading');
                if (loadingContainer) {
                    loadingContainer.style.display = 'flex';
                    setTimeout(() => {
                        loadingContainer.style.opacity = '1';
                    }, 10);
                }
            }, 200);
        } else {
            if (loadingContainer) {
                loadingContainer.style.opacity = '0';
            }
            
            setTimeout(() => {
                if (loadingContainer) loadingContainer.style.display = 'none';
                imageContainer.classList.remove('loading');
                if (imageLayer) imageLayer.classList.remove('loading');
                imageResultElement.style.display = 'block';
                setTimeout(() => {
                    imageResultElement.style.opacity = '1';
                }, 10);
            }, 300);
        }
    }

    // Conectar el botón de generar con la función
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateImage);
    }

    // Inicializar botón fullscreen
    botonFullScreen();

    // Hacer generateImage global si lo necesitas llamar desde HTML onclick
    window.generateImage = generateImage;
});