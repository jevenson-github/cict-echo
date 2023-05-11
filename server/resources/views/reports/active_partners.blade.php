<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Active Partners Report</title>
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
        }

        th,
        td {
            text-align: left;
            padding: 8px;
            border: 1px solid #ddd;
        }

        th {
            background-color: #f2f2f2;
        }
    </style>
</head>

<body>
    <h1>Active Partners Report</h1>
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Contact Person</th>
                <th>Contact Number</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($partners as $partner)
            <tr>
                <td>{{ $partner['name'] }}</td>
                <td>{{ $partner['address'] }}</td>
                <td>{{ $partner['contact_person'] }}</td>
                <td>{{ $partner['contact_number'] }}</td>
                <td>{{ \Carbon\Carbon::parse($partner['start_date'])->format('F d, Y') }}</td>
                <td>{{ \Carbon\Carbon::parse($partner['end_date'])->format('F d, Y') }}</td>
                <td>{{ $partner['status'] }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>