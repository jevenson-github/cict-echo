<!DOCTYPE html>
<html>
    <head>
        <title>Extension Programs Per Faculty</title>
    </head>
    <body>
        <h1>Extension Programs Per Faculty</h1>
        <h2>User Details:</h2>
        <p>
            <strong>First Name:</strong> {{ $user->first_name }}<br>
            <strong>Last Name:</strong> {{ $user->last_name }}<br>
            <strong>Department:</strong> {{ $user->department }}<br>
            <strong>Designation:</strong> {{ $user->designation }}
        </p>
        <h2>Upcoming Programs:</h2>
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
            <p>No upcoming programs found.</p>
        @endif
        <h2>Ongoing Programs:</h2>
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
            <p>No ongoing programs found.</p>
        @endif
        <h2>Completed Programs:</h2>
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
            <p>No completed programs found.</p>
        @endif
    </body>
</html>
