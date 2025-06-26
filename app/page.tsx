<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CarlyCompare Coming Soon</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
      body {
        background: url('./images/background.png') no-repeat center center;
        background-size: cover;
      }
      .form-input {
        @apply w-full px-4 py-2 rounded-lg border border-gray-300 mb-4;
      }
    </style>
  </head>
  <body class="flex items-center justify-center min-h-screen">
    <div class="bg-white bg-opacity-80 rounded-lg p-6 max-w-md w-full shadow-lg text-center">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">COMING SOON</h1>
      <p class="text-gray-700 mb-6">
        Carly compares real-time cash offers from top sites like Carvana and KBB to help you get the best deal. Launching soon!
      </p>

      <form>
        <input type="text" placeholder="Name" class="form-input" />
        <input type="email" placeholder="Email" class="form-input" />
        <input type="text" placeholder="Car make" class="form-input" />
        <button type="submit" class="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold">
          Submit to get discounts when we launch
        </button>
      </form>
    </div>
  </body>
</html>
