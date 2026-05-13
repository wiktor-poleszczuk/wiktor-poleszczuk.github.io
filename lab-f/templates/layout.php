<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Wiktor Poleszczuk 57831 - PTW LAB F</title>

    <style>
        body {
            font-family: Helvetica, sans-serif;
            background-color: ghostwhite;
            padding: 20px;
        }

        h1 {
            text-align: center;
            text-shadow: 0 0 2px #001521;;
            color: #009dff;
            margin-bottom: 30px;
        }

        .converter-container {
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
        }

        .column {
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        select {
            margin-bottom: 10px;
            padding: 8px;
            border: 1px solid dimgray;
            border-radius: 6px;
            background-color: white;
        }

        textarea, pre {
            height: 350px;
            width: 100%;
            margin: 0;
            box-sizing: border-box;
            border: 1px solid black;
            padding: 10px;
            box-shadow: 0 0 4px rgb(0 0 0 / 0.55);
            border-radius: 6px;
        }

        pre {
            background-color: white;
            overflow: auto;
            white-space: pre;
        }

        button {
            width: 100%;
            padding: 15px;
            cursor: pointer;
            background-color: #0098ff;
            color: white;
            border: 1px solid #002742;
            border-radius: 4px;
            font-size: 16px;
            font-weight: bold;
            transition: background-color 0.2s ease;
        }

        button:hover {
            background-color: #0048ff;
        }

        button:active {
            background-color: #002682;
        }

    </style>
</head>

<body>

<h1>Konwerter Danych</h1>

<form method="POST">

    <div class="converter-container">

        <div class="column">

            <select name="input_format" id="input_format">
                <!-- sprawdzamy czy aktualny format pasuje do opcji jeśli tak to dodajemy atrybut selected aby lista pamiętała wybór -->
                <option value="csv" <?php if ($inputFormat === 'csv') { echo 'selected="selected"'; } ?>>csv</option>
                <option value="ssv" <?php if ($inputFormat === 'ssv') { echo 'selected="selected"'; } ?>>ssv</option>
                <option value="tsv" <?php if ($inputFormat === 'tsv') { echo 'selected="selected"'; } ?>>tsv</option>
                <option value="json" <?php if ($inputFormat === 'json') { echo 'selected="selected"'; } ?>>json</option>
                <option value="yaml" <?php if ($inputFormat === 'yaml') { echo 'selected="selected"'; } ?>>yml</option>
            </select>

            <textarea name="input"><?php echo htmlspecialchars($input); ?></textarea>

        </div>

        <div class="column">
            <select name="output_format" id="output_format">
                <option value="csv" <?php if ($outputFormat === 'csv') { echo 'selected="selected"'; } ?>>csv</option>
                <option value="ssv" <?php if ($outputFormat === 'ssv') { echo 'selected="selected"'; } ?>>ssv</option>
                <option value="tsv" <?php if ($outputFormat === 'tsv') { echo 'selected="selected"'; } ?>>tsv</option>
                <option value="json" <?php if ($outputFormat === 'json') { echo 'selected="selected"'; } ?>>json</option>
                <option value="yaml" <?php if ($outputFormat === 'yaml') { echo 'selected="selected"'; } ?>>yml</option>
            </select>

            <pre><?php echo htmlspecialchars($output); ?></pre>

        </div>

    </div>
    <button type="submit">Konwertuj</button>
</form>

</body>
</html>