import { deflateRawSync } from "node:zlib";
import {
    copyFile,
    mkdir,
    readFile,
    readdir,
    rm,
    stat,
    writeFile
} from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
    buildSuperOfficeCaptureModule,
    buildVtiCaptureModule
} from "./browserExtensionBuildSupport.mjs";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const extensionRoot = join(projectRoot, "browser-extension");
const extensionDist = join(extensionRoot, "dist");
const downloadPath = join(projectRoot, "public/downloads/salt-bo-capture-beta.zip");
const zipRootName = "salt-bo-capture-beta";

const staticFiles = [
    "alexAutomation.js",
    "aloAutomation.js",
    "INSTALL.md",
    "app-bridge.js",
    "healthcheckCapture.js",
    "manifest.json",
    "service-worker.js",
    "tabActivity.js",
    "tabDiscovery.js",
    "vtiContractorSearch.js",
    "vtiParallelCapture.js"
];

function createCrc32Table() {
    return Array.from({ length: 256 }, (_, index) => {
        let value = index;
        for (let bit = 0; bit < 8; bit += 1) {
            value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
        }
        return value >>> 0;
    });
}

const crc32Table = createCrc32Table();

function crc32(buffer) {
    let checksum = 0xffffffff;
    for (const byte of buffer) {
        checksum = crc32Table[(checksum ^ byte) & 0xff] ^ (checksum >>> 8);
    }
    return (checksum ^ 0xffffffff) >>> 0;
}

function createZipBuffer(entries) {
    const localParts = [];
    const centralParts = [];
    let localOffset = 0;

    entries.forEach(({ name, content }) => {
        const nameBuffer = Buffer.from(name.replaceAll("\\", "/"), "utf8");
        const compressed = deflateRawSync(content, { level: 9 });
        const checksum = crc32(content);

        const localHeader = Buffer.alloc(30);
        localHeader.writeUInt32LE(0x04034b50, 0);
        localHeader.writeUInt16LE(20, 4);
        localHeader.writeUInt16LE(0x0800, 6);
        localHeader.writeUInt16LE(8, 8);
        localHeader.writeUInt32LE(0, 10);
        localHeader.writeUInt32LE(checksum, 14);
        localHeader.writeUInt32LE(compressed.length, 18);
        localHeader.writeUInt32LE(content.length, 22);
        localHeader.writeUInt16LE(nameBuffer.length, 26);

        const centralHeader = Buffer.alloc(46);
        centralHeader.writeUInt32LE(0x02014b50, 0);
        centralHeader.writeUInt16LE(20, 4);
        centralHeader.writeUInt16LE(20, 6);
        centralHeader.writeUInt16LE(0x0800, 8);
        centralHeader.writeUInt16LE(8, 10);
        centralHeader.writeUInt32LE(0, 12);
        centralHeader.writeUInt32LE(checksum, 16);
        centralHeader.writeUInt32LE(compressed.length, 20);
        centralHeader.writeUInt32LE(content.length, 24);
        centralHeader.writeUInt16LE(nameBuffer.length, 28);
        centralHeader.writeUInt32LE(0, 38);
        centralHeader.writeUInt32LE(localOffset, 42);

        localParts.push(localHeader, nameBuffer, compressed);
        centralParts.push(centralHeader, nameBuffer);
        localOffset += localHeader.length + nameBuffer.length + compressed.length;
    });

    const centralDirectory = Buffer.concat(centralParts);
    const endRecord = Buffer.alloc(22);
    endRecord.writeUInt32LE(0x06054b50, 0);
    endRecord.writeUInt16LE(entries.length, 8);
    endRecord.writeUInt16LE(entries.length, 10);
    endRecord.writeUInt32LE(centralDirectory.length, 12);
    endRecord.writeUInt32LE(localOffset, 16);

    return Buffer.concat([...localParts, centralDirectory, endRecord]);
}

async function listFiles(directory) {
    const entries = await readdir(directory);
    const files = [];

    for (const entry of entries.sort()) {
        const absolutePath = join(directory, entry);
        const fileStat = await stat(absolutePath);
        if (fileStat.isDirectory()) {
            files.push(...await listFiles(absolutePath));
        } else {
            files.push(absolutePath);
        }
    }

    return files;
}

async function buildExtensionDirectory() {
    await rm(extensionDist, { force: true, recursive: true });
    await mkdir(join(extensionDist, "generated"), { recursive: true });
    await mkdir(join(extensionDist, "shared"), { recursive: true });

    await Promise.all(staticFiles.map((fileName) => (
        copyFile(join(extensionRoot, fileName), join(extensionDist, fileName))
    )));
    await copyFile(
        join(projectRoot, "shared/browserExtensionProtocol.js"),
        join(extensionDist, "shared/browserExtensionProtocol.js")
    );
    await copyFile(
        join(projectRoot, "shared/superOfficeTicketNavigation.js"),
        join(extensionDist, "shared/superOfficeTicketNavigation.js")
    );
    await copyFile(
        join(projectRoot, "shared/vtiContractorNavigation.js"),
        join(extensionDist, "shared/vtiContractorNavigation.js")
    );

    const [superOfficeBookmarklet, vtiBookmarklet] = await Promise.all([
        readFile(join(projectRoot, "src/data/superOfficeBookmarklet.txt"), "utf8"),
        readFile(join(projectRoot, "src/data/vtiHealthcheckBookmarklet.txt"), "utf8")
    ]);

    await Promise.all([
        writeFile(
            join(extensionDist, "generated/superOfficeCapture.js"),
            buildSuperOfficeCaptureModule(superOfficeBookmarklet),
            "utf8"
        ),
        writeFile(
            join(extensionDist, "generated/vtiCapture.js"),
            buildVtiCaptureModule(vtiBookmarklet),
            "utf8"
        )
    ]);
}

async function buildExtensionZip() {
    await buildExtensionDirectory();
    const extensionFiles = await listFiles(extensionDist);
    const zipEntries = await Promise.all(extensionFiles.map(async (filePath) => ({
        name: `${zipRootName}/${relative(extensionDist, filePath)}`,
        content: await readFile(filePath)
    })));

    await mkdir(dirname(downloadPath), { recursive: true });
    await writeFile(downloadPath, createZipBuffer(zipEntries));
    return { downloadPath, fileCount: zipEntries.length };
}

const result = await buildExtensionZip();
console.log(`Browser extension package created: ${result.downloadPath} (${result.fileCount} files)`);
