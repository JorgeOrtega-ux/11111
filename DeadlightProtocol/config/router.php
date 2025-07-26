<?php
// --- LÓGICA DE ENRUTAMIENTO CENTRALIZADA ---

// 1. Array asociativo como ÚNICA fuente de verdad para las rutas.
$pageUrlMap = [
    'main' => '',
    'privacy-policy' => 'privacy-policy',
    'terms-and-conditions' => 'terms-and-conditions',
    'cookie-policy' => 'cookie-policy',
    'send-feedback' => 'send-feedback',
    'faq' => 'faq',
    'guides' => 'guides',
    'blog' => 'blog'
];

// 2. Obtiene la ruta del URI solicitado.
$requestUri = $_SERVER['REQUEST_URI'];
$requestPath = strtok($requestUri, '?');

// 3. Obtiene la ruta del directorio donde se ejecuta index.php.
$scriptDir = dirname($_SERVER['SCRIPT_NAME']);
$basePath = rtrim($scriptDir, '/') . '/';

// 4. Determina la ruta local de la solicitud.
$localPath = '/';
if (strpos($requestPath, $basePath) === 0) {
    $localPath = substr($requestPath, strlen($basePath));
}

// 5. Obtiene los segmentos de la ruta.
$pathSegments = array_filter(explode('/', $localPath));

// 6. Determina la página solicitada.
$requestedPage = 'main'; // Por defecto es 'main'
$urlSegment = '';
if (!empty($pathSegments)) {
    $urlSegment = array_values($pathSegments)[0];
    // Busca la clave (nombre de la sección) que corresponde al segmento de la URL
    $foundPage = array_search($urlSegment, $pageUrlMap);
    if ($foundPage !== false) {
        $requestedPage = $foundPage;
    } else {
        $requestedPage = '404'; // Si el segmento no corresponde a ninguna ruta, es 404
    }
}

// --- VALIDACIÓN MEJORADA ---
// La URL es inválida si:
// 1. Contiene más de un segmento (ej: /faq/algo-mas).
// 2. O si el primer segmento no existe en nuestro mapa de rutas.
if (count($pathSegments) > 1 || ($urlSegment && !in_array($urlSegment, $pageUrlMap))) {
    http_response_code(404);
    $requestedPage = '404';
}

$defaultLang = 'en';

$legalPages = ['privacy-policy', 'terms-and-conditions', 'cookie-policy', 'send-feedback'];
$resourcesPages = ['faq', 'guides', 'blog'];

$isMainActive = $requestedPage === 'main';
$isLegalActive = in_array($requestedPage, $legalPages);
$isResourcesActive = in_array($requestedPage, $resourcesPages);
$is404Active = $requestedPage === '404';

?>