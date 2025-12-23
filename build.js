import { spawn, execSync } from "child_process";
const VERSION = "-1.1.0";
const A64 = "_arm64";
const AHF = "_armhf";
const X64 = "_x64";
const UNI = "_universal";
const paths = [
	["linux", [A64, AHF, X64], ""],
	["mac", [A64, UNI, X64], ""],
	["win", [X64], ".exe"]
];
function makePaths (platform, type, extension) {
	return ["discript-" + platform + type + extension, "discript-" + platform + type + VERSION + ".zip"]
}
function makeCommand (target, location) {
	return `Compress-Archive -Path 'dist/discript/${target}','dist/discript/resources.neu' -DestinationPath 'dist/discript/${location}' -Force`;
}
function zippers (code) {
	if (code !== 0) { console.error("neu build failed"); return; }
	const commands = [];
	for (const [platform, types, extension] of paths) {
		for (const type of types) {
			commands.push(makeCommand(...makePaths(platform, type, extension)));
		}
	}
	const child = spawn("powershell", [
		"-command",
		commands.join(" ; ")
	], {
		stdio: "inherit", shell: true
	});
}
function build () {
	const buildProcess = spawn("neu", ["build"], { stdio: "inherit", shell: true });
	buildProcess.on("exit", zippers);
}
build();