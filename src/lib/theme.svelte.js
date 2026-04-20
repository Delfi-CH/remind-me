import { getTheme, updateTheme } from "./database/db.js";

let theme = $state('cosmo');

const themeMap = {
	cosmo: 'https://cdn.jsdelivr.net/npm/bootswatch@5/dist/cosmo/bootstrap.min.css',
	quartz: 'https://cdn.jsdelivr.net/npm/bootswatch@5/dist/vapor/bootstrap.min.css',
	spacelab: 'https://cdn.jsdelivr.net/npm/bootswatch@5/dist/spacelab/bootstrap.min.css',
	mint: 'https://cdn.jsdelivr.net/npm/bootswatch@5/dist/minty/bootstrap.min.css',
	drawn: 'https://cdn.jsdelivr.net/npm/bootswatch@5/dist/sketchy/bootstrap.min.css',
	liquid: 'https://cdn.jsdelivr.net/npm/bootswatch@5/dist/morph/bootstrap.min.css',
	lux: 'https://cdn.jsdelivr.net/npm/bootswatch@5/dist/lux/bootstrap.min.css',
	slate: 'https://cdn.jsdelivr.net/npm/bootswatch@5/dist/slate/bootstrap.min.css',
	cyborg: 'https://cdn.jsdelivr.net/npm/bootswatch@5/dist/solar/bootstrap.min.css'
};

function applyTheme(value) {
	const link = document.getElementById('theme-link');
	if (link) link.href = themeMap[value] ?? themeMap.cosmo;
}

export async function setTheme(value) {
	theme = value;
	applyTheme(value);
	updateTheme(value);
}

export async function initTheme() {
	const saved = await getTheme()
	setTheme(saved);
}