import { setFailed, getInput, setOutput } from "@actions/core";
import { LinearClient } from "@linear/sdk";
import getTeamByKey from "./getTeamByKey";

const getIdsFromInput = (input: string): string[] => {
  if (!input.trim()) {
    return [];
  }
  return input.split(",").map((id) => id.trim());
};

const main = async () => {
  try {
    const apiKey = getInput("linear-api-key");
    const linearClient = new LinearClient({ apiKey });

    // Get team object from linear-team-key
    const teamKey = getInput("linear-team-key");
    const team = await getTeamByKey(linearClient, teamKey);
    if (!team) {
      setFailed(`Failed to find team with key: ${teamKey}`);
      return;
    }

    // Get old state id and label id
    const oldStateIds = getIdsFromInput(getInput("old-linear-issue-state-ids"));
    const oldLabelId = getInput("old-linear-issue-label-id");

    // Get all issues
    const linearIssues = await linearClient.issues({
      filter: {
        team: { id: { eq: team.id } },
        ...(oldLabelId ? { labels: { id: { eq: oldLabelId } } } : {}),
        ...(oldStateIds.length > 0
          ? { state: { id: { in: oldStateIds } } }
          : {}),
      },
    });

    const count = linearIssues?.nodes?.length || 0;
    if (count === 0) {
      setOutput("issue-affected", count);
      return;
    }

    // Get new state id
    const newStateId = getInput("new-linear-issue-state-id");

    // Update all issues to new state
    await linearClient.issueBatchUpdate(
      linearIssues.nodes.map((issue) => issue.id),
      {
        stateId: newStateId,
      }
    );

    setOutput("issues-affected", count);
  } catch (error) {
    setFailed(`${(error as any)?.message ?? error}`);
  }
};

main();
