/* eslint-disable */

import axios from "axios";
import { exec } from "child_process"

const QUERY_SIZE = 250;
const SCOPE = "rbxts"

async function getAllPackages() {
	let offset = 0;
	const pkgNames = new Array<string>();

	while (true) {
		const url = `https://api.npms.io/v2/search?q=scope:${SCOPE}&size=${QUERY_SIZE}&from=${offset}`;
		console.log("url", url);
		const response = await axios.get(url);

		for (const v of response.data.results) {
			pkgNames.push(v.package.name);
		}

		offset += QUERY_SIZE;
		if (offset > response.data.total) {
			break;
		}
	}

	return pkgNames;
}

async function main() {
	const allPkgNames = await getAllPackages();
	const pkgsStr = allPkgNames.map(v => `${v}@latest`).join(" ");
	exec(`npm install ${pkgsStr}`);
}

main();
