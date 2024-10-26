const distrosContainer = document.getElementById('distros');
const jsonFiles = ["ubuntu.json", "debian.json", "fedora.json", "arch.json", "mint.json"];

function createDistroBox(variant) {
    const box = document.createElement('div');
    box.classList.add('distro-box');
    
    const purposes = variant.categories ? variant.categories.map(cat => cat.name) : [];
    box.setAttribute('data-purpose', purposes.join(','));
    
    box.textContent = variant.name; // Display variant name exactly as it is
    distrosContainer.appendChild(box);
}

async function loadVariants() {
    for (const file of jsonFiles) {
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`Failed to load ${file}`);
            const data = await response.json();
            data.variants.forEach(variant => createDistroBox(variant));
        } catch (error) {
            console.error(`Error loading ${file}:`, error);
        }
    }
}

loadVariants();

function filterDistros() {
    const selectedPurpose = Array.from(document.querySelectorAll('#purpose input:checked')).map(input => input.value);
    document.querySelectorAll('.distro-box').forEach(box => {
        const boxPurpose = box.getAttribute('data-purpose').split(',');
        const matchesAllPurposes = selectedPurpose.every(purpose => boxPurpose.includes(purpose));
        box.style.display = matchesAllPurposes ? 'block' : 'none';
    });
}

document.querySelectorAll('#purpose input').forEach(input => input.addEventListener('change', filterDistros));
