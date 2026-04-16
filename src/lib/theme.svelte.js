import { getTheme, updateTheme } from "./database/db.js";

let theme = $state('cosmo');

const themeMap = {
	cosmo: 'https://cdn.jsdelivr.net/npm/bootswatch@5/dist/cosmo/bootstrap.min.css',
	quartz: 'https://cdn.jsdelivr.net/npm/bootswatch@5/dist/quartz/bootstrap.min.css',
	materia: 'https://cdn.jsdelivr.net/npm/bootswatch@5/dist/materia/bootstrap.min.css',
	spacelab: 'https://cdn.jsdelivr.net/npm/bootswatch@5/dist/spacelab/bootstrap.min.css',
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