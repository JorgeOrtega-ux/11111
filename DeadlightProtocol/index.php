<?php require_once 'config/router.php'; ?>
<!DOCTYPE html>
<html lang="<?php echo $defaultLang; ?>">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded">
    <link rel="stylesheet" type="text/css" href="<?php echo $basePath; ?>assets/css/styles.css">
    <script src="<?php echo $basePath; ?>assets/js/core/initial-setup.js"></script>
    <title>DeadlightProtocol - <?php echo ucfirst(str_replace('-', ' ', $requestedPage)); ?></title>

    <script>
        window.basePath = '<?php echo $basePath; ?>';
        window.initialPage = '<?php echo $requestedPage; ?>';
        window.pageUrlMap = <?php echo json_encode($pageUrlMap); ?>;
    </script>
</head>

<body>
    <div class="page-wrapper">
        <div class="main-content">
            <div class="general-content">
                <div class="general-content-top">
                    <?php include 'includes/layout/header.php'; ?>
                </div>
                <div class="general-content-bottom ">
                    <div class="general-content-scrolleable overflow-y">
                        <?php include 'includes/sections/general-section.php'; ?>
                       
                    </div>
                     <?php include 'includes/modules/module-overlay.php'; ?>
                </div>
            </div>
        </div>
    </div>


    <script type="module" src="<?php echo $basePath; ?>assets/js/app/app-init.js"></script>
</body>

</html>