const systeminformation = require('systeminformation')

async function getCpuUsage(){
	const cpuData = await systeminformation.currentLoad();
	const totalLoad = cpuData.cpus.reduce((load, cpuLoad) => {
		return load + cpuLoad.load;
	}, 0);
	return Math.round(totalLoad / cpuData.cpus.length);
}

async function getStorageInfo(){
	const fsInfo = await systeminformation.fsSize();
	let mainFs;
	let total = 0;
	// First we find the block device which the data partition is part of
	for (const partition of fsInfo) {
		if (partition.mount === '/data') {
			mainFs = partition.fs;
			total = partition.size;
			break;
		}
	}

	if (!mainFs) {
		return {
			blockDevice: '',
			storageUsed: undefined,
			storageTotal: undefined,
		};
	}

	let used = 0;
	for (const partition of fsInfo) {
		if (partition.fs.startsWith(mainFs)) {
			used += partition.used;
		}
	}

	return {
		blockDevice: mainFs,
		storageUsed: bytesToMb(used),
		storageTotal: bytesToMb(total),
	};
}

async function getMemoryInformation(){
	const mem = await systeminformation.mem();
	return {
		used: bytesToMb(mem.used - mem.cached - mem.buffers),
		total: bytesToMb(mem.total),
	};
}

async function getCpuTemp(){
	const tempInfo = await systeminformation.cpuTemperature();
	return Math.round(tempInfo.main);
}

async function getSystemMetrics() {
	const [cpu, mem, temp, storage] = await Promise.all([
		getCpuUsage(),
		getMemoryInformation(),
		getCpuTemp(),
		getStorageInfo(),
	]);

	return {
		cpu_usage: cpu,
		memory_usage: mem.used,
		memory_total: mem.total,
		storage_usage: storage.storageUsed,
		storage_total: storage.storageTotal,
		storage_block_device: storage.blockDevice,
		cpu_temp: temp,
	};
}

function bytesToMb(bytes) {
	return Math.floor(bytes / 1024 / 1024);
}


module.exports = { getSystemMetrics }
