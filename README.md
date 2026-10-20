# Interactive Demultiplexer Simulator

A beginner-friendly Flask web application that demonstrates 1-to-2, 1-to-4, and 1-to-8 digital demultiplexers. Python performs the output calculation and generates each truth table; JavaScript sends input changes to the Flask API and refreshes the display.

## Requirements

- Python 3.9 or later
- pip
- A modern web browser

## Run on Windows

1. Install Python from [python.org](https://www.python.org/downloads/) if needed. Select **Add Python to PATH** during installation.
2. Open this project folder in VS Code, or open PowerShell in the project folder.
3. Create a virtual environment:

   ```powershell
   py -m venv .venv
   ```

4. Activate it in PowerShell:

   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```

   If PowerShell blocks activation, run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` in that terminal and activate again.

5. Install Flask:

   ```powershell
   py -m pip install -r requirements.txt
   ```

6. Start the web application:

   ```powershell
   py app.py
   ```

7. Open the local address printed in the terminal, usually [http://127.0.0.1:5000](http://127.0.0.1:5000).
8. Stop the server with **Ctrl+C** in the terminal.

## How it works

Choose a DEMUX size, set the data input D, and toggle the select lines. The browser submits the values to `POST /api/simulate`. Flask validates the request, calculates the output array, creates the full truth table, and returns the result as JSON. The page shows all outputs, highlights the active route, and marks the matching truth-table row.

The select lines are read in descending order (for example, S2 S1 S0). Their binary value is the output index. When D is 0, every output remains 0.

## Project files

```text
app.py
requirements.txt
README.md
templates/
  index.html
static/
  style.css
  script.js
report/
  project_report.md
  flowchart.md
```

See `report/project_report.md` for the theory, algorithm, test cases, and screenshot placeholders.
# Interactive-Demultiplexer-system
