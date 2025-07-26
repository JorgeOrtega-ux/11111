<div class="section-wrapper <?php echo $isMainActive ? 'active' : 'disabled'; ?>" data-section="mainWrapper">
    <div class="section-content body-title">
        <?php include 'includes/sections/general/banner.php'; ?>
    </div>
    <div class="section-content body-title">
        <?php include 'includes/sections/general/tool-content.php'; ?>
    </div>
    <div class="section-content body-title">
        <?php include 'includes/sections/general/resources.php'; ?>
    </div>
    <div class="section-content body-title">
        <?php include 'includes/sections/general/footer.php'; ?>
    </div>
</div>
<div class="section-wrapper <?php echo $isLegalActive ? 'active' : 'disabled'; ?>" data-section="legalWrapper">
    <div class="section-content <?php echo $requestedPage === 'privacy-policy' ? 'active' : 'disabled'; ?>" data-section="privacy-policy">
        <?php include 'includes/sections/legal/privacy-policy.php'; ?>
    </div>
    <div class="section-content <?php echo $requestedPage === 'terms-and-conditions' ? 'active' : 'disabled'; ?>" data-section="terms-and-conditions">
        <?php include 'includes/sections/legal/terms-and-conditions.php'; ?>
    </div>
    <div class="section-content <?php echo $requestedPage === 'cookie-policy' ? 'active' : 'disabled'; ?>" data-section="cookie-policy">
        <?php include 'includes/sections/legal/cookie-policy.php'; ?>
    </div>
    <div class="section-content <?php echo $requestedPage === 'send-feedback' ? 'active' : 'disabled'; ?>" data-section="send-feedback">
        <?php include 'includes/sections/legal/send-feedback.php'; ?>
    </div>
</div>
<div class="section-wrapper <?php echo $isResourcesActive ? 'active' : 'disabled'; ?>" data-section="resourcesWrapper">
    <div class="section-content <?php echo $requestedPage === 'faq' ? 'active' : 'disabled'; ?>" data-section="faq">
        <?php include 'includes/sections/general/faq.php'; ?>
    </div>
    <div class="section-content <?php echo $requestedPage === 'guides' ? 'active' : 'disabled'; ?>" data-section="guides">
        <?php include 'includes/sections/general/guides.php'; ?>
    </div>
    <div class="section-content <?php echo $requestedPage === 'blog' ? 'active' : 'disabled'; ?>" data-section="blog">
        <?php include 'includes/sections/general/blog.php'; ?>
    </div>
</div>
<div class="section-wrapper <?php echo $is404Active ? 'active' : 'disabled'; ?>" data-section="404Wrapper">
    <div class="section-content <?php echo $requestedPage === '404' ? 'active' : 'disabled'; ?>" data-section="404">
        <?php include 'includes/sections/general/404.php'; ?>
    </div>
</div>
