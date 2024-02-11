let fetchedSectors = [];

function setSectorsFromSessionStorage() {
  const sectors = Array.from(sessionStorage.getItem("sectors").split(","));
  if (sectors === null) {
    return;
  }
  let nextSector = 0;
  sectors.forEach(sector => {
    sector = [sector]
    const nextSectorDiv = getNextSectorDiv(nextSector);
    const sectorSelect = getSectorSelect(sector, nextSector, false);

    if (sectorSelect === undefined) {
      return;
    }

    if (nextSector !== 0) {
      document.getElementById('sectors-div-' + (nextSector - 1)).appendChild(nextSectorDiv);
    }
    nextSectorDiv.appendChild(sectorSelect);
    addSectorChangeEvent(sectorSelect);
    nextSector++;
  });
}

function fillFromSessionStorage() {
  if (sessionStorage.getItem('id') != null && sessionStorage.getItem('sessionId') != null) {
    document.getElementById('name').value = sessionStorage.getItem('name');
    setSectorsFromSessionStorage();
    document.getElementById('agreement').checked = sessionStorage.getItem('agreement');
  } else {
    const sectorOptions = fetchedSectors.map(sector => {
      if (sector.parentId === null) {
        return `<option value="${sector.value}">${sector.name}</option>`;
      }
    }).join('');
    const sectorsSelectElement = document.getElementById('sectors-0');
    sectorsSelectElement.innerHTML = sectorOptions;

    addSectorChangeEvent(sectorsSelectElement);
  }
}

function getSelectedSectors(event) {
  const data = [];
  for (const [key, value] of Object.entries(event.target)) {
    const element = document.getElementById(value.id);
    if (element != null && element.tagName === 'SELECT') {
      data.push(element.value);
    }
  }
  return data;
}

function addToastWithNoCss(text) {
  const toast = document.getElementById('toast');
  if (toast === null) {
    return;
  }
  toast.innerHTML = text;
  setTimeout(() => {
    toast.innerHTML = '';
  }, 3000);
}

function validateAndSaveForm(event) {
  const name = document.getElementById('name').value;
  const sectors = getSelectedSectors(event);
  const agree = document.getElementById('agreement').checked;
  const sessionId = !!sessionStorage.getItem('id') ? sessionStorage.getItem('sessionId')
    : Math.random().toString(36).substring(2, 15);
  const id = !!sessionStorage.getItem('id') ? sessionStorage.getItem('id') : null
  if (name === '' || sectors.length === 0 || !agree || sessionId === null) {
    return;
  }
  event.preventDefault();
  fetch('/api/entry/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, name,
      sectors, agreeToTerms: agree, sessionId: sessionId })
  }).then(response => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response);
  }).then(data => {
      sessionStorage.setItem('id', data.id);
      sessionStorage.setItem('name', name);
      sessionStorage.setItem('sectors', sectors);
      sessionStorage.setItem('agreement', agree);
      sessionStorage.setItem('sessionId', data.sessionId);

      addToastWithNoCss('Form submitted successfully');
    }).catch((error) => {
      console.log(error);
    });
}

function getNextSectorDiv(nextSector) {
  let nextSectorDiv = document.getElementById('sectors-div-' + nextSector);
  if (nextSectorDiv === null) {
    nextSectorDiv = Object.assign(document.createElement('div'), {id: 'sectors-div-' + nextSector});
  }
  nextSectorDiv.innerHTML = '';
  return nextSectorDiv;
}

function getSectorOptionsCombined(selectedOptions, subSectors) {
  let sectorOptionsCombined = '';
  selectedOptions.forEach(selectedOption => {
    const sector = fetchedSectors.find(sector => sector.value.toString() === selectedOption);
    let sectorOptions;
    if (subSectors) {
      sectorOptions = sector.subSectors.map(subSector => {
        return `<option value="${subSector.value}">${subSector.name}</option>`;
      }).join('');
      sectorOptionsCombined += sectorOptions;
    } else {
      const parentSectors = fetchedSectors.filter(parentSector => parentSector.parentId === sector.parentId);
      sectorOptions = parentSectors.map(parentSector => {
        if (sector.id === parentSector.id) {
          return `<option value="${parentSector.value}" selected>${parentSector.name}</option>`;
        } else {
          return `<option value="${parentSector.value}">${parentSector.name}</option>`;
        }
      }).join('');
    }
    sectorOptionsCombined += sectorOptions;
  });
  return sectorOptionsCombined;
}

function getSectorSelect(selectedOptions, nextSector, subSectors) {
  let sectorSelect = document.getElementById('sectors-' + nextSector);
  if (sectorSelect === null) {
    sectorSelect = Object.assign(document.createElement('select'),
      {multiple: 'true', required: 'true', size: '5', id: 'sectors-' + nextSector});
  }
  let sectorOptionsCombined = getSectorOptionsCombined(selectedOptions, subSectors);

  if (sectorOptionsCombined === '') {
    return;
  }
  sectorSelect.innerHTML = sectorOptionsCombined;
  return sectorSelect;
}

function addSectorChangeEvent(sectorsSelectElement) {
  sectorsSelectElement.addEventListener('change', (event) => {
    let selectedOptions = Array.from(event.target.options)
      .filter(option => option.selected)
      .map(option => option.value);
    if (selectedOptions.length === 0) {
      return;
    }

    const currentSector = parseInt(event.target.id.split('-')[1]);
    const nextSector = currentSector + 1;
    const nextSectorDiv = getNextSectorDiv(nextSector);
    const sectorSelect = getSectorSelect(selectedOptions, nextSector, true);

    if (sectorSelect === undefined) {
      return;
    }

    document.getElementById('sectors-div-' + currentSector).appendChild(nextSectorDiv);
    nextSectorDiv.appendChild(sectorSelect);
    addSectorChangeEvent(sectorSelect);
  });
}

async function getSectors() {
  await fetch('/api/sectors/all')
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    }).then(data => {
      fetchedSectors = data;
    }).catch(error => {
    console.log(error);
  });
}

window.addEventListener("DOMContentLoaded", (event) => {
  const el = document.getElementById('form');
  if (el) {
    getSectors().then(() => fillFromSessionStorage());
    el.addEventListener('submit', (event) => {return validateAndSaveForm(event)});
  }
});

