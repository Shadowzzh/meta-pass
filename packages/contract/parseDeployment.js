const file = require('fs');
const path = require('path');

function parseDeploymentFile(filePath) {
  const content = file.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').filter((line) => line.trim() !== '');

  console.log('Deployment Information:');

  lines.forEach((line, index) => {
    try {
      const data = JSON.parse(line);

      if (data.type === 'DEPLOYMENT_INITIALIZE') {
        console.log(`\nChain ID: ${data.chainId}`);
      } else if (data.type === 'DEPLOYMENT_EXECUTION_STATE_INITIALIZE') {
        console.log(`\nContract: ${data.contractName}`);
        console.log(`Deployer: ${data.from}`);
        console.log(`Deployment ID: ${data.futureId}`);
      } else if (data.type === 'NETWORK_INTERACTION_REQUEST') {
        console.log(`\nInteraction Type: ${data.networkInteraction.type}`);
        console.log(`Transaction ID: ${data.networkInteraction.id}`);
        console.log(
          `Data (first 64 chars): ${data.networkInteraction.data.slice(0, 64)}...`,
        );
      }
    } catch (error) {
      console.error(`Error parsing line ${index + 1}: ${error.message}`);
    }
  });
}

// 使用示例
const deploymentFilePath = path.join(
  __dirname,
  'ignition',
  'deployments',
  'chain-11155111',
  'journal.jsonl'

);
parseDeploymentFile(deploymentFilePath);
