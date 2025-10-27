#!/bin/bash

# Check if participants are provided
if [ "$#" -lt 1 ]; then
    echo "Usage: $0 participant1 participant2 ..."
    exit 1
fi

PARTICIPANTS=("$@")

# Function to create folder structure for a participant
create_structure() {
    ROOT="$1"

    # Create directories
    mkdir -p "$ROOT/config"
    mkdir -p "$ROOT/templates/sample_files"
    mkdir -p "$ROOT/src/models"
    mkdir -p "$ROOT/src/agents"
    mkdir -p "$ROOT/src/evaluators"
    mkdir -p "$ROOT/src/graph"
    mkdir -p "$ROOT/src/utils"
    mkdir -p "$ROOT/tests/expected_outputs"

    # Create root files
    touch "$ROOT/requirements.txt" "$ROOT/.env.example" "$ROOT/main.py"
    
    # README with starter content
    echo "# $ROOT" > "$ROOT/README.md"
    echo "This is the starter structure for $ROOT." >> "$ROOT/README.md"

    # Config files
    touch "$ROOT/config/__init__.py"
    touch "$ROOT/config/settings.py"

    # Templates
    echo "## Requirement Specification Template" > "$ROOT/templates/requirement_spec_template.md"
    echo "- Feature 1:" >> "$ROOT/templates/requirement_spec_template.md"
    echo "- Feature 2:" >> "$ROOT/templates/requirement_spec_template.md"
    touch "$ROOT/templates/sample_files/before_code.py"
    touch "$ROOT/templates/sample_files/after_code.py"

    # Src files
    touch "$ROOT/src/__init__.py"
    touch "$ROOT/src/models/__init__.py"
    touch "$ROOT/src/models/inputs.py"
    touch "$ROOT/src/models/outputs.py"
    touch "$ROOT/src/models/evaluation.py"

    touch "$ROOT/src/agents/__init__.py"
    touch "$ROOT/src/agents/base_agent.py"
    touch "$ROOT/src/agents/business_analyst_agent.py"
    touch "$ROOT/src/agents/developer_agent.py"
    touch "$ROOT/src/agents/qa_agent.py"

    touch "$ROOT/src/evaluators/__init__.py"
    touch "$ROOT/src/evaluators/base_evaluator.py"
    touch "$ROOT/src/evaluators/ba_evaluator.py"
    touch "$ROOT/src/evaluators/dev_evaluator.py"
    touch "$ROOT/src/evaluators/qa_evaluator.py"

    touch "$ROOT/src/graph/__init__.py"
    touch "$ROOT/src/graph/workflow.py"
    touch "$ROOT/src/graph/nodes.py"

    touch "$ROOT/src/utils/__init__.py"
    touch "$ROOT/src/utils/file_handler.py"
    touch "$ROOT/src/utils/summarizer.py"
    touch "$ROOT/src/utils/output_writer.py"

    # Tests
    touch "$ROOT/tests/__init__.py"
    touch "$ROOT/tests/test_agents.py"
    touch "$ROOT/tests/expected_outputs/ba_expected.json"
    touch "$ROOT/tests/expected_outputs/dev_expected.json"
    touch "$ROOT/tests/expected_outputs/qa_expected.json"
}

# Loop through participants
for participant in "${PARTICIPANTS[@]}"; do
    echo "Creating structure for $participant"
    create_structure "$participant"

    cd "$participant"

    # Initialize git repo
    git init
    git add .
    git reset src/evaluators/  # exclude evaluators
    git commit -m "Initial structure for $participant (evaluators excluded)"

    # Create private repo using GitHub CLI (gh)
    REPO_NAME="$participant-kettle-competition"
    gh repo create "$REPO_NAME" --private --source=. --remote=origin --push

    cd ..
done

echo "All participant folders created and pushed to private GitHub repos (evaluators excluded)."
