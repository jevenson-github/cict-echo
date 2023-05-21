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
        }

        table,
        th,
        td {
            border: 1px solid black;
            padding: 2px 4px;
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

    <center><strong>EXTENSION COMMUNITY INVOLVEMENT TERMINAL REPORT</strong></center>

    <br>

    <strong>Name of Activity/Project:</strong> {{ $title }}
    <br>
    <strong>Date and Place Conducted:</strong> {{ date('M d, Y', strtotime($start_date)) }} - {{ date('M d, Y', strtotime($end_date)) }} at {{ $location }}

    <br><br>


    <strong>Faculty Involved:</strong>
    <ol>
        @foreach($faculty_involved as $faculty)
        <li>
            {{ $faculty['name'] }}
            @if($faculty['role'] === 'Lead')
            - Lead
            @else
            - {{ $faculty['role'] }}
            @endif
        </li>
        @endforeach
    </ol>

    <br>

    <strong>Beneficiaries:</strong>
    {!! $participants !!}

    <br>

    <strong>Report on the flow of the Activity/Project Conducted:</strong>
    {!! $details !!}
    {!! $flow !!}
    {!! $additional_details !!}

    <br>

    <strong>Prepared by:</strong>
    <br>
    <table border="1" width="100%">
        <thead>
            <tr>
                <th>Name</th>
                <th>Signature</th>
            </tr>
        </thead>
        <tbody>
            @foreach($faculty_involved as $faculty)
            <tr>
                <td>
                    {{ $faculty['name'] }}
                    @if($faculty['role'] === 'Lead')
                    - Lead
                    @else
                    - {{ $faculty['role'] }}
                    @endif
                </td>
                <td></td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <br><br>

    <strong>Conforme:</strong>
    <br><br><br><br>
    <strong style="text-transform: uppercase">{{ $dean->first_name }} {{ $dean->last_name }}</strong>
    <br>
    Dean


</body>

</html>