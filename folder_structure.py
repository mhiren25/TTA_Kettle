#!/bin/bash

# Check if participants are provided
if [ "$#" -lt 1 ]; then
    echo "Usage: $0 participant1 participant2 ..."
    exit 1
fi

PARTICIPANTS=("$@")

# Root repo folder
ROOT_REPO="kettle-competition"
mkdir -p "$ROOT_REPO"
cd "$ROOT_REPO"

# Initialize git repo if not already
if [ ! -d ".git" ]; then
    git init
fi

# Create main branch with evaluator code
git checkout -b main
mkdir -p src/evaluators
touch src/evaluators/{__init__.py,base_evaluator.py,ba_evaluator.py,dev_evaluator.py,qa_evaluator.py}
git add src/evaluators
git commit -m "Add evaluator code to main branch"

# Function to create participant structure
create_structure() {
    ROOT="$1"
    mkdir -p "$ROOT/config"
    mkdir -p "$ROOT/templates/sample_files"
    mkdir -p "$ROOT/src/models" "$ROOT/src/agents" "$ROOT/src/graph" "$ROOT/src/utils"
    mkdir -p "$ROOT/tests/expected_outputs"

    # Root files
    touch "$ROOT/requirements.txt" "$ROOT/.env.example" "$ROOT/main.py"
    echo "# $ROOT" > "$ROOT/README.md"

    # Config
    touch "$ROOT/config/__init__.py" "$ROOT/config/settings.py"

    # Templates
    echo "## Requirement Specification Template" > "$ROOT/templates/requirement_spec_template.md"
    touch "$ROOT/templates/sample_files/before_code.py"
    touch "$ROOT/templates/sample_files/after_code.py"

    # Src files
    touch "$ROOT/src/__init__.py"
    touch "$ROOT/src/models/{__init__.py,inputs.py,outputs.py,evaluation.py}"
    touch "$ROOT/src/agents/{__init__.py,base_agent.py,business_analyst_agent.py,developer_agent.py,qa_agent.py}"
    touch "$ROOT/src/graph/{__init__.py,workflow.py,nodes.py}"
    touch "$ROOT/src/utils/{__init__.py,file_handler.py,summarizer.py,output_writer.py}"

    # Tests
    touch "$ROOT/tests/__init__.py"
    touch "$ROOT/tests/test_agents.py"
    touch "$ROOT/tests/expected_outputs/{ba_expected.json,dev_expected.json,qa_expected.json}"
}

# Loop through participants and create separate branch for each
for participant in "${PARTICIPANTS[@]}"; do
    echo "Creating branch and structure for $participant"
    git checkout main
    git checkout -b "$participant"

    create_structure "$participant"

    # Add and commit participant files (evaluators excluded)
    git add .
    git commit -m "Add structure for participant $participant (evaluators excluded)"
done

echo "Branches for participants created. Each branch has isolated folder structure without evaluators."
