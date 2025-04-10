const fs = require("fs");
const path = require("path");
const solc = require("solc");

const buildPath = path.join(__dirname, "build");

// Ensure build directory exists
if (!fs.existsSync(buildPath)) {
  fs.mkdirSync(buildPath);
}

// Read all .sol files in the current (blockchain root) directory
const solFiles = fs.readdirSync(__dirname).filter(file => file.endsWith(".sol"));
if (solFiles.length === 0) {
  console.error("No Solidity files found in the blockchain root folder.");
  process.exit(1);
}

// Build the sources object
const sources = {};
solFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  sources[file] = { content: fs.readFileSync(filePath, "utf8") };
});

// OpenZeppelin import handler
function findImports(importPath) {
  if (importPath.startsWith("@openzeppelin/contracts")) {
    const fullPath = path.join(
      __dirname,
      "node_modules",
      "@openzeppelin",
      "contracts",
      importPath.substring("@openzeppelin/contracts/".length)
    );
    return { contents: fs.readFileSync(fullPath, "utf8") };
  }
  return { error: `File not found: ${importPath}` };
}

const input = {
  language: "Solidity",
  sources,
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode.object"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

if (output.errors) {
  output.errors.forEach(err => {
    console[err.severity === 'error' ? 'error' : 'warn'](err.formattedMessage);
  });
  if (output.errors.some(err => err.severity === 'error')) {
    process.exit(1);
  }
}

Object.keys(sources).forEach(sourceFile => {
  const contracts = output.contracts[sourceFile];
  if (!contracts) {
    console.warn(`No contracts compiled from ${sourceFile}`);
    return;
  }

  for (const contractName in contracts) {
    const contract = contracts[contractName];

    // Save ABI
    fs.writeFileSync(
      path.join(buildPath, `${contractName}.abi`),
      JSON.stringify(contract.abi, null, 2)
    );

    // Save bytecode
    fs.writeFileSync(
      path.join(buildPath, `${contractName}.bin`),
      contract.evm.bytecode.object
    );

    // Save combined JSON (for frontend)
    fs.writeFileSync(
      path.join(buildPath, `${contractName}.json`),
      JSON.stringify({
        contractName,
        abi: contract.abi,
        bytecode: contract.evm.bytecode.object
      }, null, 2)
    );

    // Save placeholder address (to be filled after deployment)
    fs.writeFileSync(
      path.join(buildPath, `${contractName}-address.json`),
      JSON.stringify({ address: "" }, null, 2)
    );

    console.log(`✅ Compiled ${contractName} from ${sourceFile}`);
  }
});
