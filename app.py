"""Interactive 1-to-2, 1-to-4, and 1-to-8 demultiplexer simulator."""

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

DEMUX_TYPES = {"1-to-2": 1, "1-to-4": 2, "1-to-8": 3}


def calculate_outputs(demux_type, data, select_bits):
    """Route data to the output addressed by select_bits (MSB first)."""
    if demux_type not in DEMUX_TYPES:
        raise ValueError("Choose a supported DEMUX type: 1-to-2, 1-to-4, or 1-to-8.")
    if data not in (0, 1):
        raise ValueError("Data input D must be 0 or 1.")

    select_count = DEMUX_TYPES[demux_type]
    if not isinstance(select_bits, list) or len(select_bits) != select_count:
        raise ValueError(f"{demux_type} requires exactly {select_count} select bit(s).")
    if any(bit not in (0, 1) for bit in select_bits):
        raise ValueError("Every select-line value must be 0 or 1.")

    output_count = 2**select_count
    outputs = [0] * output_count
    selected_index = int("".join(map(str, select_bits)), 2)
    if data == 1:
        outputs[selected_index] = 1
    return outputs, selected_index


def make_truth_table(demux_type):
    """Return every input combination in ascending binary order."""
    select_count = DEMUX_TYPES[demux_type]
    select_names = [f"S{i}" for i in reversed(range(select_count))]
    output_names = [f"Y{i}" for i in range(2**select_count)]
    rows = []
    for data in (0, 1):
        for address in range(2**select_count):
            bits = [int(bit) for bit in f"{address:0{select_count}b}"]
            outputs, _ = calculate_outputs(demux_type, data, bits)
            rows.append({"D": data, **dict(zip(select_names, bits)), **dict(zip(output_names, outputs))})
    return {"select_names": select_names, "output_names": output_names, "rows": rows}


@app.get("/")
def home():
    return render_template("index.html")


@app.post("/api/simulate")
def simulate():
    """Validate a JSON request and return the Python-calculated result."""
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify(error="Send a JSON object containing type, data, and select_bits."), 400

    demux_type = payload.get("type")
    data = payload.get("data")
    bits = payload.get("select_bits")
    if isinstance(data, bool) or not isinstance(data, int):
        return jsonify(error="Data input D must be the integer 0 or 1."), 400
    if not isinstance(bits, list) or any(isinstance(bit, bool) or not isinstance(bit, int) for bit in bits):
        return jsonify(error="Select-line values must be an array of integer 0s and 1s."), 400

    try:
        outputs, selected_index = calculate_outputs(demux_type, data, bits)
        table = make_truth_table(demux_type)
    except ValueError as error:
        return jsonify(error=str(error)), 400

    return jsonify(
        type=demux_type,
        data=data,
        select_bits=bits,
        select_names=table["select_names"],
        outputs=outputs,
        output_names=table["output_names"],
        active_output=f"Y{selected_index}" if data else None,
        explanation=(
            f"D = 1, so the input is routed to Y{selected_index} (select value "
            f"{''.join(map(str, bits))}). All other outputs are LOW."
            if data
            else "D = 0, so no output is active. All outputs remain LOW regardless of the select lines."
        ),
        truth_table=table,
    )


if __name__ == "__main__":
    app.run(debug=True)
