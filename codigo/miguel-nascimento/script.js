let map, directionsService, directionsRenderer;
let savedRoutes = JSON.parse(localStorage.getItem('savedRoutes')) || [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -19.9191, lng: -43.9386 },
        zoom: 13,
    });
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    loadSavedRoutes();
}

function calculateRoute() {
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;
    const mode = document.getElementById('mode').value;

    if (!start || !end) {
        alert('Por favor, insira os locais de partida e chegada.');
        return;
    }

    const request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode[mode],
    };

    directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
            displayRouteDetails(result, mode);
        } else {
            alert('Falha ao calcular a rota: ' + status);
        }
    });
}

function displayRouteDetails(result, mode) {
    const detailsDiv = document.getElementById('details');
    detailsDiv.innerHTML = '';

    if (mode === 'TRANSIT') {
        const legs = result.routes[0].legs;
        legs.forEach((leg) => {
            leg.steps.forEach((step) => {
                if (step.transit) {
                    detailsDiv.innerHTML += `<p>Ônibus: ${step.transit.line.short_name} - ${step.transit.line.name}</p>`;
                }
            });
        });
    } else {
        detailsDiv.innerHTML = '<p>Rota calculada com sucesso. Confira o mapa acima.</p>';
    }
}

function saveRoute() {
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;
    const mode = document.getElementById('mode').value;

    if (!start || !end) {
        alert('Por favor, insira os locais de partida e chegada antes de salvar.');
        return;
    }

    const route = { start, end, mode };
    savedRoutes.push(route);
    localStorage.setItem('savedRoutes', JSON.stringify(savedRoutes));
    loadSavedRoutes();
    alert('Rota salva com sucesso!');
}

function loadSavedRoutes() {
    const select = document.getElementById('savedRoutes');
    select.innerHTML = '<option value="">Selecione uma rota</option>';
    savedRoutes.forEach((route, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${route.start} -> ${route.end}`;
        select.appendChild(option);
    });
}

function useSavedRoute() {
    const select = document.getElementById('savedRoutes');
    const index = select.value;

    if (index === '') return;

    const route = savedRoutes[index];
    document.getElementById('start').value = route.start;
    document.getElementById('end').value = route.end;
    document.getElementById('mode').value = route.mode;

    calculateRoute();
}

function editRoute() {
    const select = document.getElementById('savedRoutes');
    const index = select.value;

    if (index === '') {
        alert('Por favor, selecione uma rota para editar.');
        return;
    }

    const route = savedRoutes[index];
    route.start = prompt('Edite o local de partida:', route.start) || route.start;
    route.end = prompt('Edite o local de chegada:', route.end) || route.end;
    route.mode = prompt('Edite o modo de transporte (DRIVING, TRANSIT, WALKING, BICYCLING):', route.mode) || route.mode;

    savedRoutes[index] = route;
    localStorage.setItem('savedRoutes', JSON.stringify(savedRoutes));
    loadSavedRoutes();
    alert('Rota editada com sucesso!');
}

function deleteRoute() {
    const select = document.getElementById('savedRoutes');
    const index = select.value;

    if (index === '') {
        alert('Por favor, selecione uma rota para excluir.');
        return;
    }

    savedRoutes.splice(index, 1);
    localStorage.setItem('savedRoutes', JSON.stringify(savedRoutes));
    loadSavedRoutes();
    alert('Rota excluída com sucesso!');
}

// Inicializa o mapa ao carregar a página
window.onload = initMap;
