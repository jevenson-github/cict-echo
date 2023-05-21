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

    <center><strong>EXTENSION COMMUNITY INVOLVEMENT FACULTY REPORT</strong></center>

    <br>

    <strong>Faculty name:</strong> {{ $user->first_name }} {{ $user->last_name }}
    <br>
    <strong>Description:</strong> {{ $user->department}} {{ $user->designation }}
    <br><br>

    <strong>Upcoming Programs:</strong>
        @if ($upcomingPrograms->count() > 0)
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($upcomingPrograms as $program)
                        <tr>
                            <td>{{ $program->title }}</td>
                            <td>{{ $program->description }}</td>
                            <td>{{ $program->start_date }}</td>
                            <td>{{ $program->end_date }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            No upcoming programs found.
        @endif

        <br><br>

        <strong>Ongoing Programs:</strong>
        @if ($ongoingPrograms->count() > 0)
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($ongoingPrograms as $program)
                        <tr>
                            <td>{{ $program->title }}</td>
                            <td>{{ $program->description }}</td>
                            <td>{{ $program->start_date }}</td>
                            <td>{{ $program->end_date }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            No ongoing programs found.
        @endif

        <br><br>

        <strong>Completed Programs:</strong>
        @if ($completedPrograms->count() > 0)
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($completedPrograms as $program)
                        <tr>
                            <td>{{ $program->title }}</td>
                            <td>{{ $program->description }}</td>
                            <td>{{ $program->start_date }}</td>
                            <td>{{ $program->end_date }}</td>
                            <td>{{ $program->status }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            No completed programs found.
        @endif
</body>

</html>