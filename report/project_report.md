# Interactive Demultiplexer Simulator

**College PBL Task 2 — Computer Engineering**

## Abstract

The Interactive Demultiplexer Simulator is a small educational web application for exploring 1-to-2, 1-to-4, and 1-to-8 digital demultiplexers. A user chooses the circuit size, data input, and select-line values. A Python Flask backend validates the values, computes the output, and generates the complete truth table. The browser presents the result as labelled output indicators and a circuit diagram.

## Introduction

A demultiplexer (DEMUX) is a combinational logic circuit with one data input, multiple outputs, and select lines. The select-line binary value identifies the output that receives the input. A DEMUX is sometimes described as the reverse routing operation of a multiplexer.

## Problem Statement

Students need a clear way to observe how data and select-line combinations determine a demultiplexer's outputs. This project demonstrates these combinations interactively and provides a complete truth table for each supported circuit size.

## Objectives

- Understand the role of data and select inputs in a DEMUX.
- Simulate 1-to-2, 1-to-4, and 1-to-8 demultiplexers.
- Display the selected output and all inactive outputs clearly.
- Generate the truth table from the same Python logic used for simulation.
- Provide a simple application suitable for classroom demonstration.

## Requirements

### Software

- Python 3.9 or later
- Flask 3.x
- Modern web browser
- Windows, macOS, or Linux operating system

### Hardware

- Computer capable of running Python and a web browser
- Keyboard, mouse, and display
- No dedicated digital-logic hardware is required

## System Design

The browser renders the interface using HTML and CSS. JavaScript listens for input changes and sends a JSON request to Flask at `POST /api/simulate`. The backend validates the DEMUX type and bit values, computes the result, and returns the output array, active output, explanation, and generated truth table. JavaScript updates the diagram, output indicators, and table.

## Input, Processing, and Output

- **Input:** DEMUX type, data bit D, and the select bits in most-significant-first order.
- **Processing:** Interpret the select bits as an unsigned binary output index. Initialize every output to 0. If D is 1, assign 1 to the indexed output.
- **Output:** Circuit type, inputs, every output value, active output when D is 1, explanation, and full truth table.

## Demultiplexer Theory

For a DEMUX with `n` select lines, there are `2^n` outputs. The select lines form a binary number `k`, where `0 ≤ k < 2^n`. The output relation is `Yk = D`; every other output is 0. Therefore, when D is 0, all outputs are 0 for any select value.

| Circuit | Select lines | Outputs |
|---|---:|---:|
| 1-to-2 | 1 | 2 |
| 1-to-4 | 2 | 4 |
| 1-to-8 | 3 | 8 |

Select lines are written most-significant first: S0 for 1-to-2, S1S0 for 1-to-4, and S2S1S0 for 1-to-8.

## Boolean Expressions

Let `D` be the data input and `Si` the select bits. Each output is the data input ANDed with the minterm that matches that output's binary address.

- **1-to-2:** `Y0 = D · ¬S0`; `Y1 = D · S0`.
- **1-to-4:** `Y0 = D · ¬S1 · ¬S0`; `Y1 = D · ¬S1 · S0`; `Y2 = D · S1 · ¬S0`; `Y3 = D · S1 · S0`.
- **1-to-8:** For each `k` from 0 through 7, `Yk = D` AND the three select literals matching the 3-bit binary representation of `k`. A 0 bit contributes a complemented select literal; a 1 bit contributes the uncomplemented literal. For example, `Y5 = D · S2 · ¬S1 · S0`.

## Algorithm

1. Start.
2. Select the DEMUX type.
3. Enter D and the select-line values.
4. Validate the type, bit values, and number of select bits.
5. Calculate the number of outputs as `2^n`.
6. Convert the select bits to a binary output index.
7. Set all outputs to 0.
8. If D is 1, set the selected output to 1.
9. Display the outputs, truth table, and explanation.
10. Stop or repeat with new inputs.

## Flowchart

See [flowchart.md](flowchart.md) for the Mermaid flowchart.

## Implementation Details

- `app.py` contains the Flask routes, input validation, DEMUX calculation, and truth-table generation.
- `templates/index.html` contains the simulator and educational sections.
- `static/style.css` provides responsive layout and LOW/HIGH/selection styling.
- `static/script.js` submits changed inputs to Flask and updates the page from the returned result.
- `requirements.txt` lists Flask as the only external dependency.

## Test Cases and Expected Results

The following are logic-derived expected results; they are not a claim that the application has been run or tested.

| Case | Type | D | Select | Expected outputs |
|---|---|---:|---|---|
| 1 | 1-to-2 | 1 | S0=0 | Y0=1, Y1=0 |
| 2 | 1-to-2 | 1 | S0=1 | Y0=0, Y1=1 |
| 3 | 1-to-4 | 1 | S1S0=10 | Y0=0, Y1=0, Y2=1, Y3=0 |
| 4 | 1-to-4 | 0 | S1S0=11 | Y0=0, Y1=0, Y2=0, Y3=0 |
| 5 | 1-to-8 | 1 | S2S1S0=101 | Y5=1; all other outputs 0 |
| 6 | 1-to-8 | 0 | S2S1S0=000 | Y0–Y7=0 |
| 7 | Invalid type | 1 | Valid-length bits | HTTP 400 with supported-type validation message |
| 8 | 1-to-4 | 2 | S1S0=00 | HTTP 400 with data-input validation message |
| 9 | 1-to-2 | 1 | Missing select bit | HTTP 400 with select-count validation message |

## Applications and Advantages

Applications include data routing, communication systems, digital circuits, and control systems. A DEMUX provides simple routing, efficient signal distribution, and easy digital control using a compact set of select lines.

## Limitations and Future Scope

This simulator models ideal binary logic only; it does not model propagation delay, electrical loading, or physical gate implementation. Possible extensions include timing visualization, a gate-level view, downloadable truth tables, and additional circuit configurations.

## Screenshot Placeholders

Add screenshots captured from the actual running application after launching it locally. No screenshots are included in this report yet.

- `[Screenshot placeholder: simulator with 1-to-4 DEMUX active]`
- `[Screenshot placeholder: truth table for 1-to-8 DEMUX]`

## Conclusion

The project provides an interactive demonstration of the core DEMUX rule: select lines choose an output address, and the data bit appears only at that output. Its Flask backend performs the calculation and truth-table generation, while the browser makes input changes and results easy to observe.

## References

1. M. Morris Mano and Michael D. Ciletti, *Digital Design*, Pearson, combinational logic and data selectors/demultiplexers.
2. Python Software Foundation, [Python documentation](https://docs.python.org/3/).
3. Pallets Projects, [Flask documentation](https://flask.palletsprojects.com/).
