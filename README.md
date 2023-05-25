# action-update-linear-issues

This is a [Github Action](https://github.com/features/actions) that updates [Linear](https://linear.app/) Issues to a new state.

This is helpful when you're:

- Adding a new release

## Inputs

| Input                       | Description                                                   | Required |
| --------------------------- | ------------------------------------------------------------- | -------- |
| `linear-api-key`            | Linear API key generated from https://linear.app/settings/api | ✅       |
| `linear-team-key`           | Team key (e.g. ENG) for the Linear issue.                     | ✅       |
| `old-linear-issue-state-ids`| Old state ids to filter to                                    | ✅       |
| `new-linear-issue-state-id` | New state ids for the Linear issue.                           | ✅       |
| `old-linear-issue-label-id` | Additional label id to filter on.                             |          |

## Outputs

| Output                     | Description                                                  |
| -------------------------- | ------------------------------------------------------------ |
| `issues-affected`          | Number of issues affected                                    |

## Example usage

### Create Linear Issue on Pull Request

```yaml
name: Update Linear Issues on workflow

on:
  workflow_dispatch:

jobs:
  create-linear-issue-on-pull-request:
    runs-on: ubuntu-latest
    steps:
      - name: Update Linear Issues
        id: updateIssues
        uses: ctriolo/action-update-linear-issues@v1
        with:
          linear-api-key: ${{secrets.LINEAR_API_KEY}}
          linear-team-key: "CHR"
          old-linear-issue-state-ids: "071ad1e9-4cef-4392-86eb-f4d00ec126fc,b8cc1b97-f4a0-4a1c-afd2-1fd5b89bf773"
          new-linear-issue-state-id: "d8dc0111-0862-4ea9-8eb5-e7c127f847ce"
          old-linear-issue-label-id: "ea7fc863-71f7-409c-bcda-b42a22dc9a75"
```
