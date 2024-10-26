const distrosContainer = document.getElementById('distros');
const jsonFiles = ["ubuntu.json", "debian.json", "fedora.json", "arch.json", "mint.json"];

function createDistroBox(variant, distroName) {
    const box = document.createElement('div');
    box.classList.add('distro-box');
    
    const purposes = variant.categories ? variant.categories.map(cat => cat.name).join(',') : '';
    const customization = variant.desktop_environment?.customization_allowance?.toLowerCase() || 'medium';

    box.setAttribute('data-purpose', purposes);
    box.setAttribute('data-experience', distroName === "Ubuntu" || distroName === "Fedora" || distroName === "Linux Mint" ? "Beginner" : "Experienced");
    box.setAttribute('data-customization', customization);
    
    box.textContent = `${distroName} ${variant.name}`;
    distrosContainer.appendChild(box);
}

async function loadVariants() {
    for (const file of jsonFiles) {
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`Failed to load ${file}`);

            const data = await response.json();
            const distroName = data.name;
            data.variants.forEach(variant => createDistroBox(variant, distroName));
        } catch (error) {
            console.error(`Error loading ${file}:`, error);
        }
    }
}

loadVariants();

function filterDistros() {
    const selectedPurpose = Array.from(document.querySelectorAll('#purpose input:checked')).map(input => input.value);
    const selectedExperience = document.querySelector('input[name="experience"]:checked')?.value;
    const selectedCustomization = document.querySelector('input[name="customization"]:checked')?.value;

    document.querySelectorAll('.distro-box').forEach(box => {
        const boxPurpose = box.getAttribute('data-purpose').split(',');
        const boxExperience = box.getAttribute('data-experience');
        const boxCustomization = box.getAttribute('data-customization');

        const matchesPurpose = selectedPurpose.length === 0 || selectedPurpose.some(p => boxPurpose.includes(p));
        const matchesExperience = !selectedExperience || selectedExperience === boxExperience;
        const matchesCustomization = !selectedCustomization || selectedCustomization === boxCustomization;

        box.style.display = matchesPurpose && matchesExperience && matchesCustomization ? 'block' : 'none';
    });
}

document.querySelectorAll('#purpose input').forEach(input => input.addEventListener('change', filterDistros));
document.querySelectorAll('input[name="experience"]').forEach(input => input.addEventListener('change', filterDistros));
document.querySelectorAll('input[name="customization"]').forEach(input => input.addEventListener('change', filterDistros));
