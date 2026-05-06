/**
 * Generates a luxury-themed HTML email for OTP verification.
 * @param {string} otp - The one-time password code.
 * @param {string} firstName - (Optional) The user's name for personalization.
 * @returns {string} - The complete HTML string.
 */
export const getDesignedEmail = (otp, firstName = "Radiant Member") => {
    // Brand Colors
    const colors = {
        accent: "#E91E63",
        primary: "#FFF5F8",
        secondary: "#9C27B0",
        white: "#FFFFFF",
        text: "#666666"
    };

    return `
    <div style="background-color: ${colors.primary}; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: center;">
        <div style="max-width: 500px; margin: 0 auto; background-color: ${colors.white}; border-radius: 40px; overflow: hidden; box-shadow: 0 20px 40px rgba(156, 39, 176, 0.05); border: 1px solid rgba(156, 39, 176, 0.1);">
            
            <!-- Header Section -->
            <div style="padding: 40px 20px 20px 20px;">
                <h1 style="color: ${colors.secondary}; font-family: 'Georgia', serif; font-style: italic; font-size: 32px; margin: 0; letter-spacing: -1px;">
                    Luxe<span style="color: ${colors.accent};">Glow</span>
                </h1>
                <div style="width: 30px; height: 2px; background-color: ${colors.accent}; margin: 15px auto;"></div>
            </div>

            <!-- Body Section -->
            <div style="padding: 0 40px 40px 40px;">
                <p style="color: ${colors.secondary}; text-transform: uppercase; letter-spacing: 3px; font-size: 11px; font-weight: bold; margin-bottom: 25px;">
                    Authentication
                </p>
                
                <h2 style="color: ${colors.secondary}; font-family: 'Georgia', serif; font-size: 20px; font-weight: normal; margin-bottom: 15px;">
                    Hello, ${firstName}
                </h2>
                
                <p style="color: ${colors.text}; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
                    To protect your account and continue your beauty journey, please use the secure verification code provided below.
                </p>

                <!-- OTP Display Area -->
                <div style="background-color: ${colors.primary}; border-radius: 24px; padding: 35px; border: 1px dashed ${colors.accent};">
                    <span style="color: ${colors.secondary}; font-size: 48px; font-weight: bold; letter-spacing: 10px; margin-left: 10px; display: inline-block;">
                        ${otp}
                    </span>
                </div>

                <p style="color: #999999; font-size: 12px; margin-top: 30px; font-style: italic;">
                    Code expires in 10 minutes. If you did not initiate this request, please secure your account immediately.
                </p>
            </div>

            <!-- Footer Section -->
            <div style="background-color: ${colors.secondary}; padding: 25px; color: ${colors.white};">
                <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin: 0; font-weight: bold;">
                    Official LuxeGlow Communication
                </p>
                <p style="font-size: 9px; opacity: 0.7; margin-top: 8px;">
                    Skin Health • Artistic Radiance • Pure Elegance
                </p>
            </div>
        </div>
        
        <!-- Social/Legal Footer -->
        <div style="margin-top: 30px; text-align: center;">
            <p style="color: ${colors.secondary}; opacity: 0.4; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin: 0;">
                &copy; 2026 LuxeGlow Global. All Rights Reserved.
            </p>
            <p style="color: ${colors.secondary}; opacity: 0.4; font-size: 10px; margin-top: 5px;">
                Colombo, Western Province, Sri Lanka
            </p>
        </div>
    </div>
    `;
};