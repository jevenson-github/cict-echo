<!DOCTYPE html>
<html>
<head>
    <title>Extension Community Involvement Terminal Report</title>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f2f2f2;
        }
        .signature {
            width: 30%;
            border-top: 1px solid #000;
            padding-top: 20px;
            margin-top: 50px;
        }
    </style>
</head>
<body>
    <h1 class="text-center mb-4">EXTENSION COMMUNITY INVOLVEMENT TERMINAL REPORT</h1>
    <p><strong>Name of Activity/Project:</strong> {{ $title }}</p>
    <p><strong>Date and Place Conducted:</strong> {{ date('M d, Y', strtotime($start_date)) }} - {{ date('M d, Y', strtotime($end_date)) }} at {{ $location }}</p>
    <div class="my-4">
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
    </div>
    <div class="my-4">
        <strong>Beneficiaries:</strong>
        <p>{!! $participants !!}</p>
    </div>
    <div class="my-4">
        <strong>Report on the flow of the Activity/Project Conducted:</strong>
        <p>{!! $details !!}</p>
        <p>{!! $flow !!}</p>
        <p>{!! $additional_details !!}</p>
    </div>
    <div class="my-4">
        <strong>Prepared by:</strong>
        <table>
            <tbody>
                @foreach($faculty_involved as $faculty)
                    @if($faculty['role'] !== 'Lead')
                        <tr>
                            <td>{{ $faculty['name'] }}</td>
                            <td></td>
                        </tr>
                    @endif
                @endforeach
            </tbody>
        </table>
    </div>
    <div class="my-4">
        <strong>Conforme:</strong>
        <p>{{ $dean->first_name }} {{ $dean->last_name }}</p>
        <p>Dean</p>
    </div>
</body>
</html>
