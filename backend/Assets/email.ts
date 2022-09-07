export const emailTemplate = (name: string, code: number[]) =>
  `<div style="margin: 0; padding: 0; padding-bottom: 5rem; min-height: 100vh; min-width: 100%; background-image: url(https://github.com/Disadus/DisadusAssets/blob/main/background.jpg?raw=true);box-sizing: border-box;">
  <!-- HIDDEN PREHEADER TEXT -->
  <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Verify your new account now!
  </div>

  <table style="z-index: 2;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;;"
   border="0" cellpadding="0" cellspacing="0" width="100%">
    <!-- LOGO -->
    <tr>
      <td align="center" style="-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;">
        <table style="z-index: 2;width: min(480px, calc(100% - 20px));-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;;"
         border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" valign="top" style="padding: 40px 10px 40px 10px;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;">
              <img alt="Logo" src="https://github.com/HWBounty/HWBountyAssets/blob/main/b7ace94ccb79c6a6a39b0d1bfbbc27fe.png?raw=true" width="164" height="164" style="display: block;  font-family: Helvetica, Arial, sans-serif; color: #ffffff; font-size: 18px;-ms-interpolation-mode: bicubic;" border="0" style="border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none;">
                  </td>
              </tr>
          </table>
      </td>
  </tr>
  <!-- HERO -->
  <tr>
      <td align="center" style="padding: 0px 10px 0px 10px;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;">
          <table style="z-index: 2;width: min(480px, calc(100% - 20px));-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;;" border="0" cellpadding="0" cellspacing="0"  >
              <tr>
                  <td align="center" valign="top" style="background-color: rgb(60, 60, 60); color: rgb(250, 250, 250); padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px;  font-family: Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;border-radius: 0.8rem 0.8rem 0px 0px;color: #111111;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;">
                    <h1 style="font-size: 32px; font-weight: 400; margin: 0;color:#DBA5FF;">Verify Your Email</h1>
                  </td>
              </tr>
          </table>
      </td>
  </tr>
  <!-- COPY BLOCK -->
  <tr>
      <td align="center" style="padding: 0px 10px 0px 10px;background-color: rgba(0, 0, 0, 0);-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;">
          <table style="z-index: 2;width: min(480px, calc(100% - 20px));-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;;" border="0" cellpadding="0" cellspacing="0">
            <!-- COPY -->
            <tr>
              <td align="left" style="padding: 20px 30px 40px 30px;  font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px; background-color: rgb(60, 60, 60); color: rgb(250, 250, 250);-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;" >
                <p style="margin: 0;">Hello <b>${name}</b>!</p><p>You, or someone who pretended to be you, has tried to register for a Disadus account! If you were the person who tried to register (hopefully you were), enter the 6 digit code displayed below. Otherwise, feel free to disregard this email in its entirety.</p><p></p><p></p><p> (Note that the code expires in 15 minutes)</p>
              </td>
            </tr>
            <!-- BULLETPROOF BUTTON -->
            <tr>
              <td align="left" style="border-radius: 0 0 0.5rem 0.5rem; background-color: rgb(60, 60, 60); color: rgb(250, 250, 250);-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;">
                <table style="z-index: 2;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;;" width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center" style="padding: 20px 15px 60px 15px;border-radius: 0 0 0.5rem 0.5rem; background-color: rgb(60, 60, 60); color: rgb(250, 250, 250);-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;">
                      <table style="border-collapse: separate;border-spacing: 10px 5px;z-index: 2;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;;">
                        <tr>
                          <td style="width: 4rem;height: 6rem;font-family: monospace;border-radius: 0.8rem;font-size: 3rem;color: rgb(250, 250, 250);text-align: center;margin: 0rem;background-color: rgb(45, 45, 45);-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;">
                             ${code[0]}
                          </td>
                          <td style="width: 4rem;height: 6rem;font-family: monospace;border-radius: 0.8rem;font-size: 3rem;color: rgb(250, 250, 250);text-align: center;margin: 0.25rem;background-color: rgb(45, 45, 45);-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;">
                             ${code[1]}
                          </td>
                          <td style="width: 4rem;height: 6rem;font-family: monospace;border-radius: 0.8rem;font-size: 3rem;color: rgb(250, 250, 250);text-align: center;margin: 0.25rem;background-color: rgb(45, 45, 45);-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;">
                             ${code[2]}
                          </td>
                          <td style="width: 4rem;height: 6rem;font-family: monospace;border-radius: 0.8rem;font-size: 3rem;color: rgb(250, 250, 250);text-align: center;margin: 0.25rem;background-color: rgb(45, 45, 45);-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;">
                             ${code[3]}
                          </td>
                          <td style="width: 4rem;height: 6rem;font-family: monospace;border-radius: 0.8rem;font-size: 3rem;color: rgb(250, 250, 250);text-align: center;margin: 0.25rem;background-color: rgb(45, 45, 45);-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;">
                             ${code[4]}
                          </td>
                          <td style="width: 4rem;height: 6rem;font-family: monospace;border-radius: 0.8rem;font-size: 3rem;color: rgb(250, 250, 250);text-align: center;margin: 0.25rem;background-color: rgb(45, 45, 45);-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;">
                             ${code[5]}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
      </td>
  </tr>
  <!-- COPY CALLOUT -->

  <!-- SUPPORT CALLOUT -->
  <tr>
      <td align="center" style="padding: 30px 10px 0px 10px;background-color: rgba(0, 0, 0, 0);-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;">
          <table border="0" cellpadding="0" cellspacing="0" style="z-index: 2;width: min(480px, calc(100% - 20px));-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;;">
              <!-- HEADLINE -->
              <tr>
                <td align="center" style="padding: 30px 30px 30px 30px; border-radius: 0.5rem; color: #37998e; font-family: Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px; background-color: rgb(60, 60, 60); color: rgb(250, 250, 250);-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;" >
                  <p class="moreHelpText" style="font-size: 20px; font-weight: 400;margin: 0;color:#DBA5FF;">Need more help?</p>
                  <p style="margin: 0;"><a href="https://discord.gg/X6uJzWFx9k" target="_blank" style="color: #a2c7ff;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;mso-table-lspace: 0pt;mso-table-rspace: 0pt;">Join the Discord!</a></p>
                </td>
              </tr>
          </table>
      </td>
  </tr>
  <!-- FOOTER -->
  <tr>
      <td align="center" style="padding: 0px 10px 0px 10px;margin-bottom: 5rem;background-color: rgba(0, 0, 0, 0);	color: #dba4ff">
      </td>
  </tr>
</table>
</div>`;
