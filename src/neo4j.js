import neo4j from "neo4j-driver";

// Neo4j configuration
const neo4jUri = "neo4j+s://067db61f.production-orch-0367.neo4j.io:7687";
const neo4jUser = "valu8";
const neo4jPassword = "Uv8#krGIJOZcMXqH13R#Fii%0ircN";

// Create a driver instance
const driver = neo4j.driver(
  neo4jUri,
  neo4j.auth.basic(neo4jUser, neo4jPassword)
);

// Function to run the query
async function runQuery() {
  const session = driver.session();

  try {
    // Cypher query
    const query = `
MATCH (this:Company {OrgNo: '957170005'})
OPTIONAL MATCH path = (this)<-[:CONNECTED_TO*]-(ubo:Person)
WHERE ALL(
  rel IN relationships(path) WHERE 
  (rel.PenneoRoleCode = 'UBO' AND (rel.MinOwnedStake IS NOT NULL OR rel.OwnedStake IS NOT NULL)) 
  OR 
  (rel.PenneoRoleCode = 'OW' AND rel.OwnedStake IS NOT NULL)
)
WITH this, ubo, nodes(path) AS nodesOnPath, relationships(path) AS rels
UNWIND nodesOnPath AS node
WITH ubo, 
  COLLECT(DISTINCT CASE WHEN 'Company' IN labels(node) THEN node{.*, label:'Company'} ELSE NULL END) AS companyNodes, 
  COLLECT(DISTINCT CASE WHEN 'Person' IN labels(node) THEN node{.*, label:'Person'} ELSE NULL END) AS personNodes,
  rels,
  REDUCE(total = 1.0, rel IN rels | total * coalesce(toFloat(rel.MinOwnedStake), 1.0)) AS minOwnedStake,
  REDUCE(total = 1.0, rel IN rels | total * coalesce(toFloat(rel.MaxOwnedStake), 1.0)) AS maxOwnedStake,
  REDUCE(total = 1.0, rel IN rels | total * coalesce(toFloat(rel.OwnedStake), 1.0)) AS ownedStake
WITH ubo, 
  CASE WHEN minOwnedStake = 0 THEN null ELSE minOwnedStake END AS minOwnedStake,
  CASE WHEN maxOwnedStake = 0 THEN null ELSE maxOwnedStake END AS maxOwnedStake,
  CASE WHEN ownedStake = 0 THEN null ELSE ownedStake END AS ownedStake, 
  companyNodes, personNodes, rels
UNWIND rels AS rel
WITH ubo, minOwnedStake, maxOwnedStake, ownedStake, companyNodes, personNodes, 
  COLLECT(DISTINCT rel{.*, startNodeID:startNode(rel).Valu8Id, endNodeID:endNode(rel).Valu8Id}) AS relationshipDetails
RETURN 
  COLLECT(DISTINCT ubo{.*, minOwnedStake, maxOwnedStake, ownedStake}) as uboDetails, 
  relationshipDetails,
  companyNodes + personNodes AS nodes
        `;

    // Run the query
    const result = await session.run(query);

    // Convert the result to JSON
    const resultsJson = JSON.stringify(
      result.records.map((record) => record.toObject()),
      null,
      4
    );

    console.log(resultsJson);

    // Specify the file path and name
    // const filePath = 'result_data.json';

    // Write the JSON data to a file
    // fs.writeFileSync(filePath, resultsJson);
    // console.log(`Results have been saved to ${filePath}`);
  } catch (error) {
    console.error("Error running query:", error);
  } finally {
    await session.close();
  }
}

export const run = async () => {
  return await runQuery().then(() => {
    driver.close();
  });
}
