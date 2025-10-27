#!/bin/bash

# Root folder
ROOT="kettle-competition"

# Create main directories
mkdir -p $ROOT/{config,templates/sample_files,src/{models,agents,evaluators,graph,utils},tests/expected_outputs}

# Create root files
touch $ROOT/{requirements.txt,.env.example,README.md,main.py}

# Create config files
touch $ROOT/config/{__init__.py,settings.py}

# Create template files
touch $ROOT/templates/requirement_spec_template.md
touch $ROOT/templates/sample_files/{before_code.py,after_code.py}

# Create src files
touch $ROOT/src/__init__.py

# Models
touch $ROOT/src/models/{__init__.py,inputs.py,outputs.py,evaluation.py}

# Agents
touch $ROOT/src/agents/{__init__.py,base_agent.py,business_analyst_agent.py,developer_agent.py,qa_agent.py}

# Evaluators
touch $ROOT/src/evaluators/{__init__.py,base_evaluator.py,ba_evaluator.py,dev_evaluator.py,qa_evaluator.py}

# Graph
touch $ROOT/src/graph/{__init__.py,workflow.py,nodes.py}

# Utils
touch $ROOT/src/utils/{__init__.py,file_handler.py,summarizer.py,output_writer.py}

# Tests
touch $ROOT/tests/__init__.py
touch $ROOT/tests/test_agents.py

# Expected outputs
touch $ROOT/tests/expected_outputs/{ba_expected.json,dev_expected.json,qa_expected.json}

echo "Folder structure for '$ROOT' created successfully."
