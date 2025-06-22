#!/usr/bin/env bash

# Find all workflow files and lint them
find .gitea/workflows -name "*.yml" -o -name "*.yaml" | while read file; do
  echo "Linting $file..."
  cat "$file" | docker run --rm -i rhysd/actionlint:latest -color -
  
  # Store exit code
  exit_code=$?
  
  # If linting failed, exit with an error
  if [ $exit_code -ne 0 ]; then
    echo "Linting failed for $file"
    exit $exit_code
  fi
done
