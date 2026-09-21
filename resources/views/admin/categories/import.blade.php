<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Import Categories</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; background: #f3f4f6; display: flex; justify-content: center; padding-top: 60px; margin: 0; }
        .card { background: #fff; padding: 28px 32px; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,.15); width: 440px; }
        h1 { margin: 0 0 16px; font-size: 22px; color: #111827; }
        .help { color: #6b7280; font-size: 13px; margin: 0 0 16px; }
        .alert { background: #fee2e2; color: #b91c1c; padding: 10px 12px; border-radius: 6px; margin-bottom: 16px; font-size: 14px; }
        .error { color: #dc2626; font-size: 13px; margin-top: 6px; }
        input[type=file] { width: 100%; margin: 8px 0 4px; }
        button { background: #2563eb; color: #fff; border: 0; padding: 10px 16px; border-radius: 6px; font-size: 14px; cursor: pointer; }
        button:hover { background: #1d4ed8; }
        a.back { display: inline-block; margin-left: 10px; color: #374151; text-decoration: none; font-size: 14px; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Import Categories</h1>

        @if (session('error'))
            <div class="alert">{{ session('error') }}</div>
        @endif

        <form action="{{ route('admin.categories.import') }}" method="POST" enctype="multipart/form-data">
            @csrf
            <label for="file">Excel file (xlsx, xls, csv)</label>
            <p class="help">Columns: Name, Description</p>
            <input type="file" name="file" id="file" required>
            @error('file')<div class="error">{{ $message }}</div>@enderror

            <div style="margin-top: 18px;">
                <button type="submit">Upload and Import</button>
                <a class="back" href="{{ route('admin.categories.index') }}">Back to categories</a>
            </div>
        </form>
    </div>
</body>
</html>

