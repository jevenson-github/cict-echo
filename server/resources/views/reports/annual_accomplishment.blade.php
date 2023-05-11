
<!DOCTYPE html>
<html>
<head>
    <title>Annual Accomplishment Report of A.Y. {{ $schoolYear }}</title>
</head>
<body>
    <h1>Annual Accomplishment Report of A.Y. {{ $schoolYear }}</h1>

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
            @foreach ($programs as $program)
                <tr>
                    <td>{{ $program->title }}</td>
                    <td>{{ $program->initiative }}</td>
                    <td>{{ $program->start_date }}</td>
                    <td>{{ $program->end_date }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
