export const MailConstant = {
  register: (username: string, code?: string) => `
    <h2>Hi ${username}</h2>
    <br/>

    <p>To complete your registration for the Vehicle Tracking App, verify your email.</p>
    <p>Your six digits code is:  <strong>${code}</strong> </p>
    <p><strong>Note: <strong/> The code expires in 30 minutes.</p>
    <br/>
    <br/>
    <span>If you received this message without performing any action related to this email, please ignore.</span>
    <br/>
    <br/>
    <strong>Utibeabasi Ekong,</strong>
    <br/>
    <strong>Support team</strong>
    `,

  passwordReset: (username: string, code?: string) => `
    <h2>Hi ${username}</h2>
    <br/>

    <p>Your password reset code is:  <strong>${code}</strong> </p>
    <p><strong>Note: <strong/> The code expires in 30 minutes.</p>
    <br/>
    <br/>
    <span>If you received this message without performing any action related to this email, please ignore.</span>
    <br/>
    <br/>
    <strong>Utibeabasi Ekong,</strong>
    <br/>
    <strong>Support team</strong>
    `,
};
