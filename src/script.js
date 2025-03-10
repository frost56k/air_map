// Функция для ленивой загрузки изображений
function lazyLoadImages() {
    const images = document.querySelectorAll('.place-image[data-src]');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.onerror = () => img.style.display = 'none';
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '0px 0px 200px 0px',
        threshold: 0.1
    });
    console.log(`Found ${images.length} images to lazy load`);
    images.forEach(img => observer.observe(img));
}

// Функция для открытия модального окна с изображением
// Функция для открытия модального окна с изображением
function openModal(imageSrc) {
    const modal = document.getElementById('image-modal');
    modal.style.display = 'block';
    modalImage.src = imageSrc;

    // Закрытие модального окна при нажатии на ESC
    document.addEventListener('keydown', handleEscapeKey);

    // Закрытие модального окна при клике вне изображения
    modal.addEventListener('click', handleOutsideClick);
}

// Функция для закрытия модального окна
function closeModal() {
    const modal = document.getElementById('image-modal');
    modal.style.display = 'none';

    // Очищаем обработчики событий
    document.removeEventListener('keydown', handleEscapeKey);
    modal.removeEventListener('click', handleOutsideClick);

    // Сбрасываем состояние лупы
    magnifier.style.display = 'none';
    magnifierActive = false;
}

// Отдельные обработчики событий
function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
}

function handleOutsideClick(e) {
    const modal = document.getElementById('image-modal');
    if (e.target === modal) {
        closeModal();
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    // Добавляем обработчики для кнопок "Открыть фото"
    document.querySelectorAll('.place-image').forEach(img => {
        img.addEventListener('click', () => {
            openModal(img.dataset.src || img.src);
        });
    });

    // Добавляем обработчики для кнопок внутри popup
    document.querySelectorAll('.popup-image-button').forEach(button => {
        button.addEventListener('click', () => {
            const imgSrc = button.closest('.popup-image-container').querySelector('img').src;
            openModal(imgSrc);
        });
    });
});

// Функция для закрытия модального окна
function closeModal() {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    modal.style.display = 'none';
    scale = 1;
    currentX = 0;
    currentY = 0;
}

// Функция для управления мобильным меню и кнопкой "О сайте"
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menubtn');
    const sidebar = document.getElementById('sidebar');
    const closeMenu = document.getElementById('close-menu');
    const aboutBtn = document.getElementById('about-btn');
    const buttonContainer = document.querySelector('.button-container'); // Находим button-container

    if (!mobileMenuBtn) {
        console.error('Element #mobile-menubtn not found');
        return;
    }
    if (!sidebar) {
        console.error('Element #sidebar not found');
        return;
    }
    if (!closeMenu) {
        console.error('Element #close-menu not found');
        return;
    }
    if (!aboutBtn) {
        console.error('Element #about-btn not found');
        return;
    }
    if (!buttonContainer) {
        console.error('Element .button-container not found');
        return;
    }

    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.add('open'); // Заменяем 'active' на 'open'
        mobileMenuBtn.style.display = 'none';
        buttonContainer.style.display = 'none'; // Скрываем кнопки при открытии sidebar
    });

    closeMenu.addEventListener('click', () => {
        sidebar.classList.remove('open'); // Заменяем 'active' на 'open'
        mobileMenuBtn.style.display = 'block';
        buttonContainer.style.display = 'flex'; // Показываем кнопки при закрытии sidebar
    });

    aboutBtn.addEventListener('click', () => {
        if (window.innerWidth <= 768 && sidebar.classList.contains('open')) { // Заменяем 'active' на 'open'
            sidebar.classList.remove('open'); // Заменяем 'active' на 'open'
            mobileMenuBtn.style.display = 'block';
            buttonContainer.style.display = 'flex'; // Показываем кнопки при закрытии через about-btn
        }
    });

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 &&
            !sidebar.contains(e.target) &&
            e.target !== mobileMenuBtn &&
            e.target !== aboutBtn) {
            sidebar.classList.remove('open'); // Заменяем 'active' на 'open'
            mobileMenuBtn.style.display = 'block';
            buttonContainer.style.display = 'flex'; // Показываем кнопки при клике вне sidebar
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('open'); // Заменяем 'active' на 'open'
            mobileMenuBtn.style.display = 'none';
            buttonContainer.style.display = 'flex'; // Показываем кнопки на десктопе
        } else {
            if (!sidebar.classList.contains('open')) { // Заменяем 'active' на 'open'
                sidebar.style.display = 'block';
                buttonContainer.style.display = 'flex'; // Показываем кнопки, если sidebar закрыт
            }
            mobileMenuBtn.style.display = 'block';
        }
        setTimeout(() => window.map.invalidateSize(), 300);
    });

    // Инициализация при загрузке
    if (window.innerWidth > 768) {
        sidebar.classList.remove('open'); // Заменяем 'active' на 'open'
        mobileMenuBtn.style.display = 'none';
        buttonContainer.style.display = 'flex'; // Показываем кнопки на десктопе
    } else {
        sidebar.style.display = 'block';
        mobileMenuBtn.style.display = 'block';
        buttonContainer.style.display = 'flex'; // Показываем кнопки, если sidebar закрыт
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const modalImage = document.getElementById('modal-image');
    let scale = 2;
    let minScale = 1;
    let maxScale = window.innerWidth <= 768 ? 14 : 10;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;
    let startX, startY;

    // Функция для управления зумом через колесо прокрутки
    modalImage.addEventListener('wheel', (event) => {
        event.preventDefault();
        let delta = event.deltaY > 0 ? -0.1 : 0.1;
        let newScale = Math.min(maxScale, Math.max(minScale, scale + delta));

        if (newScale !== scale) {
            scale = newScale;
            updateTransform();
        }
    });

    // Функция для начала перетаскивания (мышь)
    modalImage.addEventListener('mousedown', (event) => {
        if (scale > 1) {
            isDragging = true;
            startX = event.clientX - currentX;
            startY = event.clientY - currentY;
            modalImage.style.cursor = 'grabbing';
        }
    });

    // Функция для перемещения (мышь)
    document.addEventListener('mousemove', (event) => {
        if (!isDragging) return;
        currentX = event.clientX - startX;
        currentY = event.clientY - startY;
        updateTransform();
    });

    // Функция для завершения перетаскивания (мышь)
    document.addEventListener('mouseup', () => {
        isDragging = false;
        modalImage.style.cursor = scale > 1 ? 'grab' : 'default';
    });

    // Функции для мобильных устройств (перетаскивание)
    let touchStartX = 0, touchStartY = 0;
    modalImage.addEventListener('touchstart', (event) => {
        if (scale > 1) {
            isDragging = true;
            const touch = event.touches[0];
            touchStartX = touch.clientX - currentX;
            touchStartY = touch.clientY - currentY;
        }
    });

    modalImage.addEventListener('touchmove', (event) => {
        if (!isDragging || event.touches.length !== 1) return;
        event.preventDefault();
        const touch = event.touches[0];
        currentX = touch.clientX - touchStartX;
        currentY = touch.clientY - touchStartY;
        updateTransform();
    });

    modalImage.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Ограничение перемещения изображения
    function updateTransform() {
        const maxX = (scale - 1) * modalImage.clientWidth / 2;
        const maxY = (scale - 1) * modalImage.clientHeight / 2;
        currentX = Math.min(maxX, Math.max(-maxX, currentX));
        currentY = Math.min(maxY, Math.max(-maxY, currentY));
        modalImage.style.transform = `scale(${scale}) translate(${currentX}px, ${currentY}px)`;
    }

    // Сброс зума и позиции при закрытии модального окна
    function closeModal() {
        const modal = document.getElementById('image-modal');
        modal.style.display = 'none';
        scale = window.innerWidth <= 768 ? 2 : 1;
        currentX = 0;
        currentY = 0;
        updateTransform();
    }

    document.getElementById('close-modal').addEventListener('click', closeModal);
});

// Основная функция для загрузки данных и инициализации карты
function initMapAndData() {
    fetch('place_database.json')
        .then(response => {
            if (!response.ok) throw new Error('Не удалось загрузить данные');
            return response.json();
        })
        .then(data => {
            const placesData = data;
            const placeList = document.getElementById('place-list');
            const sidebar = document.getElementById('sidebar');
            const loading = document.getElementById('loading');
            const searchInput = document.getElementById('search');
            const itemsPerPage = 10;
            let currentPage = 0;
            let filteredData = placesData;
            let lastBounds = null;

            console.log(`Total places: ${placesData.length}`);

            const map = L.map('map').setView([54.87, 27.5], 8);

            // Слой OpenStreetMap
            const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            });

            // Слой Google Maps (спутник)
            const googleLayer = L.tileLayer('https://www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}', {
                attribution: '© Google Maps'
            });

            // Устанавливаем OSM как начальный слой
            osmLayer.addTo(map);

            map.setMaxBounds([
                [50.6968, 22.0471],
                [56.8042, 34.9464]
            ]);

            const markersCluster = L.markerClusterGroup({
                spiderfyOnMaxZoom: true,
                showCoverageOnHover: false,
                zoomToBoundsOnClick: true,
                animate: true,
                maxClusterRadius: 20
            });

            const maxClusters = 300;
            let allMarkers = [];

            // Переключение слоев с иконками
            const layerToggleBtn = document.getElementById('layer-toggle-btn');
            const layerIcon = layerToggleBtn.querySelector('i');
            let currentLayer = 'osm';

            // Устанавливаем начальную иконку для OSM
            layerIcon.classList.add('fa-map');

            layerToggleBtn.addEventListener('click', () => {
                if (currentLayer === 'osm') {
                    map.removeLayer(osmLayer);
                    googleLayer.addTo(map);
                    currentLayer = 'google';
                    layerIcon.classList.remove('fa-map');
                    layerIcon.classList.add('fa-satellite');
                } else {
                    map.removeLayer(googleLayer);
                    osmLayer.addTo(map);
                    currentLayer = 'osm';
                    layerIcon.classList.remove('fa-satellite');
                    layerIcon.classList.add('fa-map');
                }
            });

            // Функция дебаунсинга
            function debounce(func, wait) {
                let timeout;
                return function (...args) {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func.apply(this, args), wait);
                };
            }

            // Парсинг координат
            function parseCoordinates(place) {
                let lat, lon, coordString;
                if (Array.isArray(place.coordinates)) {
                    [lat, lon] = place.coordinates;
                    coordString = place.coordinates.join(', ');
                } else if (typeof place.coordinates === 'string') {
                    [lat, lon] = place.coordinates.split(',').map(coord => parseFloat(coord.trim()));
                    coordString = place.coordinates;
                } else {
                    console.error(`Invalid Coordinates format for ${place.title}:`, place.coordinates);
                    return null;
                }
                return { lat, lon, coordString };
            }

            // Создание маркеров
            function createMarkers(data) {
                allMarkers = [];
                data.forEach(place => {
                    const coords = parseCoordinates(place);
                    if (!coords) {
                        console.error(`Invalid coordinates for place: ${place.title}`);
                        return; // Пропускаем место с некорректными координатами
                    }
                    const marker = L.marker([coords.lat, coords.lon])
                        .bindPopup(`
                            <div class="popup-container">
                                <div class="popup-header">
                                    <b>${place.title}</b>
                                </div>
                                <div class="popup-content">
                                    <div class="popup-info">
                                        <div class="popup-location">
                                            <span>${place.location}</span>
                                            <span>${place.locationBY}</span>
                                        </div>
                                        <div class="date-info">
                                        <span>${place.produced_date}</span>
                                        </div>
                                        <div class="popup-coordinates">
                                            <span>${coords.coordString}</span>
                                        </div>
                                    </div>
                                    <div class="popup-image-container">
                                        <img src="${place['thumbnail']}" 
                                             class="popup-image" 
                                             onerror="this.style.display='none'" 
                                             onclick="openModal('${place['photo_url']}')">
                                        <button class="popup-image-button" onclick="openModal('${place['photo_url']}')">
                                            <i class="fas fa-expand"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `, {
                            autoPan: false,
                            className: 'custom-popup'
                        });
                    allMarkers.push(marker);
                });
            }

            // Обновление маркеров
            function updateMarkers(data) {
                const currentBounds = map.getBounds().pad(0.1);
                if (lastBounds && currentBounds.equals(lastBounds)) {
                    console.log('Bounds unchanged, skipping marker update');
                    return;
                }
                markersCluster.clearLayers();
                createMarkers(data);
                const zoomLevel = map.getZoom();
                const bounds = map.getBounds().pad(0.1);
                const dynamicMaxClusters = Math.min(maxClusters + (zoomLevel * 5), allMarkers.length);
                const visibleMarkers = allMarkers.filter(marker => bounds.contains(marker.getLatLng()));
                const limitedMarkers = visibleMarkers.slice(0, dynamicMaxClusters);
                markersCluster.addLayers(limitedMarkers);
                map.addLayer(markersCluster);
                lastBounds = currentBounds; // Обновляем lastBounds
            }

            map.on('moveend zoomend', debounce(() => {
                if (!map._popup || !map._popup.isOpen()) {
                    updateMarkers(filteredData);
                }
            }, 200));

            function loadPage(page, data) {
                const start = page * itemsPerPage;
                const end = Math.min(start + itemsPerPage, data.length);
                placeList.innerHTML = '';
                for (let i = start; i < end; i++) {
                    const place = data[i];
                    let lat, lon, coordString;
                    if (Array.isArray(place.coordinates)) {
                        [lat, lon] = place.coordinates;
                        coordString = place.coordinates.join(', ');
                    } else if (typeof place.coordinates === 'string') {
                        [lat, lon] = place.coordinates.split(',').map(coord => parseFloat(coord.trim()));
                        coordString = place.coordinates;
                    } else {
                        console.error(`Invalid Coordinates format for ${place.title}:`, place.coordinates);
                        continue;
                    }
                    const placeDiv = document.createElement('div');
                    placeDiv.className = 'place-item';
                    placeDiv.innerHTML = `
                        <div class="place-image-container">
                            <img class="place-image" 
                                 data-src="${place['thumbnail']}" 
                                 alt="${place.title}" 
                                 onclick="openModal('${place['photo_url']}')">
                            <button class="place-image-button" onclick="openModal('${place['photo_url']}')">
                                <i class="fas fa-expand"></i>
                            </button>
                        </div>
                        <div class="place-info">
                            <div class="place-title">${place.title}</div>
                            <div class="place-location">
                                <span>${place.locationBY}</span>
                                <span>${place.location}</span>
                            </div>
                            <div class="date-info">
                            <span>${place.produced_date}</span>
                            </div>
                            <div class="place-coordinates">
                                ${coordString}
                            </div>
                        </div>
                    `;
            
                    // Добавляем обработчик клика для карточки места
                    placeDiv.addEventListener('click', () => {
                        const coords = parseCoordinates(place); // Получаем координаты
                        if (!coords) {
                            console.error(`Failed to parse coordinates for place: ${place.title}`);
                            return; // Прекращаем выполнение, если координаты некорректны
                        }
                        const { lat, lon } = coords; // Деструктурируем объект
                        map.flyTo([lat, lon], 15); // Перемещаем карту к координатам с зумом 15
                    });
            
                    placeList.appendChild(placeDiv);
                }
                lazyLoadImages();
            }

            function updateSearchResults(searchText) {
                filteredData = placesData.filter(place => {
                    if (place.LocationBY) {
                        return place.LocationBY.toLowerCase().includes(searchText.toLowerCase());
                    }
                    return false;
                });
                updateMarkers(filteredData);
                currentPage = 0;
                loadPage(currentPage, filteredData);
            }

            searchInput.addEventListener('input', (e) => {
                updateSearchResults(e.target.value);
            });

            updateMarkers(filteredData);
            loadPage(currentPage, filteredData);
            loading.style.display = 'block';

            const paginationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if ((currentPage + 1) * itemsPerPage < filteredData.length) {
                            loading.style.display = 'block';
                            setTimeout(() => {
                                currentPage++;
                                loadPage(currentPage, filteredData);
                                loading.style.display = filteredData.length <= (currentPage + 1) * itemsPerPage ? 'none' : 'block';
                            }, 500);
                        } else {
                            loading.style.display = 'none';
                        }
                    }
                });
            }, {
                root: sidebar,
                rootMargin: '0px',
                threshold: 0.1
            });

            paginationObserver.observe(loading);

            window.map = map;
            window.markersCluster = markersCluster;
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
            document.getElementById('loading').textContent = 'Ошибка загрузки данных. Попробуйте позже.';
        });
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    modalImage = document.getElementById('modal-image');
    setupMobileMenu();
    initMapAndData();
});