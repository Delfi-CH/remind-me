import { getTheme, updateTheme } from "./database/db.js";

let theme = $state('cosmo');

const themeMap = {
	cosmo: 'themes/cosmo/bootstrap.min.css',
	quartz: 'themes/vapor/bootstrap.min.css',
	spacelab: 'themes/spacelab/bootstrap.min.css',
	mint: 'themes/minty/bootstrap.min.css',
	drawn: 'themes/sketchy/bootstrap.min.css',
	liquid: 'themes/morph/bootstrap.min.css',
	slate: 'themes/slate/bootstrap.min.css',
	cyborg: 'themes/solar/bootstrap.min.css'
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