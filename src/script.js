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
function openModal(imageSrc) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    modal.style.display = 'block';
    modalImg.src = imageSrc;

    let isDragging = false;
    let startX, startY, currentX = 0, currentY = 0;
    let scale = 1;
    let initialDistance = null;

    modalImg.onload = () => updateTransform();

    // Управление transition и курсором
    function startDragging() {
        modalImg.style.transition = 'none';
        modalImg.style.cursor = 'grabbing';
    }

    function stopDragging() {
        modalImg.style.transition = 'transform 0.25s ease'; // Включаем обратно для масштабирования
        modalImg.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
    }

    modalImg.addEventListener('click', (e) => {
        scale = scale === 1 ? 2 : 1;
        currentX = currentY = 0; // Сбрасываем позицию при клике
        updateTransform();
    });

    modalImg.addEventListener('wheel', (e) => {
        e.preventDefault();
        scale += e.deltaY < 0 ? 0.1 : -0.1;
        scale = Math.max(0.5, Math.min(scale, 3));
        updateTransform();
    });

    modalImg.addEventListener('mousedown', (e) => {
        if (scale > 1) {
            isDragging = true;
            startX = e.pageX - currentX;
            startY = e.pageY - currentY;
            startDragging();
            e.preventDefault();
        }
    });

    modalImg.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        currentX = e.pageX - startX;
        currentY = e.pageY - startY;
        updateTransform();
    });

    modalImg.addEventListener('mouseup', () => {
        isDragging = false;
        stopDragging();
    });

    modalImg.addEventListener('mouseleave', () => {
        isDragging = false;
        stopDragging();
    });

    modalImg.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            startX = e.touches[0].pageX - currentX;
            startY = e.touches[0].pageY - currentY;
            startDragging();
        } else if (e.touches.length === 2) {
            initialDistance = getDistance(e.touches[0], e.touches[1]);
        }
    });

    modalImg.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && isDragging) {
            e.preventDefault();
            currentX = e.touches[0].pageX - startX;
            currentY = e.touches[0].pageY - startY;
            updateTransform();
        } else if (e.touches.length === 2) {
            e.preventDefault();
            const newDistance = getDistance(e.touches[0], e.touches[1]);
            if (initialDistance !== null) {
                scale *= newDistance / initialDistance;
                scale = Math.max(0.5, Math.min(scale, 3));
                initialDistance = newDistance;
                updateTransform();
            }
        }
    });

    modalImg.addEventListener('touchend', () => {
        isDragging = false;
        initialDistance = null;
        stopDragging();
    });

    function updateTransform() {
        modalImg.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
        // Курсор обновляется только при остановке перетаскивания через stopDragging
    }

    function getDistance(touch1, touch2) {
        return Math.hypot(touch2.pageX - touch1.pageX, touch2.pageY - touch1.pageY);
    }

    document.getElementById('close-modal').addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });
}

// Функция для закрытия модального окна
function closeModal() {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    modal.style.display = 'none';
    modalImg.style.transform = 'translate(0px, 0px) scale(1)'; // Сбрасываем трансформацию
    // Удаляем масштаб и координаты из глобальной области (если они были объявлены глобально)
    if (typeof scale !== 'undefined') scale = 1;
    if (typeof currentX !== 'undefined') currentX = 0;
    if (typeof currentY !== 'undefined') currentY = 0;
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
                if (Array.isArray(place.Coordinates)) {
                    [lat, lon] = place.Coordinates;
                    coordString = place.Coordinates.join(', ');
                } else if (typeof place.Coordinates === 'string') {
                    [lat, lon] = place.Coordinates.split(',').map(coord => parseFloat(coord.trim()));
                    coordString = place.Coordinates;
                } else {
                    console.error(`Invalid Coordinates format for ${place.Title}:`, place.Coordinates);
                    return null;
                }
                return { lat, lon, coordString };
            }

            // Создание маркеров
            function createMarkers(data) {
                allMarkers = [];
                data.forEach(place => {
                    const coords = parseCoordinates(place); // Получаем координаты
                    if (!coords) {
                        console.error(`Invalid coordinates for place: ${place.Title}`);
                        return; // Пропускаем это место, если координаты некорректны
                    }

                    const marker = L.marker([coords.lat, coords.lon])
                        .bindPopup(`
                            <div class="popup-container">
                                <div class="popup-header">
                                    <b>${place.Title}</b>
                                </div>
                                <div class="popup-content">
                                    <div class="popup-info">
                                        <div class="popup-location">
                                            <span>${place.Location}</span>
                                            <span>${place.LocationBY}</span>
                                        </div>
                                        <div class="popup-coordinates">
                                            <span>${coords.coordString}</span>
                                        </div>
                                    </div>
                                    <div class="popup-image-container">
                                        <img src="${place['Photo Path']}" 
                                             class="popup-image" 
                                             onerror="this.style.display='none'" 
                                             onclick="openModal('${place['Photo Path']}')">
                                        <button class="popup-image-button" onclick="openModal('${place['Photo Path']}')">
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
                if (lastBounds && currentBounds.contains(lastBounds) && lastBounds.contains(currentBounds)) {
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

                lastBounds = currentBounds;
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
                    if (Array.isArray(place.Coordinates)) {
                        [lat, lon] = place.Coordinates;
                        coordString = place.Coordinates.join(', ');
                    } else if (typeof place.Coordinates === 'string') {
                        [lat, lon] = place.Coordinates.split(',').map(coord => parseFloat(coord.trim()));
                        coordString = place.Coordinates;
                    } else {
                        console.error(`Invalid Coordinates format for ${place.Title}:`, place.Coordinates);
                        continue;
                    }

                    const placeDiv = document.createElement('div');
                    placeDiv.className = 'place-item';
                    placeDiv.innerHTML = `
                        <div class="place-image-container">
                            <img class="place-image" 
                                 data-src="${place['Photo Path']}" 
                                 alt="${place.Title}" 
                                 onclick="openModal('${place['Photo Path']}')">
                            <button class="place-image-button" onclick="openModal('${place['Photo Path']}')">
                                <i class="fas fa-expand"></i>
                            </button>
                        </div>
                        <div class="place-info">
                            <div class="place-title">${place.Title}</div>
                            <div class="place-location">
                                <span>${place.LocationBY}</span>
                                <span>${place.Location}</span>
                            </div>
                            <div class="place-coordinates">
                                ${coordString}
                            </div>
                        </div>
                    `;

                    const placeInfo = placeDiv.querySelector('.place-info');
                    placeInfo.addEventListener('click', () => {
                        if (window.innerWidth <= 768) {
                            sidebar.classList.remove('open'); // Заменяем 'active' на 'open'
                            document.getElementById('mobile-menubtn').style.display = 'block';
                        }

                        const targetMarker = allMarkers.find(marker => {
                            const popupContent = marker.getPopup().getContent();
                            return popupContent.includes(place.Title);
                        });

                        if (targetMarker) {
                            map.setView(targetMarker.getLatLng(), 13);
                            targetMarker.openPopup();
                        }
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
    setupMobileMenu();
    initMapAndData();
});