<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <style>
        @page {
            size: Letter;
            margin-top: 245px;
            margin-bottom: 147px;
            margin-left: 98px;
            margin-right: 98px;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.5;
        }

        img {
            width: 816px;
        }

        header {
            position: fixed;
            margin-top: -245px;
            margin-left: -98px;
            top: 0;
        }

        footer {
            position: fixed;
            bottom: 0;
            margin-bottom: -147px;
            margin-left: -98px;
        }

        p {
            text-align: justify;
        }

        table {
            border-collapse: collapse;
            width: 100%;
        }

        table,
        th,
        td {
            border: 1px solid black;
            padding: 2px 4px
        }
        
    </style>

</head>

<body>
    <header>
        <img src="{{ public_path('reports/header.png') }}">
    </header>

    <footer>
        <img src="{{ public_path('reports/footer.png') }}">
    </footer>

    <center class="text-transform: uppercase"><strong>EXTENSION COMMUNITY INVOLVEMENT</strong><br>LIST OF {{ strtoupper($status) }} PARTNERS</center>

    <br>

    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Contact Person</th>
                <th>Validity</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($partners as $partner)
            <tr>
                <td>{{ $partner['name'] }}</td>
                <td>{{ $partner['address'] }}</td>
                <td>{{ $partner['contact_person'] }} <br> {{ $partner['contact_number'] }}</td>
                <td>{{ \Carbon\Carbon::parse($partner['start_date'])->format('F d, Y') }} - {{ \Carbon\Carbon::parse($partner['end_date'])->format('F d, Y') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

</body>

</html>