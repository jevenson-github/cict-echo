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

    <center><strong class="text-transform: uppercase">EXTENSION COMMUNITY INVOLVEMENT <br> MONTHLY ACCOMPLISHMENT REPORT FOR {{ strtoupper(date('F', strtotime($month))) }} {{ date('Y', strtotime($year)) }}</strong></center>

    <br>

    <table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Initiative</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                </tr>
            </thead>
            <tbody>
                @foreach($programs as $program)
                <tr>
                    <td>{{ $program->title }}</td>
                    <td align="center">{{ $program->initiative }}</td>
                    <td align="center">{{ date('M d, Y', strtotime($program->start_date )) }}</td>
                    <td align="center">{{ date('M d, Y', strtotime($program->end_date )) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>


</body>

</html>