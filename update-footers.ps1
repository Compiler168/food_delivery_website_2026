$newFooter = @'
    <!-- Footer -->
    <footer class="footer" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 60px 0 20px;">
        <div class="container">
            <div class="footer-content" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 3rem; margin-bottom: 3rem;">
                <!-- Brand Section -->
                <div class="footer-section">
                    <div style="margin-bottom: 1.5rem;">
                        <img src="assets/images/logo.png" alt="FoodUp Logo" style="height: 50px; margin-bottom: 1rem;">
                    </div>
                    <p style="opacity: 0.9; line-height: 1.8; margin-bottom: 1.5rem;">Your favorite food, delivered fast. Quality ingredients, authentic recipes, and exceptional service.</p>
                    <div class="social-links" style="display: flex; gap: 0.8rem;">
                        <a href="#" class="social-link" style="width: 40px; height: 40px; background: linear-gradient(135deg, #1877f2, #0c63d4); border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease;"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="social-link" style="width: 40px; height: 40px; background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease;"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="social-link" style="width: 40px; height: 40px; background: linear-gradient(135deg, #1DA1F2, #0d8bd9); border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease;"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="social-link" style="width: 40px; height: 40px; background: linear-gradient(135deg, #FF0000, #cc0000); border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: transform 0.3s ease;"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div class="footer-section">
                    <h3 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 1.5rem; color: white;">Quick Links</h3>
                    <ul style="list-style: none; padding: 0; opacity: 0.9; line-height: 2.2;">
                        <li><a href="index.html" style="color: white; text-decoration: none; transition: color 0.3s ease;">Home</a></li>
                        <li><a href="menu.html" style="color: white; text-decoration: none; transition: color 0.3s ease;">Menu</a></li>
                        <li><a href="about.html" style="color: white; text-decoration: none; transition: color 0.3s ease;">About Us</a></li>
                        <li><a href="contact.html" style="color: white; text-decoration: none; transition: color 0.3s ease;">Contact</a></li>
                    </ul>
                </div>

                <!-- Contact Info -->
                <div class="footer-section">
                    <h3 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 1.5rem; color: white;">Contact Us</h3>
                    <p style="opacity: 0.9; line-height: 2.2;">
                        📍 123 Food Street, City, Country<br>
                        📞 +1 234 567 8900<br>
                        ✉️ info@foodup.com
                    </p>
                </div>

                <!-- Newsletter -->
                <div class="footer-section">
                    <h3 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 1.5rem; color: white;">Newsletter</h3>
                    <p style="opacity: 0.9; margin-bottom: 1rem;">Subscribe to get special offers and updates!</p>
                    <form class="newsletter-form" id="newsletterForm" style="display: flex; gap: 0.5rem;">
                        <input type="email" placeholder="Your email" class="newsletter-input" required style="flex: 1; padding: 0.8rem; border-radius: 6px; border: none;">
                        <button type="submit" class="btn btn-primary" style="padding: 0.8rem 1.5rem; white-space: nowrap;">Subscribe</button>
                    </form>
                </div>
            </div>
            
            <div class="footer-bottom" style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem; text-align: center;">
                <p style="opacity: 0.8; margin: 0;">© 2024 FoodUp. All rights reserved.</p>
            </div>
        </div>

        <style>
            .footer-content a:hover {
                color: var(--primary-color) !important;
            }
            .social-link:hover {
                transform: translateY(-3px) !important;
            }
            @media (max-width: 968px) {
                .footer-content {
                    grid-template-columns: repeat(2, 1fr) !important;
                }
            }
            @media (max-width: 576px) {
                .footer-content {
                    grid-template-columns: 1fr !important;
                }
                .newsletter-form {
                    flex-direction: column !important;
                }
            }
        </style>
    </footer>
'@

$files = @('about.html','menu.html','contact.html','profile.html')

foreach($file in $files) {
    $path = "frontend\public\$file"
    $content = Get-Content $path -Raw -Encoding UTF8
    
    # Replace footer section
    $content = $content -replace '(?s)<!-- Footer -->.*?</footer>', $newFooter
    
    Set-Content $path $content -Encoding UTF8 -NoNewline
    Write-Host "Updated footer in $file"
}

Write-Host "Footer updates complete!"
