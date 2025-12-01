const athletesData = [
    {
        name: "Lionel Messi",
        country: "Argentina",
        position: "Forward",
        number: 10,
        goals: 108,
        apps: 180,
        countryCode: "argentina"
    },
    {
        name: "Kylian Mbappé",
        country: "France",
        position: "Forward",
        number: 7,
        goals: 48,
        apps: 75,
        countryCode: "france"
    },
    {
        name: "Neymar Jr",
        country: "Brazil",
        position: "Forward",
        number: 10,
        goals: 79,
        apps: 128,
        countryCode: "brazil"
    },
    {
        name: "Cristiano Ronaldo",
        country: "Portugal",
        position: "Forward",
        number: 7,
        goals: 128,
        apps: 206,
        countryCode: "portugal"
    },
    {
        name: "Kevin De Bruyne",
        country: "Belgium",
        position: "Midfielder",
        number: 7,
        goals: 26,
        apps: 98,
        countryCode: "belgium"
    },
    {
        name: "Manuel Neuer",
        country: "Germany",
        position: "Goalkeeper",
        number: 1,
        goals: 0,
        apps: 119,
        countryCode: "germany"
    },
    {
        name: "Vinícius Júnior",
        country: "Brazil",
        position: "Forward",
        number: 20,
        goals: 5,
        apps: 24,
        countryCode: "brazil"
    },
    {
        name: "Christian Pulisic",
        country: "USA",
        position: "Midfielder",
        number: 10,
        goals: 28,
        apps: 67,
        countryCode: "usa"
    },
    {
        name: "Luka Modrić",
        country: "Croatia",
        position: "Midfielder",
        number: 10,
        goals: 23,
        apps: 172,
        countryCode: "croatia"
    },
    {
        name: "Antoine Griezmann",
        country: "France",
        position: "Forward",
        number: 7,
        goals: 44,
        apps: 127,
        countryCode: "france"
    },
    {
        name: "Toni Kroos",
        country: "Germany",
        position: "Midfielder",
        number: 8,
        goals: 17,
        apps: 114,
        countryCode: "germany"
    },
    {
        name: "Ángel Di María",
        country: "Argentina",
        position: "Midfielder",
        number: 11,
        goals: 31,
        apps: 133,
        countryCode: "argentina"
    }
];

const stadiumData = {
    metlife: {
        name: "MetLife Stadium, New York",
        capacity: 82500,
        location: "East Rutherford, New Jersey, USA"
    },
    azteca: {
        name: "Estadio Azteca, Mexico City",
        capacity: 87523,
        location: "Mexico City, Mexico"
    },
    "rose-bowl": {
        name: "Rose Bowl, Los Angeles",
        capacity: 88565,
        location: "Pasadena, California, USA"
    },
    att: {
        name: "AT&T Stadium, Dallas",
        capacity: 80000,
        location: "Arlington, Texas, USA"
    }
};

function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.dataset.section;

            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });
        });
    });
}

function initStadiumSeating() {
    const seatSections = document.querySelectorAll('.seat-section');
    const sectionDetails = document.getElementById('section-details');
    const stadiumSelect = document.getElementById('stadium-select');

    seatSections.forEach(section => {
        section.addEventListener('click', () => {
            const sectionName = section.dataset.section;
            const capacity = section.dataset.capacity;
            const price = section.dataset.price;
            const stadium = stadiumSelect.value;
            const stadiumInfo = stadiumData[stadium];

            sectionDetails.innerHTML = `
                <strong>${sectionName}</strong><br>
                Stadium: ${stadiumInfo.name}<br>
                Capacity: ${parseInt(capacity).toLocaleString()} seats<br>
                Price: $${price} USD<br>
                Location: ${stadiumInfo.location}<br>
                <small>Total Stadium Capacity: ${stadiumInfo.capacity.toLocaleString()}</small>
            `;
        });
    });

    stadiumSelect.addEventListener('change', () => {
        sectionDetails.textContent = 'Click on a seating section to view details';
    });
}

function renderAthletes(filter = 'all') {
    const athletesGrid = document.getElementById('athletes-grid');
    athletesGrid.innerHTML = '';

    const filteredAthletes = filter === 'all' 
        ? athletesData 
        : athletesData.filter(athlete => athlete.countryCode === filter);

    filteredAthletes.forEach(athlete => {
        const card = document.createElement('div');
        card.className = 'athlete-card';
        card.innerHTML = `
            <div class="athlete-image">⚽</div>
            <div class="athlete-info">
                <h3>${athlete.name}</h3>
                <div class="country">🏴 ${athlete.country}</div>
                <div class="position">${athlete.position} #${athlete.number}</div>
                <div class="stats">
                    <div>⚽ Goals: ${athlete.goals}</div>
                    <div>🎽 Appearances: ${athlete.apps}</div>
                </div>
            </div>
        `;
        athletesGrid.appendChild(card);
    });
}

function initAthleteFilter() {
    const countryFilter = document.getElementById('country-filter');
    
    countryFilter.addEventListener('change', (e) => {
        renderAthletes(e.target.value);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initStadiumSeating();
    renderAthletes();
    initAthleteFilter();
});
